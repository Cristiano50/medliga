export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }} role="status" aria-live="polite">
      <div className="centro muted">
        <img src="./icons/icon.svg" alt="" width={56} height={56} style={{ opacity: 0.9 }} />
        <p style={{ marginTop: 12 }}>{texto}</p>
      </div>
    </div>
  );
}
