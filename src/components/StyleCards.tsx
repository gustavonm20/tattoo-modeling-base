import { styles, type TattooStyle } from '@/content';
import Accent from './Accent';

function StyleIcon({ style }: { style: TattooStyle }) {
  if (style === 'blackwork')
    return (
      <svg viewBox="0 0 60 60" aria-hidden="true">
        <rect x="10" y="10" width="40" height="40" fill="#e9e6df" />
        <circle cx="30" cy="30" r="12" fill="#0a0a0a" />
        <path d="M10 30h40M30 10v40" stroke="#0a0a0a" />
      </svg>
    );
  if (style === 'fineline')
    return (
      <svg viewBox="0 0 60 60" fill="none" stroke="#e9e6df" strokeWidth=".7" aria-hidden="true">
        <path d="M30 52C30 36 20 30 14 18M30 52c0-16 10-22 16-34M30 52V8" />
        <circle cx="30" cy="8" r="2" />
        <circle cx="14" cy="18" r="2" />
        <circle cx="46" cy="18" r="2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 60 60" aria-hidden="true">
      <defs>
        <radialGradient id="rg">
          <stop offset="0" stopColor="#e9e6df" />
          <stop offset="1" stopColor="#0a0a0a" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="22" fill="url(#rg)" />
    </svg>
  );
}

/** Cartas que viram no hover (ou no foco pelo teclado). */
export default function StyleCards() {
  return (
    <section className="sec" id="estilos">
      <span className="lbl rv scr">{styles.label}</span>
      <h2 className="big rv">
        <Accent {...styles.title} />
      </h2>
      <div className="sty">
        {styles.items.map((s) => (
          <div className="fl rv" key={s.key} tabIndex={0}>
            <div className="fi">
              <div className="fa">
                <StyleIcon style={s.key} />
                <div>
                  <small>{s.tag}</small>
                  <h3>{s.name}</h3>
                </div>
              </div>
              <div className="fb2">
                <small>{s.name}</small>
                <b>{s.headline}</b>
                <p>{s.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
