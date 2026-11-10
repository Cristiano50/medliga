// Registro dos modelos 3D da histologia (ids = content/histologia/modelos3d-*.json).
// Mesmo contrato dos modelos da embriologia (Componente, partes, câmera, raio), para usar o mesmo Cena3D.
import type { ModeloEstagio } from '../../embriologia/modelos/index.ts';
import { MODELOS_HISTO_A } from './grupo-a.tsx';
import { MODELOS_HISTO_B } from './grupo-b.tsx';

export const MODELOS_HISTOLOGIA: Record<string, ModeloEstagio> = { ...MODELOS_HISTO_A, ...MODELOS_HISTO_B };
