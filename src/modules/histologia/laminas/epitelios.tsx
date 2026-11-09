// Lâminas de epitélios e glândula (esquemas em SVG com aspecto de HE).
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, cunha, entre, grade, hexagono, poli, textura, type Rng } from '../he.tsx';

// ---------------------------------------------------------------------------------------------
export const PARTES_EPITELIO_CUBICO = ['epitelio-simples-cubico', 'lumen', 'membrana-basal', 'capilar'];
/** Túbulos renais em corte transversal: epitélio simples cúbico. */
export function LaminaEpitelioCubico(rng: Rng) {
  const tubulos: [number, number, number][] = [
    [190, 190, 92], [450, 160, 84], [720, 200, 96], [930, 120, 70], [300, 460, 96],
    [570, 440, 84], [840, 470, 92], [110, 610, 70], [460, 680, 80], [700, 680, 70],
  ];
  const capilares: [number, number, number][] = [[330, 300, 0.4], [600, 300, -0.3], [150, 380, 1.1], [760, 340, 0.2], [930, 330, 1.3], [420, 590, 0.1]];
  return (
    <>
      <rect width={W} height={H} fill={HE.colagenoClaro} />
      {textura(rng, 700, HE.citoplasmaEscuro)}
      <E id="capilar">
        {capilares.map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${(a * 180) / Math.PI})`}>
            <ellipse rx={34} ry={13} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={3} />
            <ellipse cx={-12} rx={8} ry={6} fill={HE.hemacia} />
            <ellipse cx={8} cy={2} rx={8} ry={6} fill={HE.hemacia} />
            <ellipse cx={30} cy={-12} rx={6} ry={3} fill={HE.nucleo} />
          </g>
        ))}
      </E>
      <E id="membrana-basal">
        {tubulos.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r + 3} fill="none" stroke="#c75b8e" strokeWidth={5} />
        ))}
      </E>
      <E id="epitelio-simples-cubico">
        {tubulos.map(([x, y, r], ti) => {
          const n = Math.max(8, Math.round((2 * Math.PI * r) / 46));
          const r0 = r * 0.5;
          return (
            <g key={ti}>
              {Array.from({ length: n }, (_, i) => {
                const a0 = (2 * Math.PI * i) / n;
                const a1 = (2 * Math.PI * (i + 1)) / n;
                const am = (a0 + a1) / 2 + entre(rng, -0.05, 0.05);
                const rn = r * 0.72;
                return (
                  <g key={i}>
                    <path d={cunha(x, y, r0, r, a0, a1)} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.4} />
                    <circle cx={x + Math.cos(am) * rn} cy={y + Math.sin(am) * rn} r={r * 0.11} fill={HE.nucleo} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </E>
      <E id="lumen">
        {tubulos.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r * 0.5 - 1} fill={HE.luz} />
        ))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
type Ponto = { x: number; y: number; nx: number; ny: number; tx: number; ty: number };

/** Contorno de uma vilosidade (dedo com topo arredondado): pontos com normal para dentro. */
function contornoVilo(cx: number, base: number, larg: number, alt: number, passo: number): Ponto[] {
  const r = larg / 2;
  const topo = base - alt + r;
  const pts: Ponto[] = [];
  for (let y = base; y > topo; y -= passo) pts.push({ x: cx - r, y, nx: 1, ny: 0, tx: 0, ty: -1 });
  const nArco = Math.round((Math.PI * r) / passo);
  for (let i = 0; i <= nArco; i++) {
    const a = Math.PI + (Math.PI * i) / nArco;
    const x = cx + Math.cos(a) * r;
    const y = topo + Math.sin(a) * r;
    pts.push({ x, y, nx: -Math.cos(a), ny: -Math.sin(a), tx: -Math.sin(a), ty: Math.cos(a) });
  }
  for (let y = topo + passo; y <= base; y += passo) pts.push({ x: cx + r, y, nx: -1, ny: 0, tx: 0, ty: 1 });
  return pts;
}

export const PARTES_EPITELIO_CILINDRICO = ['epitelio-simples-cilindrico', 'celula-caliciforme', 'borda-em-escova', 'lamina-propria', 'capilar', 'lumen'];
/** Vilosidades do intestino delgado: epitélio simples cilíndrico com borda em escova e células caliciformes. */
export function LaminaEpitelioCilindrico(rng: Rng) {
  const vilos = [
    { cx: 170, larg: 270, alt: 600 },
    { cx: 500, larg: 280, alt: 640 },
    { cx: 830, larg: 270, alt: 590 },
  ];
  const prof = 62; // altura do epitélio (≈ 2,5× a largura da célula); o eixo conjuntivo fica com ~1/2 da largura
  const passo = 24;
  const base = H + 20;
  const enterocitos: ReactElement[] = [];
  const caliciformes: ReactElement[] = [];
  const bordas: ReactElement[] = [];
  const propria: ReactElement[] = [];
  const capilares: ReactElement[] = [];
  const pontos = (ps: { x: number; y: number }[]) => ps.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L');
  vilos.forEach((v, vi) => {
    const pts = contornoVilo(v.cx, base, v.larg, v.alt, passo);
    // canto entre células vizinhas, com a normal média: as células se encaixam também na ponta arredondada
    const canto = (i: number) => {
      const a = pts[Math.max(0, Math.min(pts.length - 1, i))];
      if (i < 0) return { x: a.x - (a.tx * passo) / 2, y: a.y - (a.ty * passo) / 2, nx: a.nx, ny: a.ny };
      if (i >= pts.length - 1) return { x: a.x + (a.tx * passo) / 2, y: a.y + (a.ty * passo) / 2, nx: a.nx, ny: a.ny };
      const b = pts[i + 1];
      const nx = a.nx + b.nx;
      const ny = a.ny + b.ny;
      const n = Math.hypot(nx, ny) || 1;
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, nx: nx / n, ny: ny / n };
    };
    let borda: { x: number; y: number }[] = [];
    const fecharBorda = () => {
      if (borda.length > 1) bordas.push(<path key={`${vi}-${bordas.length}`} d={`M${pontos(borda)}`} fill="none" stroke="#c4467c" strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />);
      borda = [];
    };
    pts.forEach((p, i) => {
      const c0 = canto(i - 1);
      const c1 = canto(i);
      const quad: [number, number][] = [
        [c0.x, c0.y],
        [c1.x, c1.y],
        [c1.x + c1.nx * prof, c1.y + c1.ny * prof],
        [c0.x + c0.nx * prof, c0.y + c0.ny * prof],
      ];
      const ang = (Math.atan2(p.ny, p.nx) * 180) / Math.PI;
      // ponto em coordenadas da célula: u ao longo da superfície, v em profundidade
      const em = (u: number, w: number): [number, number] => [p.x + p.tx * u + p.nx * w, p.y + p.ty * u + p.ny * w];
      if ((i + vi) % 6 === 3) {
        // caliciforme: teca apical dilatada (muco pálido) dentro da célula, haste basal estreita com o núcleo
        const m = passo / 2 + 1;
        const h = passo * 0.22;
        const calice = [em(-m, 0), em(m, 0), em(m + 2, prof * 0.25), em(m - 1, prof * 0.5), em(h, prof * 0.68), em(h, prof), em(-h, prof), em(-h, prof * 0.68), em(-m + 1, prof * 0.5), em(-m - 2, prof * 0.25)];
        const [tx, ty] = em(0, prof * 0.3);
        const [kx, ky] = em(0, prof * 0.82);
        enterocitos.push(<path key={`${vi}-${i}`} d={poli(quad)} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1} />);
        caliciformes.push(
          <g key={`${vi}-${i}`}>
            <path d={poli(calice)} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
            <ellipse cx={tx} cy={ty} rx={prof * 0.27} ry={passo * 0.5} transform={`rotate(${ang} ${tx} ${ty})`} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.5} />
            <ellipse cx={kx} cy={ky} rx={6} ry={4} transform={`rotate(${ang} ${kx} ${ky})`} fill={HE.nucleoEscuro} />
          </g>,
        );
        // a borda em escova se interrompe sobre a caliciforme
        fecharBorda();
      } else {
        const [cxN, cyN] = em(0, prof * 0.66);
        enterocitos.push(
          <g key={`${vi}-${i}`}>
            <path d={poli(quad)} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
            <ellipse cx={cxN} cy={cyN} rx={5.5} ry={13} transform={`rotate(${ang + 90} ${cxN} ${cyN})`} fill={HE.nucleo} />
          </g>,
        );
        if (!borda.length) borda.push({ x: c0.x - c0.nx * 3, y: c0.y - c0.ny * 3 });
        borda.push({ x: c1.x - c1.nx * 3, y: c1.y - c1.ny * 3 });
      }
    });
    fecharBorda();

    // eixo da vilosidade: lâmina própria (conjuntivo frouxo)
    const ah = v.larg / 2 - prof; // meia-largura do eixo
    const topoEixo = base - (v.alt - prof) + ah; // centro do arco do eixo
    const noEixo = (x: number, y: number, m: number) => (y >= topoEixo ? Math.abs(x - v.cx) <= ah - m : Math.hypot(x - v.cx, y - topoEixo) <= ah - m);
    const interno = contornoVilo(v.cx, base, v.larg - 2 * prof + 4, v.alt - prof + 2, 18);
    propria.push(<path key={vi} d={poli(interno.map((p) => [p.x, p.y]))} fill={HE.colagenoClaro} />);
    // quilífero: vaso linfático central, de fundo cego, claro e sem hemácias
    const lq = 11;
    const topoQ = topoEixo + 18;
    propria.push(
      <g key={`q${vi}`}>
        <path d={`M${v.cx - lq},${base} L${v.cx - lq},${topoQ + lq} A${lq},${lq} 0 0 1 ${v.cx + lq},${topoQ + lq} L${v.cx + lq},${base} Z`} fill="#fdf9fb" stroke={HE.citoplasmaEscuro} strokeWidth={1.5} />
        {[0.15, 0.45, 0.75].map((f, k) => {
          const y = topoQ + 40 + f * (H - topoQ - 40);
          const x = v.cx + (k % 2 ? lq : -lq);
          return <ellipse key={k} cx={x} cy={y} rx={2} ry={7} fill={HE.nucleo} />;
        })}
      </g>,
    );
    // células do conjuntivo entre o quilífero e os capilares: linfócitos, fibroblastos e plasmócitos
    const usados: [number, number][] = [];
    const celulas: ReactElement[] = [];
    for (let k = 0; k < 700 && usados.length < 54; k++) {
      const x = v.cx + entre(rng, -ah, ah);
      const y = entre(rng, topoEixo - ah, H);
      if (!noEixo(x, y, 22) || (Math.abs(x - v.cx) < lq + 7 && y > topoQ - 8)) continue;
      if (usados.some(([ux, uy]) => Math.hypot(ux - x, uy - y) < 11)) continue;
      usados.push([x, y]);
      const tipo = rng();
      if (tipo < 0.5) celulas.push(<circle key={k} cx={x} cy={y} r={entre(rng, 3.4, 4.4)} fill={HE.nucleoEscuro} />);
      else if (tipo < 0.8) celulas.push(<ellipse key={k} cx={x} cy={y} rx={6.5} ry={2.2} transform={`rotate(${entre(rng, 50, 130)} ${x} ${y})`} fill={HE.nucleo} />);
      else
        celulas.push(
          <g key={k}>
            <ellipse cx={x} cy={y} rx={7} ry={5} fill="#c9a2d6" />
            <circle cx={x + 2.5} cy={y} r={3.2} fill={HE.nucleoEscuro} />
          </g>,
        );
    }
    propria.push(<g key={`c${vi}`}>{celulas}</g>);

    // capilares: rede logo abaixo do epitélio (perfis em alça com hemácias)
    const trilha = contornoVilo(v.cx, base, 2 * (ah - 11), v.alt - prof - 11, 9);
    for (let i = 0; i < trilha.length; ) {
      const n = Math.round(entre(rng, 7, 15));
      const trecho = trilha.slice(i, i + n);
      i += n + Math.round(entre(rng, 2, 4));
      if (trecho.length < 3) continue;
      const d = `M${pontos(trecho)}`;
      capilares.push(
        <g key={`${vi}-${i}`}>
          <path d={d} fill="none" stroke={HE.citoplasmaEscuro} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke={HE.luz} strokeWidth={11.5} strokeLinecap="round" strokeLinejoin="round" />
          {trecho.map((p, k) =>
            k % 3 === 1 && rng() < 0.85 ? (
              <ellipse key={k} cx={p.x} cy={p.y} rx={5.2} ry={4} transform={`rotate(${(Math.atan2(p.ty, p.tx) * 180) / Math.PI} ${p.x} ${p.y})`} fill={HE.hemacia} />
            ) : null,
          )}
        </g>,
      );
    }
  });
  return (
    <>
      <E id="lumen">
        <rect width={W} height={H} fill={HE.luz} />
        {textura(rng, 120, HE.citoplasmaClaro)}
      </E>
      <E id="lamina-propria">{propria}</E>
      <E id="capilar">{capilares}</E>
      <E id="epitelio-simples-cilindrico">{enterocitos}</E>
      <E id="celula-caliciforme">{caliciformes}</E>
      <E id="borda-em-escova">{bordas}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_PSEUDOESTRATIFICADO = ['epitelio-pseudoestratificado', 'cilios', 'celula-caliciforme', 'celula-basal', 'membrana-basal', 'lamina-propria', 'lumen'];
/** Mucosa da traqueia: epitélio pseudoestratificado cilíndrico ciliado com células caliciformes. */
export function LaminaPseudoestratificado(rng: Rng) {
  const yApice = 200;
  const yBase = 380;
  const larg = 30;
  const colunares: ReactElement[] = [];
  const caliciformes: ReactElement[] = [];
  const basais: ReactElement[] = [];
  const cilios: ReactElement[] = [];
  for (let i = 0, x = 0; x < W; i++, x += larg) {
    const ond = Math.sin(x / 90) * 6;
    const topo = yApice + ond;
    if (i % 7 === 4) {
      caliciformes.push(
        <g key={i}>
          <path d={`M${x + 2},${topo} L${x + larg - 2},${topo} L${x + larg - 8},${yBase} L${x + 8},${yBase} Z`} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
          <ellipse cx={x + larg / 2} cy={topo + 55} rx={13} ry={48} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.5} />
          <ellipse cx={x + larg / 2} cy={yBase - 50} rx={6} ry={9} fill={HE.nucleoEscuro} />
        </g>,
      );
      continue;
    }
    // núcleos em alturas variadas: o aspecto "estratificado" falso
    const yN = entre(rng, topo + 80, yBase - 40);
    colunares.push(
      <g key={i}>
        <path d={`M${x + 1},${topo} L${x + larg - 1},${topo} L${x + larg - 7},${yBase} L${x + 7},${yBase} Z`} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
        <ellipse cx={x + larg / 2} cy={yN} rx={7} ry={15} fill={HE.nucleo} />
      </g>,
    );
    cilios.push(
      <g key={i}>
        {Array.from({ length: 7 }, (_, k) => (
          <line key={k} x1={x + 3 + k * 4} y1={topo} x2={x + 3 + k * 4 + entre(rng, -2, 2)} y2={topo - entre(rng, 16, 22)} stroke="#c4467c" strokeWidth={1.4} />
        ))}
      </g>,
    );
    if (i % 2 === 0) {
      basais.push(
        <g key={i}>
          <path d={`M${x + larg - 12},${yBase} L${x + larg + 12},${yBase} L${x + larg},${yBase - 48} Z`} fill={HE.citoplasmaEscuro} stroke={HE.nucleoClaro} strokeWidth={1} />
          <circle cx={x + larg} cy={yBase - 15} r={7.5} fill={HE.nucleoEscuro} />
        </g>,
      );
    }
  }
  return (
    <>
      <E id="lumen">
        <rect width={W} height={yApice - 25} fill={HE.luz} />
      </E>
      <E id="lamina-propria">
        <rect y={yBase + 14} width={W} height={H - yBase} fill={HE.colagenoClaro} />
        {textura(rng, 300, HE.citoplasmaEscuro, [0, yBase + 20, W, H])}
        <Deco>
          {Array.from({ length: 40 }, (_, k) => {
            // inclinação em torno do próprio centro (girar em torno da origem tirava os núcleos do lugar)
            const x = entre(rng, 0, W);
            const y = entre(rng, yBase + 40, H);
            return <ellipse key={k} cx={x} cy={y} rx={8} ry={3.5} transform={`rotate(${entre(rng, -30, 30)} ${x} ${y})`} fill={HE.nucleo} opacity={0.85} />;
          })}
          {/* vasos da lâmina própria (vênulas e capilares com hemácias) */}
          {([[170, 480, 15], [430, 455, 10], [650, 520, 17], [880, 470, 11], [300, 620, 13], [780, 640, 14]] as const).map(([x, y, r], k) => (
            <g key={`v${k}`}>
              <circle cx={x} cy={y} r={r} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={r > 12 ? 3.5 : 2.5} />
              <ellipse cx={x - r * 0.3} cy={y - r * 0.15} rx={5} ry={4} fill={HE.hemacia} />
              {r > 12 && <ellipse cx={x + r * 0.35} cy={y + r * 0.2} rx={5} ry={4} fill={HE.hemacia} />}
              <ellipse cx={x + r * 0.9} cy={y - r * 0.45} rx={5} ry={1.8} transform={`rotate(-60 ${x + r * 0.9} ${y - r * 0.45})`} fill={HE.nucleo} />
            </g>
          ))}
        </Deco>
      </E>
      <E id="membrana-basal">
        <rect y={yBase} width={W} height={14} fill="#e68ab2" />
      </E>
      <E id="epitelio-pseudoestratificado">
        {/* citoplasma contínuo: as células se encostam, sem vãos */}
        <path d={`M0,${yApice} ${Array.from({ length: 51 }, (_, k) => `L${k * 20},${yApice + Math.sin((k * 20) / 90) * 6}`).join(' ')} L${W},${yBase} L0,${yBase} Z`} fill={HE.citoplasmaClaro} />
        {colunares}
      </E>
      <E id="celula-basal">{basais}</E>
      <E id="celula-caliciforme">{caliciformes}</E>
      <E id="cilios">{cilios}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_EPIDERME = ['estrato-basal', 'estrato-espinhoso', 'estrato-granuloso', 'estrato-lucido', 'estrato-corneo', 'papila-dermica', 'derme-reticular'];
/** Pele espessa (palma/planta): epitélio estratificado pavimentoso queratinizado e seus estratos. */
export function LaminaEpiderme(rng: Rng) {
  // junção dermoepidérmica: papilas dérmicas altas, estreitas e numerosas alternando com cristas epidérmicas
  // profundas (perfil não senoidal, lados íngremes). A crista fica mais larga que a papila para caber, além da
  // camada basal dos dois lados, um miolo de células espinhosas, como na lâmina real.
  const PER = 172;
  const AMP = 92;
  const BASE = 482;
  const CRISTA = 0.6;
  const juncao = (x: number) => {
    const f = ((((x + 40) / PER) % 1) + 1) % 1;
    const s = f < CRISTA ? Math.sin((Math.PI * f) / CRISTA) : -Math.sin((Math.PI * (f - CRISTA)) / (1 - CRISTA));
    // fundo da crista largo e arredondado; ponta da papila em dedo
    return s > 0 ? BASE + AMP * Math.pow(s, 0.55) : BASE - AMP * Math.pow(-s, 0.9);
  };
  const topoEspinhoso = 250;
  const yLucido = topoEspinhoso - 52;
  const yDerme = 615;
  const curva: [number, number][] = [];
  for (let x = 0; x <= W; x += 2) curva.push([x, juncao(x)]);
  const distJuncao = (x: number, y: number) => {
    let m = Infinity;
    for (const [cx, cy] of curva) if (Math.abs(cx - x) < 60) m = Math.min(m, Math.hypot(cx - x, cy - y));
    return m;
  };

  // estrato basal: uma fileira de células cilíndricas apoiadas na junção, distribuídas pelo comprimento da curva
  const basais: ReactElement[] = [];
  let acumulado = 9;
  for (let i = 1; i < curva.length; i++) {
    const [x0, y0] = curva[i - 1];
    const [x1, y1] = curva[i];
    const seg = Math.hypot(x1 - x0, y1 - y0);
    acumulado += seg;
    if (acumulado < 17) continue;
    acumulado = 0;
    const tx = (x1 - x0) / seg;
    const ty = (y1 - y0) / seg;
    const cx = x1 + ty * 14; // normal (ty, −tx) aponta para a epiderme
    const cy = y1 - tx * 14;
    basais.push(
      <g key={i} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${((Math.atan2(ty, tx) * 180) / Math.PI).toFixed(1)})`}>
        <rect x={-9} y={-14} width={18} height={28} rx={3} fill={HE.citoplasmaEscuro} stroke={HE.nucleoClaro} strokeWidth={0.8} />
        <ellipse rx={6} ry={10} fill={HE.nucleoEscuro} />
      </g>,
    );
  }
  // estrato espinhoso: células poligonais que se achatam progressivamente perto do granuloso
  const espinhosas = grade(rng, 30, [0, topoEspinhoso, W, BASE + AMP]).filter(([x, y]) => y > topoEspinhoso + 8 && y < juncao(x) && distJuncao(x, y) > 38);
  // estrato granuloso: 3 fileiras de células achatadas com grânulos de querato-hialina; a de cima já sem núcleo
  const granulosas: ReactElement[] = [];
  for (let fila = 0; fila < 3; fila++) {
    const y = topoEspinhoso - 10 - fila * 14;
    const graos: string[] = [];
    for (let x = (fila % 2) * 20; x < W + 20; x += 40) {
      granulosas.push(
        <g key={`${fila}-${x}`}>
          <ellipse cx={x} cy={y} rx={21} ry={7} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
          {fila < 2 && <ellipse cx={x} cy={y} rx={6} ry={3} fill={HE.nucleo} />}
        </g>,
      );
      for (let k = 0; k < 7; k++) {
        const gx = x + entre(rng, -16, 16);
        const gy = y + entre(rng, -3.5, 3.5);
        graos.push(`M${(gx - 1.8).toFixed(1)},${gy.toFixed(1)}a1.8,1.8 0 1,0 3.6,0a1.8,1.8 0 1,0 -3.6,0`);
      }
    }
    granulosas.push(<path key={`g${fila}`} d={graos.join('')} fill={HE.nucleoEscuro} />);
  }
  // alças capilares no topo das papilas dérmicas
  const alcas: ReactElement[] = [];
  for (let x = PER * (CRISTA + (1 - CRISTA) / 2) - 40; x < W; x += PER) {
    const y = juncao(x) + 30;
    alcas.push(
      <g key={x}>
        <ellipse cx={x} cy={y} rx={9} ry={16} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={2} />
        <ellipse cx={x} cy={y - 5} rx={5} ry={4} fill={HE.hemacia} />
        <ellipse cx={x} cy={y + 6} rx={5} ry={4} fill={HE.hemacia} />
      </g>,
    );
  }
  return (
    <>
      <rect width={W} height={H} fill={HE.vidro} />
      <E id="derme-reticular">
        <rect y={yDerme} width={W} height={H - yDerme} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 24 }, (_, k) => {
            const y = entre(rng, yDerme + 10, H);
            return <path key={k} d={`M${entre(rng, -50, W)},${y} q 60,${entre(rng, -14, 14)} 140,0 t 140,0`} stroke="#d77aa3" strokeWidth={entre(rng, 5, 10)} fill="none" opacity={0.8} />;
          })}
          {Array.from({ length: 12 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, yDerme + 10, H)} rx={9} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="papila-dermica">
        <path d={poli([...curva, [W, yDerme + 2], [0, yDerme + 2]])} fill={HE.colagenoClaro} />
        {textura(rng, 260, HE.citoplasmaEscuro, [0, BASE - AMP, W, yDerme])}
        {alcas}
      </E>
      <E id="estrato-espinhoso">
        <path d={poli([[0, topoEspinhoso - 4], [W, topoEspinhoso - 4], ...[...curva].reverse()])} fill={HE.citoplasmaClaro} />
        {espinhosas.map(([x, y], i) => {
          const k = Math.min(1, Math.max(0, (y - topoEspinhoso) / 90));
          const fy = 0.6 + 0.4 * k;
          const fx = 1.12 - 0.12 * k;
          const pts = hexagono(rng, x, y, 16.5).map(([px, py]) => [x + (px - x) * fx, y + (py - y) * fy] as [number, number]);
          return (
            <g key={i}>
              <path d={poli(pts)} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.2} strokeDasharray="2 2" />
              <ellipse cx={x} cy={y} rx={6.5 * fx} ry={6.5 * fy} fill={HE.nucleo} />
            </g>
          );
        })}
      </E>
      <E id="estrato-basal">{basais}</E>
      <E id="estrato-granuloso">
        {/* fundo contínuo: sem faixas brancas entre o lúcido, o granuloso e o espinhoso */}
        <rect y={yLucido + 2} width={W} height={topoEspinhoso - yLucido + 2} fill={HE.citoplasma} />
        {granulosas}
      </E>
      <E id="estrato-lucido">
        <rect y={yLucido - 14} width={W} height={18} fill="#f6d4e3" />
      </E>
      <E id="estrato-corneo">
        {/* espesso na pele espessa: quase da espessura do espinhoso */}
        <rect y={24} width={W} height={yLucido - 38} fill="#f0a7c4" />
        {Array.from({ length: 20 }, (_, k) => {
          const y = 34 + k * ((yLucido - 52) / 20);
          return <path key={k} d={`M0,${y} C 200,${y + entre(rng, -6, 6)} 400,${y + entre(rng, -6, 6)} 600,${y} S 900,${y + entre(rng, -5, 5)} ${W},${y}`} stroke="#d7709e" strokeWidth={1.6} fill="none" />;
        })}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_TRANSICAO = ['epitelio-de-transicao', 'celula-em-guarda-chuva', 'celula-basal', 'lamina-propria', 'lumen'];
