import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/dashboard?month=${selectedMonth}&year=${selectedYear}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ok': return 'text-green-700 bg-green-100 border-green-300'; // < 100% - Verde forte
      case 'perfect': return 'text-blue-700 bg-blue-100 border-blue-300'; // = 100% - Azul
      case 'critical': return 'text-red-700 bg-red-100 border-red-300'; // > 100% - Vermelho
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ok': return <TrendingUp className="w-5 h-5" />;
      case 'perfect': return <DollarSign className="w-5 h-5" />;
      case 'critical': return <TrendingDown className="w-5 h-5" />;
      default: return null;
    }
  };

  const getExecutionColor = (execution) => {
    if (execution < 100) return '#10B981'; // Verde forte
    if (execution === 100) return '#3B82F6'; // Azul
    return '#EF4444'; // Vermelho
  };

  // Prepare data for bar chart com cores dinâmicas
  const barData = dashboardData.categories_summary.map(cat => ({
    name: cat.name,
    Ideal: cat.ideal_amount,
    Realizado: cat.actual_amount
  }));

  const COLORS_PIE = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
  const COLOR_IDEAL = '#10B981'; // Verde forte para Ideal
  const COLOR_REALIZADO = '#3B82F6'; // Azul padrão para Realizado

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="max-w-7xl mx-auto" data-testid="dashboard-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Dashboard Financeiro</h1>
        <p className="text-gray-600">Visão geral da sua saúde financeira</p>
      </div>

      {/* Month/Year Selector */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          data-testid="month-selector"
        >
          {months.map((month, index) => (
            <option key={index} value={index + 1}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          data-testid="year-selector"
        >
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg" data-testid="kpi-monthly-income">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Renda Mensal</p>
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R$ {dashboardData.monthly_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg" data-testid="kpi-extra-income">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Renda Extra</p>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-600">
            R$ {dashboardData.extra_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg" data-testid="kpi-total-income">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-700 text-sm font-medium">Renda Total</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-700">
            R$ {dashboardData.total_income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg" data-testid="kpi-expenses">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600 text-sm font-medium">Gastos Totais</p>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            R$ {dashboardData.total_expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Balance Card */}
      <div className={`rounded-xl p-6 shadow-lg mb-8 ${
        dashboardData.balance >= 0 ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gradient-to-br from-red-50 to-red-100'
      }`} data-testid="kpi-balance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-2">Saldo do Mês</p>
            <p className={`text-4xl font-bold ${
              dashboardData.balance >= 0 ? 'text-green-700' : 'text-red-700'
            }`}>
              R$ {Math.abs(dashboardData.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {dashboardData.balance >= 0 ? 
            <TrendingUp className="w-12 h-12 text-green-600" /> : 
            <TrendingDown className="w-12 h-12 text-red-600" />
          }
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribuição por Categoria</h2>
          {dashboardData.categories_summary.some(cat => cat.actual_amount > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.categories_summary.filter(cat => cat.actual_amount > 0).map(cat => ({
                    name: cat.name,
                    value: cat.actual_amount
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dashboardData.categories_summary.filter(cat => cat.actual_amount > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>Nenhum gasto registrado este mês</p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ideal vs Realizado</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
              <Legend />
              <Bar dataKey="Ideal" fill={COLOR_IDEAL} name="Ideal (Verde)" />
              <Bar dataKey="Realizado" fill={COLOR_REALIZADO} name="Realizado (Azul)" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🟢 <strong>Verde:</strong> Ideal | 🔵 <strong>Azul:</strong> Realizado
            </p>
          </div>
        </div>
      </div>

      {/* Category Details */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Detalhamento por Categoria</h2>
        <div className="space-y-4">
          {dashboardData.categories_summary.map((category, index) => (
            <div 
              key={index} 
              className={`border rounded-lg p-4 ${getStatusColor(category.status)}`}
              data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(category.status)}
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                </div>
                <span className="text-sm font-medium">
                  {category.actual_percentage.toFixed(1)}% (Ideal: {category.ideal_percentage}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Real: R$ {category.actual_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-sm">Ideal: R$ {category.ideal_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    Variação: {category.deviation > 0 ? '+' : ''}{category.deviation.toFixed(1)}%
                    {category.deviation > 0 ? ' acima' : category.deviation < 0 ? ' abaixo' : ' no ideal'}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-current transition-all"
                  style={{ width: `${Math.min(category.actual_percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;