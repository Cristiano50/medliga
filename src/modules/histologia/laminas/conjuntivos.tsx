// Lâminas de tecido conjuntivo, adiposo, cartilagem, osso e sangue.
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, grade, hexagono, poli, textura, type Rng } from '../he.tsx';

// ---------------------------------------------------------------------------------------------
export const PARTES_CONJUNTIVO = ['fibras-colagenas', 'fibras-elasticas', 'fibroblasto', 'mastocito', 'macrofago', 'plasmocito', 'capilar'];
/** Tecido conjuntivo frouxo (mesentério/derme papilar): fibras e células do conjuntivo. */
export function LaminaConjuntivo(rng: Rng) {
  const colagenas: ReactElement[] = [];
  for (let k = 0; k < 26; k++) {
    const x0 = entre(rng, -100, W);
    const y0 = entre(rng, 0, H);
    const dx = entre(rng, 180, 360);
    const dy = entre(rng, -140, 140);
    colagenas.push(<path key={k} d={`M${x0},${y0} c ${dx * 0.3},${entre(rng, -60, 60)} ${dx * 0.7},${dy + entre(rng, -60, 60)} ${dx},${dy}`} stroke={HE.colageno} strokeWidth={entre(rng, 9, 16)} strokeLinecap="round" fill="none" />);
  }
  const elasticas: ReactElement[] = [];
  for (let k = 0; k < 16; k++) {
    const x0 = entre(rng, 0, W);
    const y0 = entre(rng, 0, H);
    elasticas.push(<path key={k} d={`M${x0},${y0} q ${entre(rng, 40, 90)},${entre(rng, -50, 50)} ${entre(rng, 120, 220)},${entre(rng, -40, 40)} t ${entre(rng, 80, 160)},${entre(rng, -30, 30)}`} stroke="#8c3d6b" strokeWidth={1.8} fill="none" />);
  }
  const fibroblastos: [number, number, number][] = Array.from({ length: 14 }, () => [entre(rng, 40, W - 40), entre(rng, 40, H - 40), entre(rng, -40, 40)]);
  const mastocitos: [number, number][] = [[260, 180], [720, 520], [880, 160]];
  const macrofagos: [number, number][] = [[560, 260], [180, 560]];
  const plasmocitos: [number, number][] = [[390, 470], [760, 330], [120, 300]];
  return (
    <>
      <rect width={W} height={H} fill={HE.vidro} />
      {textura(rng, 500, HE.colagenoClaro)}
      <E id="fibras-colagenas">{colagenas}</E>
      <E id="fibras-elasticas">{elasticas}</E>
      <E id="capilar">
        <g transform="translate(640 120) rotate(18)">
          <rect x={-120} y={-18} width={240} height={36} rx={18} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={4} />
          {[-80, -40, 0, 40, 80].map((x) => (
            <ellipse key={x} cx={x} rx={11} ry={9} fill={HE.hemacia} />
          ))}
          <ellipse cx={-30} cy={-17} rx={12} ry={3.5} fill={HE.nucleo} />
        </g>
      </E>
      <E id="fibroblasto">
        {fibroblastos.map(([x, y, a], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
            <path d="M-34,0 Q-10,-9 0,-7 Q10,-9 34,0 Q10,9 0,7 Q-10,9 -34,0 Z" fill={HE.citoplasmaClaro} opacity={0.9} />
            <ellipse rx={15} ry={4.5} fill={HE.nucleo} />
          </g>
        ))}
      </E>
      <E id="mastocito">
        {mastocitos.map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={26} ry={20} fill="#c9b3e6" />
            {Array.from({ length: 40 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -22, 22)} cy={y + entre(rng, -16, 16)} r={2.2} fill="#5e3b9a" />
            ))}
            <circle cx={x} cy={y} r={8} fill={HE.nucleoEscuro} />
          </g>
        ))}
      </E>
      <E id="macrofago">
        {macrofagos.map(([x, y], i) => (
          <g key={i}>
            <path d={poli(Array.from({ length: 9 }, (_, k) => {
              const a = (2 * Math.PI * k) / 9;
              const r = entre(rng, 22, 34);
              return [x + Math.cos(a) * r, y + Math.sin(a) * r] as [number, number];
            }))} fill={HE.citoplasma} stroke={HE.citoplasmaEscuro} strokeWidth={1.2} />
            <path d={`M${x - 10},${y - 6} q10,-10 20,0 q-4,6 0,12 q-10,8 -20,0 q4,-6 0,-12 Z`} fill={HE.nucleo} />
            {Array.from({ length: 5 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -20, 20)} cy={y + entre(rng, 8, 20)} r={3} fill="#b36a3a" opacity={0.7} />
            ))}
          </g>
        ))}
      </E>
      <E id="plasmocito">
        {plasmocitos.map(([x, y], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y} rx={22} ry={16} fill="#b98ad0" />
            <circle cx={x + 9} cy={y} r={9} fill={HE.nucleoClaro} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <circle key={k} cx={x + 9 + Math.cos(k) * 6} cy={y + Math.sin(k) * 6} r={2} fill={HE.nucleoEscuro} />
            ))}
            <ellipse cx={x - 4} cy={y} rx={5} ry={7} fill="#e5d6ef" />
          </g>
        ))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_ADIPOSO = ['adipocito-unilocular', 'septo-conjuntivo', 'capilar'];
