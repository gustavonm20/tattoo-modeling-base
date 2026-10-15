'use client';
import { useEffect, useRef } from 'react';
import { marquee } from '@/content';
import { onFrame } from '@/lib/frame';
import { ensurePointer, pointer } from '@/lib/pointer';
import { prefersReducedMotion } from '@/lib/device';

const COPIES = 4;

/** Faixa infinita que acelera com o mouse e inverte com o scroll para cima. */
export default function Marquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    ensurePointer();
    const wrap = wrapRef.current!, track = trackRef.current!;
    let x = 0, visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(wrap);
    // largura de uma cópia, em cache (ler scrollWidth a cada quadro força layout)
    let w = track.scrollWidth / COPIES;
    const ro = new ResizeObserver(() => (w = track.scrollWidth / COPIES));
    ro.observe(track);
    const stop = onFrame(() => {
      if (!visible) return;
      const sv = pointer.scrollVel, sp = 1 + pointer.vel * 0.15 + Math.abs(sv) * 0.6, dir = sv < -0.5 ? -1 : 1;
      x -= sp * dir;
      if (x < -w) x += w;
      if (x > 0) x -= w;
      const tilt = Math.max(-25, Math.min(25, pointer.vel * 0.6 + sv * 1.2));
      track.style.transform = `translateX(${x}px) rotateX(${tilt}deg)`;
    });
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const words = Array.from({ length: COPIES }, () => marquee).flat();
  return (
    <div className="mq" ref={wrapRef} aria-hidden="true">
      <div className="mq-track" ref={trackRef}>
        {words.map((t, i) => (
          <span key={i}>
            {t}
            <em>✦</em>
          </span>
        ))}
      </div>
    </div>
  );
}
