'use client';
import { useEffect, useState } from 'react';
import { testimonials } from '@/content';

const INTERVAL = 5000;

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setActive((i) => (i + 1) % testimonials.items.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="sec" id="depoimentos">
      <span className="lbl rv scr">{testimonials.label}</span>
      <div className="dep">
        {testimonials.items.map((t, i) => (
          <figure key={i} className={`q${i === active ? ' on' : ''}`} aria-hidden={i !== active} style={{ margin: 0 }}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <cite>{t.author}</cite>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
