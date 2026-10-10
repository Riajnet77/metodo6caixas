import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useAccess, SupportLink } from '../contexts/AccessContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const {checkout_url} = useAccess();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bloqueado) return;
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
    } else {
      if (result.error?.includes('Muitas tentativas')) {
        setBloqueado(true);
        setError(result.error);
        setTimeout(() => {
          setBloqueado(false);
          setError('');
        }, 60000);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Método 6 Caixas</h1>
          <p className="text-gray-600">e Gestão Financeira</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <LogIn className="w-6 h-6 text-amber-600" />
            <h2 className="text-2xl font-bold text-gray-900">Entrar</h2>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-2 ${bloqueado ? 'bg-orange-50 border border-orange-200' : 'bg-red-50 border border-red-200'}`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${bloqueado ? 'text-orange-600' : 'text-red-600'}`} />
              <p className={`text-sm ${bloqueado ? 'text-orange-700' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="seu@email.com"
                  required
                  disabled={bloqueado || loading}
                  data-testid="login-email-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={bloqueado || loading}
                  data-testid="login-password-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || bloqueado}
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all ${bloqueado ? 'bg-orange-400' : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:shadow-xl'}`}
              data-testid="login-submit-button"
            >
              {bloqueado ? '⏳ Aguarde 1 minuto...' : loading ? 'Entrando... aguarde' : 'Entrar'}
            </button>
          </form>
          <Link className="block text-sm text-amber-700 underline mt-4" to="/esqueci-senha">Esqueci minha senha</Link>
          <Link className="block text-sm text-amber-700 underline mt-3" to="/register">Comprei e preciso do primeiro acesso</Link>
          <SupportLink />

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Ainda não tem acesso?{' '}
              <a href={checkout_url || "/diagnostico"} className="text-amber-600 font-semibold hover:text-amber-700">
                {checkout_url ? "Adquira o Método 6 Caixas" : "Conheça o diagnóstico gratuito"}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 italic">
            "Os pensamentos dos diligentes conduzem à abundância"
          </p>
          <p className="text-xs text-gray-500 mt-1">Provérbios 21:5</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
