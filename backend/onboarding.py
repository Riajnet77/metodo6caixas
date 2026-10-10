"""Diagnóstico e direcionamento vinculados ao usuário autenticado."""
from datetime import datetime, timezone
from decimal import Decimal
from typing import Dict, Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator
from backend.auth import TokenData, get_current_user


class DiagnosticAnswers(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)
    problema: Literal["a", "b", "c", "d"]
    receita: float = Field(gt=0, le=9999999)
    tipoRenda: Literal["fixa", "variavel", "mista"]
    fixos: Dict[str, float]
    variaveis: Dict[str, float]
    cartao: float = Field(ge=0, le=999999)
    usoCartao: Literal["", "essencial", "lazer", "misto"] = ""

    @field_validator("fixos", "variaveis")
    @classmethod
    def validate_expenses(cls, values, info):
        allowed = {
            "fixos": {"aluguel", "contasBasicas", "internetCelular", "planoSaude", "academia", "medicamentos", "parcelasCredito", "escolaFaculdade", "diarista", "pet"},
            "variaveis": {"alimentacao", "transporte", "salaobeleza", "lazer", "assinaturas", "roupasCompras", "viagens", "outros"},
        }[info.field_name]
        if set(values) - allowed:
            raise ValueError("Categoria de despesa desconhecida")
        if any(not Decimal(str(value)).is_finite() or value < 0 or value > 999999 for value in values.values()):
            raise ValueError("Despesa deve estar entre 0 e 999999")
        return values


def summarize(answers: DiagnosticAnswers):
    fixed = sum((Decimal(str(v)) for v in answers.fixos.values()), Decimal(0))
    variable = sum((Decimal(str(v)) for v in answers.variaveis.values()), Decimal(0))
    card = Decimal(str(answers.cartao))
    income = Decimal(str(answers.receita))
    expenses = fixed + variable + card
    balance = income - expenses
    profile = "endividado" if balance < 0 else "ajuste" if expenses >= income * Decimal("0.85") else "organizacao"
    return {
        "receita": float(income), "totalFixos": float(fixed), "totalVariaveis": float(variable),
        "totalCartao": float(card), "totalGastos": float(expenses), "saldo": float(balance),
        "deficitMensal": float(max(-balance, Decimal(0))),
        "percentualGasto": round(float(expenses / income * 100), 1), "perfil": profile,
    }


def create_onboarding_router(db):
    router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

    def scope(user):
        return {"id": user.user_id, "company_id": user.company_id}

    async def read(user):
        doc = await db.users.find_one(scope(user), {"_id": 0, "onboarding": 1})
        if doc is None:
            raise HTTPException(404, "Usuário não encontrado")
        return doc.get("onboarding")

    @router.get("")
    async def get_onboarding(user: TokenData = Depends(get_current_user)):
        return await read(user)

    @router.put("")
    async def save_onboarding(answers: DiagnosticAnswers, user: TokenData = Depends(get_current_user)):
        if await db.users.find_one(scope(user), {"_id": 0, "id": 1}) is None:
            raise HTTPException(404, "Usuário não encontrado")
        summary = summarize(answers)
        record = {
            "version": 1, "respostas": answers.model_dump(), "resumo": summary,
            "passo_zero_concluido": False,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.update_one(scope(user), {"$set": {"onboarding": record}})
        return record

    @router.post("/concluir-passo-zero")
    async def finish(user: TokenData = Depends(get_current_user)):
        record = await read(user)
        if not record or record["resumo"]["perfil"] != "endividado":
            raise HTTPException(409, "Não há Passo Zero pendente para este diagnóstico")
        record["passo_zero_concluido"] = True
        record["updated_at"] = datetime.now(timezone.utc).isoformat()
        await db.users.update_one(scope(user), {"$set": {"onboarding": record}})
        return record

    return router
