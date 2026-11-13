// Progresso do jogador para o avatar: nível atual e conquistas já obtidas (as de agora e as guardadas no aparelho).
import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../data/store.ts';
import { carregarEstatisticas } from '../../data/estatisticas.ts';
import { conquistasDe } from '../../core/conquistas.ts';
import { nivelPorXP } from '../../core/scoring.ts';
import type { Progresso } from './regras.ts';

/** null enquanto o histórico local está sendo lido. */
export function useProgressoAvatar(): Progresso | null {
  const xpTotal = useApp((s) => s.xpTotal);
  const sequenciaDias = useApp((s) => s.sequenciaDias);
  const temEscola = useApp((s) => !!s.perfil?.escolaId);
  const guardadas = useApp((s) => s.perfil?.conquistasObtidas);
  const registrarConquistas = useApp((s) => s.registrarConquistas);
  const [agora, setAgora] = useState<string[] | null>(null);

  useEffect(() => {
    let vivo = true;
    void carregarEstatisticas({ xpTotal, sequenciaDias, temEscola }).then((e) => {
      if (!vivo) return;
      const obtidas = conquistasDe(e)
        .filter((c) => c.obtida)
        .map((c) => c.id);
      setAgora(obtidas);
      void registrarConquistas(obtidas);
    });
    return () => {
      vivo = false;
    };
  }, [xpTotal, sequenciaDias, temEscola, registrarConquistas]);

  return useMemo(() => {
    if (!agora) return null;
    return { nivel: nivelPorXP(xpTotal).nivel, conquistas: new Set([...agora, ...(guardadas ?? [])]) };
  }, [agora, guardadas, xpTotal]);
}
