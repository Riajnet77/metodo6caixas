import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Configuracoes from './pages/Configuracoes';
import Lancamentos from './pages/Lancamentos';
import Metas from './pages/Metas';
import Ebook from './pages/Ebook';
import Exemplos from './pages/Exemplos';
// ✅ NOVO: Importa o Passo Zero
import PassoZero from './pages/PassoZero';
import './App.css';

function App() {
  // ✅ NOVO: Estados para controle do Passo Zero
  const [perfil, setPerfil] = useState(null);
  const [passoZeroConcluido, setPassoZeroConcluido] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // ✅ NOVO: Verifica se usuário veio do diagnóstico endividado
  useEffect(() => {
    const perfilDiagnostico = localStorage.getItem('diagnostico_perfil');
    const dadosDiagnostico = JSON.parse(localStorage.getItem('diagnostico_dados') || '{}');
    const passoZeroStatus = localStorage.getItem('passo_zero_concluido');

    if (perfilDiagnostico === 'endividado' && dadosDiagnostico.receita) {
      setPerfil({
        tipo: 'endividado',
        dados: dadosDiagnostico
      });
    }

    if (passoZeroStatus === 'true') {
      setPassoZeroConcluido(true);
    }

    setCarregando(false);
  }, []);

  // ✅ NOVO: Função chamada quando conclui o Passo Zero
  const handleConcluirPassoZero = () => {
    localStorage.setItem('passo_zero_concluido', 'true');
    localStorage.removeItem('diagnostico_perfil');
    setPassoZeroConcluido(true);
    setPerfil(null);
  };

  // ✅ NOVO: Mostra loading enquanto verifica
  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f0f0f',
        color: '#ffffff',
        fontSize: 14,
      }}>
        Carregando...
      </div>
    );
  }

  // ✅ NOVO: Se endividado e não concluiu Passo Zero, mostra ele primeiro
  if (perfil?.tipo === 'endividado' && !passoZeroConcluido) {
    return (
      <PassoZero
        dadosDoDiagnostico={perfil.dados}
        onConcluirPassoZero={handleConcluirPassoZero}
      />
    );
  }

  // ✅ ORIGINAL: Rotas normais do Método 6 Caixas (inalterado)
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="lancamentos" element={<Lancamentos />} />
            <Route path="metas" element={<Metas />} />
            <Route path="ebook" element={<Ebook />} />
            <Route path="exemplos" element={<Exemplos />} />
          </Route>
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
