import { Link, Navigate, useParams } from 'react-router-dom';
import { Markdown } from '../ui/comum.tsx';
import termos from '../../docs/legal/termos-de-uso.md?raw';
import privacidade from '../../docs/legal/politica-de-privacidade.md?raw';
import { Icone } from '../ui/Icone.tsx';

const DOCS: Record<string, string> = { termos, privacidade };

export function LegalTela() {
  const { doc = '' } = useParams();
  const texto = DOCS[doc];
  if (!texto) return <Navigate to="/" replace />;
  return (
    <div className="app sem-nav">
      <main className="conteudo" style={{ maxWidth: 720 }}>
        <button className="btn fantasma pequeno" onClick={() => history.back()}><Icone nome="seta-esquerda" tamanho={14} /> Voltar</button>
        <div className="card" style={{ marginTop: 12 }}>
          <Markdown texto={texto} />
        </div>
        <p className="muted pequeno centro">
          <Link to="/legal/termos">Termos de uso</Link> · <Link to="/legal/privacidade">Política de privacidade</Link>
        </p>
      </main>
    </div>
  );
}
