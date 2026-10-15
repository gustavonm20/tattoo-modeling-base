'use client';
import { onFrame } from './frame';

/** Estado global do ponteiro e do scroll, atualizado uma vez por quadro. */
export const pointer = {
  x: 0,
  y: 0,
  /** velocidade suavizada do mouse (px/quadro, máx. 60) */
  vel: 0,
  /** velocidade suavizada do scroll (px/quadro, com sinal) */
  scrollVel: 0,
};

let started = false;

export function ensurePointer() {
  if (started || typeof window === 'undefined') return;
  started = true;
  pointer.x = innerWidth / 2;
  pointer.y = innerHeight / 2;
  let px = pointer.x, py = pointer.y, lastY = scrollY;
  addEventListener(
    'pointermove',
    (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    },
    { passive: true },
  );
  onFrame(() => {
    pointer.vel += (Math.min(60, Math.hypot(pointer.x - px, pointer.y - py)) - pointer.vel) * 0.1;
    px = pointer.x;
    py = pointer.y;
    const ds = scrollY - lastY;
    lastY = scrollY;
    pointer.scrollVel += (ds - pointer.scrollVel) * 0.1;
  }, true);
}

export const clamp = (v: number, min = -1, max = 1) => Math.max(min, Math.min(max, v));
