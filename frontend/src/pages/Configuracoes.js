import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Configuracoes = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(`${API}/settings`, {
        monthly_income: settings.monthly_income,
        categories: settings.categories
      });
      setMessage('✅ Configurações salvas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('❌ Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (index, field, value) => {
    const updatedCategories = [...settings.categories];
    updatedCategories[index][field] = field === 'ideal_percentage' ? parseFloat(value) : value;
    setSettings({ ...settings, categories: updatedCategories });
  };

  const totalPercentage = settings?.categories.reduce((sum, cat) => sum + cat.ideal_percentage, 0) || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto" data-testid="configuracoes-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Configurações Financeiras</h1>
        <p className="text-gray-600">Defina sua renda e os percentuais ideais para cada categoria</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Income Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Renda Mensal</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">R$</span>
          <input
            type="number"
            value={settings?.monthly_income || 0}
            onChange={(e) => setSettings({ ...settings, monthly_income: parseFloat(e.target.value) || 0 })}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
            placeholder="5000.00"
            step="0.01"
            data-testid="monthly-income-input"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          💡 Dica: Inclua todas as suas fontes de renda (salário, freelance, investimentos, etc.)
        </p>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Categorias e Percentuais</h2>
          <div className={`px-4 py-2 rounded-lg font-semibold ${
            Math.abs(totalPercentage - 100) < 0.01 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            Total: {totalPercentage.toFixed(0)}%
          </div>
        </div>

        <div className="space-y-4">
          {settings?.categories.map((category, index) => {
            const idealAmount = (settings.monthly_income * category.ideal_percentage) / 100;
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      data-testid={`category-name-${index}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Percentual Ideal (%)</label>
                    <input
                      type="number"
                      value={category.ideal_percentage}
                      onChange={(e) => handleCategoryChange(index, 'ideal_percentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      step="0.1"
                      min="0"
                      max="100"
                      data-testid={`category-percentage-${index}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor Ideal (R$)</label>
                    <input
                      type="text"
                      value={`R$ ${idealAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => handleCategoryChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                    placeholder="Ex: Moradia, alimentação, transporte"
                    data-testid={`category-description-${index}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {Math.abs(totalPercentage - 100) >= 0.01 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">
              ⚠️ A soma dos percentuais deve ser 100%. Ajuste os valores para continuar.
            </p>
          </div>
        )}
      </div>

      {/* Biblical Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <p className="text-center text-gray-700 italic font-serif">
          "Ao SENHOR pertence a terra e tudo o que nela existe,<br />
          o mundo e os que nele vivem."
        </p>
        <p className="text-center text-sm text-blue-600 font-semibold mt-2">
          Salmos 24:1
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          Lembre-se: você é um administrador, não o dono. Gerencie com sabedoria!
        </p>
      </div>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saving || Math.abs(totalPercentage - 100) >= 0.01}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 transition-all"
          data-testid="save-settings-button"
        >
          {saving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;