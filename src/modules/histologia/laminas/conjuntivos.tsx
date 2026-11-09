// Lâminas de tecido conjuntivo, adiposo, cartilagem, osso e sangue.
import type { ReactElement } from 'react';
import { Deco, E, H, HE, W, entre, grade, poli, textura, type Rng } from '../he.tsx';

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
    const ex = entre(rng, 120, 220);
    const ey = entre(rng, -40, 40);
    let d = `M${x0},${y0} q ${entre(rng, 40, 90)},${entre(rng, -50, 50)} ${ex},${ey} t ${entre(rng, 80, 160)},${entre(rng, -30, 30)}`;
    // fibras elásticas ramificadas: um ramo fino sai do meio de boa parte delas
    if (rng() < 0.65) {
      const lado = rng() < 0.5 ? -1 : 1;
      d += ` M${(x0 + ex).toFixed(1)},${(y0 + ey).toFixed(1)} q ${entre(rng, 30, 60)},${lado * entre(rng, 15, 35)} ${entre(rng, 70, 130)},${lado * entre(rng, 50, 100)}`;
    }
    elasticas.push(<path key={k} d={d} stroke="#8c3d6b" strokeWidth={1.8} fill="none" />);
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
/** Célula de Voronoi de `c` (limitada a um círculo de raio rMax): vizinhos compartilham a mesma borda, sem vãos. */
function celulaVoronoi(c: [number, number], vizinhos: [number, number][], rMax: number): [number, number][] {
  let pol: [number, number][] = Array.from({ length: 12 }, (_, k) => [c[0] + Math.cos((Math.PI / 6) * k) * rMax, c[1] + Math.sin((Math.PI / 6) * k) * rMax]);
  for (const v of vizinhos) {
    const nx = v[0] - c[0];
    const ny = v[1] - c[1];
    const d2 = nx * nx + ny * ny;
    if (!d2 || d2 > 4 * rMax * rMax) continue;
    const mx = (c[0] + v[0]) / 2;
    const my = (c[1] + v[1]) / 2;
    const lado = (p: [number, number]) => (p[0] - mx) * nx + (p[1] - my) * ny;
    const novo: [number, number][] = [];
    pol.forEach((a, i) => {
      const b = pol[(i + 1) % pol.length];
      const la = lado(a);
      const lb = lado(b);
      if (la <= 0) novo.push(a);
      if ((la < 0 && lb > 0) || (la > 0 && lb < 0)) {
        const t = la / (la - lb);
        novo.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    });
    pol = novo;
  }
  return pol;
}

export const PARTES_ADIPOSO = ['adipocito-unilocular', 'septo-conjuntivo', 'capilar'];
/** Tecido adiposo unilocular (branco): adipócitos com gota lipídica única (extraída no preparo) e núcleo periférico. */
export function LaminaAdiposo(rng: Rng) {
  const centros = grade(rng, 92, [0, 0, W, H], 0.18).filter(([x]) => Math.abs(x - 600) > 40);
  const capilares: [number, number][] = [];
  return (
    <>
      <rect width={W} height={H} fill={HE.colagenoClaro} />
      <E id="adipocito-unilocular">
        {centros.map(([x, y], i) => {
          // bordas compartilhadas com as vizinhas: a orla de citoplasma de duas células vizinhas se toca
          const pts = celulaVoronoi([x, y], centros, 58);
          if (i % 5 === 2) capilares.push([pts[0][0], pts[0][1]]);
          // núcleo achatado em crescente, por dentro da orla, no lado mais longo da célula
          let nucleo: ReactElement | null = null;
          if (i % 3 === 0) {
            let melhor = 0;
            pts.forEach((p, k) => {
              const q = pts[(k + 1) % pts.length];
              const r = pts[(melhor + 1) % pts.length];
              if (Math.hypot(q[0] - p[0], q[1] - p[1]) > Math.hypot(r[0] - pts[melhor][0], r[1] - pts[melhor][1])) melhor = k;
            });
            const [ax, ay] = pts[melhor];
            const [bx, by] = pts[(melhor + 1) % pts.length];
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2;
            const dc = Math.hypot(x - mx, y - my) || 1;
            const cx = mx + ((x - mx) / dc) * 5;
            const cy = my + ((y - my) / dc) * 5;
            const ang = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
            nucleo = <ellipse cx={cx} cy={cy} rx={Math.min(13, Math.hypot(bx - ax, by - ay) * 0.4)} ry={3.2} transform={`rotate(${ang} ${cx} ${cy})`} fill={HE.nucleo} />;
          }
          return (
            <g key={i}>
              <path d={poli(pts)} fill={HE.luz} stroke="#d77aa3" strokeWidth={3} strokeLinejoin="round" />
              {nucleo}
            </g>
          );
        })}
      </E>
      {/* septo por cima: os adipócitos terminam na borda do conjuntivo */}
      <E id="septo-conjuntivo">
        <path d="M560,0 C600,160 650,300 610,420 S 640,620 660,700 L720,700 C700,600 690,440 690,420 S 640,160 610,0 Z" fill={HE.colageno} />
        <Deco>
          {Array.from({ length: 10 }, (_, k) => (
            <ellipse key={k} cx={entre(rng, 600, 660)} cy={entre(rng, 10, 690)} rx={8} ry={3} fill={HE.nucleo} />
          ))}
        </Deco>
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
  const grupos = grade(rng, 120, [40, yPeri + 95, W - 40, H - 30], 0.14);
  const RX = 12.5; // semieixos da lacuna
  const RY = 10;
  const condrocitos: ReactElement[] = [];
  const lacunas: ReactElement[] = [];
  const territoriais: ReactElement[] = [];
  const isogenos: ReactElement[] = [];
  const celula = (key: string, cx: number, cy: number, ang: number, rx: number, ry: number) => {
    lacunas.push(<ellipse key={key} cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${ang} ${cx} ${cy})`} fill="#f4f0f8" />);
    // o condrócito se retrai no preparo e não ocupa toda a lacuna
    condrocitos.push(
      <g key={key} transform={`rotate(${ang} ${cx} ${cy})`}>
        <ellipse cx={cx - 1} cy={cy} rx={rx - 3} ry={ry - 2.5} fill={HE.citoplasmaClaro} />
        <ellipse cx={cx - 1.5} cy={cy} rx={Math.min(4, rx - 5)} ry={Math.min(3.8, ry - 4.5)} fill={HE.nucleo} />
      </g>,
    );
  };
  grupos.forEach(([x, y], g) => {
    const n = 2 + (g % 3);
    const giro = entre(rng, 0, Math.PI);
    // cada condrócito na sua lacuna, separado do vizinho por um septo fino de matriz (centro a centro ≥ 2·RX + 4)
    const offsets: [number, number][] =
      n === 2 ? [[-15, 0], [15, 0]] : n === 3 ? [0, 1, 2].map((k) => [Math.cos((2 * Math.PI * k) / 3) * 17.5, Math.sin((2 * Math.PI * k) / 3) * 17.5]) : [[-15, -15], [15, -15], [15, 15], [-15, 15]];
    let raio = 0;
    offsets.forEach(([ox, oy], c) => {
      const cx = x + ox * Math.cos(giro) - oy * Math.sin(giro);
      const cy = y + ox * Math.sin(giro) + oy * Math.cos(giro);
      // faces voltadas para as vizinhas achatadas: eixo maior perpendicular à direção do centro do grupo
      const ang = ((Math.atan2(cy - y, cx - x) + Math.PI / 2) * 180) / Math.PI;
      celula(`${g}-${c}`, cx, cy, n === 4 ? (giro * 180) / Math.PI : ang, RX, RY);
      raio = Math.max(raio, Math.hypot(ox, oy) + RX);
    });
    territoriais.push(<circle key={g} cx={x} cy={y} r={raio + 24} fill="url(#cartilagem-territorial)" />);
    isogenos.push(<circle key={g} cx={x} cy={y} r={raio + 3} fill="transparent" />);
  });
  // condrócitos jovens, achatados, logo abaixo do pericôndrio (crescimento aposicional)
  for (let x = 30; x < W; x += 62) {
    const cx = x + entre(rng, -12, 12);
    celula(`j${x}`, cx, yPeri + 24 + entre(rng, -3, 3), entre(rng, -6, 6), 17, 6.5);
  }
  return (
    <>
      <defs>
        {/* matriz territorial: halo com gradiente; onde dois halos se cruzam, as bordas transparentes não escurecem */}
        <radialGradient id="cartilagem-territorial">
          <stop offset="0" stopColor={HE.basofiloEscuro} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={HE.basofiloEscuro} stopOpacity={0.8} />
          <stop offset="1" stopColor={HE.basofiloEscuro} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="cartilagem-transicao" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={HE.colageno} stopOpacity={1} />
          <stop offset="1" stopColor={HE.colageno} stopOpacity={0} />
        </linearGradient>
      </defs>
      <E id="matriz-interterritorial">
        <rect y={yPeri - 8} width={W} height={H - yPeri + 8} fill={HE.basofilo} />
        {textura(rng, 300, HE.basofiloEscuro, [0, yPeri, W, H])}
      </E>
      <E id="pericondrio">
        <rect width={W} height={yPeri - 2} fill={HE.colageno} />
        <Deco>
          {/* camada fibrosa externa: feixes de colágeno */}
          {Array.from({ length: 7 }, (_, k) => (
            <path key={k} d={`M0,${12 + k * 10} C300,${7 + k * 10} 700,${19 + k * 10} ${W},${11 + k * 10}`} stroke="#d77aa3" strokeWidth={2} fill="none" />
          ))}
          {/* transição gradual do pericôndrio para a matriz cartilaginosa */}
          <rect y={yPeri - 3} width={W} height={26} fill="url(#cartilagem-transicao)" />
        </Deco>
        {/* fibrosa: núcleos finos e alongados de fibroblastos */}
        {Array.from({ length: 18 }, (_, k) => (
          <ellipse key={`f${k}`} cx={entre(rng, 0, W)} cy={entre(rng, 14, 78)} rx={16} ry={3} fill={HE.nucleo} />
        ))}
        {/* condrogênica (interna): núcleos ovais mais volumosos de células condrogênicas */}
        {Array.from({ length: 16 }, (_, k) => (
          <ellipse key={`c${k}`} cx={entre(rng, 0, W)} cy={entre(rng, 90, yPeri - 8)} rx={10} ry={4.8} fill={HE.nucleo} />
        ))}
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
  // ósteons próximos entre si (pouco osso intersticial), com linha cimentante levemente irregular
  const osteons: [number, number, number][] = [
    [175, 175, 145], [480, 150, 135], [800, 185, 150], [320, 480, 150], [640, 470, 145], [935, 520, 110], [40, 545, 100],
  ];
  const RC = 22; // raio do canal de Havers
  const ZONAS = 6; // lamelas por ósteon
  const formas = osteons.map(() => [entre(rng, 0, 6.3), entre(rng, 0, 6.3)]);
  /** Distância do centro do ósteon `o`, na direção `a`, da fração `f` entre o canal (0) e a linha cimentante (1). */
  const raioEm = (o: number, a: number, f: number) => {
    const r = osteons[o][2] * (1 + 0.045 * Math.sin(2 * a + formas[o][0]) + 0.03 * Math.sin(3 * a + formas[o][1]));
    return RC + (r - RC) * f;
  };
  const contorno = (o: number, f: number) => {
    const [x, y] = osteons[o];
    return poli(Array.from({ length: 48 }, (_, k) => {
      const a = (2 * Math.PI * k) / 48;
      const r = raioEm(o, a, f);
      return [x + Math.cos(a) * r, y + Math.sin(a) * r] as [number, number];
    }));
  };
  const foraDosOsteons = (px: number, py: number, folga: number) =>
    osteons.every(([x, y], o) => Math.hypot(px - x, py - y) > raioEm(o, Math.atan2(py - y, px - x), 1) + folga);
  const f = (n: number) => n.toFixed(1);
  // canalículo: curva sinuosa e fina de P a Q
  const canal = (px: number, py: number, qx: number, qy: number) => {
    const d = Math.hypot(qx - px, qy - py) || 1;
    const s = entre(rng, -0.14, 0.14) * d;
    return `M${f(px)},${f(py)}Q${f((px + qx) / 2 - ((qy - py) / d) * s)},${f((py + qy) / 2 + ((qx - px) / d) * s)} ${f(qx)},${f(qy)}`;
  };
  const curtos = (px: number, py: number, n: number) => {
    let d = '';
    for (let k = 0; k < n; k++) {
      const a = entre(rng, 0, Math.PI * 2);
      const l = entre(rng, 6, 9);
      d += canal(px, py, px + Math.cos(a) * l, py + Math.sin(a) * l);
    }
    return d;
  };

  const lamelas: ReactElement[] = [];
  const lacunas: ReactElement[] = [];
  const canaliculos: string[] = [];
  const lacuna = (key: string, x: number, y: number, ang: number) =>
    lacunas.push(<ellipse key={key} cx={f(x)} cy={f(y)} rx={8.5} ry={3.2} transform={`rotate(${f(ang)} ${f(x)} ${f(y)})`} fill={HE.ossoEscuro} />);

  osteons.forEach(([x, y], o) => {
    for (let k = 1; k < ZONAS; k++) lamelas.push(<path key={`${o}-${k}`} d={contorno(o, k / ZONAS)} />);
    // lacunas entre as lamelas, alongadas paralelas a elas; anéis de dentro para fora
    const aneis: { a: number; x: number; y: number }[][] = [];
    for (let k = 0; k < ZONAS; k++) {
      const fr = (k + 0.5) / ZONAS;
      const rm = raioEm(o, 0, fr);
      const n = Math.max(4, Math.round((2 * Math.PI * rm) / 58));
      const giro = entre(rng, 0, Math.PI * 2);
      const anel = Array.from({ length: n }, (_, i) => {
        const a = giro + (2 * Math.PI * i) / n + entre(rng, -0.12, 0.12);
        const r = raioEm(o, a, fr);
        return { a, x: x + Math.cos(a) * r, y: y + Math.sin(a) * r };
      });
      aneis.push(anel);
    }
    let d = '';
    aneis.forEach((anel, k) => {
      anel.forEach((p, i) => {
        lacuna(`${o}-${k}-${i}`, p.x, p.y, (p.a * 180) / Math.PI + 90);
        if (k === 0) {
          // 1ª fileira: canalículos até o canal de Havers
          for (const da of [-0.18, 0.18]) d += canal(p.x, p.y, x + Math.cos(p.a + da) * (RC - 1), y + Math.sin(p.a + da) * (RC - 1));
        } else {
          // sobretudo radiais (perpendiculares às lamelas): ligam a lacuna às vizinhas da lamela de dentro;
          // sem vizinha perto, o canalículo segue para dentro e encontra os da lamela seguinte
          const zona = raioEm(o, p.a, (k + 0.5) / ZONAS) - raioEm(o, p.a, (k - 0.5) / ZONAS);
          const dist = (q: { x: number; y: number }) => Math.hypot(q.x - p.x, q.y - p.y);
          const perto = aneis[k - 1].filter((q) => dist(q) < zona * 1.9).sort((u, v) => dist(u) - dist(v)).slice(0, 2);
          perto.forEach((q) => (d += canal(p.x, p.y, q.x, q.y)));
          for (let m = perto.length; m < 2; m++) {
            const a = p.a + entre(rng, -0.12, 0.12);
            const r = raioEm(o, a, (k + 0.5) / ZONAS) - zona * 0.9;
            d += canal(p.x, p.y, x + Math.cos(a) * r, y + Math.sin(a) * r);
          }
        }
        if (k === ZONAS - 1) {
          // última fileira: param na linha cimentante, sem atravessá-la
          for (const da of [-0.1, 0.1]) {
            const r = raioEm(o, p.a + da, 1) - 2;
            d += canal(p.x, p.y, x + Math.cos(p.a + da) * r, y + Math.sin(p.a + da) * r);
          }
        }
        // algumas ligações laterais curtas, dentro da mesma lamela
        if (rng() < 0.25) {
          const q = anel[(i + 1) % anel.length];
          if (Math.hypot(q.x - p.x, q.y - p.y) < 45) d += canal(p.x, p.y, q.x, q.y);
        }
        d += curtos(p.x, p.y, 2);
      });
    });
    canaliculos.push(d);
  });

  // lamelas intersticiais: restos de ósteons antigos nos espaços entre os ósteons atuais, também com lacunas
  const ancoras: [number, number][] = [];
  for (let y = 10; y < H; y += 20) {
    for (let x = 10; x < W; x += 20) {
      if (foraDosOsteons(x, y, 26) && ancoras.every(([ax, ay]) => Math.hypot(ax - x, ay - y) > 160)) ancoras.push([x, y]);
    }
  }
  const arcos: ReactElement[] = [];
  let dInter = '';
  ancoras.forEach(([gx, gy], g) => {
    const dir = entre(rng, 0, Math.PI * 2);
    const R = entre(rng, 110, 170);
    const cx = gx + Math.cos(dir) * R;
    const cy = gy + Math.sin(dir) * R;
    const a0 = Math.atan2(gy - cy, gx - cx);
    for (let j = -2; j <= 2; j++) {
      const rr = R + j * 16;
      const p = (a: number) => `${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)}`;
      arcos.push(<path key={`${g}-${j}`} d={`M${p(a0 - 0.6)} A${f(rr)},${f(rr)} 0 0 1 ${p(a0 + 0.6)}`} />);
      if (j === 2 || j === -2) continue;
      const rl = rr + 8;
      for (let a = a0 - 0.6 + entre(rng, 0, 0.2); a < a0 + 0.6; a += 50 / rl) {
        const lx = cx + Math.cos(a) * rl;
        const ly = cy + Math.sin(a) * rl;
        if (lx < -10 || lx > W + 10 || ly < -10 || ly > H + 10 || !foraDosOsteons(lx, ly, 12)) continue;
        lacuna(`i${g}-${j}-${a.toFixed(2)}`, lx, ly, (a * 180) / Math.PI + 90);
        // canalículos atravessando as lamelas (para dentro e para fora do arco), mais os curtos
        for (const s of [-1, 1]) dInter += canal(lx, ly, lx + Math.cos(a) * s * entre(rng, 13, 18), ly + Math.sin(a) * s * entre(rng, 13, 18));
        dInter += curtos(lx, ly, 3);
      }
    }
  });
  canaliculos.push(dInter);

  return (
    <>
      <E id="lamelas-intersticiais">
        <rect width={W} height={H} fill={HE.ossoMatriz} />
        <g fill="none" stroke={HE.ossoLinha} strokeWidth={1.4} opacity={0.6}>
          {arcos}
        </g>
      </E>
      <E id="osteon">
        {osteons.map((_, o) => (
          <path key={o} d={contorno(o, 1)} fill="#e3d5be" stroke="#6f5c3e" strokeWidth={3} />
        ))}
      </E>
      <E id="lamelas-concentricas">
        {/* traço visível fino; faixa transparente mais larga só para facilitar o toque */}
        <g fill="none" stroke="transparent" strokeWidth={5}>
          {lamelas}
        </g>
        <g fill="none" stroke={HE.ossoLinha} strokeWidth={1.6} opacity={0.75} style={{ pointerEvents: 'none' }}>
          {lamelas}
        </g>
      </E>
      <E id="canaliculos">
        {canaliculos.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="transparent" strokeWidth={2.4} />
            <path d={d} fill="none" stroke={HE.ossoEscuro} strokeWidth={0.65} style={{ pointerEvents: 'none' }} />
          </g>
        ))}
      </E>
      <E id="osteocito">{lacunas}</E>
      <E id="canal-de-volkmann">
        {/* calibre próximo ao do canal de Havers; atravessa as lamelas sem ter lamelas próprias */}
        <path d="M480,150 L320,480" stroke="#2f2418" strokeWidth={30} />
      </E>
      <E id="canal-de-havers">
        {osteons.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={RC} fill="#2f2418" />
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
  const raioLeuco: Record<keyof typeof leucos, number> = { neutrofilo: 28, eosinofilo: 29, basofilo: 26, linfocito: 22, monocito: 38 };
  const ocupados = Object.values(leucos).flat();
  const hemacias = grade(rng, 46, [0, 0, W, H], 0.35).filter(([x, y]) => ocupados.every(([lx, ly]) => Math.hypot(lx - x, ly - y) > 48));
  const RH = 19; // raio da hemácia
  // plaquetas só no plasma, entre as hemácias (sobre uma hemácia imitariam inclusões: Howell-Jolly, plasmódio)
  const leucoCirculos = (Object.keys(leucos) as (keyof typeof leucos)[]).flatMap((k) => leucos[k].map(([x, y]) => [x, y, raioLeuco[k]] as const));
  const plaquetas: [number, number, number][] = [];
  const livre = (x: number, y: number, r: number) =>
    hemacias.every(([hx, hy]) => Math.hypot(hx - x, hy - y) > RH + r + 1.5) &&
    leucoCirculos.every(([lx, ly, lr]) => Math.hypot(lx - x, ly - y) > lr + r + 3) &&
    plaquetas.every(([px, py, pr]) => Math.hypot(px - x, py - y) > pr + r + 0.8);
  for (let t = 0; t < 4000 && plaquetas.length < 24; t++) {
    const x = entre(rng, 12, W - 12);
    const y = entre(rng, 12, H - 12);
    const r = entre(rng, 4.4, 5.8);
    if (!livre(x, y, r)) continue;
    plaquetas.push([x, y, r]);
    // às vezes em pequenos grupos de 2 a 3
    if (rng() < 0.35) {
      for (let k = 0; k < 2; k++) {
        const a = entre(rng, 0, 2 * Math.PI);
        const r2 = entre(rng, 3.8, 5);
        const x2 = x + Math.cos(a) * (r + r2 + 1.5);
        const y2 = y + Math.sin(a) * (r + r2 + 1.5);
        if (livre(x2, y2, r2)) plaquetas.push([x2, y2, r2]);
      }
    }
  }
  return (
    <>
      <rect width={W} height={H} fill="#f8f2f5" />
      <E id="hemacia">
        {hemacias.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={RH} fill={HE.hemaciaEsfregaco} />
            {/* palidez central ≈ 1/3 do diâmetro (normocromia) */}
            <circle cx={x} cy={y} r={RH / 3} fill={HE.hemaciaCentro} />
          </g>
        ))}
      </E>
      <E id="plaquetas">
        {plaquetas.map(([x, y, r], i) => (
          <g key={i}>
            {/* hialômero claro e irregular; granulômero roxo no centro */}
            <path d={poli(Array.from({ length: 7 }, (_, k) => {
              const a = (2 * Math.PI * k) / 7;
              const rr = r * entre(rng, 0.75, 1.15);
              return [x + Math.cos(a) * rr, y + Math.sin(a) * rr] as [number, number];
            }))} fill="#d6c4ea" />
            {Array.from({ length: 3 }, (_, k) => (
              <circle key={k} cx={x + entre(rng, -0.4, 0.4) * r} cy={y + entre(rng, -0.4, 0.4) * r} r={entre(rng, 1.1, 1.7)} fill={HE.plaqueta} />
            ))}
          </g>
        ))}
      </E>
      <E id="neutrofilo">
        {leucos.neutrofilo.map(([x, y], i) => {
          // 2 a 5 lóbulos (em geral 3) unidos por filamentos finos de cromatina
          const lobulos: [number, number][] = i === 0 ? [[-14, -6], [2, -14], [15, 0], [2, 13]] : [[-12, 3], [1, -11], [13, 5]];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={28} fill="#efd7e6" />
              {Array.from({ length: 40 }, (_, k) => (
                <circle key={k} cx={x + entre(rng, -22, 22)} cy={y + entre(rng, -22, 22)} r={1.3} fill="#c79ac0" />
              ))}
              <path d={`M${lobulos.map(([dx, dy]) => `${x + dx},${y + dy}`).join(' L')}`} stroke={HE.nucleoLeuco} strokeWidth={2.2} fill="none" />
              {lobulos.map(([dx, dy], k) => (
                <ellipse key={k} cx={x + dx} cy={y + dy} rx={7.6} ry={6.3} transform={`rotate(${entre(rng, 0, 180)} ${x + dx} ${y + dy})`} fill={HE.nucleoLeuco} />
              ))}
            </g>
          );
        })}
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
