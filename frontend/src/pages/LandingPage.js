import React from 'react';
import { useAccess } from '../contexts/AccessContext';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const {checkout_url} = useAccess();
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#ffffff', color: '#0f0f0f' }}>

      {/* HEADER */}
      <header style={{ background: '#0f0f0f', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>Método 6 Caixas</span>
          <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 8 }}>Método 6 Caixas</span>
        </div>
        <Link to="/login" style={{ background: 'transparent', border: '1px solid #f59e0b', color: '#f59e0b', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Já tenho acesso
        </Link>
      </header>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', color: '#fff', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', color: '#fbbf24', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 16px', borderRadius: 999, marginBottom: 24 }}>
          Método 6 Caixas
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
          Pare de ver seu dinheiro{' '}
          <span style={{ color: '#f59e0b' }}>desaparecer</span>{' '}
          todo mês
        </h1>
        <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#a3a3a3', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Um sistema simples e comprovado para dividir sua renda em 6 destinos — e finalmente saber para onde cada real vai.
        </p>
        <a href={checkout_url || "/diagnostico"} style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontSize: 18, fontWeight: 800, padding: '18px 48px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
          {checkout_url ? "Quero organizar minhas finanças →" : "Começar pelo diagnóstico gratuito →"}
        </a>
        <p style={{ marginTop: 16, fontSize: 14, color: '#525252' }}>R$ 97,00 à vista — ou em até 10x com juros no cartão</p>
      </section>

      {/* DIAGNÓSTICO GRATUITO */}
      <section style={{ background: 'linear-gradient(135deg, #1a0a00, #0f0f0f)', borderTop: '2px solid #f59e0b', borderBottom: '2px solid #f59e0b', padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>🎯 Antes de comprar</p>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: '#ffffff', marginBottom: 16 }}>Descubra seu ciclo financeiro gratuitamente</h2>
        <p style={{ color: '#a3a3a3', maxWidth: 520, margin: '0 auto 32px', fontSize: 16, lineHeight: 1.7 }}>
          Faça o diagnóstico gratuito e veja em minutos qual é a sua situação real — quanto tempo seu dinheiro dura, onde ele some e qual o caminho certo.
        </p>
        <a href="/diagnostico" style={{ display: 'inline-block', background: 'transparent', color: '#f59e0b', fontSize: 16, fontWeight: 700, padding: '16px 40px', borderRadius: 12, textDecoration: 'none', border: '2px solid #f59e0b' }}>
          Fazer meu diagnóstico gratuito →
        </a>
        <p style={{ marginTop: 14, fontSize: 13, color: '#525252' }}>Leva menos de 3 minutos • 100% gratuito • Sem cadastro</p>
      </section>

      {/* PROBLEMA */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 40 }}>Você se identifica com alguma dessas situações?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, textAlign: 'left' }}>
          {[
            { emoji: '📅', texto: 'Seu dinheiro acaba antes do mês terminar — e você não sabe por quê.' },
            { emoji: '❓', texto: 'Você gasta, mas não sabe para onde o dinheiro vai. Ele simplesmente some.' },
            { emoji: '💸', texto: 'Você ganha bem, mas no final do mês não sobra nada para investir ou poupar.' },
            { emoji: '📉', texto: 'Sua renda é instável e qualquer imprevisto coloca tudo a perder.' },
          ].map((p, i) => (
            <div key={i} style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.emoji}</div>
              <p style={{ fontSize: 15, color: '#525252', lineHeight: 1.6 }}>{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section style={{ background: '#0f0f0f', color: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>A solução</p>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 16 }}>O Método 6 Caixas</h2>
        <p style={{ color: '#a3a3a3', maxWidth: 560, margin: '0 auto 48px', fontSize: 16 }}>Uma regra simples: cada real que entra já tem um destino certo.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto 40px' }}>
          {[
            { pct: '50%', nome: 'Viver', desc: 'Aluguel, comida, contas', cor: '#3b82f6' },
            { pct: '10%', nome: 'Investir', desc: 'Sua aposentadoria', cor: '#10b981' },
            { pct: '10%', nome: 'Sonhos', desc: 'Carro, viagem, casa', cor: '#8b5cf6' },
            { pct: '10%', nome: 'Aprender', desc: 'Cursos e livros', cor: '#f59e0b' },
            { pct: '10%', nome: 'Doação', desc: 'Ajudar o próximo', cor: '#f43f5e' },
            { pct: '10%', nome: 'Lazer', desc: 'Se divertir sem culpa', cor: '#06b6d4' },
          ].map((c, i) => (
            <div key={i} style={{ background: '#1a1a1a', border: `1.5px solid ${c.cor}`, borderRadius: 16, padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: c.cor, marginBottom: 6 }}>{c.pct}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.nome}</div>
              <div style={{ fontSize: 11, color: '#525252' }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 12, padding: '20px 24px', maxWidth: 600, margin: '0 auto', fontSize: 15, color: '#a3a3a3', lineHeight: 1.7 }}>
          💡 <strong style={{ color: '#fff' }}>A ideia é simples:</strong> quando cada real tem um endereço antes de você gastar, o ciclo muda.
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ padding: '80px 24px', maxWidth: 800, margin: '0 auto' }}>
        <p style={{ fontSize: 12, fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, textAlign: 'center' }}>Como usar</p>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 48, textAlign: 'center' }}>4 passos simples para começar hoje</h2>
        {[
          { num: '1', titulo: '⚙️ Diga quanto você ganha', desc: 'Acesse Configurações e informe sua renda mensal. O sistema calcula automaticamente quanto vai para cada caixa.', cor: '#f59e0b' },
          { num: '2', titulo: '➕ Lance o que você gasta', desc: 'Acesse Lançamentos e registre cada gasto na categoria certa. Leva menos de 1 minuto por dia.', cor: '#3b82f6' },
          { num: '3', titulo: '📊 Veja para onde o dinheiro vai', desc: 'O Dashboard mostra gráficos em tempo real comparando o ideal com o realizado em cada categoria.', cor: '#10b981' },
          { num: '4', titulo: '✅ Defina um sonho e realize', desc: 'Em Metas, coloque um objetivo concreto. O sistema acompanha seu progresso até você chegar lá.', cor: '#8b5cf6' },
        ].map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 24, background: '#f9f8f6', borderRadius: 16, padding: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: p.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{p.num}</div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.titulo}</h3>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* O QUE INCLUI */}
      <section style={{ background: '#f9f8f6', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 48 }}>O que está incluído</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
          {[
            { icon: '📊', titulo: 'Dashboard Financeiro', desc: 'Gráficos claros mostrando Ideal vs Realizado em cada categoria em tempo real.' },
            { icon: '➕', titulo: 'Lançamentos', desc: 'Registre seus gastos diários de forma simples e rápida por categoria.' },
            { icon: '🎯', titulo: 'Metas Financeiras', desc: 'Defina objetivos concretos e acompanhe quanto falta para realizá-los.' },
            { icon: '📚', titulo: 'Conteúdo Completo', desc: '13 capítulos com os princípios bíblicos de Salomão aplicados às finanças.' },
            { icon: '🔍', titulo: 'Diagnóstico Financeiro', desc: 'Descubra seu ciclo financeiro atual gratuitamente antes de começar.' },
            { icon: '♾️', titulo: 'Acesso Vitalício', desc: 'Pague uma vez e use para sempre. Sem mensalidade, sem assinatura.' },
          ].map((item, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.titulo}</h3>
              <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREÇO */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 48 }}>Invista na sua liberdade financeira</h2>
        <div style={{ background: '#0f0f0f', border: '2px solid #f59e0b', borderRadius: 24, padding: '48px 32px', maxWidth: 480, margin: '0 auto', color: '#fff' }}>
          <span style={{ display: 'inline-block', background: '#f59e0b', color: '#000', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 999, marginBottom: 24 }}>Oferta especial</span>
          <p style={{ fontSize: 16, color: '#525252', textDecoration: 'line-through', marginBottom: 8 }}>De R$ 197,00</p>
          <p style={{ fontSize: 14, color: '#a3a3a3', marginBottom: 4 }}>Por apenas</p>
          <div style={{ fontSize: 64, fontWeight: 900, color: '#f59e0b', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: 8 }}>R$ 97</div>
          <p style={{ fontSize: 16, color: '#a3a3a3', marginBottom: 32 }}>ou <strong style={{ color: '#fff' }}>até 10x com juros</strong> no cartão</p>
          <ul style={{ listStyle: 'none', marginBottom: 32, textAlign: 'left' }}>
            {['Sistema completo Método 6 Caixas', 'Dashboard com gráficos em tempo real', 'Lançamentos e controle de gastos', 'Metas financeiras personalizadas', '13 capítulos de conteúdo educativo', 'Diagnóstico financeiro gratuito', 'Pagamento único — sem mensalidade'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: '#d4d4d4', padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ color: '#f59e0b' }}>✓</span> {item}
              </li>
            ))}
          </ul>
          <a href={checkout_url || "/diagnostico"} style={{ display: 'block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontSize: 18, fontWeight: 800, padding: '18px 32px', borderRadius: 12, textDecoration: 'none', marginBottom: 16 }}>
            {checkout_url ? "Quero começar agora →" : "Fazer diagnóstico gratuito →"}
          </a>
          <p style={{ fontSize: 13, color: '#525252' }}>{checkout_url ? "🔒 Pagamento no checkout" : "Já tem acesso? Entre pelo botão no topo da página."}</p>
        </div>
      </section>

      {/* GARANTIA */}
      <section style={{ background: '#f0fdf4', borderTop: '4px solid #16a34a', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: '#166534', marginBottom: 16 }}>🛡️ Garantia de 7 dias</h2>
        <p style={{ color: '#166534', maxWidth: 560, margin: '0 auto', fontSize: 16, lineHeight: 1.7 }}>
          Se por qualquer motivo você não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
        </p>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, marginBottom: 40, textAlign: 'center' }}>Dúvidas frequentes</h2>
        {[
          { p: 'Preciso ter conhecimento de finanças para usar?', r: 'Não. O sistema foi feito exatamente para quem não tem experiência com finanças. O guia de uso explica tudo passo a passo.' },
          { p: 'Funciona para quem tem dívidas?', r: 'Sim. O sistema inclui um guia específico para quem está endividado, com a ordem certa para sair das dívidas antes de estruturar as 6 caixas.' },
          { p: 'É um aplicativo ou um curso?', r: 'É um sistema completo: uma plataforma online onde você registra seus gastos, acompanha gráficos e lê o conteúdo educativo — tudo em um só lugar.' },
          { p: 'Como acesso após a compra?', r: 'Após o pagamento, você recebe um email com seu link de acesso. É só criar sua conta e começar a usar imediatamente.' },
          { p: 'Funciona no celular?', r: 'Sim! O sistema é 100% responsivo e funciona perfeitamente em qualquer dispositivo — celular, tablet ou computador.' },
          { p: 'Precisa pagar mensalidade?', r: 'Não. A oferta atual é de pagamento único, sem mensalidade ou assinatura.' },
        ].map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid #e5e5e5', padding: '20px 0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{faq.p}</h3>
            <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7 }}>{faq.r}</p>
          </div>
        ))}
      </section>

      {/* CTA FINAL */}
      <section style={{ background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)', color: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, marginBottom: 16 }}>Seu dinheiro merece um destino</h2>
        <p style={{ color: '#a3a3a3', maxWidth: 480, margin: '0 auto 40px', fontSize: 16 }}>
          "Todo resultado que você deseja na sua vida está naquilo que você ainda não aprendeu."
        </p>
        <a href={checkout_url || "/diagnostico"} style={{ display: 'inline-block', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', fontSize: 18, fontWeight: 800, padding: '18px 48px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
          {checkout_url ? "Começar agora por R$ 97,00 →" : "Fazer diagnóstico gratuito →"}
        </a>
        <p style={{ marginTop: 16, fontSize: 14, color: '#525252' }}>ou até 10x com juros • Garantia de 7 dias • Acesso após aprovação do pagamento</p>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f0f0f', borderTop: '1px solid #1a1a1a', padding: '32px 24px', textAlign: 'center', color: '#525252', fontSize: 13 }}>
        <p>© 2026 Método 6 Caixas e Gestão Financeira — Método 6 Caixas</p>
        <p style={{ marginTop: 8 }}>Todos os direitos reservados</p>
      </footer>

    </div>
  );
};

export default LandingPage;