/** Tecido adiposo unilocular (branco): adipócitos com gota lipídica única (extraída no preparo) e núcleo periférico. */
export function LaminaAdiposo(rng: Rng) {
  const centros = grade(rng, 92, [0, 0, W, H], 0.18).filter(([x]) => Math.abs(x - 600) > 40);
  const capilares: [number, number][] = [];
  return (
    <>
      <rect width={W} height={H} fill={HE.colagenoClaro} />
      <E id="septo-conjuntivo">
        <path d="M560,0 C600,160 650,300 610,420 S 640,620 660,700 L720,700 C700,600 690,440 690,420 S 640,160 610,0 Z" fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 10 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 600, 660)} cy={entre(rng, 10, 690)} rx={8} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
      </E>
      <E id="adipocito-unilocular">
        {centros.map(([x, y], i) => {
          const pts = hexagono(rng, x, y, 50);
          if (i % 5 === 2) capilares.push([pts[0][0], pts[0][1]]);
          const nucleo = i % 3 === 0;
          const [nx, ny] = pts[2];
          return (
            <g key={i}>
              <path d={poli(pts)} fill={HE.luz} stroke="#d77aa3" strokeWidth={3} />
              {nucleo && <ellipse cx={nx * 0.85 + x * 0.15} cy={ny * 0.85 + y * 0.15} rx={11} ry={4} transform={`rotate(-30 ${nx * 0.85 + x * 0.15} ${ny * 0.85 + y * 0.15})`} fill={HE.nucleo} />}
            </g>
          );
        })}
      </E>
      <E id="capilar">
        {capilares.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={9} fill={HE.luz} stroke={HE.citoplasmaEscuro} strokeWidth={2} />
            <circle cx={x} cy={y} r={5} fill={HE.hemacia} />
          </g>
        ))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_CARTILAGEM = ['condrocito', 'lacuna', 'grupo-isogeno', 'matriz-territorial', 'matriz-interterritorial', 'pericondrio'];
