import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMetodo, MetodoStatus } from '../contexts/MetodoContext';
import Questionario from './Questionario';
import { formatarMoeda } from '../logica';
function summary(a) {
  const fixed = Object.values(a.fixos).reduce((n, v) => n + v, 0);
  const variable = Object.values(a.variaveis).reduce((n, v) => n + v, 0);
  const total = fixed + variable + a.cartao;
  return { receita: a.receita, totalGastos: total, saldo: a.receita - total,
    perfil: total > a.receita ? 'endividado' : total >= a.receita * .85 ? 'ajuste' : 'organizacao' };
}
export default function Diagnostico() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { record, loading, error: loadError, save } = useMetodo();
  const [draft, setDraft] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('diagnostico_pendente')) || null; } catch { return null; }
  });
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(answers) {
    setDraft(answers); setEditing(false); setError('');
    if (!isAuthenticated) { sessionStorage.setItem('diagnostico_pendente', JSON.stringify(answers)); return; }
    setBusy(true);
    try { await save(answers); sessionStorage.removeItem('diagnostico_pendente'); setDraft(null); }
    catch { setError('Não foi possível salvar. Seus valores continuam nesta tela; tente novamente.'); }
    finally { setBusy(false); }
  }
  if (authLoading || (isAuthenticated && (loading || loadError))) return <MetodoStatus />;
  const answers = draft || record?.respostas;
  const result = draft ? summary(draft) : record?.resumo;
  return <div style={{background:'#f9f8f6', minHeight:'100vh'}}>
    <nav className="p-4 bg-white border-b flex flex-wrap justify-between gap-4"><Link to={isAuthenticated ? "/" : "/inicio"} aria-label="Voltar à página inicial do Método 6 Caixas">← Método 6 Caixas</Link>{isAuthenticated && <Link to="/guia" className="underline font-semibold">Ir para o passo a passo →</Link>}</nav>
    {(!result || editing) ? <Questionario dadosIniciais={answers} onConcluir={submit} /> :
      <main className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Seu diagnóstico financeiro</h1>
        <p>Resumo mensal dos valores que você informou. Este resultado não identifica dívidas que você não declarou.</p>
        <dl className="bg-white rounded-xl p-6 space-y-3">
          <dt>Renda mensal</dt><dd>{formatarMoeda(result.receita)}</dd>
          <dt>Despesas mensais</dt><dd>{formatarMoeda(result.totalGastos)}</dd>
          <dt>Saldo mensal</dt><dd>{formatarMoeda(result.saldo)}</dd>
        </dl>
        <p>{result.perfil === 'endividado' ? 'As despesas superam a renda. Comece pelo Passo Zero para organizar cortes e dívidas antes de distribuir sua renda.' : result.perfil === 'ajuste' ? 'Você compromete pelo menos 85% da renda. Revise despesas e configure as caixas com valores que caibam no orçamento.' : 'Há espaço no orçamento informado. O próximo passo é configurar suas seis caixas.'}</p>
        {busy && <p role="status">Salvando seu diagnóstico...</p>}
        {error && <p role="alert">{error}</p>}
        {!busy && (isAuthenticated ? draft ? <button className="bg-orange-600 text-white p-3 rounded" onClick={() => submit(draft)}>Salvar diagnóstico na minha conta</button> : <Link className="inline-block bg-orange-600 text-white p-3 rounded" to={result.perfil === 'endividado' && !record.passo_zero_concluido ? '/passo-zero' : '/configuracoes'}>Continuar meu método →</Link> : <Link className="inline-block bg-orange-600 text-white p-3 rounded" to="/login">Entrar para salvar e continuar →</Link>)}
        {!busy && <button className="block underline" onClick={() => setEditing(true)}>Revisar respostas</button>}
        {record && editing && <p>Salvar novas respostas reinicia o direcionamento do método.</p>}
      </main>}
  </div>;
}
