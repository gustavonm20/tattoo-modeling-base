import { nav } from '@/content';

export default function Nav() {
  return (
    <nav aria-label="Principal">
      <b>
        Vulto<em>.</em>Ink
      </b>
      <div>
        {nav.map((l) => (
          <a key={l.href} href={l.href} className="scr">
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
