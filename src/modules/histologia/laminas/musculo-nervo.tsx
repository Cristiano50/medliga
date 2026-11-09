// Lâminas de tecido muscular e nervoso.
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, hexagono, poli, textura, type Rng } from '../he.tsx';

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_ESQUELETICO = ['fibra-muscular-esqueletica', 'estriacoes-transversais', 'endomisio'];
/** Músculo estriado esquelético em corte longitudinal: estriações transversais e núcleos periféricos. */
export function LaminaMusculoEsqueletico(rng: Rng) {
  const fibras: [number, number][] = [];
  for (let y = 20; y < H; y += 112) fibras.push([y, entre(rng, 84, 96)]);
  const SARC = 9; // comprimento do sarcômero no esquema
  const corpos: ReactElement[] = [];
  const nucleos: ReactElement[] = [];
  const estrias: ReactElement[] = [];
  fibras.forEach(([y, alt], i) => {
    corpos.push(<rect key={i} x={-10} y={y} width={W + 20} height={alt} rx={10} fill={HE.musculo} />);
    const xs = Array.from({ length: Math.ceil(W / SARC) + 1 }, (_, k) => k * SARC + (i % 2) * 3);
    // banda A escura e larga (≈ 60% do sarcômero); banda I clara, cortada ao meio pela linha Z fina
    estrias.push(
      <g key={i}>
        <path d={xs.map((x) => `M${x},${y + 3}V${y + alt - 3}`).join('')} stroke="#b84a7c" strokeWidth={SARC * 0.6} opacity={0.6} />
        <path d={xs.map((x) => `M${x + SARC / 2},${y + 3}V${y + alt - 3}`).join('')} stroke="#8e3462" strokeWidth={0.7} opacity={0.75} />
      </g>,
    );
    // núcleos achatados na periferia da fibra (logo abaixo do sarcolema), por cima das estrias
    for (let x = entre(rng, 20, 80); x < W; x += entre(rng, 110, 180)) {
      const topo = rng() > 0.5;
      nucleos.push(<ellipse key={`${i}-${x}`} cx={x} cy={topo ? y + 6 : y + alt - 6} rx={20} ry={4.5} fill={HE.nucleo} />);
    }
  });
  return (
    <>
      <E id="endomisio">
        <rect width={W} height={H} fill={HE.colagenoClaro} />
        <Deco>
          {fibras.map(([y], i) => (
            <ellipse key={i} cx={entre(rng, 100, 900)} cy={y - 8} rx={14} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="fibra-muscular-esqueletica">{corpos}</E>
      <E id="estriacoes-transversais">{estrias}</E>
      <E id="fibra-muscular-esqueletica">{nucleos}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_CARDIACO = ['fibra-muscular-cardiaca', 'disco-intercalar', 'endomisio'];
/** Músculo estriado cardíaco: fibras ramificadas, núcleo central e discos intercalares. */
export function LaminaMusculoCardiaco(rng: Rng) {
  // fileiras paralelas de células longas (≈ 4–6 : 1), de largura variável, separadas por endomísio estreito
  const PASSO = 60;
  const onda = (x: number) => 5 * Math.sin(x / 110);
  const fileiras: { y: number; celulas: { x0: number; x1: number; h: number }[] }[] = [];
  for (let y = -10; y < H + 50; y += PASSO) {
    const celulas: { x0: number; x1: number; h: number }[] = [];
    for (let x = entre(rng, -200, -20); x < W + 20; ) {
      const comp = entre(rng, 180, 260);
      celulas.push({ x0: x, x1: x + comp, h: entre(rng, 20, 27) });
      x += comp;
    }
    fileiras.push({ y, celulas });
  }
  const meiaAltura = (f: number, x: number) => fileiras[f].celulas.find((c) => x >= c.x0 && x < c.x1)?.h ?? 24;
  const borda = (y: number, h: number, x0: number, x1: number) => {
    const pts: [number, number][] = [];
    for (let x = x0; x < x1; x += 20) pts.push([x, y + onda(x) + h]);
    pts.push([x1, y + onda(x1) + h]);
    return pts;
  };
  const estrias = (x0: number, x1: number, y: number, h: number) => {
    let d = '';
    for (let x = x0 + 4; x < x1 - 2; x += 7) d += `M${x.toFixed(1)},${(y + onda(x) - h + 3).toFixed(1)}V${(y + onda(x) + h - 3).toFixed(1)}`;
    return d;
  };
  const corpos: ReactElement[] = [];
  const discos: ReactElement[] = [];
  fileiras.forEach(({ y, celulas }, i) => {
    celulas.forEach(({ x0, x1, h }, k) => {
      const cx = (x0 + x1) / 2;
      const cy = y + onda(cx);
      const binucleada = rng() < 0.12;
      corpos.push(
        <g key={`${i}-${k}`}>
          <path d={poli([...borda(y, -h, x0, x1), ...borda(y, h, x0, x1).reverse()])} fill={HE.musculo} />
          <path d={estrias(x0, x1, y, h)} stroke="#c55d8c" strokeWidth={1.4} opacity={0.45} />
          {/* núcleo central com zona clara junto aos polos */}
          {(binucleada ? [-17, 17] : [0]).map((dx) => (
            <g key={dx}>
              <ellipse cx={cx + dx} cy={cy} rx={binucleada ? 19 : 25} ry={6.5} fill="#f6e2ec" />
              <ellipse cx={cx + dx} cy={cy} rx={binucleada ? 10 : 13} ry={5.5} fill={HE.nucleo} />
            </g>
          ))}
        </g>,
      );
      // disco intercalar em degraus no fim de cada célula
      if (k < celulas.length - 1) {
        const hd = Math.max(h, celulas[k + 1].h);
        const yd = y + onda(x1) - hd;
        const d1 = hd * entre(rng, 0.45, 0.75);
        discos.push(<path key={`${i}-${k}`} d={`M${x1.toFixed(1)},${yd.toFixed(1)} v${d1.toFixed(1)} h-6 v${(hd * 0.8).toFixed(1)} h6 v${(2 * hd - d1 - hd * 0.8).toFixed(1)}`} stroke="#5b1d47" strokeWidth={3} fill="none" />);
      }
    });
  });
  // ramificações em Y: a fibra se divide e se une à fileira vizinha; o endomísio termina em ponta
  const pontes: [number, number, number][] = []; // fileira de cima, x inicial, x final
  for (let i = 0; i < fileiras.length - 1; i++) {
    for (let x = entre(rng, 40, 500); x < W - 40; x += entre(rng, 560, 800)) {
      const xb = x + entre(rng, 50, 90);
      pontes.push([i, x, xb]);
      const y = fileiras[i].y;
      const sup = (xx: number) => y + onda(xx) + meiaAltura(i, xx) - 2;
      const inf = (xx: number) => y + PASSO + onda(xx) - meiaAltura(i + 1, xx) + 2;
      const meio = (xx: number) => (sup(xx) + inf(xx)) / 2;
      const pts: [number, number][] = [[x - 70, meio(x - 70)], [x, sup(x)], [xb, sup(xb)], [xb + 70, meio(xb + 70)], [xb, inf(xb)], [x, inf(x)]];
      corpos.push(
        <g key={`p${i}-${x.toFixed(0)}`}>
          <path d={poli(pts)} fill={HE.musculo} />
          <path d={estrias(x - 40, xb + 40, y + PASSO / 2, 8)} stroke="#c55d8c" strokeWidth={1.4} opacity={0.45} />
        </g>,
      );
    }
  }
  // capilares com hemácias no endomísio estreito entre as fileiras
  const capilares: ReactElement[] = [];
  for (let i = 0; i < fileiras.length - 1; i++) {
    for (let x = entre(rng, 0, 200); x < W; x += entre(rng, 260, 420)) {
      const comp = entre(rng, 90, 170);
      if (pontes.some(([pi, a, b]) => pi === i && x < b + 80 && x + comp > a - 80)) continue;
      const y = fileiras[i].y;
      let d = '';
      const hemacias: ReactElement[] = [];
      let cabe = true;
      for (let xx = x, k = 0; xx <= x + comp; xx += 9, k++) {
        const vao = PASSO - meiaAltura(i, xx) - meiaAltura(i + 1, xx);
        if (vao < 11) cabe = false;
        const ym = y + PASSO / 2 + onda(xx) + (meiaAltura(i, xx) - meiaAltura(i + 1, xx)) / 2;
        d += `${k ? 'L' : 'M'}${xx.toFixed(1)},${ym.toFixed(1)}`;
        if (k % 2 === 1) hemacias.push(<ellipse key={k} cx={xx} cy={ym} rx={4.2} ry={3.2} fill={HE.hemacia} />);
      }
      if (!cabe) continue;
      capilares.push(
        <g key={`${i}-${x.toFixed(0)}`}>
          <path d={d} stroke={HE.citoplasmaEscuro} strokeWidth={10.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={d} stroke={HE.luz} strokeWidth={7.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {hemacias}
        </g>,
      );
    }
  }
  return (
    <>
      <E id="endomisio">
        <rect width={W} height={H} fill={HE.colagenoClaro} />
        {textura(rng, 120, HE.citoplasmaEscuro)}
      </E>
      <E id="fibra-muscular-cardiaca">{corpos}</E>
      <E id="endomisio">{capilares}</E>
      <E id="disco-intercalar">{discos}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_LISO = ['fibra-muscular-lisa', 'endomisio'];
/** Músculo liso em corte longitudinal: células fusiformes com núcleo central alongado. */
export function LaminaMusculoLiso(rng: Rng) {
  const fibras: ReactElement[] = [];
  // núcleo alongado; ~1 em 6 em saca-rolhas (célula contraída)
  const nucleo = (cx: number, cy: number, rx: number) => {
    if (rng() > 0.17) return <ellipse cx={cx} cy={cy} rx={rx} ry={3.6} fill={HE.nucleo} />;
    const l = rx * 0.62;
    const pts = Array.from({ length: 17 }, (_, k) => `${(cx - l + (2 * l * k) / 16).toFixed(1)},${(cy + 1.9 * Math.sin((k * Math.PI) / 4)).toFixed(1)}`);
    return <path d={`M${pts.join(' L')}`} stroke={HE.nucleo} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  };
  for (let y = 10; y < H + 20; y += 26) {
    for (let x = entre(rng, -160, 0) + ((y / 26) % 2) * 90; x < W + 100; x += entre(rng, 170, 210)) {
      const comp = entre(rng, 200, 240);
      const alt = entre(rng, 18, 24);
      const cx = x + comp / 2;
      fibras.push(
        <g key={`${y}-${x.toFixed(0)}`}>
          {/* limites celulares discretos, pouco nítidos no HE */}
          <path d={`M${x},${y} Q${cx},${y - alt} ${x + comp},${y} Q${cx},${y + alt} ${x},${y} Z`} fill={HE.musculo} stroke="#d27aa2" strokeWidth={0.6} />
          {rng() > 0.35 && nucleo(cx + entre(rng, -10, 10), y, entre(rng, 20, 26))}
        </g>,
      );
    }
  }
  return (
    <>
      <E id="endomisio">
        <rect width={W} height={H} fill={HE.colagenoClaro} />
      </E>
      <E id="fibra-muscular-lisa">{fibras}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_NEURONIO = ['neuronio-multipolar', 'corpusculos-de-nissl', 'nucleolo', 'dendrito', 'cone-de-implantacao', 'celulas-da-glia', 'neuropilo'];

type Pt = [number, number];
/** Ponto e tangente (unitária) de uma curva quadrática de Bézier. */
function bezier(p0: Pt, p1: Pt, p2: Pt, t: number): { p: Pt; tg: Pt } {
  const u = 1 - t;
  const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  const n = Math.hypot(dx, dy) || 1;
  return { p: [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]], tg: [dx / n, dy / n] };
}

/** Prolongamento que afila ao longo de uma curva quadrática (largura w0 na base → w1 na ponta). */
function prolongamento(p0: Pt, p1: Pt, p2: Pt, w0: number, w1: number, n = 14) {
  const em = (t: number) => ({ ...bezier(p0, p1, p2, t), w: w1 + (w0 - w1) * Math.pow(1 - t, 1.25) });
  const esq: Pt[] = [];
  const dir: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const { p, tg, w } = em(i / n);
    esq.push([p[0] - (tg[1] * w) / 2, p[1] + (tg[0] * w) / 2]);
    dir.push([p[0] + (tg[1] * w) / 2, p[1] - (tg[0] * w) / 2]);
  }
  const fim = em(1);
  const ponta: Pt = [fim.p[0] + (fim.tg[0] * fim.w) / 2, fim.p[1] + (fim.tg[1] * fim.w) / 2];
  return { d: poli([...esq, ponta, ...dir.reverse()]), em };
}

/** Corno anterior da medula espinal: neurônio motor multipolar com corpúsculos de Nissl. */
export function LaminaNeuronio(rng: Rng) {
  const neuronios: [number, number, number][] = [[460, 330, 1], [170, 170, 0.55], [820, 520, 0.6]];
  const angDendritos = [0, 1.3, 2.4, 3.6, 4.9];
  // dendritos que se ramificam (índice → lado do ramo), escolhidos para não cruzar o axônio nem os outros neurônios
  const ramos: Record<number, number>[] = [{ 0: -1, 1: -1, 4: 1 }, { 2: 1 }, { 1: -1, 4: 1 }];
  // direção do axônio do neurônio principal: no intervalo livre entre dois dendritos
  const AXONIO = 2.02;
  const cor = { pericario: '#d991b9', dendrito: '#d48ab3', cone: '#dfa3c6', axonio: '#dfa3c6', nissl: '#5b3b93' };
  const corpo = (x: number, y: number, s: number) =>
    poli(Array.from({ length: 7 }, (_, k) => {
      const a = (2 * Math.PI * k) / 7;
      const r = (k % 2 ? 85 : 100) * s;
      return [x + Math.cos(a) * r, y + Math.sin(a) * r] as [number, number];
    }));

  // dendritos: afilam a partir do corpo; alguns se ramificam; Nissl só na porção proximal
  const dendritos: ReactElement[] = [];
  const nisslDendritos: ReactElement[] = [];
  neuronios.forEach(([x, y, s], i) => {
    angDendritos.forEach((a, k) => {
      const p0: Pt = [x + Math.cos(a) * 60 * s, y + Math.sin(a) * 60 * s];
      const p1: Pt = [x + Math.cos(a + 0.2) * 200 * s, y + Math.sin(a + 0.2) * 200 * s];
      const p2: Pt = [x + Math.cos(a + 0.35) * 320 * s, y + Math.sin(a + 0.35) * 320 * s];
      const dd = prolongamento(p0, p1, p2, 30 * s, 8 * s);
      dendritos.push(<path key={`${i}-${k}`} d={dd.d} fill={cor.dendrito} />);
      const lado = ramos[i][k];
      if (lado) {
        const { p, tg, w } = dd.em(entre(rng, 0.5, 0.6));
        const b = Math.atan2(tg[1], tg[0]) + lado * 0.6;
        const L = entre(rng, 110, 150) * s;
        const q1: Pt = [p[0] + Math.cos(b) * L * 0.5, p[1] + Math.sin(b) * L * 0.5];
        const q2: Pt = [p[0] + Math.cos(b - lado * 0.2) * L, p[1] + Math.sin(b - lado * 0.2) * L];
        dendritos.push(<path key={`${i}-${k}r`} d={prolongamento(p, q1, q2, w * 0.8, 5 * s, 8).d} fill={cor.dendrito} />);
      }
      for (let m = 0, n = Math.round(9 * s); m < n; m++) {
        const { p, tg, w } = dd.em(entre(rng, 0.1, 0.4));
        const desvio = entre(rng, -1, 1) * Math.max(0, w / 2 - 5 * s);
        const cx = p[0] - tg[1] * desvio;
        const cy = p[1] + tg[0] * desvio;
        nisslDendritos.push(<ellipse key={`${i}-${k}-${m}`} cx={cx} cy={cy} rx={6.5 * s} ry={2.8 * s} transform={`rotate(${(Math.atan2(tg[1], tg[0]) * 180) / Math.PI} ${cx} ${cy})`} fill={cor.nissl} />);
      }
    });
  });

  // cone de implantação: base larga dentro/na borda do pericário, afilando até o calibre do axônio
  const [nx, ny] = neuronios[0];
  const ux = Math.cos(AXONIO);
  const uy = Math.sin(AXONIO);
  const BORDA = 88; // distância do centro até o contorno do pericário nessa direção
  const meiaLargura = (d: number) =>
    d < BORDA ? 30 * Math.sqrt(Math.max(0, 1 - ((BORDA - d) / 28) ** 2)) : 3.5 + 26.5 * Math.pow(1 - Math.min(1, (d - BORDA) / 92), 1.4);
  const passos = [60, 62, 66, 72, 80, 88, 98, 110, 122, 134, 146, 158, 170, 180];
  const conePts: Pt[] = [
    ...passos.map((d): Pt => [nx + ux * d - uy * meiaLargura(d), ny + uy * d + ux * meiaLargura(d)]),
    ...[...passos].reverse().map((d): Pt => [nx + ux * d + uy * meiaLargura(d), ny + uy * d - ux * meiaLargura(d)]),
  ];
  const pa: Pt = [nx + ux * 178, ny + uy * 178];
  const axonio = `M${pa[0].toFixed(1)},${pa[1].toFixed(1)} Q${(nx + ux * 300 + uy * 15).toFixed(1)},${(ny + uy * 300 - ux * 15).toFixed(1)} ${(nx + ux * 440 - uy * 10).toFixed(1)},${(ny + uy * 440 + ux * 10).toFixed(1)}`;
  const noCone = (px: number, py: number) => {
    const da = Math.abs(((Math.atan2(py - ny, px - nx) - AXONIO + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
    return da < 0.45 && Math.hypot(px - nx, py - ny) > 50;
  };

  // glia satélite encostada nos pericários (nos intervalos entre dendritos, fora do cone)
  const satelites: ReactElement[] = [];
  neuronios.forEach(([x, y, s], i) => {
    [0.75, 3.0, 4.25, 5.65].forEach((a, k) => {
      if (i > 0 && k % 2) return;
      const r = 90 * s + 5;
      satelites.push(<ellipse key={`s${i}-${k}`} cx={x + Math.cos(a) * r} cy={y + Math.sin(a) * r} rx={7.5} ry={5} transform={`rotate(${(a * 180) / Math.PI + 90} ${x + Math.cos(a) * r} ${y + Math.sin(a) * r})`} fill={HE.nucleoEscuro} />);
    });
  });

  return (
    <>
      <E id="neuropilo">
        <rect width={W} height={H} fill="#e7c3d8" />
        {textura(rng, 1400, '#c98fb2', [0, 0, W, H], 1.4)}
      </E>
      <E id="dendrito">{dendritos}</E>
      <E id="neuronio-multipolar">
        {neuronios.map(([x, y, s], i) => (
          <path key={i} d={corpo(x, y, s)} fill={cor.pericario} />
        ))}
        {/* axônio (parte do neurônio), saindo do cone de implantação */}
        <path d={axonio} stroke={cor.axonio} strokeWidth={7} strokeLinecap="round" fill="none" />
      </E>
      <E id="cone-de-implantacao">
        {/* o tom passa do rosa do pericário ao rosa mais pálido do cone, sem contorno interno */}
        <defs>
          <linearGradient id="neuronio-cone" gradientUnits="userSpaceOnUse" x1={nx + ux * 62} y1={ny + uy * 62} x2={nx + ux * 104} y2={ny + uy * 104}>
            <stop offset="0" stopColor={cor.pericario} />
            <stop offset="1" stopColor={cor.cone} />
          </linearGradient>
        </defs>
        <path d={poli(conePts)} fill="url(#neuronio-cone)" />
      </E>
      <E id="corpusculos-de-nissl">
        {neuronios.map(([x, y, s], i) => (
          <g key={i}>
            {Array.from({ length: Math.round(70 * s) }, (_, k) => {
              const a = entre(rng, 0, Math.PI * 2);
              const r = entre(rng, 40, 82) * s;
              const px = x + Math.cos(a) * r;
              const py = y + Math.sin(a) * r;
              // poupa o cone de implantação (sem Nissl)
              if (i === 0 && noCone(px, py)) return null;
              return <ellipse key={k} cx={px} cy={py} rx={7 * s} ry={4 * s} transform={`rotate(${entre(rng, 0, 180)} ${px} ${py})`} fill={cor.nissl} />;
            })}
          </g>
        ))}
        {nisslDendritos}
      </E>
      <Deco>
        {neuronios.map(([x, y, s], i) => (
          <circle key={i} cx={x - 8 * s} cy={y - 6 * s} r={34 * s} fill="#e8d9ef" stroke="#7a62b5" strokeWidth={2} />
        ))}
      </Deco>
      <E id="nucleolo">
        {neuronios.map(([x, y, s], i) => (
          <circle key={i} cx={x - 4 * s} cy={y - 10 * s} r={10 * s} fill="#3c2575" />
        ))}
      </E>
      <E id="celulas-da-glia">
        {Array.from({ length: 34 }, (_, k) => {
          const x = entre(rng, 10, W - 10);
          const y = entre(rng, 10, H - 10);
          if (neuronios.some(([nx2, ny2, s]) => Math.hypot(nx2 - x, ny2 - y) < 120 * s)) return null;
          return <circle key={k} cx={x} cy={y} r={entre(rng, 6, 8)} fill={HE.nucleoEscuro} />;
        })}
        {satelites}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_NERVO = ['epineuro', 'perineuro', 'endoneuro', 'fasciculo-nervoso', 'fibra-mielinizada'];
/** Nervo periférico em corte transversal: epineuro, perineuro, endoneuro e fibras mielinizadas. */
export function LaminaNervo(rng: Rng) {
  const fasciculos: [number, number, number][] = [[300, 270, 170], [680, 240, 140], [560, 540, 130], [190, 560, 90]];
  const fibras: ReactElement[] = [];
  const schwann: ReactElement[] = [];
  const fibroblastos: ReactElement[] = [];
  fasciculos.forEach(([x, y, r], f) => {
    // distribuição sem sobreposição (amostragem com distância mínima): sobra endoneuro entre as fibras
    const dentro: [number, number, number][] = [];
    // primeiro as fibras grossas; depois as finas preenchem parte dos espaços (calibres variados, como no nervo real)
    for (let t = 0; t < r * 30 && dentro.length < r * 1.6; t++) {
      const fina = t > r * 18;
      const a = entre(rng, 0, Math.PI * 2);
      const rr = fina ? entre(rng, 3.8, 5.5) : entre(rng, 6, 11);
      const d = Math.sqrt(rng()) * (r - 6 - rr);
      const cx = x + Math.cos(a) * d;
      const cy = y + Math.sin(a) * d;
      if (dentro.some(([ox, oy, or]) => Math.hypot(ox - cx, oy - cy) < or + rr + 2.5)) continue;
      dentro.push([cx, cy, rr]);
    }
    dentro.forEach(([cx, cy, rr], k) => {
      fibras.push(
        <g key={`${f}-${k}`}>
          <circle cx={cx} cy={cy} r={rr} fill="#f6eaf1" stroke="#c77ba4" strokeWidth={1.3} />
          <circle cx={cx} cy={cy} r={rr * 0.32} fill="#b0558a" />
        </g>,
      );
      // núcleo de célula de Schwann em crescente, por fora da mielina, em ~1 de cada 5 fibras
      if (rng() < 0.2) {
        const a = entre(rng, 0, Math.PI * 2);
        const R1 = rr + 2.6;
        const p1: [number, number] = [cx + Math.cos(a - 0.75) * R1, cy + Math.sin(a - 0.75) * R1];
        const p2: [number, number] = [cx + Math.cos(a + 0.75) * R1, cy + Math.sin(a + 0.75) * R1];
        const corda = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
        const s2 = Math.max(0.3, R1 * (1 - Math.cos(0.75)) - 2.4); // flecha do arco interno → espessura ≈ 2,4 no meio
        const R2 = ((corda / 2) ** 2 + s2 ** 2) / (2 * s2);
        schwann.push(
          <path key={`${f}-${k}`} d={`M${p1[0].toFixed(1)},${p1[1].toFixed(1)} A${R1.toFixed(1)},${R1.toFixed(1)} 0 0 1 ${p2[0].toFixed(1)},${p2[1].toFixed(1)} A${R2.toFixed(1)},${R2.toFixed(1)} 0 0 0 ${p1[0].toFixed(1)},${p1[1].toFixed(1)} Z`} fill={HE.nucleo} />,
        );
      }
    });
    // núcleos alongados de fibroblastos do endoneuro, nos espaços entre as fibras
    for (let t = 0, n = 0; t < 200 && n < Math.round(r / 12); t++) {
      const a = entre(rng, 0, Math.PI * 2);
      const d = Math.sqrt(rng()) * (r - 14);
      const cx = x + Math.cos(a) * d;
      const cy = y + Math.sin(a) * d;
      if (dentro.some(([ox, oy, or]) => Math.hypot(ox - cx, oy - cy) < or + 4)) continue;
      n++;
      fibroblastos.push(<ellipse key={`${f}-${t}`} cx={cx} cy={cy} rx={6} ry={1.8} transform={`rotate(${entre(rng, 0, 180)} ${cx} ${cy})`} fill={HE.nucleo} />);
    }
  });
  // epineuro: vasos com hemácias e alguns adipócitos entre os fascículos
  const vasos: [number, number, number][] = [[880, 450, 20], [60, 330, 14], [470, 405, 11], [420, 665, 13]];
  const adipocitos: [number, number][] = [[920, 620], [972, 620], [946, 575], [868, 620], [894, 665], [946, 665], [50, 60], [102, 60], [76, 105], [24, 105], [76, 15]];
  return (
    <>
      <E id="epineuro">
        <rect width={W} height={H} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 30 }, (_, k) => {
            // girado em torno do próprio centro (antes girava em torno da origem e quase todos saíam do campo)
            const x = entre(rng, 0, W);
            const y = entre(rng, 0, H);
            return <ellipse key={k} cx={x} cy={y} rx={10} ry={3.5} transform={`rotate(${entre(rng, 0, 180)} ${x} ${y})`} fill={HE.nucleo} />;
          })}
        </Deco>
        {adipocitos.map(([x, y], i) => (
          <path key={i} d={poli(hexagono(rng, x, y, 30))} fill={HE.luz} stroke="#d77aa3" strokeWidth={2} />
        ))}
        {vasos.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={HE.luz} stroke="#c9578d" strokeWidth={r > 15 ? 6 : 3} />
            <ellipse cx={x - r * 0.25} cy={y} rx={5} ry={4} fill={HE.hemacia} />
            <ellipse cx={x + r * 0.3} cy={y + r * 0.2} rx={5} ry={4} fill={HE.hemacia} />
          </g>
        ))}
      </E>
      <E id="fasciculo-nervoso">
        {fasciculos.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r + 12} fill="#f3d6e4" />
        ))}
      </E>
      <E id="perineuro">
        {fasciculos.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r + 8} fill="none" stroke="#c9578d" strokeWidth={8} />
            <circle cx={x} cy={y} r={r + 2} fill="none" stroke="#d97ea6" strokeWidth={3} />
          </g>
        ))}
      </E>
      <E id="endoneuro">
        {fasciculos.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r - 2} fill="#f0c9da" />
        ))}
        <Deco>{textura(rng, 300, HE.citoplasmaEscuro)}</Deco>
        {fibroblastos}
      </E>
      <E id="fibra-mielinizada">
        {fibras}
        {schwann}
      </E>
    </>
  );
}
