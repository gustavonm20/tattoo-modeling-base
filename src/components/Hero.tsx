'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { hero } from '@/content';
import { ScrollTrigger } from '@/lib/gsap';
import { onFrame } from '@/lib/frame';
import { clamp, ensurePointer, pointer } from '@/lib/pointer';
import { detectQuality, hasWebGL, prefersReducedMotion, whenIdle } from '@/lib/device';
import type { HeroScene } from '@/scenes/hero';

/** Título com entrada 3D letra a letra; a segunda linha fica em itálico vermelho. */
function Title() {
  let d = 0;
  const chars = (word: string) =>
    [...word].map((c, k) => {
      const delay = 0.4 + d++ * 0.07;
      return c === ' ' ? (
        ' '
      ) : (
        <span key={k} className="ch" style={{ animationDelay: `${delay.toFixed(2)}s` }}>
          {c}
        </span>
      );
    });
  return (
    <>
      <span className="sr">{hero.lines.join(' ')}</span>
      <span aria-hidden="true">
        {hero.lines.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {i > 0 ? <i>{chars(w)}</i> : chars(w)}
          </Fragment>
        ))}
      </span>
    </>
  );
}

function HeroFallback() {
  return (
    <div className="hero-fallback" aria-hidden="true">
      <svg viewBox="0 0 400 400" fill="none">
        <defs>
          <radialGradient id="hf" cx="40%" cy="35%" r="70%">
            <stop offset="0" stopColor="#1a0306" />
            <stop offset=".55" stopColor="#0c0c0c" />
            <stop offset=".85" stopColor="#6d0b13" />
            <stop offset="1" stopColor="#b3121f" />
          </radialGradient>
        </defs>
        <g stroke="#2a2a2a" strokeWidth=".6">
          <polygon points="200,18 358,110 358,290 200,382 42,290 42,110" />
          <path d="M200 18 200 382M42 110 358 290M358 110 42 290" />
        </g>
        <ellipse cx="200" cy="200" rx="176" ry="58" stroke="#b3121f" strokeOpacity=".7" transform="rotate(-24 200 200)" />
        <circle cx="200" cy="200" r="112" fill="url(#hf)" />
        <ellipse cx="200" cy="200" rx="190" ry="84" stroke="#e9e6df" strokeOpacity=".4" transform="rotate(16 200 200)" />
        <ellipse cx="200" cy="200" rx="204" ry="128" stroke="#5a5a56" strokeOpacity=".5" transform="rotate(62 200 200)" />
        <circle cx="371" cy="164" r="4" fill="#b3121f" />
        <circle cx="62" cy="262" r="3.5" fill="#e9e6df" />
      </svg>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    ensurePointer();
    const heroEl = heroRef.current!, canvas = canvasRef.current!, title = titleRef.current!;
    const rm = prefersReducedMotion();
    let tx = 0, ty = 0, inside = false, visible = true, scroll = 0, disposed = false;
    let scene: HeroScene | null = null;

    const enter = () => (inside = true);
    const leave = () => (inside = false);
    const click = (e: MouseEvent) => {
      if ((e.target as Element).closest('a,button')) return;
      const r = heroEl.getBoundingClientRect();
      scene?.ripple((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };
    heroEl.addEventListener('pointerenter', enter);
    heroEl.addEventListener('pointerleave', leave);
    heroEl.addEventListener('click', click);

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(heroEl);
    const ro = new ResizeObserver(() => scene?.resize());
    ro.observe(canvas);

    // Progresso do scroll pelo hero: câmera recua/orbita e a forma vira pó
    const st = ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (s) => (scroll = s.progress),
      onRefresh: (s) => (scroll = s.progress),
    });

    const stop = onFrame((dt) => {
      if (!visible) return;
      const r = heroEl.getBoundingClientRect();
      tx += (clamp(((pointer.x - r.left) / r.width) * 2 - 1) - tx) * 0.06;
      ty += (clamp(((pointer.y - r.top) / r.height) * 2 - 1) - ty) * 0.06;
      if (!rm) title.style.transform = `rotateY(${tx * 10}deg) rotateX(${-ty * 8}deg)`;
      if (scene && !document.hidden) scene.render(dt, { tx, ty, hover: inside, vel: pointer.vel, scroll });
    });

    let cancelIdle = () => {};
    if (!hasWebGL()) setFallback(true);
    else
      cancelIdle = whenIdle(() => {
        import('@/scenes/hero')
          .then(({ HeroScene }) => {
            if (disposed) return;
            scene = new HeroScene(canvas, { quality: detectQuality(), reducedMotion: rm });
          })
          .catch(() => !disposed && setFallback(true));
      });

    return () => {
      disposed = true;
      cancelIdle();
      stop();
      st.kill();
      io.disconnect();
      ro.disconnect();
      heroEl.removeEventListener('pointerenter', enter);
      heroEl.removeEventListener('pointerleave', leave);
      heroEl.removeEventListener('click', click);
      scene?.dispose();
      scene = null;
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <canvas ref={canvasRef} className="hero-gl" aria-hidden="true" hidden={fallback} />
      {fallback && <HeroFallback />}
      {!fallback && <div className="hint">{hero.hint}</div>}
      <div className="hw">
        <h2 className="ht" ref={titleRef}>
          <Title />
        </h2>
      </div>
      <div className="hs">
        <p>{hero.text}</p>
        <a className="mb mag" href="#ag">
          {hero.cta} <IconArrowRight aria-hidden="true" stroke={1.5} />
        </a>
      </div>
    </section>
  );
}
