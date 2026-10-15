'use client';
import { ScrollTrigger } from './gsap';

/**
 * Transição de "tinta se espalhando": a seção é revelada por um clip-path
 * circular que nasce do topo, com uma borda de tinta vermelha à frente.
 * O progresso vai na variável CSS --ink (ver styles/ink.css).
 */
export function createInk(section: HTMLElement) {
  const apply = (p: number) => {
    section.style.setProperty('--ink', p.toFixed(4));
    section.classList.toggle('ink-done', p >= 0.999);
  };
  return ScrollTrigger.create({
    trigger: section,
    start: 'top 95%',
    end: 'top 25%',
    scrub: 0.4,
    onUpdate: (st) => apply(st.progress),
    onRefresh: (st) => apply(st.progress),
  });
}
