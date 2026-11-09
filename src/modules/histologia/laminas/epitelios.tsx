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
    { cx: 190, larg: 210, alt: 600 },
    { cx: 500, larg: 230, alt: 640 },
    { cx: 810, larg: 210, alt: 590 },
  ];
  const prof = 92;
  const passo = 24;
  const enterocitos: ReactElement[] = [];
  const caliciformes: ReactElement[] = [];
  const bordas: ReactElement[] = [];
  const propria: ReactElement[] = [];
  const capilares: ReactElement[] = [];
  vilos.forEach((v, vi) => {
    const pts = contornoVilo(v.cx, H + 20, v.larg, v.alt, passo);
    pts.forEach((p, i) => {
      const meio = passo / 2 + 1;
      const quad: [number, number][] = [
        [p.x - p.tx * meio, p.y - p.ty * meio],
        [p.x + p.tx * meio, p.y + p.ty * meio],
        [p.x + p.tx * meio + p.nx * prof, p.y + p.ty * meio + p.ny * prof],
        [p.x - p.tx * meio + p.nx * prof, p.y - p.ty * meio + p.ny * prof],
      ];
      const caliciforme = (i + vi) % 6 === 3;
      if (caliciforme) {
        caliciformes.push(
          <g key={`${vi}-${i}`}>
            <path d={poli(quad)} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
            <ellipse cx={p.x + p.nx * prof * 0.32} cy={p.y + p.ny * prof * 0.32} rx={passo * 0.62} ry={prof * 0.3} transform={`rotate(${(Math.atan2(p.ny, p.nx) * 180) / Math.PI} ${p.x + p.nx * prof * 0.32} ${p.y + p.ny * prof * 0.32})`} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.5} />
            <ellipse cx={p.x + p.nx * prof * 0.82} cy={p.y + p.ny * prof * 0.82} rx={7} ry={5} fill={HE.nucleoEscuro} />
          </g>,
        );
      } else {
        const cxN = p.x + p.nx * prof * 0.68;
        const cyN = p.y + p.ny * prof * 0.68;
        enterocitos.push(
          <g key={`${vi}-${i}`}>
            <path d={poli(quad)} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1} />
            <ellipse cx={cxN} cy={cyN} rx={5.5} ry={15} transform={`rotate(${(Math.atan2(p.ny, p.nx) * 180) / Math.PI + 90} ${cxN} ${cyN})`} fill={HE.nucleo} />
          </g>,
        );
      }
    });
    bordas.push(<polyline key={vi} points={pts.map((p) => `${p.x - p.nx * 3},${p.y - p.ny * 3}`).join(' ')} fill="none" stroke="#c4467c" strokeWidth={6} strokeLinejoin="round" />);
    const interno = contornoVilo(v.cx, H + 20, v.larg - 2 * prof, v.alt - prof, 18);
    propria.push(<path key={vi} d={poli(interno.map((p) => [p.x, p.y]))} fill={HE.colagenoClaro} />);
    propria.push(
      <g key={`n${vi}`}>
        {Array.from({ length: 18 }, (_, k) => (
          <circle key={k} cx={v.cx + entre(rng, -(v.larg / 2 - prof - 12), v.larg / 2 - prof - 12)} cy={entre(rng, H - v.alt + prof + 40, H)} r={entre(rng, 3, 5)} fill={HE.nucleo} />
        ))}
      </g>,
    );
    capilares.push(
      <g key={vi}>
        <rect x={v.cx - 9} y={H - v.alt + prof + 60} width={18} height={v.alt - prof - 40} rx={9} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={2} />
        {Array.from({ length: 6 }, (_, k) => (
          <ellipse key={k} cx={v.cx} cy={H - v.alt + prof + 90 + k * 70} rx={6} ry={5} fill={HE.hemacia} />
        ))}
      </g>,
    );
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
          <path d={`M${x + larg - 9},${yBase} L${x + larg + 9},${yBase} L${x + larg},${yBase - 42} Z`} fill={HE.citoplasmaEscuro} stroke={HE.nucleoClaro} strokeWidth={1} />
          <circle cx={x + larg} cy={yBase - 14} r={7} fill={HE.nucleoEscuro} />
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
          {Array.from({ length: 40 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, yBase + 40, H)} rx={8} ry={3.5} transform={`rotate(${entre(rng, -30, 30)})`} fill={HE.nucleo} opacity={0.85} />
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
  const juncao = (x: number) => 500 + 48 * Math.sin(x / 62);
  const topoEspinhoso = 250;
  const curva = (dy: number, passo = 10) => {
    const pts: [number, number][] = [];
    for (let x = 0; x <= W; x += passo) pts.push([x, juncao(x) + dy]);
    return pts;
  };
  const basais: ReactElement[] = [];
  for (let x = 6; x < W; x += 18) {
    const y = juncao(x);
    const ang = (Math.atan2(48 * Math.cos(x / 62) / 62, 1) * 180) / Math.PI;
    basais.push(
      <g key={x} transform={`translate(${x} ${y - 14}) rotate(${ang})`}>
        <rect x={-9} y={-14} width={18} height={28} rx={3} fill={HE.citoplasmaEscuro} stroke={HE.nucleoClaro} strokeWidth={0.8} />
        <ellipse rx={6} ry={10} fill={HE.nucleoEscuro} />
      </g>,
    );
  }
  const espinhosas = grade(rng, 30, [0, topoEspinhoso, W, 560]).filter(([x, y]) => y > topoEspinhoso + 8 && y < juncao(x) - 34);
  const granulosas: ReactElement[] = [];
  for (let fila = 0; fila < 3; fila++) {
    for (let x = (fila % 2) * 20; x < W; x += 40) {
      const y = topoEspinhoso - 10 - fila * 14;
      granulosas.push(
        <g key={`${fila}-${x}`}>
          <ellipse cx={x} cy={y} rx={20} ry={6.5} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={0.8} />
          {Array.from({ length: 6 }, (_, k) => (
            <circle key={k} cx={x + entre(rng, -15, 15)} cy={y + entre(rng, -3, 3)} r={1.8} fill={HE.nucleoEscuro} />
          ))}
          {fila < 2 && <ellipse cx={x} cy={y} rx={6} ry={3} fill={HE.nucleo} />}
        </g>,
      );
    }
  }
  const yLucido = topoEspinhoso - 52;
  return (
    <>
      <rect width={W} height={H} fill={HE.vidro} />
      <E id="derme-reticular">
        <rect y={600} width={W} height={H - 600} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 30 }, (_, k) => {
            const y = entre(rng, 610, H);
            return <path key={k} d={`M${entre(rng, -50, W)},${y} q 60,${entre(rng, -14, 14)} 140,0 t 140,0`} stroke="#d77aa3" strokeWidth={entre(rng, 5, 10)} fill="none" opacity={0.8} />;
          })}
          {Array.from({ length: 14 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, 615, H)} rx={9} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="papila-dermica">
        <path d={poli([...curva(0, 10), [W, 600], [0, 600]])} fill={HE.colagenoClaro} />
        {textura(rng, 220, HE.citoplasmaEscuro, [0, 450, W, 600])}
      </E>
      <E id="estrato-espinhoso">
        <path d={poli([[0, topoEspinhoso], [W, topoEspinhoso], ...curva(-28).reverse()])} fill={HE.citoplasmaClaro} />
        {espinhosas.map(([x, y], i) => (
          <g key={i}>
            <path d={poli(hexagono(rng, x, y, 16.5))} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.2} strokeDasharray="2 2" />
            <circle cx={x} cy={y} r={6.5} fill={HE.nucleo} />
          </g>
        ))}
      </E>
      <E id="estrato-basal">{basais}</E>
      <E id="estrato-granuloso">{granulosas}</E>
      <E id="estrato-lucido">
        <rect y={yLucido - 14} width={W} height={18} fill="#f6d4e3" />
      </E>
      <E id="estrato-corneo">
        <rect y={60} width={W} height={yLucido - 74} fill="#f0a7c4" />
        {Array.from({ length: 16 }, (_, k) => {
          const y = 72 + k * ((yLucido - 90) / 16);
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
    guarda.push(
      <g key={i}>
        <path d={`M${x},${yTopo + 64} L${x},${yTopo + 22} Q${x + 41},${yTopo - 16} ${x + 82},${yTopo + 22} L${x + 82},${yTopo + 64} Q${x + 41},${yTopo + 48} ${x},${yTopo + 64} Z`} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.4} />
        <circle cx={x + (binuc ? 28 : 41)} cy={yTopo + 34} r={9} fill={HE.nucleo} />
        {binuc && <circle cx={x + 54} cy={yTopo + 34} r={9} fill={HE.nucleo} />}
      </g>,
    );
  }
  const intermediarias = grade(rng, 38, [0, yTopo + 70, W, yBase - 40]).filter(([, y]) => y > yTopo + 76 && y < yBase - 38);
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
          {Array.from({ length: 30 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, yBase + 20, H)} rx={9} ry={3} transform={`rotate(${entre(rng, -20, 20)})`} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="epitelio-de-transicao">
        {intermediarias.map(([x, y], i) => (
          <g key={i}>
            <path d={poli(hexagono(rng, x, y, 21))} fill={HE.citoplasmaClaro} stroke={HE.citoplasmaEscuro} strokeWidth={1.2} />
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
  const serosos = grade(rng, 78, [30, 30, W - 30, H - 30], 0.22).filter(([x]) => !(x > 430 && x < 560));
  const mucosos: [number, number][] = [];
  const ductos: [number, number][] = [[250, 330], [760, 180], [700, 560]];
  // separa alguns ácinos para serem mucosos e abre espaço para os ductos
  const usados = new Set<number>();
  serosos.forEach(([x, y], i) => {
    if (ductos.some(([dx, dy]) => Math.hypot(dx - x, dy - y) < 80)) usados.add(i);
    else if (i % 4 === 1) {
      mucosos.push([x, y]);
      usados.add(i);
    }
  });
  const acinoSeroso = (cx: number, cy: number, r: number, k: number) => {
    const n = 7;
    return (
      <g key={k}>
        {Array.from({ length: n }, (_, i) => {
          const a0 = (2 * Math.PI * i) / n;
          const a1 = (2 * Math.PI * (i + 1)) / n;
          const am = (a0 + a1) / 2;
          return (
            <g key={i}>
              <path d={cunha(cx, cy, 4, r, a0, a1)} fill={HE.citoplasmaEscuro} stroke="#b45a86" strokeWidth={1} />
              <circle cx={cx + Math.cos(am) * r * 0.68} cy={cy + Math.sin(am) * r * 0.68} r={5.5} fill={HE.nucleoEscuro} />
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <>
      <rect width={W} height={H} fill={HE.colagenoClaro} />
      <E id="septo-conjuntivo">
        <path d="M430,0 C470,140 520,260 470,380 S 520,600 560,700 L620,700 C580,600 560,420 560,380 S 500,140 500,0 Z" fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 16 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 470, 540)} cy={entre(rng, 10, 690)} rx={8} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="acino-seroso">{serosos.map(([x, y], i) => (usados.has(i) ? null : acinoSeroso(x, y, entre(rng, 27, 33), i)))}</E>
      <E id="meia-lua-serosa">
        {mucosos.map(([x, y], i) =>
          i % 2 === 0 ? (
            <g key={i}>
              {Array.from({ length: 3 }, (_, k) => {
                const a0 = -2.2 + k * 0.55;
                return (
                  <g key={k}>
                    <path d={cunha(x, y, 40, 54, a0, a0 + 0.55)} fill={HE.citoplasmaEscuro} stroke="#b45a86" strokeWidth={1} />
                    <circle cx={x + Math.cos(a0 + 0.27) * 48} cy={y + Math.sin(a0 + 0.27) * 48} r={4.5} fill={HE.nucleoEscuro} />
                  </g>
                );
              })}
            </g>
          ) : null,
        )}
      </E>
      <E id="acino-mucoso">
        {mucosos.map(([x, y], i) => {
          const n = 9;
          return (
            <g key={i}>
              {Array.from({ length: n }, (_, k) => {
                const a0 = (2 * Math.PI * k) / n;
                const a1 = (2 * Math.PI * (k + 1)) / n;
                const am = (a0 + a1) / 2;
                return (
                  <g key={k}>
                    <path d={cunha(x, y, 7, 40, a0, a1)} fill={HE.muco} stroke="#b9acd3" strokeWidth={1.2} />
                    <ellipse cx={x + Math.cos(am) * 36} cy={y + Math.sin(am) * 36} rx={7} ry={2.6} transform={`rotate(${(am * 180) / Math.PI + 90} ${x + Math.cos(am) * 36} ${y + Math.sin(am) * 36})`} fill={HE.nucleoEscuro} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </E>
      <E id="ducto-estriado">
        {ductos.map(([x, y], i) => {
          const n = 12;
          return (
            <g key={i}>
              {Array.from({ length: n }, (_, k) => {
                const a0 = (2 * Math.PI * k) / n;
                const a1 = (2 * Math.PI * (k + 1)) / n;
                const am = (a0 + a1) / 2;
                return (
                  <g key={k}>
                    <path d={cunha(x, y, 20, 46, a0, a1)} fill="#e16f9e" stroke="#b45a86" strokeWidth={1} />
                    <circle cx={x + Math.cos(am) * 31} cy={y + Math.sin(am) * 31} r={5} fill={HE.nucleo} />
                    {[0.3, 0.5, 0.7].map((f) => (
                      <line key={f} x1={x + Math.cos(a0 + (a1 - a0) * f) * 38} y1={y + Math.sin(a0 + (a1 - a0) * f) * 38} x2={x + Math.cos(a0 + (a1 - a0) * f) * 45} y2={y + Math.sin(a0 + (a1 - a0) * f) * 45} stroke="#a3416f" strokeWidth={1.2} />
                    ))}
                  </g>
                );
              })}
              <circle cx={x} cy={y} r={19} fill={HE.luz} />
            </g>
          );
        })}
      </E>
    </>
  );
}
