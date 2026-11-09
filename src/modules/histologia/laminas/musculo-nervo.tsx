// Lâminas de tecido muscular e nervoso.
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, poli, textura, type Rng } from '../he.tsx';

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_ESQUELETICO = ['fibra-muscular-esqueletica', 'estriacoes-transversais', 'endomisio'];
/** Músculo estriado esquelético em corte longitudinal: estriações transversais e núcleos periféricos. */
export function LaminaMusculoEsqueletico(rng: Rng) {
  const fibras: [number, number][] = [];
  for (let y = 20; y < H; y += 112) fibras.push([y, entre(rng, 84, 96)]);
  const corpos: ReactElement[] = [];
  const estrias: ReactElement[] = [];
  fibras.forEach(([y, alt], i) => {
    corpos.push(<rect key={i} x={-10} y={y} width={W + 20} height={alt} rx={10} fill={HE.musculo} />);
    estrias.push(
      <g key={i}>
        {Array.from({ length: Math.ceil(W / 9) }, (_, k) => (
          <line key={k} x1={k * 9 + (i % 2) * 3} y1={y + 3} x2={k * 9 + (i % 2) * 3} y2={y + alt - 3} stroke="#b84a7c" strokeWidth={3.2} opacity={0.75} />
        ))}
      </g>,
    );
    // núcleos achatados na periferia da fibra (logo abaixo do sarcolema)
    for (let x = entre(rng, 20, 80); x < W; x += entre(rng, 110, 180)) {
      const topo = rng() > 0.5;
      corpos.push(<ellipse key={`${i}-${x}`} cx={x} cy={topo ? y + 6 : y + alt - 6} rx={20} ry={4.5} fill={HE.nucleo} />);
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
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_CARDIACO = ['fibra-muscular-cardiaca', 'disco-intercalar', 'endomisio'];
/** Músculo estriado cardíaco: fibras ramificadas, núcleo central e discos intercalares. */
export function LaminaMusculoCardiaco(rng: Rng) {
  const faixas = [60, 175, 290, 405, 520, 635];
  const corpos: ReactElement[] = [];
  const discos: ReactElement[] = [];
  faixas.forEach((y, i) => {
    let x = -20;
    let k = 0;
    while (x < W) {
      const comp = entre(rng, 110, 150);
      const alt = entre(rng, 62, 74);
      const yy = y + Math.sin((x + i * 50) / 120) * 10;
      corpos.push(
        <g key={`${i}-${k}`}>
          <rect x={x} y={yy - alt / 2} width={comp} height={alt} fill={HE.musculo} />
          {Array.from({ length: Math.floor(comp / 12) }, (_, s) => (
            <line key={s} x1={x + 6 + s * 12} y1={yy - alt / 2 + 6} x2={x + 6 + s * 12} y2={yy + alt / 2 - 6} stroke="#c55d8c" strokeWidth={1.4} opacity={0.5} />
          ))}
          <ellipse cx={x + comp / 2} cy={yy} rx={15} ry={7} fill={HE.luz} />
          <ellipse cx={x + comp / 2} cy={yy} rx={11} ry={5.5} fill={HE.nucleo} />
        </g>,
      );
      // disco intercalar em degraus
      const xd = x + comp;
      discos.push(<path key={`${i}-${k}`} d={`M${xd},${yy - alt / 2} l0,${alt * 0.3} l-6,0 l0,${alt * 0.4} l6,0 l0,${alt * 0.3}`} stroke="#5b1d47" strokeWidth={3.4} fill="none" />);
      // ramificação ligando à faixa de baixo
      if (i < faixas.length - 1 && k % 3 === 1) {
        corpos.push(<path key={`r${i}-${k}`} d={`M${x + comp * 0.3},${yy + alt / 2 - 4} L${x + comp * 0.75},${faixas[i + 1] - 30} L${x + comp * 1.05},${faixas[i + 1] - 30} L${x + comp * 0.65},${yy + alt / 2 - 4} Z`} fill={HE.musculo} />);
      }
      x = xd + 2;
      k++;
    }
  });
  return (
    <>
      <E id="endomisio">
        <rect width={W} height={H} fill={HE.colagenoClaro} />
        {textura(rng, 200, HE.citoplasmaEscuro)}
      </E>
      <E id="fibra-muscular-cardiaca">{corpos}</E>
      <E id="disco-intercalar">{discos}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_MUSCULO_LISO = ['fibra-muscular-lisa', 'endomisio'];
/** Músculo liso em corte longitudinal: células fusiformes com núcleo central alongado. */
export function LaminaMusculoLiso(rng: Rng) {
  const fibras: ReactElement[] = [];
  for (let y = 10; y < H + 20; y += 26) {
    for (let x = entre(rng, -160, 0) + ((y / 26) % 2) * 90; x < W + 100; x += entre(rng, 170, 210)) {
      const comp = entre(rng, 200, 240);
      const alt = entre(rng, 18, 24);
      const cx = x + comp / 2;
      fibras.push(
        <g key={`${y}-${x.toFixed(0)}`}>
          <path d={`M${x},${y} Q${cx},${y - alt} ${x + comp},${y} Q${cx},${y + alt} ${x},${y} Z`} fill={HE.musculo} stroke="#c55d8c" strokeWidth={0.8} />
          {rng() > 0.35 && <ellipse cx={cx + entre(rng, -10, 10)} cy={y} rx={entre(rng, 20, 26)} ry={3.6} fill={HE.nucleo} />}
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
/** Corno anterior da medula espinal: neurônio motor multipolar com corpúsculos de Nissl. */
export function LaminaNeuronio(rng: Rng) {
  const neuronios: [number, number, number][] = [[460, 330, 1], [170, 170, 0.55], [820, 520, 0.6]];
  const corpo = (x: number, y: number, s: number) =>
    poli(Array.from({ length: 7 }, (_, k) => {
      const a = (2 * Math.PI * k) / 7;
      const r = (k % 2 ? 85 : 100) * s;
      return [x + Math.cos(a) * r, y + Math.sin(a) * r] as [number, number];
    }));
  return (
    <>
      <E id="neuropilo">
        <rect width={W} height={H} fill="#e7c3d8" />
        {textura(rng, 1400, "#c98fb2", [0, 0, W, H], 1.4)}
      </E>
      <E id="dendrito">
        {neuronios.map(([x, y, s], i) => (
          <g key={i}>
            {[0, 1.3, 2.4, 3.6, 4.9].map((a, k) => (
              <path key={k} d={`M${x + Math.cos(a) * 70 * s},${y + Math.sin(a) * 70 * s} Q${x + Math.cos(a + 0.2) * 200 * s},${y + Math.sin(a + 0.2) * 200 * s} ${x + Math.cos(a + 0.35) * 320 * s},${y + Math.sin(a + 0.35) * 320 * s}`} stroke="#c06a98" strokeWidth={16 * s} strokeLinecap="round" fill="none" />
            ))}
          </g>
        ))}
      </E>
      <E id="cone-de-implantacao">
        <path d="M520,400 L560,500 L548,505 L538,560 L530,560 L524,505 L510,500 Z" fill="#efcadd" />
        <line x1={534} y1={560} x2={590} y2={700} stroke="#d9a3c2" strokeWidth={6} />
      </E>
      <E id="neuronio-multipolar">
        {neuronios.map(([x, y, s], i) => (
          <path key={i} d={corpo(x, y, s)} fill="#d991b9" />
        ))}
      </E>
      <E id="corpusculos-de-nissl">
        {neuronios.map(([x, y, s], i) => (
          <g key={i}>
            {Array.from({ length: Math.round(70 * s) }, (_, k) => {
              const a = entre(rng, 0, Math.PI * 2);
              const r = entre(rng, 40, 82) * s;
              const px = x + Math.cos(a) * r;
              const py = y + Math.sin(a) * r;
              // poupa a região do cone de implantação (sem Nissl)
              if (i === 0 && px > 500 && py > 370) return null;
              return <ellipse key={k} cx={px} cy={py} rx={7 * s} ry={4 * s} transform={`rotate(${entre(rng, 0, 180)} ${px} ${py})`} fill="#5b3b93" />;
            })}
          </g>
        ))}
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
          if (neuronios.some(([nx, ny, s]) => Math.hypot(nx - x, ny - y) < 120 * s)) return null;
          return <circle key={k} cx={x} cy={y} r={entre(rng, 6, 8)} fill={HE.nucleoEscuro} />;
        })}
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
  fasciculos.forEach(([x, y, r], f) => {
    for (let k = 0; k < r * 1.7; k++) {
      const a = entre(rng, 0, Math.PI * 2);
      const d = Math.sqrt(rng()) * (r - 18);
      const cx = x + Math.cos(a) * d;
      const cy = y + Math.sin(a) * d;
      const rr = entre(rng, 6, 11);
      fibras.push(
        <g key={`${f}-${k}`}>
          <circle cx={cx} cy={cy} r={rr} fill="#f6eaf1" stroke="#c77ba4" strokeWidth={1.3} />
          <circle cx={cx} cy={cy} r={rr * 0.32} fill="#b0558a" />
        </g>,
      );
    }
  });
  return (
    <>
      <E id="epineuro">
        <rect width={W} height={H} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 30 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, 0, H)} rx={10} ry={3.5} transform={`rotate(${entre(rng, 0, 180)})`} fill={HE.nucleo} />
          ))}
        </Deco>
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
      </E>
      <E id="fibra-mielinizada">{fibras}</E>
    </>
  );
}
