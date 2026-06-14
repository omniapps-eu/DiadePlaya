# Mi día de Playa 🏖️

App móvil (PWA) que muestra **de un vistazo** las condiciones de tus playas
favoritas: marea, viento, temperatura del agua y del aire, sensación térmica,
índice UV y estado del cielo — para ahora, esta tarde o mañana.

Pensada para quien organiza el día de playa en familia: decidir si ir (y a qué
hora) en menos de 10 segundos, sin saltar entre varias webs.

## Características

- 🌊 **Marea interactiva**: el agua sube/baja al nivel real del ciclo, con olas animadas
- 🌡️ **Temperaturas con color**: aire y agua se tiñen según el calor/frío
- ☀️ **Cielo animado**: sol, nubes, llovizna o lluvia según la previsión
- 🔆 **Índice UV** con categoría OMS y consejo de protección
- 🔍 **Buscador inteligente** de cualquier playa de España
- ⭐ **Favoritas** guardadas en el dispositivo (sin cuenta)
- 📱 **Instalable** como app (PWA) en móvil y escritorio

## Stack

- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS 3.4** (design system *Gradient Mesh*)
- **Zustand** (estado y favoritas en localStorage)
- **Zod** (validación de respuestas de API)
- Datos de **[Open-Meteo](https://open-meteo.com)** (Forecast + Marine, sin API key)
- Geocoding de **[Nominatim / OpenStreetMap](https://nominatim.org)**

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos:

```bash
npm run build      # build de producción
npm start          # sirve el build (necesario para probar la PWA instalable)
npm run typecheck  # comprobación de tipos
```

> El service worker solo se registra en producción; en desarrollo se desactiva
> para no servir versiones cacheadas durante el hot-reload.

## Estructura

```
src/
├── app/                    # Rutas (App Router) + API routes + manifest
│   └── api/                # /api/conditions, /api/beaches/search
├── features/
│   ├── beaches/            # Catálogo, búsqueda y store de favoritas
│   ├── conditions/         # Servicio Open-Meteo, mareas, colores, tipos
│   └── dashboard/          # UI: tarjetas interactivas y pantalla principal
└── shared/                 # Componentes y utilidades comunes
```

## Iconos

Los iconos de la PWA se generan desde `public/icon.svg`:

```bash
node scripts/generate-icons.mjs
```
