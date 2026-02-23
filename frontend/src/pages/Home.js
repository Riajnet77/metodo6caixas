import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BookOpen, Target, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 lg:py-20">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
          <span className="text-amber-700 font-semibold text-sm">Prosperidade com Propósito</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif">
          Mente Milionária &<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
            Finanças Bíblicas
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transforme sua relação com o dinheiro combinando princípios de sucesso
          com sabedoria bíblica
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            data-testid="comecar-button"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/ebook"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200"
            data-testid="ebook-button"
          >
            <BookOpen className="w-5 h-5" />
            Ler o Ebook
          </Link>
        </div>
      </div>

      {/* Bible Verse */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border border-blue-100">
        <p className="text-center text-lg text-gray-700 italic font-serif">
          "Os planos bem elaborados levam à fartura;<br />
          o apressado acaba na miséria."
        </p>
        <p className="text-center text-sm text-blue-600 font-semibold mt-2">
          Provérbios 21:5
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Interativo</h3>
          <p className="text-gray-600">
            Visualize sua saúde financeira em tempo real com gráficos e indicadores claros
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Metas com Propósito</h3>
          <p className="text-gray-600">
            Defina objetivos financeiros alinhados com seus valores e acompanhe o progresso
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sabedoria Bíblica</h3>
          <p className="text-gray-600">
            Aprenda princípios eternos sobre mordomia, generosidade e prosperidade
          </p>
        </div>
      </div>

      {/* Categories Preview */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif">
          6 Categorias para Equilíbrio Financeiro
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">50%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Viver</h4>
              <p className="text-sm text-gray-600">Moradia, alimentação, transporte</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Liberdade Financeira</h4>
              <p className="text-sm text-gray-600">Investimentos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Longo Prazo</h4>
              <p className="text-sm text-gray-600">Poupança para sonhos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Educação</h4>
              <p className="text-sm text-gray-600">Cursos, livros</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-rose-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Doação</h4>
              <p className="text-sm text-gray-600">Dízimo, ofertas, projetos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Lazer</h4>
              <p className="text-sm text-gray-600">Entretenimento, viagens</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
          Pronto para Transformar suas Finanças?
        </h2>
        <p className="text-gray-600 mb-8">
          Comece hoje sua jornada rumo à prosperidade com propósito
        </p>
        <Link
          to="/configuracoes"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-testid="configurar-button"
        >
          Configurar Minha Renda
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;