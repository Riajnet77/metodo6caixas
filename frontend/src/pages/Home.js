import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, PlusCircle, BarChart2, CheckCircle, BookOpen } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto">

      {/* HERO — Provocar a dor */}
      <div className="text-center py-12">
        <div className="inline-block mb-4 px-4 py-2 bg-red-100 rounded-full">
          <span className="text-red-700 font-semibold text-sm">Você se identifica com isso?</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
          Seu dinheiro acaba<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
            antes do mês terminar?
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-xl mx-auto">
          Você trabalha muito, mas no final do mês não sobra nada — e você não sabe exatamente para onde o dinheiro foi.
        </p>
        <p className="text-lg text-amber-700 font-semibold mb-8">
          Este sistema foi feito para resolver exatamente isso. 👇
        </p>

        <Link
          to="/configuracoes"
          className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
          data-testid="comecar-button"
        >
          Começar agora — leva 2 minutos
          <ArrowRight className="w-6 h-6" />
        </Link>
      </div>

      {/* O QUE É O MÉTODO — Simples e direto */}
      <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center font-serif">
          O que é o Método 6 Caixas?
        </h2>
        <p className="text-center text-gray-500 mb-6">Uma regra simples para dividir seu dinheiro todo mês</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { pct: '50%', nome: 'Viver', desc: 'Aluguel, comida, contas', cor: 'blue' },
            { pct: '10%', nome: 'Investir', desc: 'Sua aposentadoria', cor: 'green' },
            { pct: '10%', nome: 'Sonhos', desc: 'Carro, viagem, casa', cor: 'purple' },
            { pct: '10%', nome: 'Aprender', desc: 'Cursos e livros', cor: 'amber' },
            { pct: '10%', nome: 'Doação', desc: 'Ajudar o próximo', cor: 'rose' },
            { pct: '10%', nome: 'Lazer', desc: 'Se divertir sem culpa', cor: 'cyan' },
          ].map((cat, i) => (
            <div key={i} className={`p-4 bg-${cat.cor}-50 rounded-xl border border-${cat.cor}-100 text-center`}>
              <p className={`text-2xl font-bold text-${cat.cor}-600`}>{cat.pct}</p>
              <p className="font-semibold text-gray-900">{cat.nome}</p>
              <p className="text-xs text-gray-500 mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
          <p className="text-gray-700 font-medium">
            💡 <strong>A ideia é simples:</strong> cada real que entra já tem um destino certo. Sem adivinhação, sem culpa.
          </p>
        </div>
      </div>

      {/* COMO USAR — 4 passos ultra simples */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 mb-8 border-2 border-amber-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center font-serif">
          Por onde começar?
        </h2>
        <p className="text-center text-gray-500 mb-8">Siga estes 4 passos na ordem</p>

        <div className="space-y-4">
          {/* Passo 1 */}
          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Settings className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-gray-900">Diga quanto você ganha</h3>
              </div>
              <p className="text-sm text-gray-600">Acesse <strong>Configurações</strong> e informe sua renda mensal. Pronto — o sistema calcula tudo automaticamente.</p>
            </div>
            <Link to="/configuracoes" className="hidden md:flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 flex-shrink-0">
              Ir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Passo 2 */}
          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <PlusCircle className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900">Lance o que você gasta</h3>
              </div>
              <p className="text-sm text-gray-600">Acesse <strong>Lançamentos</strong> e registre seus gastos diariamente. Escolha a categoria certa para cada despesa.</p>
            </div>
            <Link to="/lancamentos" className="hidden md:flex items-center gap-1 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 flex-shrink-0">
              Ir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Passo 3 */}
          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 className="w-5 h-5 text-green-500" />
                <h3 className="font-bold text-gray-900">Veja para onde o dinheiro vai</h3>
              </div>
              <p className="text-sm text-gray-600">Acesse o <strong>Dashboard</strong> e veja gráficos mostrando se você está dentro ou fora do limite de cada categoria.</p>
            </div>
            <Link to="/dashboard" className="hidden md:flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 flex-shrink-0">
              Ir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Passo 4 */}
          <div className="bg-white rounded-xl p-5 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-gray-900">Defina um sonho e realize</h3>
              </div>
              <p className="text-sm text-gray-600">Acesse <strong>Metas</strong> e coloque um objetivo concreto. O sistema acompanha seu progresso até você chegar lá.</p>
            </div>
            <Link to="/metas" className="hidden md:flex items-center gap-1 px-4 py-2 bg-purple-500 text-white text-sm font-semibold rounded-lg hover:bg-purple-600 flex-shrink-0">
              Ir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* QUOTE */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100 text-center">
        <p className="text-lg text-gray-700 italic font-serif">
          "Os pensamentos dos diligentes conduzem à abundância."
        </p>
        <p className="text-sm text-blue-600 font-semibold mt-2">Provérbios 21:5</p>
      </div>

      {/* CTA FINAL */}
      <div className="text-center pb-12">
        <p className="text-gray-500 mb-4">Quer entender mais fundo a filosofia do método?</p>
        <Link
          to="/ebook"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md hover:shadow-lg border-2 border-gray-200"
          data-testid="ebook-button"
        >
          <BookOpen className="w-5 h-5" />
          Ler o Conteúdo Completo
        </Link>
      </div>

    </div>
  );
};

export default Home;