/** Cartilagem hialina (traqueia): grupos isógenos, matriz basófila e pericôndrio. */
export function LaminaCartilagem(rng: Rng) {
  const yPeri = 120;
  const grupos = grade(rng, 120, [40, yPeri + 90, W - 40, H - 30], 0.2);
  const pericondrio: ReactElement[] = [];
  for (let k = 0; k < 26; k++) {
    pericondrio.push(<ellipse key={k} cx={entre(rng, 0, W)} cy={entre(rng, 20, yPeri)} rx={16} ry={3.2} fill={HE.nucleo} />);
  }
  const condrocitos: ReactElement[] = [];
  const lacunas: ReactElement[] = [];
  const territoriais: ReactElement[] = [];
  const isogenos: ReactElement[] = [];
  grupos.forEach(([x, y], g) => {
    const n = 2 + (g % 3);
    const raioGrupo = 18 + n * 6;
    territoriais.push(<circle key={g} cx={x} cy={y} r={raioGrupo + 20} fill={HE.basofiloEscuro} opacity={0.75} />);
    isogenos.push(<circle key={g} cx={x} cy={y} r={raioGrupo + 4} fill="transparent" />);
    for (let c = 0; c < n; c++) {
      const a = (2 * Math.PI * c) / n + g;
      const cx = x + Math.cos(a) * (n === 1 ? 0 : 14);
      const cy = y + Math.sin(a) * (n === 1 ? 0 : 12);
      lacunas.push(<ellipse key={`${g}-${c}`} cx={cx} cy={cy} rx={15} ry={12} fill="#f4f0f8" />);
      condrocitos.push(
        <g key={`${g}-${c}`}>
          <ellipse cx={cx - 1} cy={cy} rx={10} ry={8} fill={HE.citoplasmaClaro} />
          <circle cx={cx - 2} cy={cy} r={4} fill={HE.nucleo} />
        </g>,
      );
    }
  });
  // condrócitos jovens achatados logo abaixo do pericôndrio
  for (let x = 30; x < W; x += 80) {
    lacunas.push(<ellipse key={`j${x}`} cx={x + entre(rng, -10, 10)} cy={yPeri + 35} rx={18} ry={6} fill="#f4f0f8" />);
  }
  return (
    <>
      <E id="matriz-interterritorial">
        <rect y={yPeri} width={W} height={H - yPeri} fill={HE.basofilo} />
        {textura(rng, 300, HE.basofiloEscuro, [0, yPeri, W, H])}
      </E>
      <E id="pericondrio">
        <rect width={W} height={yPeri + 8} fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 10 }, (_, k) => (
            <path key={k} d={`M0,${15 + k * 10} C300,${10 + k * 10} 700,${22 + k * 10} ${W},${14 + k * 10}`} stroke="#d77aa3" strokeWidth={2} fill="none" />
          ))}
        </Deco>
        {pericondrio}
      </E>
      <E id="matriz-territorial">{territoriais}</E>
      <E id="grupo-isogeno">{isogenos}</E>
      <E id="lacuna">{lacunas}</E>
      <E id="condrocito">{condrocitos}</E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_OSSO = ['osteon', 'canal-de-havers', 'lamelas-concentricas', 'osteocito', 'canaliculos', 'canal-de-volkmann', 'lamelas-intersticiais'];
/** Osso compacto por desgaste (sem coloração): ósteons, canais de Havers e Volkmann, lacunas e canalículos. */
export function LaminaOsso(rng: Rng) {
  const osteons: [number, number, number][] = [
    [190, 200, 150], [520, 170, 135], [840, 230, 150], [330, 520, 160], [700, 520, 150],
  ];
  const lamelas: ReactElement[] = [];
  const osteocitos: ReactElement[] = [];
  const canaliculos: ReactElement[] = [];
  osteons.forEach(([x, y, r], o) => {
    for (let k = 1; k <= 6; k++) {
      lamelas.push(<circle key={`${o}-${k}`} cx={x} cy={y} r={28 + k * ((r - 30) / 6)} fill="none" stroke={HE.ossoLinha} strokeWidth={1.6} opacity={0.75} />);
    }
    for (let k = 1; k <= 5; k++) {
      const rr = 28 + (k + 0.5) * ((r - 30) / 6);
      const n = Math.round((2 * Math.PI * rr) / 70);
      for (let i = 0; i < n; i++) {
        const a = (2 * Math.PI * i) / n + entre(rng, -0.1, 0.1) + k;
        const cx = x + Math.cos(a) * rr;
        const cy = y + Math.sin(a) * rr;
        const ang = (a * 180) / Math.PI + 90;
        osteocitos.push(<ellipse key={`${o}-${k}-${i}`} cx={cx} cy={cy} rx={9} ry={3.4} transform={`rotate(${ang} ${cx} ${cy})`} fill={HE.ossoEscuro} />);
        canaliculos.push(
          <g key={`${o}-${k}-${i}`}>
            {[-1, 1].map((s) =>
              [-0.5, 0, 0.5].map((d) => (
                <line key={`${s}${d}`} x1={cx} y1={cy} x2={cx + Math.cos(a + d) * s * 18} y2={cy + Math.sin(a + d) * s * 18} stroke={HE.ossoEscuro} strokeWidth={0.9} />
              )),
            )}
          </g>,
        );
      }
    }
  });
  return (
    <>
      <E id="lamelas-intersticiais">
        <rect width={W} height={H} fill={HE.ossoMatriz} />
        <Deco>
          {Array.from({ length: 18 }, (_, k) => {
            const x = entre(rng, 0, W);
            const y = entre(rng, 0, H);
            return <path key={k} d={`M${x},${y} a ${entre(rng, 60, 110)},${entre(rng, 60, 110)} 0 0 1 ${entre(rng, 40, 90)},${entre(rng, 40, 80)}`} fill="none" stroke={HE.ossoLinha} strokeWidth={1.4} opacity={0.6} />;
          })}
        </Deco>
      </E>
      <E id="osteon">
        {osteons.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#e3d5be" stroke="#6f5c3e" strokeWidth={3} />
        ))}
      </E>
      <E id="lamelas-concentricas">{lamelas}</E>
      <E id="canaliculos">{canaliculos}</E>
      <E id="osteocito">{osteocitos}</E>
      <E id="canal-de-volkmann">
        <path d="M520,170 L330,520" stroke="#2f2418" strokeWidth={16} strokeLinecap="round" />
      </E>
      <E id="canal-de-havers">
        {osteons.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={22} fill="#2f2418" />
        ))}
      </E>
    </>
  );
}

