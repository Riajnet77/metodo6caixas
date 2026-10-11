"""Password recovery and verified one-time Hotmart purchases.

Existing accounts retain access until their first approved Hotmart purchase.
New accounts are provisioned only by an authenticated product-specific webhook.
"""
import asyncio
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json
import logging
import os
import re
import secrets
import urllib.request
import urllib.error
from urllib.parse import urlparse
import uuid

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, EmailStr, Field, ValidationError, field_validator
from pymongo import ReturnDocument
from pymongo.errors import DuplicateKeyError

from backend.auth import get_password_hash

logger = logging.getLogger(__name__)
RESET_MINUTES = 30
PUBLIC_MESSAGE = "Se houver uma conta e a solicitação estiver dentro do limite, você receberá um link. Confira a pasta de spam. Aguarde um minuto entre solicitações (até três por hora)."
EVENTS = {
    "PURCHASE_APPROVED": ("active", {"APPROVED"}),
    "PURCHASE_COMPLETE": ("active", {"COMPLETE"}),
    "PURCHASE_REFUNDED": ("revoked", {"REFUNDED"}),
    "PURCHASE_CHARGEBACK": ("revoked", {"CHARGEBACK"}),
    "PURCHASE_CANCELED": ("revoked", {"CANCELLED", "CANCELED"}),
}


def digest(value):
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def normalize_email(value):
    return str(value).strip().lower()


def app_url():
    value = os.getenv("APP_URL", "https://www.metodo6caixas.com.br").rstrip("/")
    parsed = urlparse(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.query or parsed.fragment:
        raise HTTPException(503, "O serviço de acesso está temporariamente indisponível. Fale com o suporte.")
    return value


def email_ready():
    return bool(os.getenv("RESEND_API_KEY") and os.getenv("EMAIL_FROM"))


def checkout_url():
    value = os.getenv("HOTMART_CHECKOUT_URL", "")
    parsed = urlparse(value)
    if parsed.scheme == "https" and parsed.hostname in {"pay.hotmart.com", "hotmart.com", "www.hotmart.com"} and not parsed.username:
        return value
    return None


async def send_customer_email(email, subject, text, key):
    """HTTPS delivery works on Render Free, where SMTP ports are blocked."""
    if not email_ready():
        raise HTTPException(503, "O envio de email ainda não está disponível. Fale com o suporte.")
    body = json.dumps({"from": os.environ["EMAIL_FROM"], "to": [email], "subject": subject, "text": text}).encode()
    def deliver():
        req = urllib.request.Request("https://api.resend.com/emails", data=body, method="POST", headers={
            "Authorization": "Bearer " + os.environ["RESEND_API_KEY"],
            "User-Agent": "Metodo6Caixas/1.0",
            "Content-Type": "application/json", "Idempotency-Key": key,
        })
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read())
            if not data.get("id"):
                raise ValueError("Email provider did not accept message")
    try:
        await asyncio.to_thread(deliver)
    except urllib.error.HTTPError as exc:
        logger.error("Transactional email delivery failed: HTTP %s", exc.code)
        raise HTTPException(503, "Não foi possível enviar o email agora. Tente novamente ou fale com o suporte.") from None
    except Exception as exc:
        # Do not log URLs, reset tokens, email contents, credentials or provider responses.
        logger.error("Transactional email delivery failed: %s", type(exc).__name__)
        raise HTTPException(503, "Não foi possível enviar o email agora. Tente novamente ou fale com o suporte.") from None


async def find_email_user(db, email):
    email = normalize_email(email)
    user = await db.users.find_one({"email": email})
    if user is None:
        user = await db.users.find_one({"email": {"$regex": "^" + re.escape(email) + "$", "$options": "i"}})
    return user


async def ensure_account_access(db, user):
    if not user or not user.get("is_active", True):
        raise HTTPException(403, "Seu acesso está suspenso. Fale com o suporte.")
    if user.get("access_mode") == "hotmart":
        grant = await db.hotmart_purchases.find_one({"email": normalize_email(user["email"]), "state": "active"})
        if grant is None:
            raise HTTPException(403, "Não há uma compra ativa para esta conta. Fale com o suporte.")


class EmailRequest(BaseModel):
    email: EmailStr = Field(max_length=254)


class ResetRequest(BaseModel):
    token: str = Field(min_length=30, max_length=128)
    password: str = Field(min_length=8, max_length=72)

    @field_validator("password")
    @classmethod
    def validate_password(cls, password):
        if len(password.encode("utf-8")) > 72:
            raise ValueError("A senha deve ter no máximo 72 bytes")
        return password


class Buyer(BaseModel):
    email: EmailStr = Field(max_length=254)
    name: str = Field(default="Cliente", max_length=200)


class Product(BaseModel):
    id: int | str


class Purchase(BaseModel):
    transaction: str = Field(min_length=1, max_length=128)
    status: str = Field(max_length=50)


