import { ImageResponse } from 'next/og';
import { site } from '@/content';

export const dynamic = 'force-static';
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'radial-gradient(circle at 78% 40%, #3a0509 0%, #0a0a0a 45%)',
          color: '#e9e6df',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', color: '#e04452' }}>
          Tatuagem autoral · São Paulo
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 168, lineHeight: 0.9 }}>
            Vulto<span style={{ color: '#b3121f' }}>.</span>Ink
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: '#8a8a86', marginTop: 28 }}>
            Blackwork, fine line e realismo em preto e cinza
          </div>
        </div>
      </div>
    ),
    size,
  );
}
