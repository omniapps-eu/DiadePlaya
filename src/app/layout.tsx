import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RegisterServiceWorker } from '@/shared/components/register-service-worker'

export const metadata: Metadata = {
  title: 'Playa — condiciones de un vistazo',
  description:
    'Marea, viento, temperatura del agua y del aire de tus playas favoritas, de un vistazo.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Playa',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Playa',
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#7cc6f5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  )
}
