import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, BookOpen, Target, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-12 lg:py-20">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
          <span className="text-amber-700 font-semibold text-sm">Transforme Sua Realidade Financeira</span>
        </div>
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 font-serif">
          O Hábito da Economia &<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-500">
            Gestão Financeira Bíblica
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Aprenda a criar hábitos financeiros sólidos que transformam pensamentos em prosperidade,
          baseados em princípios eternos e sabedoria prática
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            data-testid="comecar-button"
          >
            Iniciar Jornada
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/ebook"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200"
            data-testid="ebook-button"
          >
            <BookOpen className="w-5 h-5" />
            Ler Conteúdo Completo
          </Link>
        </div>
      </div>

      {/* Wisdom Quote */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-12 border border-blue-100">
        <p className="text-center text-lg text-gray-700 italic font-serif">
          "Os pensamentos dos diligentes conduzem à abundância,<br />
          pois eles trabalham corretamente com um propósito claro."
        </p>
        <p className="text-center text-sm text-blue-600 font-semibold mt-2">
          Provérbios 21:5 - Princípio do Rei Salomão
        </p>
      </div>

      {/* Core Concepts */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Hábitos que Prosperam</h3>
          <p className="text-gray-600">
            Economizar é uma questão de hábito. Pela repetição, forme o piloto automático da prosperidade
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Objetivos e Metas Claras</h3>
          <p className="text-gray-600">
            Pensamentos geram emoções, emoções geram crenças, crenças geram ações que criam resultados
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl card-hover">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sabedoria de Salomão</h3>
          <p className="text-gray-600">
            Aplique os 10 princípios bíblicos de finanças do homem mais próspero da história
          </p>
        </div>
      </div>

      {/* 6 Categories System */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif">
          Sistema de 6 Categorias para Gestão Financeira
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Divida sua renda de forma inteligente e equilibrada
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">50%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Viver</h4>
              <p className="text-sm text-gray-600">Ajuste todas as despesas do cotidiano com 50% dos ganhos mensais</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Liberdade Financeira</h4>
              <p className="text-sm text-gray-600">Pague-se primeiro! Poupe para aumentar rendimentos</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Longo Prazo</h4>
              <p className="text-sm text-gray-600">Imóvel próprio, veículo, reforma, férias</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-amber-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Educação</h4>
              <p className="text-sm text-gray-600">Invista em conhecimentos para ganhar mais</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-rose-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Doação</h4>
              <p className="text-sm text-gray-600">É dando que se recebe - Lei universal</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-600 font-bold">10%</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Lazer</h4>
              <p className="text-sm text-gray-600">Gaste com você, sem culpa, sinta-se próspero</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Principles */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 mb-12 border border-amber-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif">
          Princípios Fundamentais
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Formação do Hábito</h4>
              <p className="text-sm text-gray-700">
                O hábito de economizar, no início, é mais importante do que o próprio valor economizado
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Poder do Pensamento</h4>
              <p className="text-sm text-gray-700">
                Pensamentos criam emoções, sentimentos, crenças, ações e resultados
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Diligência</h4>
              <p className="text-sm text-gray-700">
                Seja cuidadoso, zeloso, pesquisador - busque a excelência em tudo
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Generosidade</h4>
              <p className="text-sm text-gray-700">
                A pessoa generosa terá sempre mais, recebendo de volta o bem que faz
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Three Ways to Earn */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif">
          Três Formas de Ganhar Dinheiro
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h4 className="font-bold text-green-900 mb-2">💵 Ajude pessoas a ganharem dinheiro</h4>
            <p className="text-gray-700 text-sm">
              Seja o melhor no que faz, estruture um curso e compartilhe conhecimento
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-bold text-blue-900 mb-2">🔧 Ajude pessoas a resolver problemas</h4>
            <p className="text-gray-700 text-sm">
              Resolvendo problemas alheios você pode ganhar muito - você só recebe aquilo que dá
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h4 className="font-bold text-purple-900 mb-2">🌟 Ajude na autoconfiança e autoconhecimento</h4>
            <p className="text-gray-700 text-sm">
              Ensine leis universais, incentive pessoas - quando você ensina, aprende muito mais
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
          Pronto para Criar o Hábito da Prosperidade?
        </h2>
        <p className="text-gray-600 mb-8">
          "Todo resultado que você deseja na sua vida está naquilo que você ainda não aprendeu"
        </p>
        <Link
          to="/configuracoes"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          data-testid="configurar-button"
        >
          Configurar Minha Renda Agora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default Home;