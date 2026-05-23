import React, { useState, useEffect } from 'react'
import { formatarMoeda } from '../logica.js'

// ============================================================
// ESTILOS COMPARTILHADOS
// ============================================================
const styles = {
  container: { minHeight: '100vh', background: '#f9f8f6', paddingBottom: 60 },
  header: {
    background: '#0f0f0f', padding: '20px 24px',
    borderBottom: '1px solid #1f1f1f',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'sticky', top: 0, zIndex: 10,
  },
  headerTitle: { fontWeight: 800, fontSize: 14, color: '#ffffff' },
  headerBadge: {
    background: '#7f1d1d', color: '#fca5a5',
    fontSize: 11, fontWeight: 800, padding: '4px 12px',
    borderRadius: 9999, letterSpacing: '0.08em', textTransform: 'uppercase',
  },
  main: { maxWidth: 600, margin: '0 auto', padding: '32px 20px' },
  card: {
    background: '#ffffff', border: '1px solid #e5e5e5',
    borderRadius: 16, padding: '24px 20px', marginBottom: 16,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  cardDark: {
    background: '#0f0f0f', border: '2px solid #dc2626',
    borderRadius: 20, padding: '28px 24px', marginBottom: 16,
    boxShadow: '0 0 32px rgba(220,38,38,0.2)',
  },
  title: { fontSize: 20, fontWeight: 800, color: '#0f0f0f', marginBottom: 12, lineHeight: 1.3 },
  titleLight: { fontSize: 20, fontWeight: 800, color: '#ffffff', marginBottom: 12, lineHeight: 1.3 },
  text: { fontSize: 15, color: '#525252', lineHeight: 1.7 },
  textLight: { fontSize: 14, color: '#a3a3a3', lineHeight: 1.65 },
  label: {
    fontSize: 11, fontWeight: 800, color: '#f97316',
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
  },
  labelAlert: {
    fontSize: 11, fontWeight: 800, color: '#fca5a5',
    letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
  },
  input: {
    width: '100%', padding: '14px 16px', background: '#f9f8f6',
    border: '1.5px solid #e5e5e5', borderRadius: 10,
    fontSize: 15, color: '#0f0f0f', outline: 'none', marginBottom: 12,
    transition: 'border-color 0.2s',
  },
  inputDark: {
    width: '100%', padding: '14px 16px', background: '#1a1a1a',
    border: '1.5px solid #2c2c2c', borderRadius: 10,
    fontSize: 15, color: '#ffffff', outline: 'none', marginBottom: 12,
  },
  buttonPrimary: {
    width: '100%', padding: '16px 24px', background: '#f97316', color: '#ffffff',
    borderRadius: 12, fontSize: 16, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 4px 14px rgba(249,115,22,0.4)', transition: 'all 0.2s',
    border: 'none', cursor: 'pointer',
  },
  buttonSecondary: {
    width: '100%', padding: '13px', background: 'transparent', color: '#737373',
    fontSize: 13, borderRadius: 10, border: '1px solid #2c2c2c',
    cursor: 'pointer',
  },
  buttonOutline: {
    flex: 1, padding: '13px', borderRadius: 10,
    background: 'transparent', border: '1px solid #e5e5e5',
    color: '#525252', fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
  },
  progressBar: {
    height: 4, background: '#e5e5e5', borderRadius: 2,
    marginBottom: 24, overflow: 'hidden',
  },
  progressFill: (pct) => ({
    height: '100%', width: `${pct}%`, background: '#f97316',
    borderRadius: 2, transition: 'width 0.5s ease',
  }),
  checkbox: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', background: '#f9f8f6',
    borderRadius: 10, marginBottom: 10, cursor: 'pointer',
  },
  checkboxChecked: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 16px', background: '#fffbeb',
    border: '1.5px solid #f97316', borderRadius: 10,
    marginBottom: 10, cursor: 'pointer',
  },
  table: {
    width: '100%', borderCollapse: 'collapse', marginTop: 16,
  },
  tableHeader: {
    background: '#f9f8f6', padding: '10px 12px',
    fontSize: 11, fontWeight: 700, color: '#737373',
    textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  tableCell: {
    padding: '12px', borderBottom: '1px solid #e5e5e5',
    fontSize: 14, color: '#0f0f0f',
  },
  highlightBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 10, padding: '14px 16px', marginBottom: 16,
    display: 'flex', gap: 10, alignItems: 'flex-start',
  },
  successBox: {
    background: '#f0fdf4', border: '1px solid #bbf7d0',
    borderRadius: 10, padding: '14px 16px', marginBottom: 16,
    display: 'flex', gap: 10, alignItems: 'flex-start',
  },
}

