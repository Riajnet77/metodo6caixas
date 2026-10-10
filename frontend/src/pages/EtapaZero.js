import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMetodo, MetodoStatus } from '../contexts/MetodoContext';
import PassoZero from './PassoZero';
export default function EtapaZero() {
  const { record, loading, error: loadError, finish } = useMetodo();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  if (loading || loadError) return <MetodoStatus />;
  if (!record) return <Navigate to="/diagnostico" replace />;
  if (record.resumo.perfil !== 'endividado' || record.passo_zero_concluido) return <Navigate to="/configuracoes" replace />;
  async function complete() {
    if (busy) return;
    setBusy(true); setError('');
    try { await finish(); navigate('/configuracoes', { replace: true }); }
    catch { setError('Não foi possível salvar a conclusão. Tente concluir novamente.'); }
    finally { setBusy(false); }
  }
  return <>{(error || busy) && <p role={error ? 'alert' : 'status'} className="p-4 text-center">{error || 'Salvando conclusão...'}</p>}<PassoZero dadosDoDiagnostico={{...record.resumo, fixos: record.respostas.fixos, variaveis: record.respostas.variaveis}} onConcluirPassoZero={complete} /></>;
}
