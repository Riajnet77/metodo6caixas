// ============================================================
// LÓGICA DO PASSO ZERO — Cálculos de saída da dívida
// ============================================================

export function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'BRL',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(valor || 0)
}

// ============================================================
// CÁLCULO DE ECONOMIA COM CORTES
// ============================================================
export function calcularEconomiaCortes(dados, cortes) {
  const valoresBase = {
    cartaoCredito: (dados.totalCartao || 0) * 0.30,      // Evita 30% do gasto no cartão
    assinaturas: 150,                                     // Streaming + apps médio
    lazer: (dados.variaveis?.lazer || 0) * 0.50,         // Reduz 50% do lazer
    parcelas: 200,                                        // Média de novas parcelas/mês
    delivery: (dados.variaveis?.alimentacao || 0) * 0.20, // 20% economia cozinhando
  }

  return Object.keys(cortes).reduce((total, key) => {
    return total + (cortes[key] ? (valoresBase[key] || 0) : 0)
  }, 0)
}

// ============================================================
// ORDENAÇÃO DAS DÍVIDAS
// ============================================================
export function ordenarDividas(dividas, estrategia) {
  const validas = dividas
    .filter(d => Number(d.valor) > 0)
    .map(d => ({
      ...d,
      valor: Number(d.valor),
      juros: Number(d.juros) || 0,
      parcelas: Number(d.parcelas) || 0,
    }))

  if (estrategia === 'bola-de-neve') {
    // Menor valor primeiro → vitória psicológica rápida
    return [...validas].sort((a, b) => a.valor - b.valor)
  }

  // Avalanche: maior juro primeiro → economia máxima
  return [...validas].sort((a, b) => b.juros - a.juros)
}

// ============================================================
// SIMULAÇÃO DO CRONOGRAMA
// ============================================================
export function simularCronograma(dividas, estrategia, economiaTotal) {
  const ordenadas = ordenarDividas(dividas, estrategia)
  const meses = []
  let dividasRestantes = ordenadas.map(d => ({...d}))
  let mes = 1
  const maxMeses = 60  // Limite de segurança: 5 anos

  while (dividasRestantes.length > 0 && mes <= maxMeses) {
    // Paga mínimo em todas (3% do saldo)
    const pagamentosMinimos = dividasRestantes.map(d => ({
      ...d,
      valor: d.valor * 0.03
    }))

    const totalMinimos = pagamentosMinimos.reduce((acc, d) => acc + d.valor, 0)
    const disponivelFoco = economiaTotal - totalMinimos

    // Foca na primeira dívida da lista
    const dividaFoco = dividasRestantes[0]
    const pagamentoFoco = Math.max(0, Math.min(disponivelFoco, dividaFoco.valor))

    // Reduz saldo da dívida foco
    dividasRestantes[0].valor -= pagamentoFoco

    // Aplica juros nas demais
    dividasRestantes = dividasRestantes.map((d, i) => {
      if (i === 0) return d  // Foco já foi reduzida
      return {
        ...d,
        valor: d.valor * (1 + d.juros / 100)
      }
    }).filter(d => d.valor > 10)  // Remove dívidas quitadas

    // Reordena se necessário (bola de neve muda conforme saldo)
    if (estrategia === 'bola-de-neve' && dividasRestantes.length > 1) {
      dividasRestantes.sort((a, b) => a.valor - b.valor)
    }

    meses.push({
      mes,
      dividaFoco: dividaFoco.nome,
      pagamentoFoco,
      pagamentosMinimos: totalMinimos,
      pagamentoTotal: pagamentoFoco + totalMinimos,
      saldoRestante: dividasRestantes.reduce((acc, d) => acc + d.valor, 0),
      dividasRestantes: dividasRestantes.length,
    })

    mes++
  }

  return {
    meses,
    totalMeses: meses.length,
    totalPago: meses.reduce((acc, m) => acc + m.pagamentoTotal, 0),
    totalJurosPagos: meses.reduce((acc, m) => {
      // Estimativa: 30% do pagamento são juros (conservador)
      return acc + (m.pagamentoTotal * 0.30)
    }, 0),
    dataConclusao: new Date(Date.now() + meses.length * 30 * 24 * 60 * 60 * 1000),
  }
}

// ============================================================
// CÁLCULO DE SUPERÁVIT NECESSÁRIO
// ============================================================
export function calcularSuperavitNecessario(dados) {
  const receita = Number(dados.receita) || 0
  const gastos = Number(dados.totalGastos) || 0
  const deficit = Math.max(0, gastos - receita)

  return {
    receita,
    gastos,
    deficit,
    metaSuperavit: deficit * 1.2,  // 20% a mais para segurança
    mensagem: deficit > 0 
      ? `Você precisa criar um superávit de ${formatarMoeda(deficit * 1.2)}/mês`
      : 'Você já tem superávit! Pode começar a quitar.',
  }
}

// ============================================================
// VALIDAÇÃO DOS DADOS
// ============================================================
export function validarDadosPassoZero(dados) {
  const erros = []

  if (!dados.receita || dados.receita <= 0) {
    erros.push('Informe sua renda mensal')
  }
  if (!dados.totalGastos || dados.totalGastos <= 0) {
    erros.push('Informe seus gastos totais')
  }
  if (dados.totalGastos <= dados.receita) {
    erros.push('Seus gastos não superam a renda. Você não precisa do Passo Zero.')
  }

  return {
    valido: erros.length === 0,
    erros,
  }
}

// ============================================================
// RESUMO DO PLANO
// ============================================================
export function gerarResumoPlano(dados, cortes, estrategia, rendaExtra) {
  const economiaCortes = calcularEconomiaCortes(dados, cortes)
  const economiaTotal = economiaCortes + rendaExtra
  const superavit = calcularSuperavitNecessario(dados)

  return {
    deficitMensal: superavit.deficit,
    economiaComCortes: economiaCortes,
    rendaExtra,
    economiaTotal,
    cobertura: economiaTotal >= superavit.deficit,
    falta: Math.max(0, superavit.deficit - economiaTotal),
    percentualCoberto: superavit.deficit > 0 
      ? Math.min(100, Math.round((economiaTotal / superavit.deficit) * 100))
      : 100,
  }
}
