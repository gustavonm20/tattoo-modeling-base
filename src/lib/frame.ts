'use client';
import { gsap } from './gsap';

export type FrameCallback = (dt: number, time: number) => void;

/**
 * Registra um callback no ticker único do GSAP (o mesmo que move o Lenis),
 * para tudo andar no mesmo requestAnimationFrame. Retorna a função de remoção.
 * dt em segundos, limitado a 50 ms para não "pular" após troca de aba.
 */
export function onFrame(cb: FrameCallback, prioritize = false) {
  const tick = (time: number, deltaMs: number) => cb(Math.min(deltaMs / 1000, 0.05), time);
  gsap.ticker.add(tick, false, prioritize);
  return () => gsap.ticker.remove(tick);
}
