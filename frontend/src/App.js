import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Configuracoes from './pages/Configuracoes';
import Lancamentos from './pages/Lancamentos';
import Metas from './pages/Metas';
import Ebook from './pages/Ebook';
import Exemplos from './pages/Exemplos';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="lancamentos" element={<Lancamentos />} />
          <Route path="metas" element={<Metas />} />
          <Route path="ebook" element={<Ebook />} />
          <Route path="exemplos" element={<Exemplos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;