// ============================================================
// COMPONENTE: PROGRESSO
// ============================================================
function Progresso({ etapaAtual, totalEtapas }) {
  const pct = ((etapaAtual + 1) / totalEtapas) * 100
  return (
    <div style={styles.progressBar}>
      <div style={styles.progressFill(pct)}/>
    </div>
  )
}

// ============================================================
// ETAPA 0: BOAS-VINDAS
// ============================================================
function EtapaBemVindo({ dados, onIniciar }) {
  return (
    <div>
      <div style={styles.cardDark}>
        <div style={styles.labelAlert}>🚨 Passo Zero Identificado</div>
        <h2 style={styles.titleLight}>Antes das 6 Caixas, precisamos fechar o buraco</h2>
        <p style={styles.textLight}>
          Seus gastos ({formatarMoeda(dados.totalGastos)}) superam sua renda ({formatarMoeda(dados.receita)}). 
          Você tem um déficit de <strong style={{color:'#fca5a5'}}>{formatarMoeda(dados.deficitMensal)}</strong> por mês.
        </p>
        <p style={{...styles.textLight, marginTop:12}}>
          Não adianta dividir o que não existe. O Passo Zero é um plano de <strong>3 a 6 meses</strong> para sair do vermelho — e só então aplicar o Método 6 Caixas.
        </p>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>O que você vai fazer</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            {icone:'📝', titulo:'Mapear todas as dívidas', desc:'Valor, juros, prazo — tudo na mesa'},
            {icone:'🔒', titulo:'Congelar novos gastos', desc:'Cartão, assinaturas, parcelas — tudo tranca'},
            {icone:'🏔️', titulo:'Escolher estratégia', desc:'Bola de Neve (vitória rápida) ou Avalanche (economia máxima)'},
            {icone:'💪', titulo:'Criar superávit', desc:'Renda extra + cortes drásticos = fôlego para quitar'},
            {icone:'📅', titulo:'Cronograma mensal', desc:'Mês a mês até a liberdade'},
          ].map((item,i) => (
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <span style={{fontSize:20}}>{item.icone}</span>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:'#0f0f0f'}}>{item.titulo}</div>
                <div style={{fontSize:13,color:'#737373'}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onIniciar} style={styles.buttonPrimary}>
        Iniciar Plano de Saída →
      </button>
    </div>
  )
}

