'use client';
import { useEffect, useRef, useState } from 'react';
import { about } from '@/content';
import { ScrollTrigger } from '@/lib/gsap';
import { onFrame } from '@/lib/frame';
import { clamp, ensurePointer, pointer } from '@/lib/pointer';
import { detectQuality, hasWebGL, prefersReducedMotion } from '@/lib/device';
import type { SacredGeometryScene } from '@/scenes/sacred-geometry';
import InkSection from './InkSection';
import Accent from './Accent';

const fmt = (n: number) => n.toLocaleString('pt-BR');

function SacredFallback() {
  const poly = (n: number, r: number, rot = -90) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((rot + (360 / n) * i) * Math.PI) / 180;
      return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
    }).join(' ');
  return (
    <svg className="g2-fallback" viewBox="-100 -100 200 200" fill="none" aria-hidden="true">
      <ellipse rx="92" ry="22" stroke="#b3121f" strokeWidth=".5" />
      <polygon points={poly(5, 80)} stroke="#3a3a38" strokeWidth=".6" />
      <polygon points={poly(6, 62)} stroke="#e9e6df" strokeOpacity=".55" strokeWidth=".5" />
      <polygon points={poly(3, 62)} stroke="#e9e6df" strokeOpacity=".35" strokeWidth=".5" />
      <polygon points={poly(3, 62, 90)} stroke="#e9e6df" strokeOpacity=".35" strokeWidth=".5" />
      <polygon points={poly(4, 40)} stroke="#b3121f" strokeWidth=".8" />
      <polygon points={poly(3, 22)} stroke="#e9e6df" strokeWidth=".6" />
    </svg>
  );
}

export default function About() {
  const statsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  // Contadores
  useEffect(() => {
    const box = statsRef.current!;
    const nums = [...box.querySelectorAll<HTMLElement>('[data-n]')];
    if (prefersReducedMotion()) return;
    nums.forEach((el) => (el.textContent = '0'));
    let raf = 0;
    const st = ScrollTrigger.create({
      trigger: box,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / 2200), k = 1 - Math.pow(1 - p, 4);
          nums.forEach((el) => (el.textContent = fmt(Math.round(Number(el.dataset.n) * k))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
    });
    return () => {
      st.kill();
      cancelAnimationFrame(raf);
      nums.forEach((el) => (el.textContent = fmt(Number(el.dataset.n))));
    };
  }, []);

  // Cena de geometria sagrada: carrega só quando chega perto da tela
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!hasWebGL()) {
      setFallback(true);
      return;
    }
    ensurePointer();
    let scene: SacredGeometryScene | null = null, visible = false, loading = false, disposed = false;
    const load = () => {
      if (loading) return;
      loading = true;
      import('@/scenes/sacred-geometry')
        .then(({ SacredGeometryScene }) => {
          if (disposed) return;
          scene = new SacredGeometryScene(canvas, { quality: detectQuality(), reducedMotion: prefersReducedMotion() });
        })
        .catch(() => !disposed && setFallback(true));
    };
    const near = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: '150px' });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    near.observe(canvas);
    io.observe(canvas);
    let r = canvas.getBoundingClientRect();
    const stopRead = onFrame(() => {
      if (visible) r = canvas.getBoundingClientRect();
    }, true);
    const stop = onFrame((dt) => {
      if (!visible || !scene || document.hidden) return;
      scene.render(dt, clamp(((pointer.x - r.left) / r.width) * 2 - 1), clamp(((pointer.y - r.top) / r.height) * 2 - 1));
    });
    return () => {
      disposed = true;
      stopRead();
      stop();
      near.disconnect();
      io.disconnect();
      scene?.dispose();
    };
  }, []);

  return (
    <InkSection id="sobre">
      <div className="two">
        <div>
          <span className="lbl rv scr">{about.label}</span>
          <h2 className="big rv">
            <Accent {...about.title} />
          </h2>
          <p className="rv">{about.text}</p>
          <div className="stats rv" ref={statsRef}>
            {about.stats.map((s) => (
              <div key={s.label}>
                <b data-n={s.value}>{fmt(s.value)}</b>
                <small>{s.label}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="g2-wrap">
          {fallback ? <SacredFallback /> : <canvas ref={canvasRef} className="g2" aria-hidden="true" />}
        </div>
      </div>
    </InkSection>
  );
}
