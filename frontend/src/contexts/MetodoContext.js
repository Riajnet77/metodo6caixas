import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
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
  const { loading, error, record } = useMetodo();
  if (loading || error) return <MetodoStatus />;
  if (!record) return <Navigate to="/diagnostico" replace />;
  if (record.resumo.perfil === 'endividado' && !record.passo_zero_concluido) return <Navigate to="/passo-zero" replace />;
  return children;
}