// ---------------------------------------------------------------------------------------------
export const PARTES_SANGUE = ['hemacia', 'neutrofilo', 'eosinofilo', 'basofilo', 'linfocito', 'monocito', 'plaquetas'];
/** Esfregaço de sangue periférico corado por Leishman/Wright. */
export function LaminaSangue(rng: Rng) {
  const leucos = {
    neutrofilo: [[220, 200], [760, 470]] as [number, number][],
    eosinofilo: [[560, 160]] as [number, number][],
    basofilo: [[880, 220]] as [number, number][],
    linfocito: [[380, 480], [620, 600]] as [number, number][],
    monocito: [[140, 520]] as [number, number][],
  };
  const ocupados = Object.values(leucos).flat();
  const hemacias = grade(rng, 46, [0, 0, W, H], 0.35).filter(([x, y]) => ocupados.every(([lx, ly]) => Math.hypot(lx - x, ly - y) > 48));
  const plaquetas = Array.from({ length: 22 }, () => [entre(rng, 20, W - 20), entre(rng, 20, H - 20)] as [number, number]);
  return (
    <>
      <rect width={W} height={H} fill="#f8f2f5" />
      <E id="hemacia">
        {hemacias.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={19} fill={HE.hemaciaEsfregaco} />
            <circle cx={x} cy={y} r={8} fill={HE.hemaciaCentro} />
          </g>
        ))}
      </E>
      <E id="plaquetas">
        {plaquetas.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={entre(rng, 3, 4.5)} fill={HE.plaqueta} />
        ))}
      </E>
      <E id="neutrofilo">
        {leucos.neutrofilo.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={28} fill="#efd7e6" />
            {Array.from({ length: 40 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -22, 22)} cy={y + entre(rng, -22, 22)} r={1.3} fill="#c79ac0" />
            ))}
            {[[-10, -6], [2, -10], [12, 0], [0, 10]].map(([dx, dy], k) => (
              <ellipse key={k} cx={x + dx} cy={y + dy} rx={7} ry={6} fill={HE.nucleoLeuco} />
            ))}
          </g>
        ))}
      </E>
      <E id="eosinofilo">
        {leucos.eosinofilo.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={29} fill="#f3d5c9" />
            {Array.from({ length: 60 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -23, 23)} cy={y + entre(rng, -23, 23)} r={2.6} fill={HE.graoEosino} />
            ))}
            <ellipse cx={x - 9} cy={y} rx={9} ry={10} fill={HE.nucleoLeuco} />
            <ellipse cx={x + 9} cy={y} rx={9} ry={10} fill={HE.nucleoLeuco} />
          </g>
        ))}
      </E>
      <E id="basofilo">
        {leucos.basofilo.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={26} fill="#d9cdea" />
            <ellipse cx={x} cy={y} rx={13} ry={11} fill={HE.nucleoLeuco} />
            {Array.from({ length: 55 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -21, 21)} cy={y + entre(rng, -21, 21)} r={2.8} fill={HE.graoBaso} />
            ))}
          </g>
        ))}
      </E>
      <E id="linfocito">
        {leucos.linfocito.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={22} fill={HE.citoLinfo} />
            <circle cx={x + 2} cy={y} r={18} fill="#3d2b7a" />
          </g>
        ))}
      </E>
      <E id="monocito">
        {leucos.monocito.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={38} fill={HE.citoMono} />
            <path d={`M${x - 22},${y - 8} q12,-22 34,-10 q10,8 4,22 q-8,-10 -18,-2 q-14,10 -20,-10 Z`} fill="#5b4596" />
          </g>
        ))}
      </E>
    </>
  );
}
