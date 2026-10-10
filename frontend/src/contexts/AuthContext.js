import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
const AuthContext = createContext(null);
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const UNAVAILABLE = 'O serviço está temporariamente indisponível ou iniciando. Aguarde um minuto e tente novamente. Sua senha não foi alterada.';
export function authError(error) {
  const status = error.response?.status;
  if (!status || status >= 500) return UNAVAILABLE;
  if (status === 401) return 'Email ou senha incorretos. Confira os dados ou use “Esqueci minha senha”.';
  if (status === 429) return 'Muitas tentativas. Aguarde 1 minuto e tente novamente.';
  const detail = error.response?.data?.detail;
  return typeof detail === 'string' ? detail : 'Não foi possível concluir. Confira os dados informados.';
}
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  const [retry, setRetry] = useState(0);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token');
    const expiry = Number(localStorage.getItem('token_expiry'));
    if (saved && (!expiry || Date.now() >= expiry)) {
      localStorage.removeItem('token'); localStorage.removeItem('token_expiry'); return null;
    }
    return saved;
  });
  const logout = useCallback(() => {
    localStorage.removeItem('token'); localStorage.removeItem('token_expiry');
    setToken(null); setUser(null); setSessionError('');
    delete axios.defaults.headers.common.Authorization;
  }, []);
  useEffect(() => {
    let active = true;
    if (!token) {setLoading(false); return;}
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    setLoading(true); setSessionError('');
    axios.get(`${API}/auth/me`, {headers:{Authorization:`Bearer ${token}`}, timeout:70000})
      .then(({data}) => {if(active) setUser(data);})
      .catch(error => {
        if(!active) return;
        if(error.response?.status === 401) logout();
        else {setUser(null); setSessionError(authError(error));}
      }).finally(() => {if(active) setLoading(false);});
    return () => {active=false;};
  }, [token, retry, logout]);
  useEffect(() => {
    if(!token) return;
    const remaining=Number(localStorage.getItem('token_expiry'))-Date.now();
    if(remaining<=0) {logout(); return;}
    const timer=setTimeout(logout,remaining);return () => clearTimeout(timer);
  }, [token,logout]);
  async function login(email,password) {
    try {
      const params = new URLSearchParams({username:email.trim().toLowerCase(),password});
      const response = await axios.post(`${API}/auth/login`,params,{headers:{'Content-Type':'application/x-www-form-urlencoded'},timeout:70000});
      const accessToken=response.data.access_token;
      const current=await axios.get(`${API}/auth/me`,{headers:{Authorization:`Bearer ${accessToken}`},timeout:70000});
      localStorage.setItem('token',accessToken);localStorage.setItem('token_expiry',String(Date.now()+TOKEN_EXPIRY_MS));
      axios.defaults.headers.common.Authorization=`Bearer ${accessToken}`;
      setUser(current.data);setSessionError('');setToken(accessToken);setLoading(false);
      return {success:true};
    } catch(error) {return {success:false,error:authError(error)};}
  }
  return <AuthContext.Provider value={{user,loading,login,logout,isAuthenticated:!!user,sessionError,retrySession:()=>setRetry(n=>n+1)}}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context=useContext(AuthContext);if(!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');return context;
};
export default AuthContext;
