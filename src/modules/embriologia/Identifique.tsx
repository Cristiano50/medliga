// Jogo "Identifique": encontre no modelo 3D a estrutura pedida. 3 vidas, 10 alvos.
// Implementação genérica em tres3d/Identifique3D.tsx (mesmos alvos, XP e textos); aqui, o catálogo da embriologia.
import { Identifique3D } from '../tres3d/Identifique3D.tsx';

export default function IdentifiqueTela() {
  return <Identifique3D disciplina="embriologia" />;
}
