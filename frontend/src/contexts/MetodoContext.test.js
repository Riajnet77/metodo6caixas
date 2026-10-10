import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { MetodoProvider, MetodoGate } from './MetodoContext';
jest.mock('react-router-dom', () => {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
  return require('../../node_modules/react-router/dist/development/index.js');
});
jest.mock('axios', () => ({ get: jest.fn() }));
jest.mock('./AuthContext', () => ({ useAuth: jest.fn() }));
let container, root;
function App() {
  return <MemoryRouter><MetodoProvider><Routes>
    <Route path="/" element={<MetodoGate><span>Área do método</span></MetodoGate>} />
    <Route path="/diagnostico" element={<span>Questionário</span>} />
    <Route path="/passo-zero" element={<span>Passo Zero</span>} />
  </Routes></MetodoProvider></MemoryRouter>;
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  useAuth.mockReturnValue({user:{id:'a'}});
  container = document.createElement('div'); document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {act(() => root.unmount());container.remove();jest.clearAllMocks();});
async function show(record) {
  axios.get.mockResolvedValue({data:record});
  await act(async () => {root.render(<App />);});
}
test('new account starts with questionnaire', async () => {
  await show(null);expect(container.textContent).toContain('Questionário');
});
test('deficit directs to Passo Zero until completion', async () => {
  await show({resumo:{perfil:'endividado'},passo_zero_concluido:false});
  expect(container.textContent).toContain('Passo Zero');
});
test('completed account can access method', async () => {
  await show({resumo:{perfil:'endividado'},passo_zero_concluido:true});
  expect(container.textContent).toContain('Área do método');
});
test('server error shows retry and does not grant access', async () => {
  axios.get.mockRejectedValue(new Error('offline'));
  await act(async () => {root.render(<App />);});
  expect(container.textContent).toContain('Tentar novamente');
  expect(container.textContent).not.toContain('Área do método');
});
