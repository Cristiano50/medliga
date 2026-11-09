import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './data/store.ts';
import { Layout } from './ui/Layout.tsx';
import { Inicio } from './screens/Inicio.tsx';
import { BoasVindas } from './screens/BoasVindas.tsx';
import { DisciplinaTela } from './screens/Disciplina.tsx';
import { TopicoTela } from './screens/Topico.tsx';
import { QuizTela } from './screens/Quiz.tsx';
import { RankingTela } from './screens/Ranking.tsx';
import { PerfilTela } from './screens/Perfil.tsx';
import { PlanosTela } from './screens/Planos.tsx';
import { PainelTela } from './screens/Painel.tsx';
import { LinhaDoTempoTela } from './games/LinhaDoTempo.tsx';
import { CamadasTela } from './games/Camadas.tsx';
import { Carregando } from './ui/Carregando.tsx';
import { carregarDisciplina } from './content/index.ts';

// A parte 3D (three.js) só é baixada quando o jogador abre o laboratório.
const Lab3DTela = lazy(() => import('./modules/embriologia/Lab3D.tsx'));
const IdentifiqueTela = lazy(() => import('./modules/embriologia/Identifique.tsx'));

function Rotas() {
  const perfil = useApp((s) => s.perfil);
  const loc = useLocation();
  if (!perfil && loc.pathname !== '/bem-vindo') return <Navigate to="/bem-vindo" replace />;
  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/bem-vindo" element={<BoasVindas />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/disciplina/:id" element={<DisciplinaTela />} />
          <Route path="/topico/:id" element={<TopicoTela />} />
          <Route path="/ranking" element={<RankingTela />} />
          <Route path="/perfil" element={<PerfilTela />} />
          <Route path="/planos" element={<PlanosTela />} />
          <Route path="/painel" element={<PainelTela />} />
        </Route>
        <Route element={<Layout semNav />}>
          <Route path="/jogar/quiz" element={<QuizTela />} />
          <Route path="/jogar/linha-do-tempo" element={<LinhaDoTempoTela />} />
          <Route path="/jogar/camadas" element={<CamadasTela />} />
          <Route path="/jogar/identifique" element={<IdentifiqueTela />} />
          <Route path="/lab3d" element={<Lab3DTela />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export function App() {
  const carregado = useApp((s) => s.carregado);
  const carregar = useApp((s) => s.carregar);
  const [conteudo, setConteudo] = useState(false);
  useEffect(() => {
    void carregar();
    // Embriologia é a disciplina disponível hoje: pré-carregada na abertura (as demais, sob demanda).
    void carregarDisciplina('embriologia').then(() => setConteudo(true));
  }, [carregar]);
  if (!carregado || !conteudo) return <Carregando />;
  return (
    <HashRouter>
      <Rotas />
    </HashRouter>
  );
}