class PurchaseData(BaseModel):
    product: Product
    buyer: Buyer
    purchase: Purchase
    subscription: dict | None = None


class PurchaseEvent(BaseModel):
    id: str = Field(min_length=1, max_length=128)
    creation_date: int = Field(gt=0)
    version: str
    event: str = Field(max_length=80)
    data: PurchaseData


async def issue_reset(db, user, send_email, welcome=False):
    now = datetime.now(timezone.utc)
    raw = secrets.token_urlsafe(32)
    hashed = digest(raw)
    record = {"_id": hashed, "user_id": user["id"], "auth_version": user.get("auth_version", 0),
              "created_at": now, "expires_at": now + timedelta(minutes=RESET_MINUTES), "used": False}
    await db.password_reset_tokens.insert_one(record)
    link = app_url() + "/redefinir-senha#token=" + raw
    subject = "Seu acesso ao Método 6 Caixas" if welcome else "Redefinir senha — Método 6 Caixas"
    text = ("Sua compra foi confirmada. Defina sua senha para começar.\n" if welcome else "Você solicitou uma nova senha.\n")
    text += f"\n{link}\n\nEste link vale por {RESET_MINUTES} minutos e só pode ser usado uma vez. "
    text += "Se o link vencer, solicite outro na tela de login. Não compartilhe este email. "
    text += "Se você não solicitou a alteração, ignore a mensagem."
    await send_email(normalize_email(user["email"]), subject, text, "password-reset-" + hashed)


async def save_purchase(db, event, email, state):
    """Atomic transaction state; refunds are terminal, including out-of-order delivery."""
    key = digest(str(event.data.product.id) + ":" + event.data.purchase.transaction)
    for _ in range(5):
        prior = await db.hotmart_purchases.find_one({"_id": key})
        if prior:
            if prior["email"] != email:
                raise HTTPException(409, "A transação não corresponde ao comprador registrado")
            if prior["state"] == "revoked" or (state == "active" and event.creation_date < prior["event_time"]):
                return prior
            if event.creation_date == prior["event_time"] and state == prior["state"]:
                return prior
        doc = {"_id": key, "email": email, "product_id": str(event.data.product.id),
               "transaction": event.data.purchase.transaction, "state": state,
               "event_time": event.creation_date, "event_id": event.id,
               "welcome_sent": (prior or {}).get("welcome_sent", False)}
        if prior:
            result = await db.hotmart_purchases.update_one({"_id": key, "event_time": prior["event_time"], "state": prior["state"]}, {"$set": {k: v for k, v in doc.items() if k != "_id"}})
            if result.matched_count:
                return doc
        else:
            try:
                await db.hotmart_purchases.insert_one(doc)
                return doc
            except DuplicateKeyError:
                continue
    raise HTTPException(503, "Tente reenviar a notificação")


async def provision_user(db, buyer):
    email = normalize_email(buyer.email)
    user = await find_email_user(db, email)
    if user is None:
        key = "hotmart:" + digest(email)
        identity = str(uuid.uuid5(uuid.NAMESPACE_URL, key))
        now = datetime.now(timezone.utc).isoformat()
        doc = {"id": identity, "email": email, "full_name": buyer.name[:100] or "Cliente",
               "company_id": str(uuid.uuid5(uuid.NAMESPACE_OID, key)), "company_name": buyer.name[:100] or "Cliente",
               "hashed_password": await asyncio.to_thread(get_password_hash, secrets.token_urlsafe(32)),
               "is_active": True, "has_password": False, "auth_version": 0,
               "created_at": now, "access_mode": "hotmart"}
        try:
            await db.users.update_one({"_id": key}, {"$setOnInsert": doc}, upsert=True)
        except DuplicateKeyError:
            pass
        user = await db.users.find_one({"_id": key})
        if not user:
            raise HTTPException(503, "Tente reenviar a notificação")
    # Preserve explicit manual access grants; otherwise the first verified purchase
    # migrates an existing account to payment-controlled access without deleting data.
    if user.get("access_mode") != "manual":
        await db.users.update_one({"id": user["id"]}, {"$set": {"access_mode": "hotmart"}})
        user["access_mode"] = "hotmart"
    return user


