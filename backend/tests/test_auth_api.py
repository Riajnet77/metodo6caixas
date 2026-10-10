import asyncio
from datetime import datetime, timezone
import importlib
import os
import unittest
from unittest.mock import patch, AsyncMock
from pymongo.errors import ServerSelectionTimeoutError
from fastapi.testclient import TestClient
from backend import auth
from backend.tests.fake_mongo import DB

class AuthAPITests(unittest.TestCase):
    def setUp(self):
        self.db=DB()
        client=type('FakeClient',(),{'__getitem__':lambda _,name:self.db})()
        with patch.dict(os.environ,{'MONGO_URL':'mongodb://localhost:27017','DB_NAME':'test'}), patch('pymongo.AsyncMongoClient',return_value=client):
            self.server=importlib.import_module('backend.server')
        self.server.db=self.db;auth.configure_auth(self.db);self.server.rate_limit_store.clear()
        self.key=patch.object(auth,'SECRET_KEY','test-signing-key-that-is-longer-than-32-characters');self.key.start()
        asyncio.run(self.db.users.insert_one({'id':'a','email':'buyer@example.com','full_name':'Cliente','company_id':'c','company_name':'Cliente','hashed_password':auth.get_password_hash('correct-password'),'is_active':True,'created_at':datetime.now(timezone.utc).isoformat()}))
        self.client=TestClient(self.server.app)
    def tearDown(self):self.client.close();self.key.stop();auth.configure_auth(None)
    def login(self,password='correct-password',email='buyer@example.com'):
        return self.client.post('/api/auth/login',data={'username':email,'password':password})
    def test_login_normalization_and_reset_version_claim(self):
        self.db.users.docs[0]['auth_version']=2
        r=self.login(email=' BUYER@example.com ');self.assertEqual(r.status_code,200)
        token=r.json()['access_token']
        self.assertEqual(self.client.get('/api/auth/me',headers={'Authorization':'Bearer '+token}).status_code,200)
        self.db.users.docs[0]['auth_version']=3
        self.assertEqual(self.client.get('/api/auth/me',headers={'Authorization':'Bearer '+token}).status_code,401)
    def test_credentials_and_corrupt_hash_return_401_not_500(self):
        self.assertEqual(self.login(password='wrong-password').status_code,401)
        self.assertEqual(self.login(email='unknown@example.com').status_code,401)
        self.db.users.docs[0]['hashed_password']='invalid-hash'
        self.assertEqual(self.login().status_code,401)
    def test_public_registration_is_closed(self):
        r=self.client.post('/api/auth/register',json={'email':'new@example.com','password':'password','full_name':'Cliente','company_name':'Cliente'})
        self.assertEqual(r.status_code,403);self.assertEqual(len(self.db.users.docs),1)
    def test_inactive_and_unpaid_cannot_login(self):
        self.db.users.docs[0]['is_active']=False;self.assertEqual(self.login().status_code,403)
        self.db.users.docs[0].update(is_active=True,access_mode='hotmart');self.assertEqual(self.login().status_code,403)
        self.db.users.docs[0].update(access_mode='manual',has_password=False);self.assertEqual(self.login().status_code,401)
    def test_database_outage_is_503_and_does_not_expose_connection_details(self):
        with patch.object(self.db.users,'find_one',AsyncMock(side_effect=ServerSelectionTimeoutError('sensitive-connection-string'))):
            response=self.login()
        self.assertEqual(response.status_code,503)
        self.assertNotIn('sensitive-connection-string',response.text)
    def test_recovery_and_login_share_server_rate_limit(self):
        for _ in range(5):self.assertEqual(self.login(password='wrong-password').status_code,401)
        self.assertEqual(self.client.post('/api/auth/forgot-password',json={'email':'buyer@example.com'}).status_code,429)
        self.assertEqual(self.client.post('/api/auth/reset-password',json={'token':'x'*43,'password':'new-password'}).status_code,429)

if __name__=='__main__':unittest.main()
