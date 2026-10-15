'use client';
import { useEffect, useRef } from 'react';
import { contact, footer, whatsappUrl } from '@/content';
import { onFrame } from '@/lib/frame';
import { ensurePointer, pointer } from '@/lib/pointer';
import { prefersReducedMotion } from '@/lib/device';

/** Rodapé com letras gigantes que se inclinam em direção ao cursor. */
export default function Footer() {
  const wordRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    ensurePointer();
    const word = wordRef.current!;
    const chars = [...word.children] as HTMLElement[];
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(word);
    // centros das letras sem a transformação (o pai não se move), lidos antes das escritas
    let centers: { x: number; y: number }[] = [];
    const stopRead = onFrame(() => {
      if (!visible) return;
      const wr = word.getBoundingClientRect();
      centers = chars.map((s) => ({
        x: wr.left + s.offsetLeft + s.offsetWidth / 2,
        y: wr.top + s.offsetTop + s.offsetHeight / 2,
      }));
    }, true);
    const stop = onFrame(() => {
      if (!visible) return;
      chars.forEach((s, i) => {
        const c = centers[i];
        if (!c) return;
        const dx = c.x - pointer.x, dy = c.y - pointer.y;
        const k = Math.max(0, 1 - Math.hypot(dx, dy) / 260);
        s.style.transform = `translateZ(${k * 60}px) rotateY(${k * dx * 0.25}deg) rotateX(${-k * dy * 0.25}deg)`;
        s.style.color = k > 0.4 && !s.classList.contains('dot') ? '#b3121f' : '';
      });
    });
    return () => {
      stopRead();
      stop();
      io.disconnect();
    };
  }, []);

  return (
    <footer>
      <div className="fbg" ref={wordRef} aria-label={footer.word} role="img">
        {[...footer.word].map((c, i) => (
          <span key={i} className={c === '.' ? 'dot' : undefined} aria-hidden="true">
            {c}
          </span>
        ))}
      </div>
      <div className="fr">
        <span>{contact.location}</span>
        <span>
          <a href={contact.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </span>
      </div>
    </footer>
  );
}
