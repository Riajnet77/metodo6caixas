import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Target, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Metas = () => {
  const [goals, setGoals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    target_amount: '',
    deadline: ''
  });

  useEffect(() => {
    fetchSettings();
    fetchGoals();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setCategories(response.data.categories);
      if (response.data.categories.length > 0 && !formData.category) {
        setFormData({ ...formData, category: response.data.categories[0].name });
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/goals`);
      setGoals(response.data);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline ? new Date(formData.deadline + 'T12:00:00').toISOString() : null
      };

      if (editingId) {
        await axios.put(`${API}/goals/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API}/goals`, dataToSend);
      }

      resetForm();
      fetchGoals();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro ao salvar meta');
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      category: goal.category,
      target_amount: goal.target_amount.toString(),
      deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) return;
    
    try {
      await axios.delete(`${API}/goals/${id}`);
      fetchGoals();
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      alert('Erro ao excluir meta');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: categories[0]?.name || '',
      target_amount: '',
      deadline: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto" data-testid="metas-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Metas e Sonhos</h1>
          <p className="text-gray-600">Defina seus objetivos financeiros e acompanhe o progresso</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-testid="add-goal-button"
        >
          {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? 'Cancelar' : 'Nova Meta'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Editar Meta' : 'Nova Meta'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Meta</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Viagem para a Europa"
                  required
                  data-testid="goal-name-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  data-testid="goal-category-input"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor Alvo (R$)</label>
                <input
                  type="number"
                  value={formData.target_amount}
                  onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="10000.00"
                  step="0.01"
                  min="0"
                  required
                  data-testid="goal-amount-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prazo (opcional)</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  data-testid="goal-deadline-input"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-testid="save-goal-button"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Biblical Reference */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <p className="text-center text-gray-700 italic font-serif">
          "Onde não há visão, o povo perece"<br />
        </p>
        <p className="text-center text-sm text-blue-600 font-semibold mt-2">
          Provérbios 29:18
        </p>
        <p className="text-center text-sm text-gray-600 mt-2">
          Tenha objetivos claros e trabalhe com propósito!
        </p>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma meta cadastrada</h3>
          <p className="text-gray-600 mb-6">
            Comece definindo suas primeiras metas financeiras!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Criar Primeira Meta
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = (goal.current_amount / goal.target_amount) * 100;
            const progressColor = getProgressColor(progress);
            const daysRemaining = goal.deadline 
              ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div key={goal.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover" data-testid={`goal-card-${goal.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.name}</h3>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {goal.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`edit-goal-${goal.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-red-600 hover:text-red-800"
                      data-testid={`delete-goal-${goal.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Progresso</span>
                    <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${progressColor} transition-all duration-500`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Atual:</span>
                    <span className="font-semibold text-gray-900">
                      R$ {goal.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Meta:</span>
                    <span className="font-semibold text-gray-900">
                      R$ {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Falta:</span>
                    <span className="font-semibold text-amber-600">
                      R$ {(goal.target_amount - goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {goal.deadline && (
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Prazo:</span>
                      <span className={`font-semibold ${
                        daysRemaining < 30 ? 'text-red-600' : daysRemaining < 90 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {daysRemaining > 0 ? `${daysRemaining} dias` : 'Prazo vencido'}
                      </span>
                    </div>
                  )}
                </div>

                {progress >= 100 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700 font-semibold text-center">
                      🎉 Meta alcançada!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Metas;