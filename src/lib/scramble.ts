'use client';

const CH = '!<>-_/[]{}=+*^?#░▒▓';
const running = new WeakSet<HTMLElement>();

/** Efeito de texto embaralhado que se resolve da esquerda para a direita. */
export function scramble(el: HTMLElement) {
  if (running.has(el)) return;
  running.add(el);
  const original = el.dataset.o ?? (el.dataset.o = el.textContent ?? '');
  let f = 0;
  const id = setInterval(() => {
    el.textContent = [...original]
      .map((c, i) => (i < f / 2 || c === ' ' ? c : CH[(Math.random() * CH.length) | 0]))
      .join('');
    if (++f / 2 > original.length) {
      clearInterval(id);
      el.textContent = original;
      running.delete(el);
    }
  }, 28);
}
