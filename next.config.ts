import type { NextConfig } from 'next';

const config: NextConfig = {
  // Gera HTML estático em /out: publica em qualquer host (Vercel, Netlify, etc.)
  output: 'export',
  // O export estático não tem otimizador de imagem; as fotos já devem estar em WebP
  images: { unoptimized: true },
  // Shaders .glsl importados como string (Turbopack no dev/build, webpack como fallback)
  turbopack: {
    rules: {
      '*.glsl': { loaders: ['raw-loader'], as: '*.js' },
    },
  },
  webpack(cfg) {
    cfg.module.rules.push({ test: /\.glsl$/, type: 'asset/source' });
    return cfg;
  },
};

export default config;
