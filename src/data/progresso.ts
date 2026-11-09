import { useEffect, useState } from 'react';
import { db } from './db.ts';
import type { EstadoItem } from '../core/srs.ts';
import { dominio } from '../core/srs.ts';
import type { Topico } from '../content/schema.ts';

export interface ProgressoTopico {
  dominio: number; // 0–1
  vistas: number;
  total: number;
  vencidas: number;
}

/** Carrega o estado de revisão espaçada e calcula o domínio de cada tópico. */
export function useProgresso(topicos: Topico[], versao = 0): Map<string, ProgressoTopico> {
  const [mapa, setMapa] = useState<Map<string, ProgressoTopico>>(new Map());
  useEffect(() => {
    let vivo = true;
    void db.estados.toArray().then((estados) => {
      if (!vivo) return;
      const porId = new Map(estados.map((e) => [e.questaoId, e]));
      const agora = Date.now();
      const m = new Map<string, ProgressoTopico>();
      for (const t of topicos) {
        const doTopico: EstadoItem[] = [];
        for (const q of t.questoes) {
          const e = porId.get(q.id);
          if (e) doTopico.push(e);
        }
        m.set(t.id, {
          dominio: dominio(doTopico, t.questoes.length),
          vistas: doTopico.length,
          total: t.questoes.length,
          vencidas: doTopico.filter((e) => e.proximaRevisao <= agora).length,
        });
      }
      setMapa(m);
    });
    return () => {
      vivo = false;
    };
  }, [topicos, versao]);
  return mapa;
}
