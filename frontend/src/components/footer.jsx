import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4 text-center">
        
        {/* Links Obrigatórios */}
        <div className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
          <a href="/politica-privacidade" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
            Política de Privacidade
          </a>
          <span className="text-gray-300">|</span>
          <a href="/termos-uso" className="text-gray-600 hover:text-blue-600 hover:underline transition-colors">
            Termos de Uso
          </a>
        </div>

        {/* Dados do Produtor */}
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>CNPJ/CPF:</strong> 00.000.000/0001-00 {/* Substitua pelo real */}</p>
          <p><strong>Contato:</strong> suporte@metodo6caixas.com.br</p>
        </div>

        {/* Aviso de Isenção (Exigido pela Hotmart para métodos) */}
        <p className="mt-6 text-xs text-gray-400 max-w-2xl mx-auto">
          Aviso legal: Os resultados podem variar de acordo com o esforço, dedicação e aplicação de cada aluno. 
          Este produto não garante a obtenção de resultados financeiros específicos.
        </p>

        <p className="mt-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Método 6 Caixas. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
