import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

const Ebook = () => {
  const [expandedPart, setExpandedPart] = useState(1);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const ebookContent = [
    {
      part: 1,
      title: "Fundamentos do Hábito Financeiro",
      chapters: [
        {
          id: 1,
          title: "O Que É Hábito?",
          subtitle: "O Piloto Automático do Cérebro",
          content: [
            "Economizar é uma questão de hábito. Por meio da repetição se forma o hábito. Mas o que é um hábito?",
            "Hábito é qualquer comportamento que, depois de repetido muitas vezes, se torna automático. É o 'piloto automático' do cérebro.",
            "O hábito de economizar, no início, é mais importante do que o próprio valor economizado. A formação do hábito de economizar, de maneira sistemática, coloca em nossa frente oportunidades maiores, dando-nos visão, confiança, imaginação, entusiasmo, iniciativa e autoconfiança para aumentar a capacidade de ganhar dinheiro."
          ],
          exercise: "Identifique um pequeno valor que você pode economizar diariamente (ex: R$ 5). Não se preocupe com o valor, foque na repetição diária.",
          verse: "\"Os pensamentos dos diligentes conduzem à abundância\" - Provérbios 21:5"
        },
        {
          id: 2,
          title: "Pensamentos Criam Prosperidade",
          subtitle: "O Ciclo da Realização",
          content: [
            "Nossos pensamentos, conscientes ou inconscientes, estão criando a nossa realidade. Pensamentos geram EMOÇÕES, as emoções geram SENTIMENTOS, os sentimentos geram CRENÇAS, as crenças geram AÇÕES e as ações geram os RESULTADOS.",
            "Através do uso consciente do pensamento, podemos criar hábitos que nos levam a um OBJETIVO desejado, através da execução das METAS.",
            "Todo resultado que você deseja na sua vida está naquilo que você ainda não aprendeu. Se já soubesse, já teria os resultados desejados."
          ],
          exercise: "Escreva 3 pensamentos positivos sobre dinheiro que você quer cultivar. Exemplo: 'Eu administro bem meus recursos', 'Eu mereço prosperidade', 'Eu sou diligente com minhas finanças'.",
          verse: "\"Como o homem imagina em sua alma, assim ele é\" - Provérbios 23:7"
        },
        {
          id: 3,
          title: "Objetivos e Metas",
          subtitle: "O Caminho do Crescimento Contínuo",
          content: [
            "Um OBJETIVO é uma situação, um lugar, uma posição que uma vez conseguida vai fazer uma diferença na sua vida. Comece com um objetivo menor e sempre que estiver atingindo esse objetivo, já se comece a programar um objetivo maior.",
            "As METAS são como pequenos objetivos, diários ou não, mas com uma frequência que vai te levar ao objetivo maior desejado. É aquele passo a passo, a caminhada que você precisa fazer hoje, amanhã, próxima semana.",
            "Quando você usa o pensamento de forma clara e objetiva para criar hábitos que possibilitem a realização de metas que levam aos objetivos desejados, isso passa a ser um processo natural em sua vida e grande prosperidade poderá ser derramada sobre você."
          ],
          exercise: "Defina 1 objetivo financeiro para os próximos 6 meses. Depois, quebre esse objetivo em 3 metas mensais menores.",
          verse: "\"Escreva a visão, torne-a clara\" - Habacuque 2:2"
        }
      ]
    },
    {
      part: 2,
      title: "Sistema de Gestão Financeira",
      chapters: [
        {
          id: 4,
          title: "Como Sobreviver com o Que se Ganha?",
          subtitle: "A Divisão Inteligente da Renda",
          content: [
            "Quanto mais se ganha, maior a capacidade de economizar. Porém, na prática vemos o contrário: quanto mais se ganha, maior o endividamento das pessoas.",
            "A solução está em distribuir a renda de forma inteligente: 50% Viver, 10% Liberdade Financeira, 10% Longo Prazo, 10% Educação, 10% Doação, 10% Lazer.",
            "Esta não é apenas uma fórmula matemática, é um sistema de vida que transforma sua relação com o dinheiro."
          ],
          exercise: "Calcule 10% da sua renda atual. Este será seu ponto de partida para a categoria Liberdade Financeira. Comprometa-se a separar esse valor PRIMEIRO, antes de qualquer outra despesa.",
          verse: "\"Quem junta dinheiro aos poucos terá cada vez mais\" - Provérbios 13:11"
        },
        {
          id: 5,
          title: "Detalhamento das 6 Categorias",
          subtitle: "",
          content: [
            "VIVER (50%): Ajuste todas as despesas do cotidiano com 50% dos ganhos mensais. Se atualmente não é possível, você precisa efetivamente aumentar sua renda. Saiba que você precisa ter múltiplas fontes de renda.",
            "LIBERDADE FINANCEIRA (10%): Pague-se a si primeiro! Poupe 10% ainda que inicie na poupança tradicional e com um montante menor. Só mexa nesse dinheiro para aumentar os rendimentos.",
            "LONGO PRAZO (10%): Poupar para atender eventos como entrada na aquisição do imóvel próprio, reforma, troca de veículo, férias e outros eventos que aparecerão sem avisar.",
            "EDUCAÇÃO (10%): Invista em seus conhecimentos para aprender como ganhar mais. Bem melhor obter sabedoria do que OURO (Provérbios 16:16).",
            "DOAÇÃO (10%): É dando que se recebe. O universo retorna aquilo que você doa. O dízimo é bíblico e pode ser doado a qualquer que tenha necessidade.",
            "LAZER (10%): Gaste com você mesmo, sem culpa, para se sentir bem, para se sentir rico mesmo, com a consciência tranquila."
          ],
          exercise: "Configure suas 6 categorias na página de Configurações. Ajuste os percentuais se necessário, mas mantenha o equilíbrio.",
          verse: "\"Há tempo de plantar e tempo de colher\" - Eclesiastes 3:2"
        },
        {
          id: 6,
          title: "Três Lógicas para Melhorar Suas Finanças",
          subtitle: "",
          content: [
            "LÓGICA 1 - Cortar Despesas: Identifique se é necessidade ou vaidade e comece cortando o supérfluo. Faça uma análise corajosa e sincera de cada um de seus gastos.",
            "LÓGICA 2 - Aumentar Receitas: Pare e pense em possibilidades. Imagine alguma forma de suprir a necessidade de alguém, quem sabe começando pelos próprios vizinhos, amigos e conhecidos.",
            "LÓGICA 3 - Combinação: Corte de despesas e aumento de rendimentos simultaneamente. Mais complexa e difícil, mas recompensadora. Uma vez conseguida, você ficará entusiasmado, confiante e sempre à procura de como ampliá-la."
          ],
          exercise: "Escolha uma das três lógicas para começar ESTA SEMANA. Identifique 1 gasto desnecessário OU 1 oportunidade de renda extra.",
          verse: "\"Gaste menos do que ganhe, gaste por necessidade, evite a vaidade\" - Provérbios 21:20"
        },
        {
          id: 7,
          title: "Por Onde Começar — Especialmente se Você Tem Dívidas",
          subtitle: "A Ordem Correta para Iniciar o Método",
          content: [
            "Se você está endividado e pagando juros, existe uma ordem específica para iniciar o método. Não se culpe — a grande maioria das pessoas começa exatamente nessa situação.",
            "⚠️ DÍVIDAS EM PRIMEIRO LUGAR: Enquanto você estiver pagando juros de dívidas, suspenda temporariamente as doações e redirecione esse valor para quitar o endividamento mais rapidamente. Dívidas com juros são um buraco no balde — de nada adianta encher se continua vazando.",
            "Uma vez que suas dívidas estejam administradas e os juros sob controle, retome as doações normalmente. A generosidade é uma lei universal, mas ela funciona muito melhor quando sua casa está em ordem.",
            "🚀 NÃO SE PREOCUPE COM OS VALORES INICIAIS: Quando iniciar a distribuição da sua renda nas 6 categorias, não se preocupe com os valores iniciais. No começo, o mais importante não é quanto você distribui, mas SIM a criação do novo hábito.",
            "Separe R$ 1, R$ 5, R$ 10 para cada caixa — não importa. O que importa é repetir esse gesto todo mês, todo salário, toda renda que entrar. Com o tempo, os valores crescem naturalmente.",
            "📊 FAÇA O DIAGNÓSTICO FINANCEIRO PRIMEIRO: Antes de começar, é fundamental entender sua situação atual. Utilize nosso Diagnóstico Financeiro para mapear suas dívidas, receitas e despesas com clareza. Um diagnóstico honesto é o ponto de partida para qualquer transformação real.",
            "Acesse o Diagnóstico Financeiro em: https://diagnostico--financeiro.vercel.app — faça agora antes de avançar para as configurações do método."
          ],
          exercise: "1. Acesse o Diagnóstico Financeiro (link acima). 2. Se tiver dívidas com juros, liste-as por ordem de maior juros. 3. Decida quanto vai destinar mensalmente para quitá-las. 4. Mesmo assim, comece a distribuir pequenos valores nas 6 categorias para criar o hábito.",
          verse: "\"Quem toma dinheiro emprestado se torna escravo de quem o empresta\" - Provérbios 22:7"
        }
      ]
    },
    {
      part: 3,
      title: "Os Dez Princípios Bíblicos de Salomão",
      chapters: [
        {
          id: 8,
          title: "Princípios 1 a 5",
          subtitle: "Sabedoria, Diligência e Propósito",
          content: [
            "1. SEJA DILIGENTE: Cuidadoso, zeloso, pesquisador, investigador, busque a excelência. (Provérbios 21:5)",
            "2. VALOR DA SABEDORIA: Bem melhor obter sabedoria do que OURO, mais vale escolher entendimento e prudência do que PRATA. (Provérbios 16:16)",
            "3. INVISTA EM CONHECIMENTO (10%): A mente dos sábios é aberta ao conhecimento e os ouvidos são abertos às novas ideias. (Provérbios 18:15)",
            "4. CONFIANÇA E GRATIDÃO: Confia ao Senhor tuas obras, seja grato pelo que tem e seus pensamentos e planos serão bem-sucedidos. (Provérbios 16:13)",
            "5. PENSAMENTOS DILIGENTES: Os pensamentos dos diligentes conduzem à abundância, pois eles trabalham corretamente com um propósito claro. (Provérbios 21:5)"
          ],
          exercise: "Escolha UM desses 5 princípios para praticar intensamente esta semana. Anote diariamente como você o aplicou.",
          verse: "\"Os pensamentos dos diligentes conduzem à abundância\" - Provérbios 21:5"
        },
        {
          id: 9,
          title: "Princípios 6 a 10",
          subtitle: "Dívidas, Poupança e Generosidade",
          content: [
            "6. EVITE AS DÍVIDAS: Quem toma dinheiro emprestado se torna escravo de quem o empresta. (Provérbios 22:7)",
            "7. GASTE CONSCIENTE: Gaste menos do que ganhe, gaste por necessidade, evite a vaidade. (Provérbios 21:20)",
            "8. POUPANÇA REGULAR: Quem junta dinheiro aos poucos terá cada vez mais. (Provérbios 13:11)",
            "9. TRABALHO COM DEDICAÇÃO: Faça seu trabalho com cuidado e dedicação. (Provérbios 22:29)",
            "10. GENEROSIDADE: A pessoa generosa terá sempre mais e mais, pois receberá de volta todo o bem que ela faz. A Lei do plantar para colher. O plantio é facultativo, a colheita é obrigatória. (Provérbios 11:25)"
          ],
          exercise: "Avalie em qual dos princípios 6 a 10 você está mais fraco. Crie um plano de ação específico para melhorar nessa área.",
          verse: "\"A pessoa generosa terá sempre mais\" - Provérbios 11:25"
        },
        {
          id: 10,
          title: "Três Formas de Ganhar Dinheiro",
          subtitle: "Servir para Prosperar",
          content: [
            "1. AJUDE AS PESSOAS A GANHAREM DINHEIRO: Sendo o melhor que você imaginar ser no que faz, e depois estruture um curso e venda presencial, via Internet e outras formas que você agregue às outras pessoas.",
            "2. AJUDE AS PESSOAS A RESOLVER PROBLEMAS: Resolvendo problemas alheios você pode ganhar muito dinheiro. Você só recebe aquilo que dá.",
            "3. AJUDE AS PESSOAS NA AUTOCONFIANÇA E AUTOCONHECIMENTO: Como funcionam as leis universais, causa e consequência, vibração, transmutação, co-criação. Incentive-as. Quando você ensina, você aprende muito mais."
          ],
          exercise: "Identifique qual das 3 formas se alinha melhor com suas habilidades atuais. Pense em 1 pessoa que você poderia ajudar ESTA SEMANA.",
          verse: "\"Você só recebe aquilo que dá\" - Lei Universal"
        }
      ]
    },
    {
      part: 4,
      title: "Desenvolvimento Contínuo",
      chapters: [
        {
          id: 11,
          title: "Aprendizado e Excelência",
          subtitle: "60 Minutos que Transformam",
          content: [
            "Torne-se o melhor no que você faz. A competição é com você mesmo.",
            "Aprenda coisas novas na sua área de atuação: 60 minutos a cada dia. Ao final de um ano, você terá uma nova especialização!",
            "Faça meditação guiada 25 minutos por dia e estude coisas novas 15 minutos por dia e verá sua vida se transformar.",
            "Como tudo está em movimento (Lei da Vibração), as coisas estão em constante mutação e precisamos nos atualizar e aprender sempre coisas novas.",
            "Surpreenda sempre com algo a mais além daquilo de sua obrigação junto aos seus clientes e parceiros."
          ],
          exercise: "Comprometa-se com 60 minutos diários de desenvolvimento. Escolha: 1 curso online, 1 livro, 1 podcast. Comece HOJE.",
          verse: "\"A mente dos sábios é aberta ao conhecimento\" - Provérbios 18:15"
        },
        {
          id: 12,
          title: "Como Gerenciar Seu Dinheiro",
          subtitle: "Passos Práticos",
          content: [
            "• Controle seu orçamento - use esta ferramenta para registrar TUDO",
            "• Reorganize suas finanças - aplique o sistema das 6 categorias",
            "• Tenha uma meta financeira - onde você quer estar daqui a 1 ano?",
            "• Aprenda a dizer não - nem toda compra é necessária",
            "• Poupe - faça disso um hábito automático",
            "• Distribua seus ganhos entre despesas e investimentos - equilíbrio é a chave"
          ],
          exercise: "Dos 6 passos acima, identifique seu ponto mais fraco. Dedique as próximas 2 semanas focando APENAS nessa área.",
          verse: "\"O que administra bem sua casa herdará vida\" - Provérbios 11:29"
        },
        {
          id: 13,
          title: "Expandindo Nosso Poder",
          subtitle: "Conclusão e Novos Começos",
          content: [
            "JUNTOS somos mais fortes. Compartilhe esses princípios com sua família.",
            "Só o AMOR constrói e dignifica a alma. Prospere com propósito de abençoar.",
            "Com CLAREZA seguimos o caminho da prosperidade. Tenha metas bem definidas.",
            "O BEM-ESTAR nos torna firmes na caminhada. Cuide de todas as áreas da vida.",
            "CONTAR é parte da abundância e da prosperidade. Registre e acompanhe seus números.",
            "O DIVINO está dentro de nós assim como as respostas que procuramos. Confie no processo."
          ],
          exercise: "Revise todo o conteúdo. Escreva uma declaração pessoal: 'Eu prospero para...' Complete com seu propósito maior.",
          verse: "\"Confia ao Senhor tuas obras e teus planos serão bem-sucedidos\" - Provérbios 16:3"
        }
      ]
    }
  ];

  const togglePart = (partNumber) => {
    setExpandedPart(expandedPart === partNumber ? null : partNumber);
    setSelectedChapter(null);
  };

  const selectChapter = (partIndex, chapterIndex) => {
    setSelectedChapter({ partIndex, chapterIndex });
  };

  return (
    <div className="max-w-7xl mx-auto" data-testid="ebook-page">
      <div className="text-center mb-12">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
          <BookOpen className="w-6 h-6 text-amber-700 inline mr-2" />
          <span className="text-amber-700 font-semibold">Conteúdo Completo</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
          O Hábito da Economia<br />
          e Gestão Financeira
        </h1>
        <p className="text-xl text-gray-600">
          Princípios eternos para prosperidade duradoura
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Índice</h2>
            <div className="space-y-2">
              {ebookContent.map((part, partIndex) => (
                <div key={part.part}>
                  <button
                    onClick={() => togglePart(part.part)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {expandedPart === part.part ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <span className="font-semibold text-sm">Parte {part.part}: {part.title}</span>
                    </div>
                  </button>
                  {expandedPart === part.part && (
                    <div className="ml-6 space-y-1 mt-1">
                      {part.chapters.map((chapter, chapterIndex) => (
                        <button
                          key={chapter.id}
                          onClick={() => selectChapter(partIndex, chapterIndex)}
                          className={`w-full text-left p-2 rounded text-sm hover:bg-blue-50 ${
                            selectedChapter?.partIndex === partIndex && selectedChapter?.chapterIndex === chapterIndex
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : 'text-gray-700'
                          }`}
                        >
                          Cap. {chapter.id}: {chapter.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedChapter ? (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="mb-6">
                <span className="text-sm text-amber-600 font-semibold">
                  Parte {ebookContent[selectedChapter.partIndex].part} - Capítulo {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].id}
                </span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 font-serif">
                  {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].title}
                </h2>
                {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].subtitle && (
                  <p className="text-gray-600 italic mt-1">
                    {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].subtitle}
                  </p>
                )}
              </div>

              <div className="prose max-w-none">
                {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].content.map((paragraph, idx) => (
                  <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="text-center text-gray-700 italic font-serif">
                  {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].verse}
                </p>
              </div>

              <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  📝 Exercício Prático
                </h3>
                <p className="text-gray-700">
                  {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].exercise}
                </p>
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    const prevChapter = selectedChapter.chapterIndex - 1;
                    if (prevChapter >= 0) {
                      selectChapter(selectedChapter.partIndex, prevChapter);
                    } else if (selectedChapter.partIndex > 0) {
                      const prevPart = selectedChapter.partIndex - 1;
                      selectChapter(prevPart, ebookContent[prevPart].chapters.length - 1);
                    }
                  }}
                  disabled={selectedChapter.partIndex === 0 && selectedChapter.chapterIndex === 0}
                  className="px-4 py-2 text-gray-700 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Capítulo Anterior
                </button>
                <button
                  onClick={() => {
                    const nextChapter = selectedChapter.chapterIndex + 1;
                    if (nextChapter < ebookContent[selectedChapter.partIndex].chapters.length) {
                      selectChapter(selectedChapter.partIndex, nextChapter);
                    } else if (selectedChapter.partIndex < ebookContent.length - 1) {
                      selectChapter(selectedChapter.partIndex + 1, 0);
                    }
                  }}
                  disabled={
                    selectedChapter.partIndex === ebookContent.length - 1 &&
                    selectedChapter.chapterIndex === ebookContent[selectedChapter.partIndex].chapters.length - 1
                  }
                  className="px-4 py-2 text-gray-700 hover:text-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próximo Capítulo →
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 shadow-lg text-center">
              <BookOpen className="w-20 h-20 text-amber-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo ao Conteúdo Completo!</h2>
              <p className="text-gray-600 mb-8">
                Selecione um capítulo no índice ao lado para começar sua jornada rumo à prosperidade financeira.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <p className="text-center text-gray-700 italic font-serif">
                  "Todo resultado que você deseja na sua vida<br />
                  está naquilo que você ainda não aprendeu."
                </p>
                <p className="text-center text-sm text-blue-600 font-semibold mt-2">
                  Comece sua transformação agora
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ebook;
