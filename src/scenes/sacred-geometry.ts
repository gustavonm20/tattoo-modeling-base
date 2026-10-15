import * as THREE from 'three';
import type { Quality } from '@/lib/device';

export interface SacredOptions {
  quality: Quality;
  reducedMotion: boolean;
}

/** Sólidos platônicos em arame que reagem ao mouse (seção Sobre). */
export class SacredGeometryScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  private group = new THREE.Group();
  private l1: THREE.LineSegments;
  private l2: THREE.LineSegments;
  private l3: THREE.LineSegments;
  private l4: THREE.LineSegments;
  private born: number;
  private time = 0;
  private lastW = 0;

  constructor(private canvas: HTMLCanvasElement, private opts: SacredOptions) {
    THREE.ColorManagement.enabled = false;
    const low = opts.quality === 'low';
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, alpha: true });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.5));
    this.camera.position.z = 6;
    this.scene.add(this.group);
    this.born = opts.reducedMotion ? 1 : 0;

    const lines = (src: THREE.BufferGeometry, color: number, opacity: number) => {
      const o = new THREE.LineSegments(
        new THREE.EdgesGeometry(src),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
      );
      src.dispose();
      this.group.add(o);
      return o;
    };
    this.l1 = lines(new THREE.IcosahedronGeometry(1.6, 1), 0xe9e6df, 0.55);
    this.l2 = lines(new THREE.OctahedronGeometry(1.05), 0xb3121f, 0.95);
    this.l3 = lines(new THREE.DodecahedronGeometry(2.1), 0x3a3a38, 0.6);
    this.l4 = lines(new THREE.TetrahedronGeometry(0.55), 0xe9e6df, 0.9);
    this.group.add(
      new THREE.Points(new THREE.IcosahedronGeometry(1.6, 1), new THREE.PointsMaterial({ color: 0xb3121f, size: 0.07 })),
    );
    const tor = new THREE.Mesh(
      new THREE.TorusGeometry(2.45, 0.004, 6, low ? 120 : 200),
      new THREE.MeshBasicMaterial({ color: 0xb3121f }),
    );
    tor.rotation.x = 1.3;
    this.group.add(tor);
  }

  /** gx, gy: mouse relativo ao canvas (-1..1) */
  render(dt: number, gx: number, gy: number) {
    const w = this.canvas.clientWidth;
    if (!w) return;
    if (w !== this.lastW) {
      this.renderer.setSize(w, w, false);
      this.lastW = w;
    }
    if (!this.opts.reducedMotion) this.time += dt;
    const t = this.time, G = this.group;
    this.born = Math.min(1, this.born + 0.008);
    G.scale.setScalar(1 - Math.pow(1 - this.born, 3));
    G.rotation.y = t * 0.2 + gx * 0.8;
    G.rotation.x = -gy * 0.6 + Math.sin(t * 0.3) * 0.2;
    this.l2.rotation.y = -t * 0.6;
    this.l2.rotation.z = t * 0.3;
    this.l4.rotation.x = t * 1.1;
    this.l4.rotation.y = t * 0.8;
    this.l3.rotation.z = -t * 0.1;
    this.l1.scale.setScalar(1 + Math.sin(t * 1.5) * 0.03);
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
