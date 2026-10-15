'use client';

export type Quality = 'high' | 'low';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isMobile = () =>
  typeof window !== 'undefined' &&
  (matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches);

let webgl: boolean | null = null;
let gpu = '';

export function hasWebGL() {
  if (webgl !== null) return webgl;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    webgl = !!gl;
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      gpu = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    webgl = false;
  }
  return webgl;
}

/** GPU fraca, renderização por software, pouco hardware ou celular → 'low'. */
export function detectQuality(): Quality {
  if (isMobile()) return 'low';
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return 'low';
  hasWebGL();
  if (/swiftshader|llvmpipe|software|basic render|mali-[4t]|adreno \(tm\) [34]|intel\(r\) hd graphics( [2-5]\d{3})?$/i.test(gpu))
    return 'low';
  return 'high';
}

/** Executa quando o navegador estiver ocioso (para não competir com o primeiro paint). */
export function whenIdle(cb: () => void, timeout = 1200) {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(cb, { timeout });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(cb, 200);
  return () => clearTimeout(id);
}

/** Espera o `load` da página e depois um momento ocioso. */
export function afterLoadIdle(cb: () => void, timeout = 2500) {
  let cancel = () => {};
  const go = () => (cancel = whenIdle(cb, timeout));
  if (document.readyState === 'complete') go();
  else addEventListener('load', go, { once: true });
  return () => {
    removeEventListener('load', go);
    cancel();
  };
}
