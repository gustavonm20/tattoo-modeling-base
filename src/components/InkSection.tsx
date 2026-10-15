'use client';
import { useEffect, useRef, type ReactNode, type Ref } from 'react';
import { createInk } from '@/lib/ink';
import { prefersReducedMotion } from '@/lib/device';

interface Props {
  id?: string;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
  'aria-labelledby'?: string;
}

/** Seção principal revelada pela transição de tinta (clip-path circular). */
export default function InkSection({ id, className = '', children, ref, ...rest }: Props) {
  const own = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = own.current;
    if (!el || prefersReducedMotion()) return;
    const st = createInk(el);
    return () => {
      st.kill();
      el.style.removeProperty('--ink');
      el.classList.remove('ink-done');
    };
  }, []);

  return (
    <section
      id={id}
      className={`sec ink ${className}`}
      ref={(node) => {
        own.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      {...rest}
    >
      <div className="ink-fill" aria-hidden="true" />
      <div className="ink-c">{children}</div>
    </section>
  );
}
