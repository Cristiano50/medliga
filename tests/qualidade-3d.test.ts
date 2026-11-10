import { afterEach, describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { acceleratedRaycast } from 'three-mesh-bvh';
import {
  alvoDpr,
  CHAVE_QUALIDADE,
  CHAVE_QUALIDADE_AUTO,
  DPR_MINIMO,
  fatorEmbriao,
  fatorSegmentos,
  forcarNivel,
  nivelAtual,
  nivelPorDispositivo,
  NIVEIS,
  PARAMETROS,
  rebaixarNivel,
  definirNivel,
} from '../src/modules/tres3d/qualidade.ts';
import { classificarGeometria, contarCena, prepararMalhas, refinarGeometria, triangulosDaGeometria } from '../src/modules/tres3d/refinar.ts';
import { intersecoesDoToque, resolverToque } from '../src/modules/embriologia/tres/nucleo.tsx';
import { perfilDoModelo, PERFIS } from '../src/modules/tres3d/perfis.ts';
import { MODELOS } from '../src/modules/embriologia/modelos/index.ts';

afterEach(() => {
  forcarNivel(null);
  localStorage.clear();
  definirNivel(null);
});

describe('nível de qualidade', () => {
  it('escolhe pelo dispositivo: economia/memória baixa → baixa; celular potente → alta; celular comum → média', () => {
    expect(nivelPorDispositivo({ economia: true, memoriaGB: 16, nucleos: 16 })).toBe('baixa');
    expect(nivelPorDispositivo({ memoriaGB: 2, nucleos: 8 })).toBe('baixa');
    expect(nivelPorDispositivo({ nucleos: 2 })).toBe('baixa');
    expect(nivelPorDispositivo({ toque: true, memoriaGB: 8, nucleos: 8 })).toBe('alta');
    expect(nivelPorDispositivo({ toque: true, memoriaGB: 4, nucleos: 8 })).toBe('media');
    expect(nivelPorDispositivo({ toque: true, nucleos: 6 })).toBe('media');
    expect(nivelPorDispositivo({ toque: true, memoriaGB: 3, nucleos: 8 })).toBe('baixa');
    expect(nivelPorDispositivo({ memoriaGB: 8, nucleos: 8 })).toBe('alta');
    expect(nivelPorDispositivo({ memoriaGB: 3, nucleos: 8 })).toBe('media');
  });

  it('fator 1 em jsdom (sem WebGL), salvo nível forçado; embriões usam 1 / 1,25 / 1,5', () => {
    expect(fatorSegmentos()).toBe(1);
    forcarNivel('alta');
    expect(fatorSegmentos()).toBe(2);
    expect(fatorEmbriao()).toBe(1.5);
    forcarNivel('media');
    expect(fatorEmbriao()).toBe(1.25);
    forcarNivel(null);
    expect(fatorSegmentos()).toBe(1);
    expect(NIVEIS.map((n) => PARAMETROS[n].fator)).toEqual([1, 1.5, 2]);
  });

  it('override em localStorage; perda de contexto desce um nível e lembra só na escolha automática', () => {
    localStorage.setItem(CHAVE_QUALIDADE, 'alta');
    definirNivel('alta');
    expect(nivelAtual()).toBe('alta');
    expect(rebaixarNivel()).toBe('media');
    expect(nivelAtual()).toBe('media');
    expect(localStorage.getItem(CHAVE_QUALIDADE)).toBe('alta');
    expect(localStorage.getItem(CHAVE_QUALIDADE_AUTO)).toBeNull();
    definirNivel(null);
    forcarNivel('media');
    forcarNivel(null);
    const auto = nivelAtual();
    const esperado = NIVEIS[Math.max(0, NIVEIS.indexOf(auto) - 1)];
    expect(rebaixarNivel()).toBe(esperado);
    expect(localStorage.getItem(CHAVE_QUALIDADE_AUTO)).toBe(esperado);
  });
});

describe('alvoDpr', () => {
  const celular = { width: 358, height: 523 };
  const desktop = { width: 900, height: 560 };
  it('parado: superamostragem até o teto do nível; em movimento: até o dpr da tela e o teto de movimento', () => {
    expect(alvoDpr(celular, 2, 'alta', false)).toBe(3);
    expect(alvoDpr(celular, 2, 'alta', true)).toBe(2);
    expect(alvoDpr(celular, 3, 'baixa', false)).toBe(2);
    expect(alvoDpr(celular, 3, 'baixa', true)).toBe(1);
    expect(alvoDpr(celular, 3, 'media', false)).toBe(2.5);
    expect(alvoDpr(celular, 3, 'media', true)).toBe(1.5);
    expect(alvoDpr(desktop, 1, 'media', false)).toBe(1.25);
    expect(alvoDpr(desktop, 1, 'alta', true)).toBe(1);
  });
  it('respeita o teto de megapixels e a redução lembrada pelo monitor', () => {
    const grande = { width: 1600, height: 1000 };
    const parado = alvoDpr(grande, 3, 'alta', false);
    expect(parado * parado * grande.width * grande.height).toBeLessThanOrEqual(PARAMETROS.alta.megapixelsParado * 1e6);
    expect(parado).toBe(1.5);
    expect(alvoDpr(grande, 3, 'alta', true)).toBe(1);
    expect(alvoDpr(celular, 2, 'alta', true, 0.5)).toBe(1.5);
    expect(alvoDpr(celular, 2, 'alta', true, 5)).toBe(DPR_MINIMO);
  });
  it('nunca passa dos tetos e o movimento nunca fica acima do parado', () => {
    for (const nivel of NIVEIS) for (const tela of [1, 1.5, 2, 2.625, 3, 4]) for (const largura of [320, 390, 768, 1280, 2560]) {
      const tamanho = { width: largura, height: Math.round(largura * 0.7) };
      const p = alvoDpr(tamanho, tela, nivel, false);
      const m = alvoDpr(tamanho, tela, nivel, true);
      expect(p).toBeLessThanOrEqual(PARAMETROS[nivel].dprParado);
      expect(m).toBeLessThanOrEqual(Math.max(DPR_MINIMO, PARAMETROS[nivel].dprMovimento));
      expect(m).toBeLessThanOrEqual(p);
      expect((p * 4) % 1).toBe(0);
    }
  });
});

describe('refino de geometria paramétrica', () => {
  it('reconstrói no próprio objeto, é idempotente e volta ao original no fator 1', () => {
    const g = new THREE.SphereGeometry(0.5, 24, 16);
    const original = Float32Array.from(g.getAttribute('position').array);
    expect(refinarGeometria(g, 2)).toBe(true);
    expect(g.parameters.widthSegments).toBe(48);
    expect(g.parameters.heightSegments).toBe(32);
    expect(g.parameters.radius).toBe(0.5);
    expect(refinarGeometria(g, 2)).toBe(false);
    expect(refinarGeometria(g, 1)).toBe(true);
    expect(Array.from(g.getAttribute('position').array)).toEqual(Array.from(original));
  });

  it('não refina geometria transladada, girada ou com posições editadas', () => {
    const transladada = new THREE.SphereGeometry(1, 16, 12).translate(0.2, 0, 0);
    expect(refinarGeometria(transladada, 2)).toBe(false);
    expect(classificarGeometria(transladada).refinavel).toBe(false);
    const editada = new THREE.CylinderGeometry(1, 1, 1, 16);
    const p = editada.getAttribute('position');
    p.setX(0, p.getX(0) + 0.01);
    expect(refinarGeometria(editada, 2)).toBe(false);
    expect(classificarGeometria(editada).motivo).toBe('alterada');
    expect(classificarGeometria(new THREE.BoxGeometry()).refinavel).toBe(false);
    expect(classificarGeometria(new THREE.IcosahedronGeometry(1, 4)).refinavel).toBe(false);
  });

  it('refina todos os tipos previstos; extrusão de polígono não muda', () => {
    const forma = new THREE.Shape().absarc(0, 0, 1, 0, Math.PI * 2, false);
    const curva = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(1, 1, 0), new THREE.Vector3(2, 0, 0)]);
    const tipos: THREE.BufferGeometry[] = [
      new THREE.SphereGeometry(1, 16, 12),
      new THREE.CylinderGeometry(1, 1, 1, 16),
      new THREE.CapsuleGeometry(0.3, 1, 4, 8),
      new THREE.TubeGeometry(curva, 24, 0.1, 8),
      new THREE.TorusGeometry(1, 0.2, 8, 24),
      new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0.5), new THREE.Vector2(0, 1)], 16),
      new THREE.RingGeometry(0.5, 1, 24),
      new THREE.CircleGeometry(1, 24),
      new THREE.ExtrudeGeometry(forma, { depth: 0.2, bevelEnabled: false }),
    ];
    for (const g of tipos) {
      const antes = triangulosDaGeometria(g);
      expect(refinarGeometria(g, 2), g.type).toBe(true);
      expect(triangulosDaGeometria(g), g.type).toBeGreaterThan(antes);
    }
    const poligono = new THREE.ExtrudeGeometry(new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(1, 0), new THREE.Vector2(0, 1)]), { depth: 0.1, bevelEnabled: false });
    expect(refinarGeometria(poligono, 2)).toBe(false);
  });

  it('pula sombreamento plano, semRefino e objetos pequenos; usos pequenos de geometria refinada ficam com a cópia base', () => {
    const raiz = new THREE.Group();
    const padrao = new THREE.MeshStandardMaterial();
    const plano = new THREE.MeshStandardMaterial({ flatShading: true });
    const facetada = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), plano);
    const marcada = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), padrao);
    marcada.userData.semRefino = true;
    const pequena = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), padrao);
    pequena.scale.setScalar(0.02);
    const compartilhada = new THREE.SphereGeometry(1, 16, 12);
    const grande = new THREE.Mesh(compartilhada, padrao);
    grande.scale.setScalar(0.3);
    const somitos = Array.from({ length: 5 }, () => {
      const m = new THREE.Mesh(compartilhada, padrao);
      m.scale.setScalar(0.03);
      return m;
    });
    raiz.add(facetada, marcada, pequena, grande, ...somitos);
    const r = prepararMalhas(raiz, { raio: 1.5, fator: 2 });
    expect((facetada.geometry as THREE.SphereGeometry).parameters.widthSegments).toBe(12);
    expect((marcada.geometry as THREE.SphereGeometry).parameters.widthSegments).toBe(12);
    expect((pequena.geometry as THREE.SphereGeometry).parameters.widthSegments).toBe(12);
    expect(grande.geometry).toBe(compartilhada);
    expect(compartilhada.parameters.widthSegments).toBe(32);
    for (const s of somitos) {
      expect(s.geometry).not.toBe(compartilhada);
      expect((s.geometry as THREE.SphereGeometry).parameters.widthSegments).toBe(16);
    }
    expect(r.copiasBase).toBe(5);
    // Idempotente: uma segunda passada não muda nada.
    expect(prepararMalhas(raiz, { raio: 1.5, fator: 2 }).mudou).toBe(false);
    // Sem uso grande no "próximo modelo", a geometria de módulo volta ao fator 1 e os usos voltam à original.
    raiz.remove(grande);
    prepararMalhas(raiz, { raio: 1.5, fator: 2 });
    expect(compartilhada.parameters.widthSegments).toBe(16);
    for (const s of somitos) expect(s.geometry).toBe(compartilhada);
    expect(contarCena(raiz).malhas).toBe(8);
  });

  it('BVH nas malhas densas mantém as interseções e a escolha do toque por prioridade', () => {
    const casca = new THREE.Group();
    casca.userData.parteId = 'casca';
    casca.userData.prioridade = 1;
    const interna = new THREE.Group();
    interna.userData.parteId = 'interna';
    interna.userData.prioridade = 7;
    const malhaCasca = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, transparent: true, opacity: 0.3 }));
    const malhaInterna = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 24), new THREE.MeshStandardMaterial());
    casca.add(malhaCasca);
    interna.add(malhaInterna);
    const raiz = new THREE.Group();
    raiz.add(casca, interna);
    const raio = new THREE.Raycaster(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
    raiz.updateMatrixWorld(true);
    const antes = raio.intersectObject(raiz, true).map((i) => [i.object.uuid, +i.distance.toFixed(5)]);
    prepararMalhas(raiz, { raio: 1.3, fator: 2 });
    expect(malhaCasca.geometry.boundsTree).toBeTruthy();
    expect(malhaCasca.raycast).toBe(acceleratedRaycast);
    const depois = raio.intersectObject(raiz, true);
    expect(depois.map((i) => i.object.uuid)).toEqual(antes.map((i) => i[0]));
    for (let i = 0; i < depois.length; i++) expect(depois[i].distance).toBeCloseTo(antes[i][1] as number, 2);
    expect(resolverToque(depois)).toBe('interna');
    // Corte entre a casca e a estrutura interna: a frente da casca fica de fora, a interna continua tocável;
    // corte que passa pelo meio da interna (FrontSide) deixa só a parede de trás da casca.
    expect(resolverToque(depois, [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.5)])).toBe('interna');
    expect(resolverToque(depois, [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)])).toBe('casca');
    // Fora da interna, só a casca responde.
    const lateral = new THREE.Raycaster(new THREE.Vector3(0.7, 0, 5), new THREE.Vector3(0, 0, -1));
    expect(resolverToque(lateral.intersectObject(raiz, true))).toBe('casca');
  });
});

