import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111', color: '#888', padding: '20px', textAlign: 'center', fontSize: '12px', marginTop: 'auto' }}>
      <div style={{ marginBottom: '10px' }}>
        <a href="/politica-privacidade.html" style={{ color: '#aaa', textDecoration: 'none', margin: '0 10px' }}>Política de Privacidade</a>
        <span style={{ margin: '0 5px' }}>|</span>
        <a href="/termos-uso.html" style={{ color: '#aaa', textDecoration: 'none', margin: '0 10px' }}>Termos de Uso</a>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '5px 0' }}>CNPJ/CPF: 185.800.842-53</p>
        <p style={{ margin: '5px 0' }}>Contato: metodo6caixas@gmail.com</p>
      </div>
      <p style={{ color: '#555', maxWidth: '600px', margin: '10px auto 0' }}>
        Aviso legal: Os resultados podem variar de acordo com o esforço e dedicação de cada aluno.
      </p>
    </footer>
  );
}
