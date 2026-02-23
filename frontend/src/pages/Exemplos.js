import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Exemplos = () => {
  const [inicianteData, setInicianteData] = useState(null);
  const [veteranoData, setVeteranoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      setLoading(true);
      const [iniciante, veterano] = await Promise.all([
        axios.get(`${API}/examples/iniciante`),
        axios.get(`${API}/examples/veterano`)
      ]);
      setInicianteData(iniciante.data);
      setVeteranoData(veterano.data);
    } catch (error) {
      console.error('Erro ao buscar exemplos:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryTotals = (transactions) => {
    const totals = {};
    transactions.forEach(t => {
      if (!totals[t.category]) {
        totals[t.category] = 0;
      }
      totals[t.category] += t.amount;
    });
    return totals;
  };

  const preparePieData = (transactions) => {
    const totals = calculateCategoryTotals(transactions);
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  };

  const calculateTotal = (transactions) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando exemplos...</p>
        </div>
      </div>
    );
  }

  const inicianteTotal = inicianteData ? calculateTotal(inicianteData.transactions) : 0;
  const veteranoTotal = veteranoData ? calculateTotal(veteranoData.transactions) : 0;
  const iniciante Pie = inicianteData ? preparePieData(inicianteData.transactions) : [];
  const veteranoPie = veteranoData ? preparePieData(veteranoData.transactions) : [];

  return (
    <div className="max-w-7xl mx-auto" data-testid="exemplos-page">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
          <Users className="w-6 h-6 text-amber-700 inline mr-2" />
          <span className="text-amber-700 font-semibold">Exemplos Práticos</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
          Iniciante vs Veterano
        </h1>
        <p className="text-xl text-gray-600">
          Compare dois perfis financeiros e veja a diferença que a disciplina faz
        </p>
      </div>

      {/* Biblical Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100">
        <p className="text-center text-gray-700 italic font-serif">
          "Não é sobre quanto você ganha, mas sobre como você administra."
        </p>
        <p className="text-center text-sm text-blue-600 font-semibold mt-2">
          Ambos os perfis ganham R$ 5.000/mês. A diferença está na MENTALIDADE.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Iniciante */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-200">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Perfil Iniciante</h2>
                <p className="text-red-100 text-sm mt-1">{inicianteData?.description}</p>
              </div>
              <TrendingDown className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Renda</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {inicianteData?.monthly_income.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Gastos</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {inicianteTotal.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-6 ${
              inicianteData?.monthly_income - inicianteTotal >= 0 
                ? 'bg-green-50' 
                : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${
                inicianteData?.monthly_income - inicianteTotal >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                R$ {(inicianteData?.monthly_income - inicianteTotal).toLocaleString('pt-BR')}
              </p>
            </div>

            {/* Pie Chart */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Distribuição de Gastos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={iniciantePie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {iniciantePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Transaction List */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Despesas Detalhadas</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {inicianteData?.transactions.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.description}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      R$ {t.amount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Problems */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-700 mb-2">⚠️ Problemas Identificados:</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>• Gastando mais de 70% da renda só em "Viver"</li>
                <li>• Zero em investimentos e poupança</li>
                <li>• Compras impulsivas frequentes</li>
                <li>• Sem reserva de emergência</li>
                <li>• Risco alto de endividamento</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Veterano */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-200">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Perfil Veterano</h2>
                <p className="text-green-100 text-sm mt-1">{veteranoData?.description}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-50" />
            </div>
          </div>

          <div className="p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Renda</p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {veteranoData?.monthly_income.toLocaleString('pt-BR')}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Gastos</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {veteranoTotal.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            <div className={`rounded-lg p-4 mb-6 ${
              veteranoData?.monthly_income - veteranoTotal >= 0 
                ? 'bg-green-50' 
                : 'bg-red-50'
            }`}>
              <p className="text-sm text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold ${
                veteranoData?.monthly_income - veteranoTotal >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                R$ {(veteranoData?.monthly_income - veteranoTotal).toLocaleString('pt-BR')}
              </p>
            </div>

            {/* Pie Chart */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Distribuição de Gastos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={veteranoPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {veteranoPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Transaction List */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Despesas Detalhadas</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {veteranoData?.transactions.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{t.description}</p>
                      <p className="text-xs text-gray-500">{t.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      R$ {t.amount.toLocaleString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-700 mb-2">✅ Conquistas Alcançadas:</h4>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Investindo 10% para liberdade financeira</li>
                <li>• Poupando 10% para objetivos de longo prazo</li>
                <li>• Investindo em educação continuada</li>
                <li>• Praticando generosidade (dízimo)</li>
                <li>• Equilíbrio entre todas as áreas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Key Lessons */}
      <div className="mt-12 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif">
          Lições Fundamentais
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Mesma Renda, Resultados Diferentes</h3>
            <p className="text-gray-600 text-sm">
              Ambos ganham R$ 5.000. A diferença está na distribuição inteligente e disciplina.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Equilíbrio é a Chave</h3>
            <p className="text-gray-600 text-sm">
              O veterano não sacrifica tudo. Ele equilibra investimento, lazer, doação e vida.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Você Pode Mudar</h3>
            <p className="text-gray-600 text-sm">
              Se você se identifica com o iniciante, não desanime. Use esta ferramenta para se tornar um veterano!
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Qual perfil mais se parece com você hoje? Que tal começar sua transformação agora?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/configuracoes"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Configurar Minhas Finanças
          </a>
          <a
            href="/ebook"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200"
          >
            Ler o Ebook Completo
          </a>
        </div>
      </div>
    </div>
  );
};

export default Exemplos;