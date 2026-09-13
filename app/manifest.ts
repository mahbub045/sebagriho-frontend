import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Seba Griho',
    short_name: 'Seba Griho',
    description: 'Seba Griho management application',
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
