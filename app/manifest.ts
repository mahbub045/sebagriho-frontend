import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sebagriho',
    short_name: 'Sebagriho',
    description: 'Sebagriho management application',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#24607a',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