def create_customer_router(db, send_email=send_customer_email):
    router = APIRouter()

    @router.get("/api/public/config")
    async def public_config():
        return {"checkout_url": checkout_url(), "support_email": os.getenv("SUPPORT_EMAIL", ""),
                "password_recovery_available": email_ready()}

    @router.get("/api/health")
    async def health():
        return {"status": "ok"}

    @router.post("/api/auth/forgot-password", status_code=202)
    async def forgot_password(body: EmailRequest):
        if not email_ready():
            raise HTTPException(503, "O envio de email ainda não está disponível. Fale com o suporte.")
        user = await find_email_user(db, body.email)
        if user:
            now = datetime.now(timezone.utc)
            window = int(now.timestamp()) // 3600
            count = user.get("recovery_count", 0) if user.get("recovery_window") == window else 0
            if count >= 3:
                return {"message": PUBLIC_MESSAGE}
            query = {"id": user["id"],
                     "recovery_count": user.get("recovery_count") if "recovery_count" in user else {"$exists": False},
                     "$or": [{"recovery_next_at": {"$lt": now}}, {"recovery_next_at": {"$exists": False}}]}
            reserved = await db.users.update_one(query, {"$set": {"recovery_next_at": now + timedelta(minutes=1), "recovery_window": window, "recovery_count": count + 1}})
            if reserved.matched_count:
                try:
                    await issue_reset(db, user, send_email)
                except HTTPException:
                    # Failed delivery does not consume the hourly email allowance.
                    await db.users.update_one({"id": user["id"], "recovery_window": window, "recovery_count": count + 1}, {"$set": {"recovery_count": count}})
                    raise
        return {"message": PUBLIC_MESSAGE}

    @router.post("/api/auth/reset-password")
    async def reset_password(body: ResetRequest):
        now = datetime.now(timezone.utc)
        invalid = HTTPException(400, "Este link é inválido, já foi utilizado ou expirou. Solicite outro link.")
        token = await db.password_reset_tokens.find_one({"_id": digest(body.token), "used": False, "expires_at": {"$gt": now}})
        if token is None:
            raise invalid
        user = await db.users.find_one({"id": token["user_id"]})
        if not user or user.get("auth_version", 0) != token["auth_version"]:
            raise invalid
        # Resetting a password never restores revoked payment access.
        password_hash = await asyncio.to_thread(get_password_hash, body.password)
        claimed = await db.password_reset_tokens.find_one_and_update({"_id": token["_id"], "used": False, "expires_at": {"$gt": now}}, {"$set": {"used": True}}, return_document=ReturnDocument.AFTER)
        if not claimed:
            raise invalid
        version = token["auth_version"]
        query = {"id": user["id"], "$or": [{"auth_version": version}]}
        if version == 0:
            query["$or"].append({"auth_version": {"$exists": False}})
        result = await db.users.update_one(query, {"$set": {"hashed_password": password_hash, "has_password": True}, "$inc": {"auth_version": 1}})
        if not result.matched_count:
            raise invalid
        return {"message": "Senha atualizada. Entre novamente com a nova senha."}

    @router.post("/api/integrations/hotmart/webhook")
    async def hotmart(request: Request):
        secret = os.getenv("HOTMART_HOTTOK", "")
        allowed = {s.strip() for s in os.getenv("HOTMART_PRODUCT_IDS", "").split(",") if s.strip()}
        if not secret or not allowed:
            raise HTTPException(503, "A integração ainda não está configurada")
        supplied = request.headers.get("X-HOTMART-HOTTOK", "")
        if not supplied or not hmac.compare_digest(secret.encode(), supplied.encode()):
            raise HTTPException(401, "Notificação não autorizada")
        raw = await request.body()
        if len(raw) > 65536:
            raise HTTPException(413, "Notificação muito grande")
        try:
            payload = json.loads(raw)
            if not isinstance(payload, dict):
                raise ValueError()
            if payload.get("event") not in EVENTS:
                return {"status": "ignored"}
            event = PurchaseEvent.model_validate(payload)
        except (ValidationError, ValueError, TypeError):
            raise HTTPException(422, "Notificação de compra inválida") from None
        if event.version != "2.0.0":
            raise HTTPException(422, "Configure o webhook na versão 2.0.0")
        if str(event.data.product.id) not in allowed:
            raise HTTPException(403, "Produto não autorizado")
        if event.data.subscription:
            raise HTTPException(422, "Esta integração é para pagamento único; assinatura requer configuração própria")
        state, statuses = EVENTS[event.event]
        if event.data.purchase.status not in statuses:
            raise HTTPException(422, "O status não corresponde ao evento")
        email = normalize_email(event.data.buyer.email)
        purchase = await save_purchase(db, event, email, state)
        if purchase["state"] == "active":
            user = await provision_user(db, event.data.buyer)
            if not purchase["welcome_sent"]:
                if not user.get("has_password", True):
                    if not email_ready():
                        raise HTTPException(503, "O envio de email ainda não está configurado")
                    await issue_reset(db, user, send_email, welcome=True)
                else:
                    await send_email(email, "Compra confirmada — Método 6 Caixas", "Seu acesso foi confirmado. Entre com seu email e senha em " + app_url() + "/login. Se esqueceu a senha, use a opção de recuperação nessa tela.", "hotmart-welcome-" + purchase["_id"])
                await db.hotmart_purchases.update_one({"_id": purchase["_id"]}, {"$set": {"welcome_sent": True}})
        return {"status": "processed"}

    return router
