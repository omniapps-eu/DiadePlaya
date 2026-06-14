import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Playa — condiciones de un vistazo',
    short_name: 'Playa',
    description:
      'Marea, viento, temperatura del agua y del aire de tus playas favoritas, de un vistazo.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#7cc6f5',
    theme_color: '#7cc6f5',
    categories: ['weather', 'lifestyle', 'travel'],
    lang: 'es',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
