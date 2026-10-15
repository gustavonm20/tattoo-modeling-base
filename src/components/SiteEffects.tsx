'use client';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { onFrame } from '@/lib/frame';
import { ensurePointer, pointer } from '@/lib/pointer';
import { prefersReducedMotion } from '@/lib/device';
import { scramble } from '@/lib/scramble';
import { setLenis } from '@/lib/scroll';

const TRAIL = 12;
const HOVER_TARGETS = '.card,.mb,a,button,summary,.fl';

/**
 * Efeitos globais: scroll suave (Lenis + ScrollTrigger), cursor com rastro,
 * botões magnéticos, texto embaralhado e revelações no scroll.
 * Fica por último na árvore para rodar depois que as seções criaram seus triggers.
 */
export default function SiteEffects() {
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensurePointer();
    const rm = prefersReducedMotion();
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches && innerWidth > 760;
    const cleanups: (() => void)[] = [];

    // Scroll suave
    if (!rm) {
      const lenis = new Lenis({ anchors: true, lerp: 0.1 });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(raf);
        lenis.destroy();
        setLenis(null);
      });
    }

    // Cursor e rastro
    const cur = curRef.current;
    if (cur && finePointer) {
      const trail = Array.from({ length: TRAIL }, (_, i) => {
        const el = document.createElement('div');
        el.className = 'tr';
        el.setAttribute('aria-hidden', 'true');
        const s = 7 - i * 0.45;
        el.style.width = el.style.height = `${s}px`;
        el.style.opacity = String(1 - i / TRAIL);
        document.body.appendChild(el);
        return { el, x: pointer.x, y: pointer.y };
      });
      let kx = pointer.x, ky = pointer.y;
      const stop = onFrame(() => {
        kx += (pointer.x - kx) * 0.18;
        ky += (pointer.y - ky) * 0.18;
        cur.style.transform = `translate(${kx}px,${ky}px) translate(-50%,-50%)`;
        let px = pointer.x, py = pointer.y;
        for (const t of trail) {
          t.x += (px - t.x) * 0.35;
          t.y += (py - t.y) * 0.35;
          t.el.style.transform = `translate(${t.x}px,${t.y}px) translate(-50%,-50%)`;
          px = t.x;
          py = t.y;
        }
      });
      const over = (e: MouseEvent) => {
        const t = e.target as Element;
        const card = t.closest('.card');
        cur.classList.toggle('big2', !!t.closest(HOVER_TARGETS));
        cur.textContent = card ? 'VER' : '';
      };
      document.addEventListener('mouseover', over);
      cleanups.push(() => {
        stop();
        document.removeEventListener('mouseover', over);
        trail.forEach((t) => t.el.remove());
      });
    }

    // Botões magnéticos (o preenchimento de tinta nasce do ponto do mouse)
    document.querySelectorAll<HTMLElement>('.mag').forEach((b) => {
      const move = (e: MouseEvent) => {
        const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        b.style.setProperty('--x', `${x}px`);
        b.style.setProperty('--y', `${y}px`);
        if (!rm) b.style.transform = `translate(${(x - r.width / 2) * 0.3}px,${(y - r.height / 2) * 0.4}px)`;
      };
      const leave = () => (b.style.transform = '');
      b.addEventListener('mousemove', move);
      b.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        b.removeEventListener('mousemove', move);
        b.removeEventListener('mouseleave', leave);
      });
    });

    // Texto embaralhado no hover
    if (!rm)
      document.querySelectorAll<HTMLElement>('.scr').forEach((el) => {
        const enter = () => scramble(el);
        el.addEventListener('mouseenter', enter);
        cleanups.push(() => el.removeEventListener('mouseenter', enter));
      });

    // Revelações (rotateX + translateY via CSS, disparadas pelo ScrollTrigger)
    const reveals = ScrollTrigger.batch('.rv', {
      start: 'top 88%',
      once: true,
      onEnter: (els) =>
        els.forEach((el) => {
          el.classList.add('on');
          if (!rm && el.classList.contains('scr')) scramble(el as HTMLElement);
        }),
    });
    cleanups.push(() => reveals.forEach((t) => t.kill()));

    // Todas as seções já criaram seus triggers: ordena e recalcula
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="cur" ref={curRef} aria-hidden="true" />
    </>
  );
}
