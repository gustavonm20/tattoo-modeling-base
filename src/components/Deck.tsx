'use client';
import { useEffect, useRef } from 'react';
import { IconArrowDown } from '@tabler/icons-react';
import { process } from '@/content';
import { ScrollTrigger } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/device';
import { scrollToY } from '@/lib/scroll';
import InkSection from './InkSection';
import Accent from './Accent';

const steps = process.steps;
const N = steps.length;
const pad = (n: number) => String(n).padStart(2, '0');
const OUT = 'translate3d(0,160px,120px) rotateX(-70deg)';

/** Baralho 3D do processo: a seção fica fixada e cada etapa de scroll avança uma carta. */
export default function Deck() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const numRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const api = useRef<{ next: () => void }>({ next: () => {} });

  useEffect(() => {
    const section = sectionRef.current!, cards = cardsRef.current;
    let cur = 0, timer = 0;

    const lay = () => {
      for (let k = 0; k < N; k++) {
        const c = cards[(cur + k) % N];
        c.style.zIndex = String(10 - k);
        c.style.opacity = String(1 - k * 0.22);
        c.style.transform = `translate3d(0,${-k * 22}px,${-k * 80}px) rotateX(${k * 6}deg)`;
        c.classList.toggle('f', k === 0);
        c.setAttribute('aria-hidden', String(k !== 0));
      }
      numRef.current!.textContent = `${pad(cur + 1)} / ${pad(N)}`;
      barRef.current!.style.setProperty('--dp', String((cur + 1) / N));
    };

    const go = (target: number) => {
      if (target === cur) return;
      const prev = cur;
      cur = target;
      clearTimeout(timer);
      if (target === (prev + 1) % N) {
        // a carta da frente cai e vai para o fim do baralho
        const f = cards[prev];
        f.style.transform = OUT;
        f.style.opacity = '0';
        timer = window.setTimeout(lay, 450);
      } else {
        // voltando: a carta sobe de onde caiu
        const c = cards[target];
        c.style.transition = 'none';
        c.style.transform = OUT;
        c.style.opacity = '0';
        void c.offsetHeight;
        c.style.transition = '';
        lay();
      }
    };
    lay();

    const pin = prefersReducedMotion()
      ? null
      : ScrollTrigger.create({
          trigger: section,
          pin: true,
          start: () => (section.offsetHeight > innerHeight ? 'bottom bottom' : 'top top'),
          end: `+=${N * 45}%`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => go(Math.min(N - 1, Math.floor(self.progress * N))),
        });

    api.current.next = () => {
      if (!pin) return go((cur + 1) % N);
      // com o pin, o botão rola até a próxima etapa (ou sai da seção na última)
      if (cur === N - 1) scrollToY(pin.end + 2);
      else scrollToY(pin.start + ((pin.end - pin.start) * (cur + 1.5)) / N);
    };

    return () => {
      clearTimeout(timer);
      pin?.kill(true);
    };
  }, []);

  return (
    <InkSection id="proc" ref={sectionRef}>
      <div className="two">
        <div>
          <span className="lbl rv scr">{process.label}</span>
          <h2 className="big rv">
            <Accent {...process.title} />
          </h2>
          <div className="dn rv">
            <button type="button" className="mb mag" onClick={() => api.current.next()}>
              {process.next} <IconArrowDown aria-hidden="true" stroke={1.5} />
            </button>
            <span ref={numRef} aria-live="polite">
              01 / {pad(N)}
            </span>
            <span className="dbar" ref={barRef} aria-hidden="true" />
          </div>
        </div>
        <div className="deck" onClick={() => api.current.next()}>
          {steps.map((step, i) => (
            <div
              className="dc"
              key={step.title}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
            >
              <h3>
                <small>{pad(i + 1)}</small>
                {step.title}
              </h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </InkSection>
  );
}
