import type { TattooStyle } from '@/content';

/** Semente estável por posição do trabalho (mesma arte em cada build). */
export const artSeed = (index: number) => index * 37 + 11;

/**
 * Gera a arte procedural (SVG em string) usada quando o trabalho não tem foto.
 * Determinística: o mesmo estilo + semente sempre produz o mesmo desenho.
 */
export function proceduralArt(type: TattooStyle, seed: number): string {
  let s = seed;
  const r = (n: number) => {
    s = (s * 9301 + 49297) % 233280;
    return (s / 233280) * n;
  };
  const W = 300, H = 400, cx = 150, cy = 200;
  let g = '';

  if (type === 'blackwork') {
    const k = 6 + Math.floor(r(6));
    for (let i = 0; i < k; i++)
      g += `<path transform="rotate(${(360 / k) * i} ${cx} ${cy})" d="M${cx} ${cy}Q${cx + 40} ${cy - 70} ${cx} ${cy - 120 + r(20)}Q${cx - 40} ${cy - 70} ${cx} ${cy}" fill="#e9e6df"/>`;
    for (let j = 0; j < 3; j++)
      g += `<circle cx="${cx}" cy="${cy}" r="${30 + j * 16 + r(6)}" fill="none" stroke="${j % 2 ? '#0a0a0a' : '#e9e6df'}" stroke-width="${j === 1 ? 8 : 1.5}"/>`;
    g += `<circle cx="${cx}" cy="${cy}" r="18" fill="#0a0a0a"/><rect x="40" y="340" width="220" height="14" fill="#e9e6df"/>`;
    for (let i = 0; i < 22; i++) g += `<rect x="${40 + i * 10}" y="358" width="5" height="5" fill="#e9e6df"/>`;
  } else if (type === 'fineline') {
    const n = 5 + Math.floor(r(4));
    g += `<path d="M${cx} 360C${cx - 10} 280 ${cx + 12} 200 ${cx} 70" stroke="#e9e6df" stroke-width=".8" fill="none"/>`;
    for (let i = 0; i < n; i++) {
      const y = 320 - i * 48, sd = i % 2 ? 1 : -1, l = 40 + r(30);
      g += `<path d="M${cx} ${y}q${sd * l * 0.6} ${-l * 0.5} ${sd * l} ${-l * 0.4}q${-sd * l * 0.3} ${l * 0.5} ${-sd * l} ${l * 0.4}z" stroke="#e9e6df" stroke-width=".7" fill="none"/>`;
    }
    g += `<circle cx="${cx}" cy="64" r="9" fill="none" stroke="#b3121f" stroke-width=".8"/>`;
    for (let i = 0; i < 14; i++) g += `<circle cx="${30 + r(240)}" cy="${30 + r(340)}" r=".9" fill="#e9e6df"/>`;
  } else {
    for (let i = 0; i < 7; i++)
      g += `<circle cx="${cx + r(10) - 5}" cy="${cy - 10 + i * 3}" r="${120 - i * 16}" fill="rgb(${20 + i * 24},${20 + i * 24},${20 + i * 23})"/>`;
    g += `<ellipse cx="${cx - 30}" cy="${cy - 40}" rx="26" ry="16" fill="#0a0a0a"/><ellipse cx="${cx + 30}" cy="${cy - 40}" rx="26" ry="16" fill="#0a0a0a"/><path d="M${cx} ${cy - 20}l-14 50h28z" fill="#1a1a1a"/><path d="M${cx - 34} ${cy + 50}q34 ${18 + r(10)} 68 0" stroke="#0a0a0a" stroke-width="5" fill="none"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${W}" height="${H}" fill="#101010"/>${g}</svg>`;
}
