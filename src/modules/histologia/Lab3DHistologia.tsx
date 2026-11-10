// Laboratório 3D da histologia: esquemas tridimensionais (néfron, alvéolo, …) no explorador genérico.
// Rota /lab3d/histologia?modelo=<id> (ids em content/histologia/modelos3d-*.json).
import { Explorador3D } from '../tres3d/Explorador3D.tsx';

export default function Lab3DHistologiaTela() {
  return <Explorador3D disciplina="histologia" />;
}
