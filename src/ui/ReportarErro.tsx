import { useState } from 'react';
import { db, uuid, type Reporte } from '../data/db.ts';
import { sincronizar } from '../data/sync.ts';

const MOTIVOS: { id: Reporte['motivo']; rotulo: string }[] = [
  { id: 'gabarito', rotulo: 'Gabarito errado' },
  { id: 'explicacao', rotulo: 'Explicação incorreta ou incompleta' },
  { id: 'enunciado', rotulo: 'Enunciado ambíguo / mais de uma resposta' },
  { id: 'portugues', rotulo: 'Erro de português ou digitação' },
  { id: 'outro', rotulo: 'Outro' },
];

/** Botão discreto "reportar erro" com formulário curto. Grava no aparelho e envia quando houver conta e rede. */
export function ReportarErro({ questaoId }: { questaoId: string }) {
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState<Reporte['motivo']>('gabarito');
  const [texto, setTexto] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (enviado) return <p className="muted pequeno" style={{ margin: 0 }}>Obrigado! O reporte vai para a fila de revisão do conteúdo.</p>;
  if (!aberto)
    return (
      <button className="btn fantasma pequeno" style={{ alignSelf: 'flex-start' }} onClick={() => setAberto(true)}>
        ⚑ Reportar erro nesta questão
      </button>
    );
  return (
    <div className="card pilha" style={{ background: 'var(--bg-elev)' }}>
      <div className="campo">
        <label htmlFor={`mot-${questaoId}`}>O que está errado?</label>
        <select id={`mot-${questaoId}`} className="input" value={motivo} onChange={(e) => setMotivo(e.target.value as Reporte['motivo'])}>
          {MOTIVOS.map((m) => <option key={m.id} value={m.id}>{m.rotulo}</option>)}
        </select>
      </div>
      <div className="campo">
        <label htmlFor={`txt-${questaoId}`}>Detalhe (opcional, de preferência com a fonte)</label>
        <textarea id={`txt-${questaoId}`} className="input" style={{ minHeight: 80, padding: 10 }} maxLength={1000} value={texto} onChange={(e) => setTexto(e.target.value)} />
      </div>
      <div className="linha">
        <button className="btn fantasma pequeno" onClick={() => setAberto(false)}>Cancelar</button>
        <button
          className="btn primario pequeno"
          onClick={async () => {
            await db.reportes.put({ id: uuid(), questaoId, motivo, texto: texto.trim(), criadoEm: Date.now(), enviado: 0 });
            setEnviado(true);
            void sincronizar();
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
