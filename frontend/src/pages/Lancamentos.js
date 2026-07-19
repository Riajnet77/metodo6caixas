import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SUBCATEGORIAS = {
  'Viver': [
    'Aluguel', 'Financiamento', 'Condomínio', 'Mercado', 'Feira',
    'Luz', 'Água', 'Gás', 'Internet', 'Celular', 'Plano de saúde',
    'Academia', 'Medicamentos', 'Farmácia', 'Consulta médica',
    'Escola', 'Faculdade', 'Creche', 'Material escolar',
    'Diarista', 'Pet - Ração', 'Pet - Veterinário', 'Pet - Banho',
    'Transporte', 'Combustível', 'Uber', 'Ônibus', 'Metrô',
    'Estacionamento', 'Pedágio', 'IPTU', 'IPVA', 'Seguro do carro',
  ],
  'Liberdade Financeira': [
    'Poupança', 'Tesouro Direto', 'CDB', 'Fundo de investimento',
    'Ações', 'FII - Fundo Imobiliário', 'Previdência privada',
    'Criptomoedas', 'LCI', 'LCA', 'Debentures',
  ],
  'Longo Prazo': [
    'Entrada do imóvel', 'Reforma', 'Troca de veículo',
    'Viagem dos sonhos', 'Casamento', 'Festa de formatura',
    'Aposentadoria antecipada', 'Reserva de emergência',
  ],
  'Educação': [
    'Curso online', 'Pós-graduação', 'MBA', 'Inglês', 'Espanhol',
    'Certificação profissional', 'Livros', 'Workshop',
    'Mentoria', 'Congresso', 'Evento profissional',
  ],
  'Doação': [
    'Dízimo', 'Oferta', 'ONG', 'Projeto social',
    'Ajuda à família', 'Cesta básica', 'Doação para amigos',
  ],
  'Lazer': [
    'Restaurante', 'Delivery', 'Cinema', 'Teatro', 'Show',
    'Netflix', 'Spotify', 'Disney+', 'Amazon Prime',
    'Roupas', 'Calçados', 'Salão de beleza', 'Barbearia',
    'Viagem', 'Hospedagem', 'Hobby', 'Games', 'Esporte',
  ],
};

const Lancamentos = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  const [filterMonth, setFilterMonth] = useState(() => {
    return Number(localStorage.getItem('lastMonth')) || new Date().getMonth() + 1;
  });
  const [filterYear, setFilterYear] = useState(() => {
    return Number(localStorage.getItem('lastYear')) || new Date().getFullYear();
  });

  const filterMonthRef = useRef(filterMonth);
  const filterYearRef = useRef(filterYear);

  useEffect(() => {
    filterMonthRef.current = filterMonth;
    filterYearRef.current = filterYear;
    localStorage.setItem('lastMonth', filterMonth.toString());
    localStorage.setItem('lastYear', filterYear.toString());
  }, [filterMonth, filterYear]);

  const getInitialDate = (month, year) => {
    const today = new Date();
    if (month === today.getMonth() + 1 && year === today.getFullYear()) {
      return today.toISOString().split('T')[0];
    }
    return `${year}-${String(month).padStart(2, '0')}-01`;
  };

  const [formData, setFormData] = useState({
    date: getInitialDate(filterMonth, filterYear),
    description: '',
    category: '',
    amount: '',
    notes: ''
  });

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchTransactions(); }, [filterMonth, filterYear, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      const cats = response.data.categories;
      setCategories(cats);
      if (cats.length > 0) {
        setFormData(prev => ({ ...prev, category: prev.category || cats[0].name }));
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let url = `${API}/transactions?month=${filterMonth}&year=${filterYear}`;
      if (filterCategory) url += `&category=${filterCategory}`;
      const response = await axios.get(url);
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterMonthChange = (month) => {
    setFilterMonth(month);
    if (!editingId) {
      setFormData(prev => ({ ...prev, date: getInitialDate(month, filterYearRef.current) }));
    }
  };

  const handleFilterYearChange = (year) => {
    setFilterYear(year);
    if (!editingId) {
      setFormData(prev => ({ ...prev, date: getInitialDate(filterMonthRef.current, year) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const savedMonth = filterMonthRef.current;
    const savedYear = filterYearRef.current;
    try {
      const dataToSend = {
        ...formData,
        date: new Date(formData.date + 'T12:00:00').toISOString(),
        amount: parseFloat(formData.amount)
      };
      if (editingId) {
        await axios.put(`${API}/transactions/${editingId}`, dataToSend);
      } else {
        await axios.post(`${API}/transactions`, dataToSend);
      }
      setEditingId(null);
      setShowForm(false);
      setFormData({
        date: getInitialDate(savedMonth, savedYear),
        description: '',
        category: categories[0]?.name || '',
        amount: '',
        notes: ''
      });
      setFilterMonth(savedMonth);
      setFilterYear(savedYear);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Erro ao salvar transação');
    }
  };

  const handleEdit = (transaction) => {
    setFormData({
      date: new Date(transaction.date).toISOString().split('T')[0],
      description: transaction.description,
      category: transaction.category,
      amount: transaction.amount.toString(),
      notes: transaction.notes || ''
    });
    setEditingId(transaction.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;
    try {
      await axios.delete(`${API}/transactions/${id}`);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      alert('Erro ao excluir transação');
    }
  };

  const resetForm = () => {
    setFormData({
      date: getInitialDate(filterMonthRef.current, filterYearRef.current),
      description: '',
      category: categories[0]?.name || '',
      amount: '',
      notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const subcategorias = SUBCATEGORIAS[formData.category] || [];

  return (
    <div className="max-w-6xl mx-auto" data-testid="lancamentos-page">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Lançamentos</h1>
            <p className="text-gray-600">Registre suas despesas e acompanhe seus gastos</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            <div className="flex-1 grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
                <select
                  value={filterMonth}
                  onChange={(e) => handleFilterMonthChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  data-testid="filter-month"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                <select
                  value={filterYear}
                  onChange={(e) => handleFilterYearChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  data-testid="filter-year"
                >
                  {[2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  data-testid="filter-category"
                >
                  <option value="">Todas</option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full lg:w-auto whitespace-nowrap flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              data-testid="add-transaction-button"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Cancelar' : 'Nova Despesa'}
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editingId ? 'Editar Despesa' : 'Nova Despesa'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  data-testid="transaction-date-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, description: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                  data-testid="transaction-category-input"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sugestões de subcategoria */}
            {subcategorias.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  💡 Sugestões para <strong>{formData.category}</strong> — clique para preencher:
                </label>
                <div className="flex flex-wrap gap-2">
                  {subcategorias.map((sub, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, description: sub })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        formData.description === sub
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Compra no supermercado"
                  required
                  data-testid="transaction-description-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  data-testid="transaction-amount-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações (opcional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                rows="2"
                placeholder="Anotações adicionais..."
                data-testid="transaction-notes-input"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                data-testid="save-transaction-button"
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

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total de Despesas</p>
            <p className="text-3xl font-bold text-gray-900">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Transações</p>
            <p className="text-3xl font-bold text-gray-900">{transactions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">Carregando...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Nenhuma transação encontrada. Adicione sua primeira despesa!
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800"
                          data-testid={`edit-transaction-${transaction.id}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800"
                          data-testid={`delete-transaction-${transaction.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Lancamentos;
