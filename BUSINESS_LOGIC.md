# BUSINESS_LOGIC.md - Playa (app de condiciones de playa)

> Generado por SaaS Factory V5 | Fecha: 2026-06-14

## 1. Problema de Negocio
**Dolor:** Quien quiere ir a la playa tiene que abrir 4-5 webs distintas (una para la marea,
otra para el viento, otra para la temperatura del agua, otra para el clima...) y armar
mentalmente el rompecabezas para decidir si vale la pena ir. No existe un solo lugar que lo
resuelva de un vistazo.

**Costo actual:** No es un costo economico, es de **tiempo y frustracion**. Una familia prepara
coche, ninos, neveras y sombrillas, conduce 30-40 min y llega a marea alta sin arena, agua fria
o viento insoportable = tarde arruinada y ninos decepcionados. O al reves: se pierde un dia
perfecto por pereza de cruzar datos en 5 webs.

## 2. Solucion
**Propuesta de valor:** Una app movil que muestra de un vistazo, con graficos sencillos pero
bonitos, todas las condiciones que afectan un dia de playa: mareas (pleamar/bajamar + si esta
subiendo o bajando), temperatura del aire, sensacion termica, viento (velocidad y direccion),
temperatura del agua y nubosidad.

**Flujo principal (Happy Path):**
1. Abre la app -> ve sus playas favoritas guardadas (o anade una nueva / la mas cercana)
2. Selecciona una playa -> el sistema consulta las fuentes de datos (Open-Meteo)
3. Ve un dashboard visual con las condiciones de AHORA
4. Puede cambiar la vista a "esta tarde" o "manana" para planear con antelacion

## 3. Usuario Objetivo
**Rol:** El padre/madre de familia que organiza el dia de playa.
**Contexto:** No es experto en meteorologia ni surf. Quiere una respuesta clara y rapida
("vamos o no, y a que hora"). Valora lo visual sobre los numeros crudos. Consulta la noche
antes (planear) o en el momento (parado en la arena con el movil). Enfoque 100% familia en v1
(sin perfiles de surfistas/pescadores).

## 4. Arquitectura de Datos

**Input:**
- Ubicacion del usuario (geolocalizacion) o seleccion manual de playa
- Playas guardadas como favoritas
- Seleccion de franja temporal: ahora / esta tarde / manana

**Output:**
- Dashboard visual por playa con: mareas (pleamar, bajamar, estado subiendo/bajando),
  temperatura del aire, sensacion termica, viento (velocidad + direccion), temperatura del
  agua, nubosidad
- Vista comparativa de franjas temporales (ahora / tarde / manana)

**Fuentes de datos externas (gratuitas, sin API key, cobertura Espana):**
- **Open-Meteo Forecast API**: viento, sensacion termica, temperatura del aire, nubosidad
- **Open-Meteo Marine API**: mareas, altura de olas, temperatura del agua (sea surface temp)
- Fallback futuro si la marea no es precisa en calas concretas: Puertos del Estado (oficial ES)

**Storage (Supabase tables sugeridas):**
- `profiles`: usuario (id, email, created_at) — base de auth
- `favorite_beaches`: playas favoritas del usuario (id, user_id, name, latitude, longitude, sort_order)
- (Opcional) `weather_cache`: cache de respuestas Open-Meteo por coordenada+hora para reducir llamadas

## 5. KPI de Exito
**Metrica principal:** Que un padre/madre abra la app y decida si va a la playa (y a que hora)
en **menos de 10 segundos**, sin necesidad de consultar ninguna otra web.

## 6. Especificacion Tecnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
├── auth/            # Autenticacion Email/Password (Supabase)
├── beaches/         # Gestion de playas favoritas (CRUD, geolocalizacion, buscar playa)
├── conditions/      # Fetch + parseo de Open-Meteo (forecast + marine), modelo de condiciones
└── dashboard/       # Visualizacion bonita: tarjetas/graficos de condiciones + selector temporal
```

### Componentes visuales clave (el corazon de la app)
- Tarjeta de marea con indicador de estado (subiendo/bajando) y proxima pleamar/bajamar
- Gauge/indicador de viento con flecha de direccion (rosa de los vientos)
- Indicadores de temperatura aire vs sensacion termica vs agua
- Indicador de nubosidad / cielo
- Selector de franja temporal (Ahora / Tarde / Manana)
- Diseno mobile-first, limpio, visual sobre numerico

### Design System
- **Gradient Mesh**: fondos con degradados suaves (cielo/mar/atardecer), colores vivos,
  sensacion moderna y fresca. El degradado del fondo puede adaptarse a la condicion real
  (cielo despejado = azul/naranja, nublado = grises suaves). Mobile-first.

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage)
- **Datos externos:** Open-Meteo (Forecast + Marine APIs) — gratis, sin API key
- **Validacion:** Zod (validar respuestas de Open-Meteo y entradas de usuario)
- **State:** Zustand (playa seleccionada, franja temporal)
- **Mobile:** PWA instalable (candidata clara para /add-mobile)
- **MCPs:** Next.js DevTools + Playwright + Supabase

### Proximos Pasos
1. [ ] Setup proyecto base (Next.js 16 + Tailwind + shadcn/ui)
2. [ ] Configurar Supabase (proyecto + tablas + RLS)
3. [ ] Implementar Auth (Email/Password) — skill /add-login
4. [ ] Feature: conditions (cliente Open-Meteo + modelo de datos + Zod)
5. [ ] Feature: beaches (favoritas + geolocalizacion)
6. [ ] Feature: dashboard (visualizacion bonita + selector temporal)
7. [ ] PWA instalable — skill /add-mobile
8. [ ] Onboarding (primer uso: anade tu primera playa) — skill /onboarding
9. [ ] Testing E2E — skill /playwright-cli
10. [ ] Deploy Vercel
```
