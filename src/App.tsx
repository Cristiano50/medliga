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
import { LegalTela } from './screens/Legal.tsx';
import { DuelosTela } from './screens/Duelos.tsx';
import { LinhaDoTempoTela } from './games/LinhaDoTempo.tsx';
import { CamadasTela } from './games/Camadas.tsx';
import { Carregando } from './ui/Carregando.tsx';
import { carregarDisciplina } from './content/index.ts';
import { DISCIPLINAS_DISPONIVEIS } from './content/disciplinas.ts';

// A parte 3D (three.js) só é baixada quando o jogador abre o laboratório.
const Lab3DTela = lazy(() => import('./modules/embriologia/Lab3D.tsx'));
const IdentifiqueTela = lazy(() => import('./modules/embriologia/Identifique.tsx'));
// Histologia: microscópio virtual (SVG, carregado sob demanda)
const MicroscopioTela = lazy(() => import('./modules/histologia/Microscopio.tsx'));
const IdentifiqueLaminaTela = lazy(() => import('./modules/histologia/IdentifiqueLamina.tsx'));
const QualTecidoTela = lazy(() => import('./modules/histologia/QualTecido.tsx'));
// Histologia: laboratório 3D (explorador genérico de tres3d/) e "Identifique no 3D"
const Lab3DHistologiaTela = lazy(() => import('./modules/histologia/Lab3DHistologia.tsx'));
const Identifique3DHistologiaTela = lazy(() => import('./modules/histologia/Identifique3DHistologia.tsx'));

// Editor do avatar: só é baixado quando o jogador abre.
const EditorAvatarTela = lazy(() => import('./modules/avatar/EditorAvatar.tsx'));

function Rotas() {
  const perfil = useApp((s) => s.perfil);
  const loc = useLocation();
  if (!perfil && loc.pathname !== '/bem-vindo' && !loc.pathname.startsWith('/legal/')) return <Navigate to="/bem-vindo" replace />;
  return (
    <Suspense fallback={<Carregando />}>
      <Routes>
        <Route path="/bem-vindo" element={<BoasVindas />} />
        <Route path="/legal/:doc" element={<LegalTela />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/disciplina/:id" element={<DisciplinaTela />} />
          <Route path="/topico/:id" element={<TopicoTela />} />
          <Route path="/ranking" element={<RankingTela />} />
          <Route path="/perfil" element={<PerfilTela />} />
          <Route path="/perfil/avatar" element={<EditorAvatarTela />} />
          <Route path="/planos" element={<PlanosTela />} />
          <Route path="/painel" element={<PainelTela />} />
          <Route path="/duelos" element={<DuelosTela />} />
        </Route>
        <Route element={<Layout semNav />}>
          <Route path="/jogar/quiz" element={<QuizPorSessao />} />
          <Route path="/jogar/linha-do-tempo" element={<LinhaDoTempoTela />} />
          <Route path="/jogar/camadas" element={<CamadasTela />} />
          <Route path="/jogar/identifique" element={<IdentifiqueTela />} />
          <Route path="/lab3d" element={<Lab3DTela />} />
          <Route path="/microscopio" element={<MicroscopioTela />} />
          <Route path="/jogar/identifique-lamina" element={<IdentifiqueLaminaTela />} />
          <Route path="/jogar/qual-tecido" element={<QualTecidoTela />} />
          <Route path="/lab3d/histologia" element={<Lab3DHistologiaTela />} />
          <Route path="/jogar/identifique/histologia" element={<Identifique3DHistologiaTela />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

/** Cada combinação de parâmetros (modo, tópico, disciplina, duelo) é uma sessão nova:
 * remonta a tela para não reaproveitar as questões da sessão anterior. */
function QuizPorSessao() {
  const { search } = useLocation();
  return <QuizTela key={search} />;
}

export function App() {
  const carregado = useApp((s) => s.carregado);
  const carregar = useApp((s) => s.carregar);
  const [conteudo, setConteudo] = useState(false);
  useEffect(() => {
    void carregar();
    // Disciplinas disponíveis são pré-carregadas na abertura (cada tópico é um arquivo, em cache para uso offline).
    void Promise.all(DISCIPLINAS_DISPONIVEIS.map((d) => carregarDisciplina(d))).then(() => setConteudo(true));
  }, [carregar]);
  if (!carregado || !conteudo) return <Carregando />;
  return (
    <HashRouter>
      <Rotas />
    </HashRouter>
  );
}