describe('toque com o corte ligado', () => {
  it('uma malha única atravessada pelo plano de corte continua tocável pela metade visível', () => {
    const parte = new THREE.Group();
    parte.userData.parteId = 'placas';
    parte.userData.prioridade = 5;
    const malha = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 36), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide }));
    parte.add(malha);
    const interna = new THREE.Group();
    interna.userData.parteId = 'interna';
    interna.userData.prioridade = 8;
    interna.add(new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })));
    interna.position.set(-0.5, 0, 0.5); // inteira na metade cortada
    const raiz = new THREE.Group();
    raiz.add(parte, interna);
    raiz.updateMatrixWorld(true);
    const plano = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0); // como no Cena3D: corta z > 0, o lado da câmera
    const raio = new THREE.Ray(new THREE.Vector3(0.2, 0.1, 5), new THREE.Vector3(0, 0, -1));
    const todas = intersecoesDoToque(raiz, raio);
    // O evento do R3F traz uma interseção por malha (a mais próxima), que aqui cai na metade cortada:
    const umaPorMalha = todas.filter((it, i) => todas.findIndex((x) => x.object === it.object) === i);
    expect(umaPorMalha).toHaveLength(1);
    expect(plano.distanceToPoint(umaPorMalha[0].point)).toBeLessThan(0);
    expect(resolverToque(umaPorMalha, [plano])).toBeNull();
    // Com todas as interseções, a parede de trás (visível) responde.
    expect(todas).toHaveLength(2);
    expect(resolverToque(todas, [plano])).toBe('placas');
    // Malha densa com BVH: o raycast acelerado também devolve todas as interseções.
    prepararMalhas(raiz, { raio: 1, fator: 2 });
    expect(malha.geometry.boundsTree).toBeTruthy();
    expect(intersecoesDoToque(raiz, raio)).toHaveLength(2);
    expect(resolverToque(intersecoesDoToque(raiz, raio), [plano])).toBe('placas');
    // Uma parte de prioridade maior, mas inteira na metade cortada, não rouba o toque.
    const pelaInterna = new THREE.Ray(new THREE.Vector3(-0.5, 0, 5), new THREE.Vector3(0, 0, -1));
    expect(resolverToque(intersecoesDoToque(raiz, pelaInterna), [])).toBe('interna');
    expect(resolverToque(intersecoesDoToque(raiz, pelaInterna), [plano])).toBe('placas');
    // Sem nada visível no caminho do raio, nada é escolhido.
    const fora = new THREE.Ray(new THREE.Vector3(3, 0, 5), new THREE.Vector3(0, 0, -1));
    expect(resolverToque(intersecoesDoToque(raiz, fora), [plano])).toBeNull();
  });
});

describe('perfis de iluminação', () => {
  it('todos os modelos têm perfil; embriões são orgânicos com sombra estática; tone mapping Neutral', () => {
    for (const id of Object.keys(MODELOS)) {
      const p = perfilDoModelo(id);
      expect(p.toneMapping).toBe(THREE.NeutralToneMapping);
      expect(p.exposicao).toBeGreaterThan(0);
    }
    for (const id of ['semana-4', 'semana-6', 'semana-8']) {
      expect(perfilDoModelo(id).tipo).toBe('organico');
      expect(perfilDoModelo(id).sombra).toBe('pcf');
    }
    expect(perfilDoModelo('gastrulacao').sombra).toBe('contato');
    expect(perfilDoModelo('zigoto').tipo).toBe('cascas');
    expect(perfilDoModelo('desconhecido')).toBe(PERFIS.esquema);
  });
});
