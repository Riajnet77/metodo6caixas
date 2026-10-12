import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordRecovery from './pages/PasswordRecovery';
import { AccessProvider } from './contexts/AccessContext';
import Dashboard from './pages/Dashboard';
import Configuracoes from './pages/Configuracoes';
import Lancamentos from './pages/Lancamentos';
import Metas from './pages/Metas';
import Ebook from './pages/Ebook';
import Exemplos from './pages/Exemplos';
import { MetodoProvider, MetodoGate } from './contexts/MetodoContext';
import Diagnostico from './pages/Diagnostico';
import EtapaZero from './pages/EtapaZero';
import Footer from './components/Footer'; // Importação do rodapé adicionada
import './App.css';

function AppContent() {
  return (
    <Routes>
      <Route path="/inicio" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/esqueci-senha" element={<PasswordRecovery />} />
      <Route path="/redefinir-senha" element={<PasswordRecovery reset />} />
      <Route path="/diagnostico" element={<Diagnostico />} />
      <Route path="/passo-zero" element={<PrivateRoute><EtapaZero /></PrivateRoute>} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<MetodoGate><Home /></MetodoGate>} />
        <Route path="guia" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="configuracoes" element={<Configuracoes />} />
        <Route path="lancamentos" element={<Lancamentos />} />
        <Route path="metas" element={<Metas />} />
        <Route path="ebook" element={<Ebook />} />
        <Route path="exemplos" element={<Exemplos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AccessProvider><AuthProvider><MetodoProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <div style={{ flex: 1 }}>
            <AppContent />
          </div>
          <Footer />
        </div>
      </MetodoProvider></AuthProvider></AccessProvider>
    </BrowserRouter>
  );
}

export default App;
