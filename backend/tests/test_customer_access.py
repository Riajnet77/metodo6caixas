import asyncio
from datetime import datetime, timedelta, timezone
import os
import re
import unittest
from unittest.mock import patch

from fastapi import Depends, FastAPI, HTTPException
from fastapi.testclient import TestClient
from backend import auth
from backend.auth import create_access_token, get_current_user, verify_password, get_password_hash
from backend.customer_access import create_customer_router, ensure_account_access, digest
from backend.tests.fake_mongo import DB

class CustomerAccessTests(unittest.TestCase):
    def setUp(self):
        self.env=patch.dict(os.environ, {'RESEND_API_KEY':'test-no-real-provider', 'EMAIL_FROM':'test@example.com', 'HOTMART_HOTTOK':'test-hotmart-secret', 'HOTMART_PRODUCT_IDS':'123', 'APP_URL':'https://www.metodo6caixas.com.br'}, clear=False)
        self.env.start()
        self.key=patch.object(auth,'SECRET_KEY','test-signing-key-that-is-longer-than-32-characters');self.key.start()
        self.db=DB();auth.configure_auth(self.db)
        self.emails=[];self.email_fail=False
        async def sender(email, subject, text, key):
            if self.email_fail: raise HTTPException(503,'Email temporarily unavailable')
            self.emails.append((email,subject,text,key))
        self.app=FastAPI();self.app.include_router(create_customer_router(self.db,sender))
        @self.app.get('/private')
        async def private(user=Depends(get_current_user)):return {'id':user.user_id}
        self.client=TestClient(self.app)
        self.user={'id':'old-user','email':'buyer@example.com','company_id':'company','hashed_password':get_password_hash('original-password'),'is_active':True}
        asyncio.run(self.db.users.insert_one(self.user))
    def tearDown(self):
        self.client.close();self.env.stop();self.key.stop();auth.configure_auth(None)
    def event(self, kind='PURCHASE_APPROVED', transaction='HP001', email='new@example.com', stamp=1000, product=123):
        status={'PURCHASE_APPROVED':'APPROVED','PURCHASE_COMPLETE':'COMPLETE','PURCHASE_REFUNDED':'REFUNDED','PURCHASE_CANCELED':'CANCELLED','PURCHASE_CHARGEBACK':'CHARGEBACK'}[kind]
        return {'id':kind+transaction+str(stamp),'creation_date':stamp,'version':'2.0.0','event':kind,'data':{'buyer':{'email':email,'name':'Cliente'},'product':{'id':product},'purchase':{'transaction':transaction,'status':status}}}
    def webhook(self,event,headers=None):
        return self.client.post('/api/integrations/hotmart/webhook',json=event,headers=headers if headers is not None else {'X-HOTMART-HOTTOK':'test-hotmart-secret'})
    def token(self):return create_access_token({'sub':'old-user','email':'buyer@example.com','company_id':'company'})
    def reset_token(self,index=-1):return re.search(r'#token=([A-Za-z0-9_-]+)',self.emails[index][2]).group(1)
    def test_recovery_hash_only_single_use_and_session_invalidation(self):
        jwt=self.token()
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,200)
        r=self.client.post('/api/auth/forgot-password',json={'email':' BUYER@example.com '})
        self.assertEqual(r.status_code,202)
        raw=self.reset_token();self.assertEqual(self.db.password_reset_tokens.docs[0]['_id'],digest(raw))
        self.assertNotIn(raw,str(self.db.password_reset_tokens.docs))
        payload={'token':raw,'password':'new-password'}
        self.assertEqual(self.client.post('/api/auth/reset-password',json=payload).status_code,200)
        self.assertEqual(self.client.post('/api/auth/reset-password',json=payload).status_code,400)
        self.assertTrue(verify_password('new-password',self.db.users.docs[0]['hashed_password']))
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,401)
    def test_expiration_invalid_token_and_password_limits(self):
        self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'})
        raw=self.reset_token();self.db.password_reset_tokens.docs[0]['expires_at']=datetime.now(timezone.utc)-timedelta(seconds=1)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':raw,'password':'new-password'}).status_code,400)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':'x'*43,'password':'new-password'}).status_code,400)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':raw,'password':'short'}).status_code,422)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':raw,'password':'á'*40}).status_code,422)
        self.assertTrue(verify_password('original-password',self.db.users.docs[0]['hashed_password']))
    def test_unknown_email_same_message_no_credentials_exposed(self):
        known=self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'})
        unknown=self.client.post('/api/auth/forgot-password',json={'email':'unknown@example.com'})
        self.assertEqual(known.status_code,unknown.status_code)
        self.assertEqual(known.json(),unknown.json());self.assertEqual(len(self.emails),1)
    def test_email_unconfigured_and_failed_delivery_not_fake_success(self):
        with patch.dict(os.environ,{'RESEND_API_KEY':''}):
            self.assertFalse(self.client.get('/api/public/config').json()['password_recovery_available'])
            self.assertEqual(self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'}).status_code,503)
            self.assertEqual(self.client.post('/api/auth/forgot-password',json={'email':'unknown@example.com'}).status_code,503)
        self.email_fail=True
        self.assertEqual(self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'}).status_code,503)
    def test_authenticity_product_status_and_version(self):
        ev=self.event()
        self.assertEqual(self.webhook(ev,{}).status_code,401)
        self.assertEqual(self.webhook(self.event(product=999)).status_code,403)
        ev['data']['purchase']['status']='WAITING_PAYMENT';self.assertEqual(self.webhook(ev).status_code,422)
        ev=self.event();ev['version']='1.0.0';self.assertEqual(self.webhook(ev).status_code,422)
        with patch.dict(os.environ,{'HOTMART_HOTTOK':''}):self.assertEqual(self.webhook(self.event()).status_code,503)
        self.assertEqual(len(self.db.users.docs),1)
    def test_paid_account_created_and_duplicate_does_not_send_again(self):
        self.assertEqual(self.webhook(self.event()).status_code,200)
        self.assertEqual(len(self.db.users.docs),2)
        user=self.db.users.docs[1];self.assertFalse(user['has_password']);self.assertEqual(user['access_mode'],'hotmart')
        self.assertEqual(len(self.emails),1)
        self.assertEqual(self.webhook(self.event()).status_code,200)
        self.assertEqual(len(self.emails),1)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':self.reset_token(),'password':'customer-password'}).status_code,200)
        self.assertTrue(self.db.users.docs[1]['has_password'])
    def test_payment_refund_blocks_already_issued_session(self):
        jwt=self.token()
        self.assertEqual(self.webhook(self.event(email='buyer@example.com')).status_code,200)
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,200)
        self.assertEqual(self.webhook(self.event('PURCHASE_REFUNDED',email='buyer@example.com',stamp=2000)).status_code,200)
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,403)
    def test_refund_before_approval_cannot_restore_access(self):
        self.assertEqual(self.webhook(self.event('PURCHASE_REFUNDED',stamp=2000)).status_code,200)
        self.assertEqual(self.webhook(self.event(stamp=1000)).status_code,200)
        self.assertEqual(self.webhook(self.event(stamp=3000)).status_code,200)
        self.assertEqual(len(self.db.users.docs),1);self.assertEqual(self.db.hotmart_purchases.docs[0]['state'],'revoked')
    def test_older_refund_is_terminal_and_second_purchase_remains_valid(self):
        self.webhook(self.event(email='buyer@example.com',stamp=2000))
        self.webhook(self.event('PURCHASE_REFUNDED',email='buyer@example.com',stamp=1000))
        jwt=self.token();self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,403)
        self.webhook(self.event(transaction='HP002',email='buyer@example.com',stamp=3000))
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+jwt}).status_code,200)
    def test_email_failure_webhook_can_retry_without_duplicate_account(self):
        self.email_fail=True;self.assertEqual(self.webhook(self.event()).status_code,503)
        self.email_fail=False;self.assertEqual(self.webhook(self.event()).status_code,200)
        self.assertEqual(len(self.db.users.docs),2);self.assertEqual(len(self.emails),1)
    def test_password_reset_does_not_restore_refunded_access(self):
        self.webhook(self.event(email='buyer@example.com'))
        self.webhook(self.event('PURCHASE_CHARGEBACK',email='buyer@example.com',stamp=2000))
        self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'})
        self.client.post('/api/auth/reset-password',json={'token':self.reset_token(),'password':'new-password'})
        user=self.db.users.docs[0]
        with self.assertRaises(HTTPException) as raised:asyncio.run(ensure_account_access(self.db,user))
        self.assertEqual(raised.exception.status_code,403)
    def test_inactive_account_and_invalid_bcrypt_hash(self):
        self.db.users.docs[0]['is_active']=False
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+self.token()}).status_code,403)
        self.assertFalse(verify_password('password','invalid-hash'));self.assertFalse(verify_password('á'*50,get_password_hash('valid-password')))
    def test_other_outstanding_link_invalid_after_password_change(self):
        for _ in range(2):
            self.db.users.docs[0]['recovery_next_at']=datetime.now(timezone.utc)-timedelta(seconds=1)
            self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'})
        self.client.post('/api/auth/reset-password',json={'token':self.reset_token(0),'password':'first-password'})
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':self.reset_token(1),'password':'second-password'}).status_code,400)
    def test_mismatched_transaction_buyer_and_subscriptions_rejected(self):
        self.webhook(self.event())
        self.assertEqual(self.webhook(self.event(email='other@example.com',stamp=2000)).status_code,409)
        ev=self.event(transaction='SUB');ev['data']['subscription']={'id':123}
        self.assertEqual(self.webhook(ev).status_code,422)
    def test_manual_and_legacy_accounts_preserved(self):
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+self.token()}).status_code,200)
        self.db.users.docs[0]['access_mode']='manual'
        self.webhook(self.event(email='buyer@example.com'))
        self.webhook(self.event('PURCHASE_REFUNDED',email='buyer@example.com',stamp=2000))
        self.assertEqual(self.client.get('/private',headers={'Authorization':'Bearer '+self.token()}).status_code,200)
    def test_recovery_per_account_cooldown_and_hourly_allowance(self):
        body={'email':'buyer@example.com'}
        self.client.post('/api/auth/forgot-password',json=body)
        self.assertEqual(self.client.post('/api/auth/forgot-password',json=body).status_code,202)
        self.assertEqual(len(self.emails),1)
        for _ in range(4):
            self.db.users.docs[0]['recovery_next_at']=datetime.now(timezone.utc)-timedelta(seconds=1)
            self.assertEqual(self.client.post('/api/auth/forgot-password',json=body).status_code,202)
        self.assertEqual(len(self.emails),3)
    def test_weak_signing_key_never_issues_token(self):
        with patch.object(auth,'SECRET_KEY',''):
            with self.assertRaises(HTTPException):self.token()

if __name__=='__main__':unittest.main()
