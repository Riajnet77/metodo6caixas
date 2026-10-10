import React from 'react';
import { Link } from 'react-router-dom';
import { useAccess, SupportLink } from '../contexts/AccessContext';
export default function Register() {
  const {checkout_url}=useAccess();
  return <main className="min-h-screen bg-amber-50 flex items-center justify-center p-4"><section className="bg-white p-8 rounded-xl shadow max-w-md w-full space-y-4">
    <h1 className="text-2xl font-bold">Primeiro acesso ao Método 6 Caixas</h1>
    <p>Após a confirmação da compra, enviaremos um link individual para você definir sua senha. Use o email informado na Hotmart.</p>
    <p>Se o link expirou ou você não encontrou a mensagem, confira a pasta de spam e solicite outro abaixo.</p>
    <Link className="block bg-orange-600 text-white rounded p-3 text-center" to="/esqueci-senha">Solicitar link de acesso</Link>
    <Link className="block underline" to="/login">Já tenho senha — Entrar</Link>
    {checkout_url && <a className="block underline" href={checkout_url}>Adquirir o Método 6 Caixas</a>}
    <SupportLink />
  </section></main>;
}
