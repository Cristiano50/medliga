// Jogo "Identifique no 3D" da histologia: rota /jogar/identifique/histologia[?modelo=<id>].
import { Identifique3D } from '../tres3d/Identifique3D.tsx';

export default function Identifique3DHistologiaTela() {
  return <Identifique3D disciplina="histologia" />;
}
