import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { prepararArmazenamento } from './data/armazenamento.ts';

// O armazenamento precisa estar decidido antes de qualquer acesso ao banco local.
void prepararArmazenamento().then(async () => {
  const { App } = await import('./App.tsx');
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
