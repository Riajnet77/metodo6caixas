import copy
import unittest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from backend.auth import TokenData, get_current_user
from backend.onboarding import create_onboarding_router

class Users:
    def __init__(self):
        self.docs = [{'id': 'a', 'company_id': 'one'}, {'id': 'b', 'company_id': 'two'}]
    async def find_one(self, query, projection=None):
        return next((copy.deepcopy(d) for d in self.docs if all(d.get(k) == v for k, v in query.items())), None)
    async def update_one(self, query, update):
        for doc in self.docs:
            if all(doc.get(k) == v for k, v in query.items()):
                doc.update(copy.deepcopy(update['$set']))

class OnboardingTests(unittest.TestCase):
    def setUp(self):
        self.db = type('DB', (), {'users': Users()})()
        self.user = TokenData(user_id='a', company_id='one')
        app = FastAPI()
        app.include_router(create_onboarding_router(self.db))
        app.dependency_overrides[get_current_user] = lambda: self.user
        self.client = TestClient(app)
        self.answers = dict(problema='a', receita=1000, tipoRenda='fixa', fixos={'aluguel': 600}, variaveis={'lazer': 200}, cartao=300, usoCartao='misto')
    def test_save_finish_reload_and_isolation(self):
        saved = self.client.put('/api/onboarding', json=self.answers)
        self.assertEqual(saved.status_code, 200)
        self.assertEqual(saved.json()['resumo']['deficitMensal'], 100)
        self.assertEqual(saved.json()['resumo']['perfil'], 'endividado')
        self.assertTrue(self.client.post('/api/onboarding/concluir-passo-zero').json()['passo_zero_concluido'])
        self.assertTrue(self.client.get('/api/onboarding').json()['passo_zero_concluido'])
        self.user = TokenData(user_id='b', company_id='two')
        self.assertIsNone(self.client.get('/api/onboarding').json())
        self.assertEqual(self.client.post('/api/onboarding/concluir-passo-zero').status_code, 409)
        self.user = TokenData(user_id='a', company_id='two')
        self.assertEqual(self.client.get('/api/onboarding').status_code, 404)
    def test_boundaries_and_reset(self):
        for card, profile in [(200, 'ajuste'), (50, 'ajuste'), (49, 'organizacao')]:
            self.answers['cartao'] = card
            result = self.client.put('/api/onboarding', json=self.answers).json()
            self.assertEqual(result['resumo']['perfil'], profile)
            self.assertFalse(result['passo_zero_concluido'])
        self.assertEqual(self.client.post('/api/onboarding/concluir-passo-zero').status_code, 409)
    def test_invalid_expenses_and_zero_income(self):
        for changes in [{'receita': 0}, {'cartao': -1}, {'fixos': {'aluguel': -1}}, {'fixos': {'unknown': 5}}]:
            self.assertEqual(self.client.put('/api/onboarding', json={**self.answers, **changes}).status_code, 422)
        self.assertIsNone(self.client.get('/api/onboarding').json())

if __name__ == '__main__': unittest.main()
