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
test('new account can choose tutorial, optional diagnosis or complete content', async () => {
  await show(null);expect(container.textContent).toContain('Bem-vindo');
  expect(container.querySelector('a[href="/guia"]')).not.toBeNull();
  expect(container.textContent).toContain('Começar pelo passo a passo');
  expect(container.querySelector('a[href="/diagnostico"]')).not.toBeNull();
  expect(container.querySelector('a[href="/ebook"]')).not.toBeNull();
});
test('deficit does not block access to purchased method', async () => {
  await show({resumo:{perfil:'endividado'},passo_zero_concluido:false});
  expect(container.textContent).toContain('Área do método');
});
test('completed account can access method', async () => {
  await show({resumo:{perfil:'endividado'},passo_zero_concluido:true});
  expect(container.textContent).toContain('Área do método');
});
test('diagnosis unavailable still offers direct content', async () => {
  axios.get.mockRejectedValue(new Error('offline'));
  await act(async () => {root.render(<App />);});
  expect(container.querySelector('a[href="/ebook"]')).not.toBeNull();
  expect(container.textContent).not.toContain('Área do método');
});
