import * as THREE from 'three';
import type { Quality } from '@/lib/device';
import blobVert from '@/shaders/blob.vert.glsl';
import blobFrag from '@/shaders/blob.frag.glsl';
import particlesVert from '@/shaders/particles.vert.glsl';
import particlesFrag from '@/shaders/particles.frag.glsl';
import dissolveVert from '@/shaders/dissolve.vert.glsl';
import dissolveFrag from '@/shaders/dissolve.frag.glsl';
import postVert from '@/shaders/post.vert.glsl';
import postFrag from '@/shaders/post.frag.glsl';

export interface HeroInput {
  /** mouse relativo ao hero, suavizado (-1..1) */
  tx: number;
  ty: number;
  hover: boolean;
  /** velocidade do mouse (0..60) */
  vel: number;
  /** progresso do scroll pelo hero (0 = topo, 1 = hero saiu da tela) */
  scroll: number;
}

export interface HeroOptions {
  quality: Quality;
  reducedMotion: boolean;
}

const CAM_Z = 5.2;
/** No celular a câmera fica mais longe para a forma não cobrir o título. */
const CAM_Z_MOBILE = 7.6;
const TAN_HALF_FOV = Math.tan((20 * Math.PI) / 180);

/** Cena do hero: forma de tinta, anéis, gaiola, poeira e pós-processamento. */
export class HeroScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private pr: number;
  private camZ = CAM_Z;
  private u = {
    t: { value: 0 },
    m: { value: new THREE.Vector2() },
    s: { value: 0 },
    p: { value: 0 },
    dis: { value: 0 },
    mw: { value: new THREE.Vector3() },
  };
  private blob: THREE.Mesh;
  private dust: THREE.Points;
  private cage: THREE.LineSegments;
  private pts: THREE.Points;
  private rings: { g: THREE.Group; m: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>; sp: number }[] = [];
  private post: null | {
    rt: THREE.WebGLRenderTarget;
    scene: THREE.Scene;
    cam: THREE.OrthographicCamera;
    u: {
      tD: { value: THREE.Texture };
      m: { value: THREE.Vector2 };
      t: { value: number };
      v: { value: number };
      asp: { value: number };
      rp: { value: THREE.Vector3 };
    };
  } = null;

  constructor(private canvas: HTMLCanvasElement, private opts: HeroOptions) {
    const low = opts.quality === 'low';
    // As cores foram calibradas sem gerenciamento de cor (como no r128)
    THREE.ColorManagement.enabled = false;
    this.pr = Math.min(devicePixelRatio, low ? 1 : 1.5);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setPixelRatio(this.pr);
    this.renderer.setClearColor(0x0a0a0a, 1);
    this.camera.position.z = CAM_Z;
    const u = this.u;

    // Forma de tinta
    this.blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.15, low ? 32 : 110),
      new THREE.ShaderMaterial({ uniforms: u, vertexShader: blobVert, fragmentShader: blobFrag }),
    );
    this.scene.add(this.blob);

    // Pó em que a forma se desfaz ao rolar
    const DN = low ? 700 : 4000;
    const dg = new THREE.BufferGeometry();
    const dp = new Float32Array(DN * 3), dr = new Float32Array(DN);
    for (let i = 0; i < DN; i++) {
      const a = Math.random() * Math.PI * 2, b = Math.acos(Math.random() * 2 - 1), r = 1.15 + Math.random() * 0.25;
      dp[i * 3] = r * Math.sin(b) * Math.cos(a);
      dp[i * 3 + 1] = r * Math.sin(b) * Math.sin(a);
      dp[i * 3 + 2] = r * Math.cos(b);
      dr[i] = Math.random();
    }
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    dg.setAttribute('rnd', new THREE.BufferAttribute(dr, 1));
    this.dust = new THREE.Points(
      dg,
      new THREE.ShaderMaterial({
        uniforms: u,
        vertexShader: dissolveVert,
        fragmentShader: dissolveFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.dust.visible = false;
    this.blob.add(this.dust);

    // Anéis orbitais
    ([[1.75, 0xb3121f], [2.05, 0xe9e6df], [2.4, 0x5a5a56]] as const).forEach(([radius, color], i) => {
      const g = new THREE.Group();
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.005, 6, low ? 120 : 220),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7 }),
      );
      g.add(m);
      const sat = new THREE.Mesh(new THREE.SphereGeometry(0.045 + i * 0.01, 16, 16), new THREE.MeshBasicMaterial({ color }));
      sat.position.x = radius;
      g.add(sat);
      g.rotation.set(1.2 + i * 0.35, i * 0.7, i * 0.4);
      this.scene.add(g);
      this.rings.push({ g, m, sp: (i % 2 ? -1 : 1) * (0.25 + i * 0.12) });
    });

    // Gaiola
    const cageSrc = new THREE.IcosahedronGeometry(2.9, 1);
    this.cage = new THREE.LineSegments(
      new THREE.EdgesGeometry(cageSrc),
      new THREE.LineBasicMaterial({ color: 0x2a2a2a, transparent: true, opacity: 0.5 }),
    );
    cageSrc.dispose();
    this.scene.add(this.cage);

    // Poeira ambiente
    const PN = low ? 300 : 1100;
    const pg = new THREE.BufferGeometry();
    const pa = new Float32Array(PN * 3), ps = new Float32Array(PN);
    for (let i = 0; i < PN; i++) {
      const r = 1.8 + Math.random() * 4, a = Math.random() * 6.28, b = Math.acos(Math.random() * 2 - 1);
      pa[i * 3] = r * Math.sin(b) * Math.cos(a) * 1.4;
      pa[i * 3 + 1] = r * Math.sin(b) * Math.sin(a) * 0.7;
      pa[i * 3 + 2] = r * Math.cos(b) - 1.2;
      ps[i] = Math.random();
    }
    pg.setAttribute('position', new THREE.BufferAttribute(pa, 3));
    pg.setAttribute('sz', new THREE.BufferAttribute(ps, 1));
    this.pts = new THREE.Points(
      pg,
      new THREE.ShaderMaterial({
        uniforms: u,
        vertexShader: particlesVert,
        fragmentShader: particlesFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    this.scene.add(this.pts);

    // Pós-processamento (desligado em GPU fraca)
    if (!low) {
      const rt = new THREE.WebGLRenderTarget(4, 4);
      const pu = {
        tD: { value: rt.texture as THREE.Texture },
        m: { value: new THREE.Vector2(0.5, 0.5) },
        t: u.t,
        v: { value: 0 },
        asp: { value: 1 },
        rp: { value: new THREE.Vector3(0.5, 0.5, -99) },
      };
      const scene = new THREE.Scene();
      scene.add(
        new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          new THREE.ShaderMaterial({ uniforms: pu, vertexShader: postVert, fragmentShader: postFrag }),
        ),
      );
      this.post = { rt, scene, cam: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), u: pu };
    }

    this.resize();
  }

  resize() {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.post) {
      this.post.rt.setSize(w * this.pr, h * this.pr);
      this.post.u.asp.value = w / h;
    }
    const x = w > 760 ? 1.4 : 0;
    [this.blob, this.cage, this.pts].forEach((o) => (o.position.x = x));
    this.rings.forEach((r) => (r.g.position.x = x));
    this.blob.position.y = w > 760 ? 0.25 : 1.35;
    this.camZ = w > 760 ? CAM_Z : CAM_Z_MOBILE;
  }

  /** Clique: onda de tinta no pós-processamento + pulso na forma. x, y em 0..1 (origem no topo). */
  ripple(x: number, y: number) {
    this.post?.u.rp.value.set(x, 1 - y, this.u.t.value);
    this.u.p.value = 1;
  }

  render(dt: number, i: HeroInput) {
    const u = this.u, cam = this.camera;
    if (!this.opts.reducedMotion) u.t.value += dt;
    const so = i.scroll;

    u.m.value.set(i.tx, -i.ty);
    u.s.value += ((i.hover ? 1 : 0) - u.s.value) * 0.04;
    u.p.value *= 0.96;
    const halfH = TAN_HALF_FOV * this.camZ;
    u.mw.value.set(i.tx * halfH * cam.aspect, -i.ty * halfH, 0);
    // A forma vira pó na segunda metade do caminho até sair da tela
    u.dis.value = THREE.MathUtils.smoothstep(so, 0.3, 0.95);
    this.dust.visible = u.dis.value > 0.001;
    this.blob.visible = u.dis.value < 0.999;

    if (this.post) {
      this.post.u.m.value.set((i.tx + 1) / 2, 1 - (i.ty + 1) / 2);
      this.post.u.v.value += ((i.hover ? i.vel / 40 : 0) - this.post.u.v.value) * 0.1;
    }

    this.blob.rotation.y += dt * 0.15;
    this.blob.rotation.x = i.ty * 0.4 + so * 0.8;
    this.cage.rotation.y -= dt * 0.04;
    this.cage.rotation.x = i.ty * 0.2 + u.t.value * 0.02;
    this.pts.rotation.y += dt * 0.03;
    this.rings.forEach((r) => {
      r.g.rotation.z += dt * r.sp;
      r.m.material.opacity = 0.45 + u.s.value * 0.45;
    });

    // Câmera recua e orbita conforme o scroll
    const orbit = so * 0.75, radius = this.camZ + so * 3.2;
    const tx = i.tx * 0.5 + Math.sin(orbit) * radius, ty = -i.ty * 0.35 + so * 1.1;
    cam.position.x += (tx - cam.position.x) * 0.05;
    cam.position.y += (ty - cam.position.y) * 0.05;
    cam.position.z = Math.cos(orbit) * radius;
    cam.lookAt(this.blob.position.x * 0.4, 0, 0);
    cam.rotateZ(so * 0.18);

    if (this.post) {
      this.renderer.setRenderTarget(this.post.rt);
      this.renderer.render(this.scene, cam);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.post.scene, this.post.cam);
    } else {
      this.renderer.render(this.scene, cam);
    }
  }

  dispose() {
    const free = (root: THREE.Object3D) =>
      root.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
    free(this.scene);
    if (this.post) {
      free(this.post.scene);
      this.post.rt.dispose();
    }
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
