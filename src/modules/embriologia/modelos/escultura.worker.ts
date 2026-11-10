// Worker: gera a escultura da semana 8 na grade alta fora da thread principal e devolve os arrays (transferidos).
import { gerarEscultura } from './escultura-embriao.ts';

const escopo = self as unknown as {
  onmessage: ((e: MessageEvent<{ nx: number; ny: number; nz: number }>) => void) | null;
  postMessage(mensagem: unknown, transferir: Transferable[]): void;
};

escopo.onmessage = (e) => {
  const { nx, ny, nz } = e.data;
  const g = gerarEscultura(nx, ny, nz);
  const posicoes = g.getAttribute('position').array as Float32Array;
  const normais = g.getAttribute('normal').array as Float32Array;
  const indices = Uint32Array.from(g.getIndex()!.array);
  escopo.postMessage({ posicoes, normais, indices }, [posicoes.buffer, normais.buffer, indices.buffer]);
};
