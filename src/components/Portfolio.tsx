'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { IconX } from '@tabler/icons-react';
import { portfolio, styleLabels, type PortfolioItem, type TattooStyle } from '@/content';
import { artSeed, proceduralArt } from '@/art/procedural';
import { ScrollTrigger } from '@/lib/gsap';
import { onFrame } from '@/lib/frame';
import { clamp, ensurePointer, pointer } from '@/lib/pointer';
import { prefersReducedMotion } from '@/lib/device';
import InkSection from './InkSection';
import Accent from './Accent';

type Filter = 'all' | TattooStyle;
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'blackwork', label: styleLabels.blackwork },
  { key: 'fineline', label: styleLabels.fineline },
  { key: 'realismo', label: styleLabels.realismo },
];

const items = portfolio.items;
const N = items.length;
const STEP = 360 / N;
const radius = () => (innerWidth <= 760 ? 210 : 320);

function Art({ item, index, sizes }: { item: PortfolioItem; index: number; sizes: string }) {
  if (item.image)
    return <Image src={item.image} alt={item.title} fill sizes={sizes} className="card-img" loading="lazy" />;
  return <div className="card-art" dangerouslySetInnerHTML={{ __html: proceduralArt(item.style, artSeed(index)) }} />;
}

/** Carrossel 3D em CSS: arrasta, gira sozinho, gira com o scroll (pin) e abre um lightbox. */
export default function Portfolio() {
  const [filter, setFilter] = useState<Filter>('all');
  const [lbIndex, setLbIndex] = useState(0);
  const [lbOpen, setLbOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const lbRef = useRef<HTMLDivElement>(null);
  const lbArtRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const s = useRef({ ang: 0, av: 0.12, drag: false, sx: 0, moved: 0, seek: null as number | null, scrollAng: 0, scrollTarget: 0, rad: 320 });

  /** Gira até que o card `i` fique de frente. */
  const seekTo = (i: number) => {
    const st = s.current, target = -i * STEP - st.scrollAng;
    st.seek = st.ang + ((((target - st.ang) % 360) + 540) % 360) - 180;
    st.av = 0;
  };

  useEffect(() => {
    ensurePointer();
    const rm = prefersReducedMotion();
    const section = sectionRef.current!, stage = stageRef.current!, ring = ringRef.current!, cards = cardsRef.current;
    const st = s.current;

    const layout = () => {
      st.rad = radius();
      cards.forEach((c, i) => (c.style.transform = `rotateY(${i * STEP}deg) translateZ(${st.rad}px)`));
    };
    layout();
    addEventListener('resize', layout);

    const down = (e: PointerEvent) => {
      st.drag = true;
      st.sx = e.clientX;
      st.moved = 0;
      st.seek = null;
    };
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      const dx = e.clientX - st.sx;
      st.sx = e.clientX;
      st.av = dx * 0.35;
      st.ang += st.av;
      st.moved += Math.abs(dx);
    };
    const up = () => (st.drag = false);
    stage.addEventListener('pointerdown', down);
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);

    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(stage);

    // Seção fixada: o scroll dá uma volta completa no carrossel
    const pin = rm
      ? null
      : ScrollTrigger.create({
          trigger: section,
          pin: true,
          start: () => (section.offsetHeight > innerHeight ? 'bottom bottom' : 'center center'),
          end: '+=120%',
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => (st.scrollTarget = self.progress * 360),
        });

    const stop = onFrame(() => {
      if (!visible) return;
      st.scrollAng += (st.scrollTarget - st.scrollAng) * 0.1;
      if (st.seek !== null) {
        if (rm) st.ang = st.seek;
        else st.ang += (st.seek - st.ang) * 0.08;
        if (Math.abs(st.seek - st.ang) < 0.05) st.seek = null;
      } else if (!st.drag && !rm) {
        st.ang += st.av + pointer.scrollVel * 0.05;
        st.av += (0.12 - st.av) * 0.02;
      }
      const total = st.ang + st.scrollAng;
      const sr = stage.getBoundingClientRect(), sy = (pointer.y - sr.top) / sr.height - 0.5;
      const tilt = rm ? -8 : -8 + clamp(sy) * -10;
      ring.style.transform = `translateZ(${-st.rad}px) rotateX(${tilt}deg) rotateY(${total}deg)`;
      cards.forEach((c, i) => {
        const a = (((((i * STEP + total) % 360) + 360) % 360) * Math.PI) / 180;
        c.style.filter = `brightness(${0.25 + 0.75 * Math.max(0, Math.cos(a))})`;
      });
    });

    return () => {
      stop();
      pin?.kill(true);
      io.disconnect();
      removeEventListener('resize', layout);
      stage.removeEventListener('pointerdown', down);
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
    };
  }, []);

  // Filtros: gira até o primeiro trabalho do estilo
  const applyFilter = (f: Filter) => {
    setFilter(f);
    const first = items.findIndex((it) => f === 'all' || it.style === f);
    if (first >= 0) seekTo(first);
  };

  const openLB = (i: number, card: HTMLElement) => {
    const lb = lbRef.current!, parent = lb.parentElement!;
    const r = card.getBoundingClientRect(), pr = parent.getBoundingClientRect();
    const px = r.left - pr.left + r.width / 2, py = r.top - pr.top + r.height / 2;
    openerRef.current = card;
    setLbIndex(i);
    setLbOpen(true);
    lb.style.transition = 'none';
    lb.style.clipPath = `circle(0% at ${px}px ${py}px)`;
    void lb.offsetHeight;
    lb.style.transition = '';
    lb.style.clipPath = `circle(150% at ${px}px ${py}px)`;
  };

  const closeLB = () => {
    const lb = lbRef.current;
    if (!lb) return;
    lb.style.clipPath = 'circle(0% at 50% 50%)';
    setLbOpen(false);
    openerRef.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!lbOpen) return;
    closeRef.current?.focus({ preventScroll: true });
    const key = (e: globalThis.KeyboardEvent) => e.key === 'Escape' && closeLB();
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [lbOpen]);

  const tiltArt = (e: React.MouseEvent) => {
    const art = lbArtRef.current;
    if (!art || prefersReducedMotion()) return;
    const r = art.getBoundingClientRect();
    art.style.transform = `rotateY(${((e.clientX - r.left - r.width / 2) / r.width) * 30}deg) rotateX(${(-(e.clientY - r.top - r.height / 2) / r.height) * 30}deg)`;
  };

  const cardKey = (e: KeyboardEvent<HTMLDivElement>, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLB(i, e.currentTarget);
    }
  };

  const current = items[lbIndex];

  return (
    <InkSection id="port" ref={sectionRef}>
      <span className="lbl rv scr">{portfolio.label}</span>
      <h2 className="big rv">
        <Accent {...portfolio.title} />
      </h2>
      <div className="flt" role="group" aria-label="Filtrar por estilo">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" className={filter === f.key ? 'act' : ''} aria-pressed={filter === f.key} onClick={() => applyFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="stage" ref={stageRef}>
        <div className="flr" aria-hidden="true" />
        <div className="ring" ref={ringRef}>
          {items.map((it, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={`card${filter !== 'all' && it.style !== filter ? ' hide' : ''}`}
              data-k={it.style}
              role="button"
              tabIndex={0}
              aria-label={`${it.title}, ${styleLabels[it.style]}. Abrir detalhes`}
              style={{ transform: `rotateY(${i * STEP}deg) translateZ(320px)` }}
              onClick={(e) => s.current.moved < 6 && openLB(i, e.currentTarget)}
              onKeyDown={(e) => cardKey(e, i)}
              onFocus={(e) => e.currentTarget.matches(':focus-visible') && seekTo(i)}
            >
              <Art item={it} index={i} sizes="190px" />
              <div className="cap" aria-hidden="true">
                <span>{it.title}</span>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="sh" aria-hidden="true">
          {portfolio.hint}
        </div>
      </div>
      <div
        className={`lb${lbOpen ? ' on' : ''}`}
        ref={lbRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lbt"
        inert={!lbOpen}
        onMouseMove={tiltArt}
      >
        <button className="x" ref={closeRef} type="button" aria-label="Fechar" onClick={closeLB}>
          <IconX aria-hidden="true" stroke={1.5} />
        </button>
        <div className="lb-art" ref={lbArtRef}>
          <Art key={lbIndex} item={current} index={lbIndex} sizes="300px" />
        </div>
        <div>
          <span className="lbl">{styleLabels[current.style]}</span>
          <h3 id="lbt">{current.title}</h3>
          <p>{current.description}</p>
        </div>
      </div>
    </InkSection>
  );
}
