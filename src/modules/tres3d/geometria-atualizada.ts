// Aviso de geometria trocada fora do React (ex.: escultura alta que chega do worker e substitui a provisória
// no próprio objeto): a cena refaz BVH e sombra e pede um quadro.
const ouvintes = new Set<() => void>();

export function assinarGeometrias(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte);
  return () => { ouvintes.delete(ouvinte); };
}

export function avisarGeometriaAtualizada() {
  for (const f of ouvintes) f();
}