// ============================================================
// ETAPA 1: MAPEAMENTO DAS DÍVIDAS
// ============================================================
function EtapaMapeamento({ dadosIniciais, onProximo }) {
  const [dividas, setDividas] = useState([
    { id: 1, nome: '', valor: '', juros: '', parcelas: '', tipo: 'cartao' }
  ])

  const atualizarDivida = (id, campo, valor) => {
    setDividas(dividas.map(d => d.id === id ? {...d, [campo]: valor} : d))
  }

  const adicionarDivida = () => {
    setDividas([...dividas, { 
      id: Date.now(), nome: '', valor: '', juros: '', parcelas: '', tipo: 'cartao' 
    }])
  }

  const removerDivida = (id) => {
    if (dividas.length > 1) setDividas(dividas.filter(d => d.id !== id))
  }

  const totalDividas = dividas.reduce((acc, d) => acc + (Number(d.valor) || 0), 0)
  const jurosMensais = dividas.reduce((acc, d) => {
    return acc + ((Number(d.valor) || 0) * (Number(d.juros) || 0) / 100)
  }, 0)

  const podeAvancar = dividas.every(d => d.nome && Number(d.valor) > 0)

  return (
    <div>
      <div style={styles.label}>Etapa 1 de 5</div>
      <h2 style={styles.title}>Mapeie todas as suas dívidas</h2>
      <p style={styles.text}>Não esconda nada. Para sair, precisamos enxergar tudo.</p>

      {dividas.map((divida, i) => (
        <div key={divida.id} style={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <span style={{fontSize:13,fontWeight:700,color:'#737373'}}>Dívida #{i+1}</span>
            {dividas.length > 1 && (
              <button onClick={() => removerDivida(divida.id)} 
                      style={{background:'none',border:'none',color:'#dc2626',fontSize:12,cursor:'pointer'}}>
                Remover
              </button>
            )}
          </div>

          <input style={styles.input} placeholder="Nome (ex: Cartão Nubank)"
                 value={divida.nome} onChange={e => atualizarDivida(divida.id, 'nome', e.target.value)} />

          <div style={{display:'flex',gap:10}}>
            <input style={{...styles.input,flex:2}} placeholder="Valor devido (R$)" type="number"
                   value={divida.valor} onChange={e => atualizarDivida(divida.id, 'valor', e.target.value)} />
            <input style={{...styles.input,flex:1}} placeholder="Juros % a.m." type="number"
                   value={divida.juros} onChange={e => atualizarDivida(divida.id, 'juros', e.target.value)} />
            <input style={{...styles.input,flex:1}} placeholder="Parcelas restantes" type="number"
                   value={divida.parcelas} onChange={e => atualizarDivida(divida.id, 'parcelas', e.target.value)} />
          </div>

          <select style={styles.input} value={divida.tipo}
                  onChange={e => atualizarDivida(divida.id, 'tipo', e.target.value)}>
            <option value="cartao">💳 Cartão de Crédito</option>
            <option value="emprestimo">🏦 Empréstimo</option>
            <option value="financiamento">🏠 Financiamento</option>
            <option value="cheque">📄 Cheque Especial</option>
            <option value="pessoal">👤 Dívida Pessoal</option>
          </select>
        </div>
      ))}

      <button onClick={adicionarDivida} style={styles.buttonOutline}>
        + Adicionar outra dívida
      </button>

      {totalDividas > 0 && (
        <div style={styles.highlightBox}>
          <span style={{fontSize:20}}>📊</span>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#991b1b'}}>
              Total em dívidas: {formatarMoeda(totalDividas)}
            </div>
            <div style={{fontSize:13,color:'#991b1b',marginTop:4}}>
              Você está pagando {formatarMoeda(jurosMensais)} só em juros todo mês.
            </div>
          </div>
        </div>
      )}

      <button onClick={() => onProximo(dividas)} disabled={!podeAvancar}
              style={{...styles.buttonPrimary, opacity: podeAvancar ? 1 : 0.5}}>
        Próxima Etapa →
      </button>
    </div>
  )
}

// ============================================================
// ETAPA 2: CONGELAMENTO
// ============================================================
function EtapaCongelamento({ dados, onProximo }) {
  const [cortes, setCortes] = useState({
    cartaoCredito: false,
    assinaturas: false,
    lazer: false,
    parcelas: false,
    delivery: false,
  })

  const toggleCorte = (key) => setCortes({...cortes, [key]: !cortes[key]})

  const economiaEstimada = {
    cartaoCredito: dados.totalCartao * 0.3,  // Evita 30% do gasto no cartão
    assinaturas: 150,  // Média de streaming + apps
    lazer: (dados.variaveis?.lazer || 0) * 0.5,
    parcelas: 200,  // Média de novas parcelas
    delivery: (dados.variaveis?.alimentacao || 0) * 0.2,  // 20% de economia em alimentação
  }

  const totalEconomia = Object.keys(cortes).reduce((acc, key) => {
    return acc + (cortes[key] ? economiaEstimada[key] : 0)
  }, 0)

  const itens = [
    { key: 'cartaoCredito', icone: '🔒', titulo: 'Trancar cartão de crédito', 
      desc: 'Usar só débito ou dinheiro vivo. O cartão é a porta da dívida.', economia: economiaEstimada.cartaoCredito },
    { key: 'assinaturas', icone: '📺', titulo: 'Cancelar assinaturas não essenciais', 
      desc: 'Streaming, apps, gym pass. Só o básico.', economia: economiaEstimada.assinaturas },
    { key: 'lazer', icone: '🎯', titulo: 'Reduzir lazer em 50%', 
      desc: 'Não zero — metade. Você precisa respirar.', economia: economiaEstimada.lazer },
    { key: 'parcelas', icone: '🛍️', titulo: 'Zero compras parceladas', 
      desc: 'Se não tem dinheiro na conta, não compra.', economia: economiaEstimada.parcelas },
    { key: 'delivery', icone: '🍕', titulo: 'Cozinhar em casa', 
      desc: 'Delivery é 3x mais caro que mercado.', economia: economiaEstimada.delivery },
  ]

  return (
    <div>
      <div style={styles.label}>Etapa 2 de 5</div>
      <h2 style={styles.title}>Congele novos gastos</h2>
      <p style={styles.text}>Enquanto estiver no Passo Zero, estas são as regras não negociáveis:</p>

      <div style={{marginTop:16}}>
        {itens.map(item => (
          <div key={item.key} 
               style={cortes[item.key] ? styles.checkboxChecked : styles.checkbox}
               onClick={() => toggleCorte(item.key)}>
            <span style={{fontSize:20,flexShrink:0}}>{cortes[item.key] ? '✅' : '⭕'}</span>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:'#0f0f0f'}}>{item.titulo}</div>
              <div style={{fontSize:13,color:'#737373'}}>{item.desc}</div>
              {cortes[item.key] && (
                <div style={{fontSize:12,color:'#f97316',fontWeight:700,marginTop:4}}>
                  Economia: {formatarMoeda(item.economia)}/mês
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalEconomia > 0 && (
        <div style={styles.successBox}>
          <span style={{fontSize:20}}>💰</span>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:'#166534'}}>
              Economia potencial: {formatarMoeda(totalEconomia)}/mês
            </div>
            <div style={{fontSize:13,color:'#166534'}}>
              Esse dinheiro vai todo para quitar dívidas.
            </div>
          </div>
        </div>
      )}

      <button onClick={() => onProximo(cortes)} style={styles.buttonPrimary}>
        Próxima Etapa →
      </button>
    </div>
  )
}

// ============================================================
// ETAPA 3: ESTRATÉGIA DE PAGAMENTO
// ============================================================
function EtapaEstrategia({ dividas, onProximo }) {
  const [estrategia, setEstrategia] = useState('bola-de-neve')

  const dividasValidas = dividas
    .filter(d => Number(d.valor) > 0)
    .map(d => ({...d, valor: Number(d.valor), juros: Number(d.juros) || 0}))

  const ordenar = (divs, tipo) => {
    if (tipo === 'bola-de-neve') {
      return [...divs].sort((a,b) => a.valor - b.valor)  // Menor primeiro
    }
    return [...divs].sort((a,b) => b.juros - a.juros)  // Maior juro primeiro
  }

  const ordenadas = ordenar(dividasValidas, estrategia)

  return (
    <div>
      <div style={styles.label}>Etapa 3 de 5</div>
      <h2 style={styles.title}>Escolha sua estratégia de pagamento</h2>
      <p style={styles.text}>Duas formas de atacar. Escolha a que combina com seu perfil.</p>

      <div style={{display:'flex',gap:12,marginTop:16,marginBottom:16}}>
        <button onClick={() => setEstrategia('bola-de-neve')}
                style={{
                  flex:1, padding:20, borderRadius:16,
                  background: estrategia === 'bola-de-neve' ? '#fffbeb' : '#ffffff',
                  border: `2px solid ${estrategia === 'bola-de-neve' ? '#f97316' : '#e5e5e5'}`,
                  cursor:'pointer', textAlign:'left',
                }}>
          <div style={{fontSize:24,marginBottom:8}}>🏔️</div>
          <div style={{fontSize:16,fontWeight:800,color:'#0f0f0f',marginBottom:4}}>Bola de Neve</div>
          <div style={{fontSize:13,color:'#737373',lineHeight:1.5}}>
            Paga a <strong>menor dívida</strong> primeiro. Vitória rápida, motivação alta. 
            Ideal se você precisa ver resultado para continuar.
          </div>
        </button>

        <button onClick={() => setEstrategia('avalanche')}
                style={{
                  flex:1, padding:20, borderRadius:16,
                  background: estrategia === 'avalanche' ? '#fffbeb' : '#ffffff',
                  border: `2px solid ${estrategia === 'avalanche' ? '#f97316' : '#e5e5e5'}`,
                  cursor:'pointer', textAlign:'left',
                }}>
          <div style={{fontSize:24,marginBottom:8}}>🌊</div>
          <div style={{fontSize:16,fontWeight:800,color:'#0f0f0f',marginBottom:4}}>Avalanche</div>
          <div style={{fontSize:13,color:'#737373',lineHeight:1.5}}>
            Paga a dívida com <strong>maior juros</strong> primeiro. Economiza mais dinheiro. 
            Ideal se você quer pagar menos no total.
          </div>
        </button>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Ordem de pagamento</div>
        {ordenadas.map((divida, i) => (
          <div key={divida.id} style={{
            display:'flex',alignItems:'center',gap:12,
            padding:'12px 0',borderBottom:'1px solid #e5e5e5'
          }}>
            <div style={{
              width:28,height:28,borderRadius:'50%',
              background:'#f97316',color:'#fff',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:12,fontWeight:800,flexShrink:0,
            }}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:'#0f0f0f'}}>{divida.nome}</div>
              <div style={{fontSize:12,color:'#737373'}}>{divida.juros}% a.m. • {formatarMoeda(divida.valor)}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => onProximo(estrategia)} style={styles.buttonPrimary}>
        Próxima Etapa →
      </button>
    </div>
  )
}

// ============================================================
// ETAPA 4: SUPERÁVIT FORÇADO
// ============================================================
function EtapaSuperavit({ dados, economiaCortes, onProximo }) {
  const deficit = dados.deficitMensal || 0
  const superavitNecessario = deficit + economiaCortes

  const [rendaExtra, setRendaExtra] = useState('')

  const coberto = (Number(rendaExtra) || 0) + economiaCortes
  const falta = Math.max(0, superavitNecessario - coberto)

  const sugestoes = [
    {icone:'💼', titulo:'Freelance / Bico', desc:'Design, redação, programação, aulas', ganho:'R$ 500-2.000'},
    {icone:'📦', titulo:'Vender coisas', desc:'Roupas, eletrônicos, móveis não usados', ganho:'R$ 300-1.000'},
    {icone:'🚗', titulo:'Uber / Entrega', desc:'Fins de semana ou horários vagos', ganho:'R$ 800-1.500'},
    {icone:'📚', titulo:'Aulas particulares', desc:'O que você sabe ensinar?', ganho:'R$ 400-1.200'},
  ]

  return (
    <div>
      <div style={styles.label}>Etapa 4 de 5</div>
      <h2 style={styles.title}>Crie um superávit forçado</h2>
      <p style={styles.text}>A matemática é fria. Precisamos cobrir o buraco.</p>

      <div style={styles.card}>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:14,color:'#525252'}}>Déficit mensal</span>
            <span style={{fontSize:16,fontWeight:800,color:'#dc2626'}}>{formatarMoeda(deficit)}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:14,color:'#525252'}}>Economia com cortes</span>
            <span style={{fontSize:16,fontWeight:800,color:'#16a34a'}}>+ {formatarMoeda(economiaCortes)}</span>
          </div>
          <div style={{height:1,background:'#e5e5e5'}}></div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:14,fontWeight:700,color:'#0f0f0f'}}>Superávit necessário</span>
            <span style={{fontSize:18,fontWeight:900,color:'#f97316'}}>{formatarMoeda(superavitNecessario)}</span>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Quanto você consegue ganhar a mais?</div>
        <input style={styles.input} type="number" placeholder="Renda extra mensal estimada"
               value={rendaExtra} onChange={e => setRendaExtra(e.target.value)} />

        {coberto > 0 && (
          <div style={{marginTop:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
              <span style={{fontSize:13,color:'#525252'}}>Total coberto</span>
              <span style={{fontSize:14,fontWeight:800,color:falta > 0 ? '#d97706' : '#16a34a'}}>
                {formatarMoeda(coberto)}
              </span>
            </div>
            {falta > 0 ? (
              <div style={{fontSize:13,color:'#d97706',fontWeight:600}}>
                ⚠️ Ainda falta {formatarMoeda(falta)}. Precisa de mais cortes ou renda.
              </div>
            ) : (
              <div style={{fontSize:13,color:'#16a34a',fontWeight:600}}>
                ✅ Superávit coberto! Pronto para quitar dívidas.
              </div>
            )}
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Ideias de renda extra</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {sugestoes.map((s,i) => (
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <span style={{fontSize:20}}>{s.icone}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:'#0f0f0f'}}>{s.titulo}</div>
                <div style={{fontSize:12,color:'#737373'}}>{s.desc}</div>
              </div>
              <div style={{fontSize:12,fontWeight:700,color:'#f97316',whiteSpace:'nowrap'}}>{s.ganho}</div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => onProximo(Number(rendaExtra) || 0)} style={styles.buttonPrimary}>
        Próxima Etapa →
      </button>
    </div>
  )
}

// ============================================================
// ETAPA 5: CRONOGRAMA MENSAL
// ============================================================
function EtapaCronograma({ dados, estrategia, dividas, economiaTotal, onConcluir }) {
  const dividasValidas = dividas
    .filter(d => Number(d.valor) > 0)
    .map(d => ({...d, valor: Number(d.valor), juros: Number(d.juros) || 0}))

  // Ordenar conforme estratégia
  const ordenadas = estrategia === 'bola-de-neve' 
    ? [...dividasValidas].sort((a,b) => a.valor - b.valor)
    : [...dividasValidas].sort((a,b) => b.juros - a.juros)

  // Calcular cronograma
  const calcularCronograma = () => {
    const meses = []
    let dividasRestantes = ordenadas.map(d => ({...d}))
    let mes = 1

    while (dividasRestantes.length > 0 && mes < 60) {
      const dividaFoco = dividasRestantes[0]
      const pagamentoMinimo = dividasRestantes.slice(1).reduce((acc, d) => {
        return acc + (d.valor * 0.03)  // 3% do saldo como mínimo
      }, 0)

      const disponivel = economiaTotal - pagamentoMinimo
      const pagamentoFoco = Math.min(disponivel, dividaFoco.valor)

      dividaFoco.valor -= pagamentoFoco

      // Aplica juros nas outras
      dividasRestantes = dividasRestantes.map(d => ({
        ...d,
        valor: d.id === dividaFoco.id ? d.valor : d.valor * (1 + d.juros/100)
      })).filter(d => d.valor > 10)

      meses.push({
        mes,
        dividaNome: dividaFoco.nome,
        pagamento: pagamentoFoco + pagamentoMinimo,
        saldoRestante: dividasRestantes.reduce((acc,d) => acc + d.valor, 0)
      })

      mes++
    }

    return meses
  }

  const cronograma = calcularCronograma()
  const dataLiberdade = new Date()
  dataLiberdade.setMonth(dataLiberdade.getMonth() + cronograma.length)

  return (
    <div>
      <div style={styles.label}>Etapa 5 de 5</div>
      <h2 style={styles.title}>Seu cronograma de saída</h2>
      <p style={styles.text}>Mês a mês até a liberdade financeira.</p>

      <div style={styles.successBox}>
        <span style={{fontSize:20}}>🎉</span>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:'#166534'}}>
            Data prevista: {dataLiberdade.toLocaleDateString('pt-BR', {month:'long', year:'numeric'})}
          </div>
          <div style={{fontSize:13,color:'#166534'}}>
            Em {cronograma.length} meses você estará sem dívidas.
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Mês</th>
              <th style={styles.tableHeader}>Foco</th>
              <th style={{...styles.tableHeader,textAlign:'right'}}>Pagamento</th>
              <th style={{...styles.tableHeader,textAlign:'right'}}>Saldo Restante</th>
            </tr>
          </thead>
          <tbody>
            {cronograma.slice(0, 12).map((item, i) => (
              <tr key={i}>
                <td style={styles.tableCell}>{item.mes}</td>
                <td style={styles.tableCell}>{item.dividaNome}</td>
                <td style={{...styles.tableCell,textAlign:'right',fontWeight:700}}>{formatarMoeda(item.pagamento)}</td>
                <td style={{...styles.tableCell,textAlign:'right',color:'#737373'}}>{formatarMoeda(item.saldoRestante)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {cronograma.length > 12 && (
          <div style={{textAlign:'center',padding:'12px',fontSize:13,color:'#737373'}}>
            ... e mais {cronograma.length - 12} meses
          </div>
        )}
      </div>

      <div style={styles.card}>
        <div style={styles.label}>Regras durante o Passo Zero</div>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[
            {icone:'✅', texto:'Pagar o mínimo em TODAS as dívidas'},
            {icone:'✅', texto:'Jogar TODO superávit na dívida foco'},
            {icone:'✅', texto:'Refazer o diagnóstico todo mês'},
            {icone:'❌', texto:'NÃO usar cartão de crédito'},
            {icone:'❌', texto:'NÃO fazer novas dívidas'},
            {icone:'❌', texto:'NÃO começar as 6 caixas antes de zerar'},
          ].map((regra, i) => (
            <div key={i} style={{display:'flex',gap:10,alignItems:'center'}}>
              <span style={{fontSize:16}}>{regra.icone}</span>
              <span style={{fontSize:14,color:'#0f0f0f'}}>{regra.texto}</span>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onConcluir} style={styles.buttonPrimary}>
        ✅ Concluir Passo Zero — Ir para o Método 6 Caixas
      </button>
    </div>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL: PASSO ZERO
// ============================================================
export default function PassoZero({ dadosDoDiagnostico, onConcluirPassoZero }) {
  const [etapa, setEtapa] = useState(0)
  const [dividas, setDividas] = useState([])
  const [cortes, setCortes] = useState({})
  const [estrategia, setEstrategia] = useState('bola-de-neve')
  const [rendaExtra, setRendaExtra] = useState(0)

  const totalEtapas = 6  // 0 (bem-vindo) + 5 etapas

  const calcularEconomia = (cortesDados) => {
    const dados = dadosDoDiagnostico || {}
    return {
      cartaoCredito: (dados.totalCartao || 0) * 0.3,
      assinaturas: 150,
      lazer: ((dados.variaveis?.lazer || 0)) * 0.5,
      parcelas: 200,
      delivery: ((dados.variaveis?.alimentacao || 0)) * 0.2,
    }
  }

  const economiaCortes = Object.keys(cortes).reduce((acc, key) => {
    const valores = calcularEconomia(dadosDoDiagnostico)
    return acc + (cortes[key] ? (valores[key] || 0) : 0)
  }, 0)

  const economiaTotal = economiaCortes + rendaExtra

  const avancarEtapa = () => setEtapa(e => e + 1)

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.headerTitle}>Método 6 Caixas</span>
        <span style={styles.headerBadge}>Passo Zero</span>
      </header>

      <main style={styles.main}>
        {etapa > 0 && <Progresso etapaAtual={etapa-1} totalEtapas={5} />}

        {etapa === 0 && (
          <EtapaBemVindo 
            dados={dadosDoDiagnostico} 
            onIniciar={avancarEtapa} 
          />
        )}

        {etapa === 1 && (
          <EtapaMapeamento 
            dadosIniciais={dadosDoDiagnostico}
            onProximo={(d) => { setDividas(d); avancarEtapa() }} 
          />
        )}

        {etapa === 2 && (
          <EtapaCongelamento 
            dados={dadosDoDiagnostico}
            onProximo={(c) => { setCortes(c); avancarEtapa() }} 
          />
        )}

        {etapa === 3 && (
          <EtapaEstrategia 
            dividas={dividas}
            onProximo={(e) => { setEstrategia(e); avancarEtapa() }} 
          />
        )}

        {etapa === 4 && (
          <EtapaSuperavit 
            dados={dadosDoDiagnostico}
            economiaCortes={economiaCortes}
            onProximo={(r) => { setRendaExtra(r); avancarEtapa() }} 
          />
        )}

        {etapa === 5 && (
          <EtapaCronograma 
            dados={dadosDoDiagnostico}
            estrategia={estrategia}
            dividas={dividas}
            economiaTotal={economiaTotal}
            onConcluir={onConcluirPassoZero}
          />
        )}
      </main>
    </div>
  )
}
