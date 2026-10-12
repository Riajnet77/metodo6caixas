import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
const Context = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api/onboarding`;
export function MetodoProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState({ owner: null, record: null, error: '', loading: false });
  const [retry, setRetry] = useState(0);
  const id = user?.id;
  useEffect(() => {
    let active = true;
    if (!id) { setState({ owner: null, record: null, error: '', loading: false }); return; }
    setState({ owner: id, record: null, error: '', loading: true });
    axios.get(API).then(({ data }) => {
      if (active) setState({ owner: id, record: data, error: '', loading: false });
    }).catch(() => {
      if (active) setState({ owner: id, record: null, error: 'Não foi possível carregar seu diagnóstico.', loading: false });
    });
    return () => { active = false; };
  }, [id, retry]);
  const update = async (method, path, answers) => {
    const { data } = await axios[method](API + path, answers);
    setState({ owner: id, record: data, error: '', loading: false });
    return data;
  };
  const value = { record: state.owner === id ? state.record : null,
    loading: !!id && (state.owner !== id || state.loading), error: state.owner === id ? state.error : '',
    reload: () => setRetry(n => n + 1), save: answers => update('put', '', answers),
    finish: () => update('post', '/concluir-passo-zero') };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useMetodo = () => useContext(Context);
export function MetodoStatus() {
  const { loading, error, reload } = useMetodo();
  return <div className="p-8 text-center">{loading ? 'Carregando seu diagnóstico...' : <><p role="alert">{error}</p><button onClick={reload}>Tentar novamente</button></>}</div>;
}
export function MetodoGate({ children }) {
  const { record } = useMetodo();
  if (record) return children;
  return <main className="max-w-2xl mx-auto py-10 px-4 space-y-6">
    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Método 6 Caixas</h1>
    <p className="text-lg text-gray-600">Comece pelo passo a passo para conhecer o método e aprender a usar suas seis caixas. Se preferir, faça o diagnóstico ou abra o conteúdo completo.</p>
    <Link to="/guia" className="block rounded-xl bg-amber-600 text-white p-6 hover:bg-amber-700">
      <span className="block text-sm font-semibold mb-2">Comece por aqui</span>
      <span className="block text-xl font-bold">Começar pelo passo a passo</span>
      <span className="block mt-2">Conheça as caixas e aprenda a configurar sua renda, registrar gastos, acompanhar seu dinheiro e definir metas.</span>
    </Link>
    <div className="grid gap-4 sm:grid-cols-2">
      <Link to="/diagnostico" className="rounded-xl border border-amber-300 bg-amber-50 p-6 hover:bg-amber-100">
        <span className="block text-sm font-semibold text-amber-800 mb-2">Opcional</span>
        <span className="block text-xl font-bold text-gray-900">Fazer meu diagnóstico</span>
        <span className="block mt-2 text-gray-700">Responda ao questionário para receber um direcionamento inicial.</span>
      </Link>
      <Link to="/ebook" className="rounded-xl border border-gray-300 bg-white p-6 hover:bg-gray-50">
        <span className="block text-xl font-bold text-gray-900">Ler o conteúdo completo</span>
        <span className="block mt-2 text-gray-700">Abra o conteúdo completo sem responder ao questionário.</span>
      </Link>
    </div>
    <p className="text-gray-600">Você pode fazer o diagnóstico depois pelo menu “Meu diagnóstico”. Para começar seu controle financeiro, <Link to="/configuracoes" className="underline text-amber-800">configure suas seis caixas</Link>.</p>
  </main>;
}
