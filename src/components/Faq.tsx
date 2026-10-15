import { faq } from '@/content';

export default function Faq() {
  return (
    <section className="sec" id="duvidas">
      <span className="lbl rv scr">{faq.label}</span>
      {faq.items.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <p>{item.a}</p>
        </details>
      ))}
    </section>
  );
}
