import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SupportLink } from '../contexts/AccessContext';
const API=`${process.env.REACT_APP_BACKEND_URL}/api/auth`;
function message(error) {
  if(!error.response || error.response.status>=500) return 'Não foi possível enviar ou concluir agora. Aguarde um minuto e tente novamente. Se persistir, fale com o suporte.';
  const detail=error.response?.data?.detail;
  return typeof detail==='string' ? detail : 'Confira os dados. Use pelo menos 8 caracteres e uma senha menos longa.';
}
export default function PasswordRecovery({reset=false}) {
  const {logout}=useAuth();
  const [token]=useState(()=>new URLSearchParams(window.location.hash.slice(1)).get('token') || '');
  const [email,setEmail]=useState('');const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');
  const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [success,setSuccess]=useState('');
  useEffect(()=>{if(reset && window.location.hash) window.history.replaceState(null,'',window.location.pathname);},[reset]);
  async function submit(event) {
    event.preventDefault();setError('');setSuccess('');
    if(reset && password!==confirm) {setError('As senhas não coincidem.');return;}
    if(reset && (password.length<8 || new TextEncoder().encode(password).length>72)) {setError('Use pelo menos 8 caracteres. Se a senha for muito longa, reduza o tamanho.');return;}
    setBusy(true);
    try {
      const {data}=await axios.post(`${API}/${reset?'reset-password':'forgot-password'}`,reset?{token,password}:{email:email.trim().toLowerCase()},{timeout:70000});
      if(reset) logout();
      setSuccess(data.message);setPassword('');setConfirm('');
    } catch(e) {setError(message(e));} finally {setBusy(false);}
  }
  return <main className="min-h-screen bg-amber-50 flex items-center justify-center p-4"><section className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-4">
    <h1 className="text-2xl font-bold">{reset?'Definir nova senha':'Recuperar acesso'}</h1>
    <p>{reset?'Escolha uma senha para sua conta do Método 6 Caixas.':'Informe o email usado na compra ou no cadastro. Enviaremos um link válido por 30 minutos.'}</p>
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {success && <p role="status" className="text-green-700">{success}</p>}
    {reset && !token ? <p>Este link está incompleto. <Link className="underline" to="/esqueci-senha">Solicitar outro link</Link>.</p> : (!success || !reset) && <form onSubmit={submit} className="space-y-4">
      {reset ? <><label className="block">Nova senha<input className="block w-full border rounded p-3" type="password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} minLength={8} required disabled={busy}/></label><label className="block">Confirmar senha<input className="block w-full border rounded p-3" type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} required disabled={busy}/></label></> : <label className="block">Email<input className="block w-full border rounded p-3" type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required disabled={busy}/></label>}
      <button className="bg-orange-600 text-white rounded p-3 w-full disabled:opacity-50" disabled={busy}>{busy?'Aguarde...':reset?'Salvar nova senha':'Enviar link por email'}</button>
    </form>}
    {reset && error && <Link className="block underline" to="/esqueci-senha">Solicitar novo link</Link>}
    <Link className="block underline" to="/login">Voltar ao login</Link><SupportLink />
  </section></main>;
}
