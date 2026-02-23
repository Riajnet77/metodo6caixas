import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

const Ebook = () => {
  const [expandedPart, setExpandedPart] = useState(1);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const ebookContent = [
    {
      part: 1,
      title: "A Base da Mentalidade",
      chapters: [
        {
          id: 1,
          title: "Seu Modelo de Dinheiro",
          subtitle: "Inspirado em T. Harv Eker",
          content: [
            "Os 'Arquivos da Riqueza' são crenças profundas sobre dinheiro que foram programadas em você desde a infância. Essas crenças determinam seu sucesso financeiro.",
            "Se você pensa que dinheiro é a raiz de todo o mal, seu subconsciente nunca permitirá que você acumule riqueza.",
            "A boa notícia? Você pode reprogramar seu modelo de dinheiro!"
          ],
          exercise: "Identifique 3 crenças limitantes sobre dinheiro que você carrega. Exemplo: 'Pessoas ricas são egoístas', 'Nunca serei rico', 'Dinheiro traz problemas'.",
          verse: "\"Porque, como imagina em sua alma, assim ele é\" - Provérbios 23:7"
        },
        {
          id: 2,
          title: "A Visão Bíblica da Riqueza",
          subtitle: "",
          content: [
            "O dinheiro, em si, não é mau. O que a Bíblia condena é o AMOR ao dinheiro (1 Timóteo 6:10).",
            "Deus deseja que seus filhos prosperem: 'Amado, desejo que te vá bem em todas as coisas e que tenhas saúde, assim como bem vai a tua alma' (3 João 1:2).",
            "Você é um MORDOMO, não um dono. Deus é o dono de tudo, e você administra recursos para Sua glória."
          ],
          exercise: "Reflita: Como seria sua vida se você usasse a riqueza para impactar vidas e avançar o Reino de Deus?",
          verse: "\"Porque quem é fiel no pouco, também é fiel no muito\" - Lucas 16:10"
        },
        {
          id: 3,
          title: "Propósito e Generosidade",
          subtitle: "",
          content: [
            "Dar não é perder, é SEMEAR. 'Quem semeia com fartura, com fartura também ceifará' (2 Coríntios 9:6).",
            "A generosidade quebra o ciclo da escassez e abre as comportas do céu.",
            "O dízimo (10%) é um princípio de prioridade: Deus em primeiro lugar. As ofertas são uma expressão de gratidão."
          ],
          exercise: "Calcule 10% da sua renda atual. Comprometa-se a dar esse valor com alegria este mês.",
          verse: "\"Deus ama quem dá com alegria\" - 2 Coríntios 9:7"
        }
      ]
    },
    {
      part: 2,
      title: "O Método Prático",
      chapters: [
        {
          id: 4,
          title: "Conhecendo a Ferramenta Financeira",
          subtitle: "",
          content: [
            "Nossa plataforma é como uma planilha interativa que transforma dados em insights.",
            "O Dashboard mostra sua saúde financeira em tempo real com gráficos e cores.",
            "Verde = Está no caminho certo | Amarelo = Atenção | Vermelho = Ajuste necessário"
          ],
          exercise: "Vá até a página de Configurações e insira sua renda mensal real.",
          verse: "\"Os planos bem elaborados levam à fartura\" - Provérbios 21:5"
        },
        {
          id: 5,
          title: "Definindo Seus Percentuais Ideais",
          subtitle: "",
          content: [
            "Proposta base: 50% Viver, 10% Liberdade Financeira, 10% Longo Prazo, 10% Educação, 10% Doação, 10% Lazer.",
            "Você pode ajustar conforme sua realidade, MAS mantenha o equilíbrio.",
            "Exemplo bíblico: José poupou nos anos de fartura para sobreviver na escassez (Gênesis 41)."
          ],
          exercise: "Personalize os percentuais na página de Configurações de acordo com suas prioridades.",
          verse: "\"Há tempo de plantar e tempo de colher\" - Eclesiastes 3:2"
        },
        {
          id: 6,
          title: "Lançando e Analisando os Gastos",
          subtitle: "",
          content: [
            "Registre TODAS as despesas, mesmo as pequenas. É lá que o dinheiro 'desaparece'.",
            "Use as categorias certas. Cada peso no lugar certo.",
            "Analise semanalmente: Onde estou gastando demais? Posso ajustar?"
          ],
          exercise: "Lance ao menos 10 despesas do mês atual na página de Lançamentos.",
          verse: "\"O que administra bem sua casa herdará vida\" - Provérbios 11:29"
        }
      ]
    },
    {
      part: 3,
      title: "Da Teoria à Transformação",
      chapters: [
        {
          id: 7,
          title: "Criando Metas com Propósito",
          subtitle: "",
          content: [
            "Cada categoria deve ter um SONHO associado. Longo prazo: casa própria. Educação: MBA. Doação: ajudar famílias carentes.",
            "Metas sem propósito são apenas números. Conecte-as ao que realmente importa.",
            "Visualize suas conquistas. Onde não há visão, o povo perece (Provérbios 29:18)."
          ],
          exercise: "Cadastre 3 metas na página de Metas, uma para cada categoria: Longo Prazo, Educação e Doação.",
          verse: "\"Escreva a visão, torne-a clara\" - Habacuque 2:2"
        },
        {
          id: 8,
          title: "Mantendo a Disciplina (e a Fé)",
          subtitle: "",
          content: [
            "A disciplina financeira é um ato de fé. Você confia que Deus proverá quando você administra bem.",
            "Ore sobre suas finanças. Convide Deus para ser seu sócio.",
            "Celebre as pequenas vitórias. Cada mês no azul é uma conquista!"
          ],
          exercise: "Agende uma 'reunião financeira' mensal com você mesmo (ou cônjuge). Revise o Dashboard e ajuste.",
          verse: "\"O meu Deus suprirá todas as necessidades de vocês\" - Filipenses 4:19"
        },
        {
          id: 9,
          title: "O Ciclo da Prosperidade",
          subtitle: "",
          content: [
            "Prosperidade com propósito é um ciclo: Receber -> Administrar -> Multiplicar -> Doar -> Receber mais.",
            "Não é sobre acumular, é sobre FLUIR. O dinheiro é um rio, não um lago.",
            "Quando você prospera, vidas são transformadas. Esse é o propósito final."
          ],
          exercise: "Escreva sua declaração de propósito financeiro: 'Eu prospero para...'",
          verse: "\"Você será enriquecido de todas as formas para que possa ser generoso\" - 2 Coríntios 9:11"
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
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4 px-4 py-2 bg-amber-100 rounded-full">
          <BookOpen className="w-6 h-6 text-amber-700 inline mr-2" />
          <span className="text-amber-700 font-semibold">Ebook Digital</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">
          Mente Milionária & Finanças Bíblicas
        </h1>
        <p className="text-xl text-gray-600">
          O Caminho da Prosperidade com Propósito
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar - Table of Contents */}
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

        {/* Main Content */}
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

              {/* Verse */}
              <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="text-center text-gray-700 italic font-serif">
                  {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].verse}
                </p>
              </div>

              {/* Exercise */}
              <div className="p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  📝 Exercício Prático
                </h3>
                <p className="text-gray-700">
                  {ebookContent[selectedChapter.partIndex].chapters[selectedChapter.chapterIndex].exercise}
                </p>
              </div>

              {/* Navigation */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo ao Ebook!</h2>
              <p className="text-gray-600 mb-8">
                Selecione um capítulo no índice ao lado para começar sua jornada rumo à prosperidade com propósito.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <p className="text-center text-gray-700 italic font-serif">
                  "Os planos bem elaborados levam à fartura;<br />
                  o apressado acaba na miséria."
                </p>
                <p className="text-center text-sm text-blue-600 font-semibold mt-2">
                  Provérbios 21:5
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