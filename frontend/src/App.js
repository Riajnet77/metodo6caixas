import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
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
import PassoZero from './pages/PassoZero';
import './App.css';

function AppContent() {
  const [searchParams] = useSearchParams();
  const [perfil, setPerfil] = useState(null);
  const [passoZeroConcluido, setPassoZeroConcluido] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // ✅ LÊ DADOS DA URL (vindos do diagnóstico em outro domínio)
    const perfilURL = searchParams.get('perfil');
    const receita = searchParams.get('receita');

    if (perfilURL === 'endividado' && receita) {
      setPerfil({
        tipo: 'endividado',
        dados: {
          receita: Number(receita),
          totalGastos: Number(searchParams.get('gastos') || 0),
          totalFixos: Number(searchParams.get('fixos') || 0),
          totalVariaveis: Number(searchParams.get('variaveis') || 0),
          totalCartao: Number(searchParams.get('cartao') || 0),
          deficitMensal: Number(searchParams.get('deficit') || 0),
        }
      });
    }

    // ✅ Também verifica localStorage (para usuários que já fizeram Passo Zero)
    const passoZeroStatus = localStorage.getItem('passo_zero_concluido');
    if (passoZeroStatus === 'true') {
      setPassoZeroConcluido(true);
    }

    setCarregando(false);
  }, [searchParams]);

  const handleConcluirPassoZero = () => {
    localStorage.setItem('passo_zero_concluido', 'true');
    setPassoZeroConcluido(true);
    setPerfil(null);
  };

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f0f0f', color: '#ffffff', fontSize: 14,
      }}>
        Carregando...
      </div>
    );
  }

  // Se endividado e não concluiu Passo Zero → mostra ele primeiro
  if (perfil?.tipo === 'endividado' && !passoZeroConcluido) {
    return (
      <PassoZero
        dadosDoDiagnostico={perfil.dados}
        onConcluirPassoZero={handleConcluirPassoZero}
      />
    );
  }

  // Rotas normais
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
