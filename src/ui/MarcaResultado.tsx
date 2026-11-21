// Certo/errado que não depende só da cor (WCAG 1.4.1): o visto e o X têm formas diferentes, e o leitor de tela
// ouve o texto. Usado onde a resposta é revelada nas alternativas, nas listas de ordenar e nas associações.
import { Icone } from './Icone.tsx';

export function MarcaResultado({ certo, texto }: { certo: boolean; texto?: string }) {
  return (
    <span className={`marca-resultado ${certo ? 'certo' : 'errado'}`}>
      <Icone nome={certo ? 'visto' : 'fechar'} tamanho={16} />
      <span className="so-leitor">{texto ?? (certo ? 'certo' : 'errado')}</span>
    </span>
  );
}