/** Bexiga urinária (vazia): epitélio de transição (urotélio) com células em guarda-chuva. */
export function LaminaTransicao(rng: Rng) {
  const yTopo = 180;
  const yBase = 420;
  const guarda: ReactElement[] = [];
  for (let x = 0, i = 0; x < W + 80; x += 82, i++) {
    const binuc = i % 3 === 1;
    // face basal levemente convexa, encaixada direto na fileira de células de baixo
    guarda.push(
      <g key={i}>
        <path d={`M${x},${yTopo + 64} L${x},${yTopo + 22} Q${x + 41},${yTopo - 16} ${x + 82},${yTopo + 22} L${x + 82},${yTopo + 64} Q${x + 41},${yTopo + 74} ${x},${yTopo + 64} Z`} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.4} />
        <circle cx={x + (binuc ? 28 : 41)} cy={yTopo + 36} r={9} fill={HE.nucleo} />
        {binuc && <circle cx={x + 54} cy={yTopo + 36} r={9} fill={HE.nucleo} />}
      </g>,
    );
  }
  // camadas intermediárias compactas (grade cerrada, pouca irregularidade): o urotélio é coeso
  const intermediarias = grade(rng, 36, [0, yTopo + 88, W, yBase - 40], 0.1).filter(([, y]) => y > yTopo + 80 && y < yBase - 44);
  const basais: ReactElement[] = [];
  for (let x = 0; x < W; x += 24) {
    basais.push(
      <g key={x}>
        <rect x={x + 1} y={yBase - 30} width={22} height={30} rx={3} fill={HE.citoplasmaEscuro} stroke={HE.nucleoClaro} strokeWidth={0.8} />
        <ellipse cx={x + 12} cy={yBase - 15} rx={6} ry={8} fill={HE.nucleoEscuro} />
      </g>,
    );
  }
  return (
    <>
      <E id="lumen">
        <rect width={W} height={yTopo + 10} fill={HE.luz} />
      </E>
      <E id="lamina-propria">
        <rect y={yBase} width={W} height={H - yBase} fill={HE.colagenoClaro} />
        {textura(rng, 260, HE.citoplasmaEscuro, [0, yBase, W, H])}
        <Deco>
          {Array.from({ length: 30 }, (_, k) => {
            const x = entre(rng, 0, W);
            const y = entre(rng, yBase + 20, H);
            return <ellipse key={k} cx={x} cy={y} rx={9} ry={3} transform={`rotate(${entre(rng, -20, 20)} ${x} ${y})`} fill={HE.nucleo} />;
          })}
        </Deco>
      </E>
      <E id="epitelio-de-transicao">
        {/* citoplasma contínuo em toda a espessura do epitélio: sem vãos entre as células */}
        <rect y={yTopo + 24} width={W} height={yBase - yTopo - 24} fill={HE.citoplasmaClaro} />
        {intermediarias.map(([x, y], i) => (
          <g key={i}>
            <path d={poli(hexagono(rng, x, y, 20.5))} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={1.2} />
            <circle cx={x} cy={y} r={8} fill={HE.nucleo} />
          </g>
        ))}
      </E>
      <E id="celula-basal">{basais}</E>
      <E id="celula-em-guarda-chuva">{guarda}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_GLANDULA = ['acino-seroso', 'acino-mucoso', 'meia-lua-serosa', 'ducto-estriado', 'septo-conjuntivo'];
/** Glândula submandibular (mista): ácinos serosos, mucosos com meias-luas serosas e ductos estriados. */
export function LaminaGlandula(rng: Rng) {
  const cor = { basal: '#a986c8', basalBorda: '#9068b0', apical: HE.citoplasmaEscuro, borda: '#b45a86', zimogenio: '#c2457a' };
  // septo interlobular: o conjuntivo fica nos septos; dentro do lóbulo os ácinos se tocam
  const septoX = (y: number) => 470 + 40 * Math.sin(y / 150) + y * 0.12;
  const septoL = (y: number) => 34 + 6 * Math.sin(y / 90);
  const yy = Array.from({ length: 37 }, (_, k) => -10 + k * 20);
  const septo = poli([...yy.map((y): [number, number] => [septoX(y) - septoL(y), y]), ...[...yy].reverse().map((y): [number, number] => [septoX(y) + septoL(y), y])]);
  const centros = grade(rng, 66, [20, 20, W - 20, H - 20], 0.16).filter(([x, y]) => Math.abs(x - septoX(y)) > septoL(y) + 20);
  const ductos: [number, number][] = [[250, 330], [760, 180], [700, 560]];
  const serosos: [number, number][] = [];
  const mucosos: [number, number][] = [];
  centros.forEach(([x, y], i) => {
    if (ductos.some(([dx, dy]) => Math.hypot(dx - x, dy - y) < 66)) return;
    // predominam os ácinos serosos (submandibular humana); ~1 em 5 unidades é mucosa
    (i % 5 === 1 ? mucosos : serosos).push([x, y]);
  });
  const raios = (cx: number, cy: number, n: number, r0: number, r1: number, giro = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = (2 * Math.PI * i) / n + giro;
      return `M${(cx + Math.cos(a) * r0).toFixed(1)},${(cy + Math.sin(a) * r0).toFixed(1)}L${(cx + Math.cos(a) * r1).toFixed(1)},${(cy + Math.sin(a) * r1).toFixed(1)}`;
    }).join('');
  const pontos = (cx: number, cy: number, n: number, ra: number, rb: number, r: number) =>
    Array.from({ length: n }, () => {
      const a = entre(rng, 0, Math.PI * 2);
      const d = entre(rng, ra, rb);
      const px = cx + Math.cos(a) * d;
      const py = cy + Math.sin(a) * d;
      return `M${(px - r).toFixed(1)},${py.toFixed(1)}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`;
    }).join('');
  // ácino seroso: base basófila (lilás, RE granular) e ápice eosinófilo com grânulos de zimogênio; luz mínima
  const acinoSeroso = (cx: number, cy: number, r: number, k: number) => {
    const n = 7;
    const giro = entre(rng, 0, 1);
    return (
      <g key={k}>
        <circle cx={cx} cy={cy} r={r} fill={cor.basal} stroke={cor.basalBorda} strokeWidth={1} />
        <circle cx={cx} cy={cy} r={r * 0.64} fill={cor.apical} />
        <path d={pontos(cx, cy, 12, r * 0.15, r * 0.56, 1.5)} fill={cor.zimogenio} />
        <path d={raios(cx, cy, n, 3, r, giro)} stroke={cor.borda} strokeWidth={1} />
        {Array.from({ length: n }, (_, i) => {
          const am = (2 * Math.PI * (i + 0.5)) / n + giro;
          return <circle key={i} cx={cx + Math.cos(am) * r * 0.74} cy={cy + Math.sin(am) * r * 0.74} r={5.2} fill={HE.nucleoEscuro} />;
        })}
        <circle cx={cx} cy={cy} r={2.5} fill={HE.luz} />
      </g>
    );
  };
  return (
    <>
      <rect width={W} height={H} fill={HE.colagenoClaro} />
      <E id="septo-conjuntivo">
        <path d={septo} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 16 }, (_, k) => {
            const y = entre(rng, 10, 690);
            return <ellipse key={k} cx={septoX(y) + entre(rng, -septoL(y) + 10, septoL(y) - 10)} cy={y} rx={8} ry={3} fill={HE.nucleo} />;
          })}
        </Deco>
      </E>
      <E id="acino-seroso">{serosos.map(([x, y], i) => acinoSeroso(x, y, entre(rng, 30, 34), i))}</E>
      <E id="meia-lua-serosa">
        {mucosos.map(([x, y], i) => {
          if (i % 2) return null;
          const a0 = -2.2;
          return (
            <g key={i}>
              {Array.from({ length: 3 }, (_, k) => (
                <path key={k} d={cunha(x, y, 40, 54, a0 + k * 0.55, a0 + (k + 1) * 0.55)} fill={cor.apical} stroke={cor.borda} strokeWidth={1} />
              ))}
              {/* base basófila das células serosas da meia-lua (voltada para fora) */}
              <path d={cunha(x, y, 48.5, 54, a0, a0 + 1.65)} fill={cor.basal} />
              {Array.from({ length: 3 }, (_, k) => (
                <circle key={k} cx={x + Math.cos(a0 + 0.27 + k * 0.55) * 49} cy={y + Math.sin(a0 + 0.27 + k * 0.55) * 49} r={4.5} fill={HE.nucleoEscuro} />
              ))}
            </g>
          );
        })}
      </E>
      <E id="acino-mucoso">
        {mucosos.map(([x, y], i) => {
          const n = 9;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={40} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.2} />
              <path d={raios(x, y, n, 8, 40)} stroke="#b9acd3" strokeWidth={1.2} />
              <circle cx={x} cy={y} r={6} fill={HE.luz} stroke="#b9acd3" strokeWidth={1} />
              {Array.from({ length: n }, (_, k) => {
                const am = (2 * Math.PI * (k + 0.5)) / n;
                const nx = x + Math.cos(am) * 36;
                const ny = y + Math.sin(am) * 36;
                return <ellipse key={k} cx={nx} cy={ny} rx={7} ry={2.6} transform={`rotate(${(am * 180) / Math.PI + 90} ${nx} ${ny})`} fill={HE.nucleoEscuro} />;
              })}
            </g>
          );
        })}
      </E>
      <E id="ducto-estriado">
        {ductos.map(([x, y], i) => {
          const n = 12;
          // estriações basais: invaginações da membrana plasmática basal com mitocôndrias (uma linha por traço)
          const estrias = Array.from({ length: n }, (_, k) =>
            [0.3, 0.5, 0.7]
              .map((f) => {
                const a = (2 * Math.PI * (k + f)) / n;
                return `M${(x + Math.cos(a) * 38).toFixed(1)},${(y + Math.sin(a) * 38).toFixed(1)}L${(x + Math.cos(a) * 45).toFixed(1)},${(y + Math.sin(a) * 45).toFixed(1)}`;
              })
              .join(''),
          ).join('');
          return (
            <g key={i}>
              {/* bainha fina de conjuntivo em volta do ducto */}
              <Deco>
                <circle cx={x} cy={y} r={52} fill={HE.colagenoClaro} />
              </Deco>
              {Array.from({ length: n }, (_, k) => {
                const a0 = (2 * Math.PI * k) / n;
                const a1 = (2 * Math.PI * (k + 1)) / n;
                const am = (a0 + a1) / 2;
                return (
                  <g key={k}>
                    <path d={cunha(x, y, 20, 46, a0, a1)} fill="#e16f9e" stroke={cor.borda} strokeWidth={1} />
                    <circle cx={x + Math.cos(am) * 31} cy={y + Math.sin(am) * 31} r={5} fill={HE.nucleo} />
                  </g>
                );
              })}
              <path d={estrias} stroke="#a3416f" strokeWidth={1.2} />
              <circle cx={x} cy={y} r={19} fill={HE.luz} />
            </g>
          );
        })}
      </E>
    </>
  );
}
