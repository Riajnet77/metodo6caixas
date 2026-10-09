import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
   const BACKEND_URL = "https://metodo6caixas-xk21.vercel.app";
const API = `${BACKEND_URL}/api`;

// Tempo de expiração do token — 7 dias em ms
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('token');
    const expiry = localStorage.getItem('token_expiry');
    // Verifica se token expirou
    if (saved && expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiry');
      return null;
    }
    return saved;
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expiry');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  // Auto logout quando token expira
  useEffect(() => {
    const expiry = localStorage.getItem('token_expiry');
    if (!expiry) return;
    const remaining = Number(expiry) - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(logout, remaining);
    return () => clearTimeout(timer);
  }, [token, logout]);

  const saveToken = (access_token) => {
    const expiry = Date.now() + TOKEN_EXPIRY_MS;
    localStorage.setItem('token', access_token);
    localStorage.setItem('token_expiry', String(expiry));
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
  };

  const login = async (email, password) => {
    try {
      // Sanitiza inputs
      const cleanEmail = email.trim().toLowerCase().slice(0, 254);
      const cleanPassword = password.slice(0, 72);

      const params = new URLSearchParams();
      params.append('username', cleanEmail);
      params.append('password', cleanPassword);
      const response = await axios.post(
        `${API}/auth/login`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      const { access_token } = response.data;
      saveToken(access_token);
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      if (error.response?.status === 429) {
        return { success: false, error: 'Muitas tentativas. Aguarde 1 minuto e tente novamente.' };
      }
      return { success: false, error: error.response?.data?.detail || 'Erro ao fazer login' };
    }
  };

  const register = async (email, password, full_name, company_name) => {
    try {
      // Sanitiza inputs
      const cleanEmail = email.trim().toLowerCase().slice(0, 254);
      const cleanName = full_name.trim().slice(0, 100);
      const cleanPassword = password.slice(0, 72);

      const response = await axios.post(`${API}/auth/register`, {
        email: cleanEmail,
        password: cleanPassword,
        full_name: cleanName,
        company_name: cleanName
      });
      const { access_token } = response.data;
      saveToken(access_token);
      const userResponse = await axios.get(`${API}/auth/me`);
      setUser(userResponse.data);
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
     const detail = error.response?.data?.detail;
     if (error.response?.status === 429 || detail?.includes('Muitas')) {
     return { success: false, error: 'Muitas tentativas. Aguarde 1 minuto e tente novamente.' };
    }
     return { success: false, error: detail || 'Erro ao fazer login' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export default AuthContext;
