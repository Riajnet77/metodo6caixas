import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LandingPage from '../pages/LandingPage';
import { SupportLink } from '../contexts/AccessContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, sessionError, retrySession, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-amber-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if(sessionError) return <div className="p-8 text-center"><p role="alert">{sessionError}</p><button className="underline m-3" onClick={retrySession}>Tentar novamente</button><button className="underline m-3" onClick={logout}>Voltar ao início</button><SupportLink /></div>;

  return isAuthenticated ? children : <LandingPage />;
};

export default PrivateRoute;
