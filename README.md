# Flor de Altura Café — Plataforma B2C + B2B

Plataforma de e-commerce de café de especialidad (Pichanaqui, 1.700 msnm · SCA 84–87)
construida como tienda directa al consumidor **y** motor de captación de leads
corporativos. Lista para despliegue continuo en **Vercel** vía GitHub.

## Stack

| Capa            | Tecnología                                  |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 14 (App Router) + React 18          |
| Lenguaje        | TypeScript (strict)                         |
| Estilos         | Tailwind CSS 3 (paleta de marca en config)  |
| Estado global   | Zustand (+ persist en localStorage)         |
| Animaciones     | Framer Motion                               |
| Formularios     | React Hook Form + Zod *(B2B — en progreso)* |
| Iconos          | lucide-react                                |

## Arquitectura de carpetas

```
src/
├─ app/                 # App Router: layout, page, estilos globales
├─ components/
│  ├─ cart/             # CartDrawer (slide-out) + CartButton
│  ├─ catalog/          # CatalogSection + ProductCard
│  └─ layout/           # Header, Hero, Footer
├─ store/
│  └─ cart-store.ts     # Estado global del carrito (Zustand)
├─ data/                # Mocks JSON (products.json)
├─ lib/                 # utils, constants, hooks
└─ types/               # Tipos de dominio
```

## Módulos

- **✅ Motor e-commerce + carrito global (B2C)** — catálogo dinámico (`#catalogo`),
  `<CartDrawer />` lateral persistente, **WhatsApp Checkout** que mapea el carrito
  a un enlace `wa.me` URL-encodeado con resumen y total.
- **✅ Embudo B2B** (`#b2b`) — formulario con validación Zod + estados loading/éxito.
- **✅ Revista digital** (`#revista`) — filtros + `<ArticleModal />` con body-lock.
- **✅ Educación + cupón** (`#educacion`) — CTA Hotmart + copiar `RITUAL20`.
- **✅ Secciones de marca** — Origen/Finca, Testimonios, Header con menú móvil y
  Footer con datos de contacto reales.

## Capa de datos / analítica

Eventos críticos instrumentados con atributos `data-layer` (listos para Google Tag
Manager → BigQuery → Looker Studio): `add_to_cart`, `open_cart`,
`begin_checkout_whatsapp`, `cart_remove_item`. Imágenes vía `next/image`.

## Configuración

`src/lib/constants.ts`:

- `WHATSAPP_NUMBER` — número destino del checkout (formato internacional sin `+`).
- `RITUAL_COUPON`, `HOTMART_COURSE_URL` — sección educación.

## Comandos

```bash
npm run dev        # desarrollo (http://localhost:3000)
npm run build      # build de producción (pipeline Vercel)
npm run typecheck  # verificación de tipos (tsc --noEmit)
npm run lint       # ESLint
```

## CI/CD y Despliegue Automático

### ✅ Configuración completada

- **GitHub**: Repo público en [`Elmarketnauta/Flor_de__altura_2.0`](https://github.com/Elmarketnauta/Flor_de__altura_2.0)
- **Vercel**: Proyecto vinculado automáticamente (`elmarketnautas-projects/flor-de-altura-2-0`)
- **Despliegue continuo**: Cada `git push origin main` → build + deploy en Vercel en ~1–2 min
- **Production URL**: `https://flor-de-altura-2-0-ocpwsd5wv-elmarketnautas-projects.vercel.app`

### Flujo de desarrollo futuro

1. **Desarrollo local**:
   ```bash
   npm run dev
   ```

2. **Commit y push**:
   ```bash
   git add .
   git commit -m "feat/fix: descripción"
   git push origin main
   ```

3. **Vercel despliega automáticamente** (monitorear en
   [vercel.com/dashboard](https://vercel.com/dashboard))

### Variables de entorno

- `.env.local` — **local only**, nunca se sube a Git:
  - `GITHUB_TOKEN` — PAT para operaciones programáticas (GitHub Actions, etc.)
  - `VERCEL_TOKEN` — token de CI/CD (ya configurado)
  - `B2B_WEBHOOK_URL` — *opcional*, URL webhook para reenviar leads B2B a CRM/Make/Zapier

- **En Vercel** (dashboard → Settings → Environment Variables):
  - `B2B_WEBHOOK_URL` — si usas Make/Zapier/Google Apps Script para procesar leads

### Webhook B2B (opcional)

El endpoint `POST /api/b2b-lead` valida y reenvía leads a `B2B_WEBHOOK_URL`. Ejemplos:

- **Make** (ex-Integromat): webhooks automáticos → Slack, Google Sheets, HubSpot
- **Zapier**: zap webhook → email, CRM
- **Google Apps Script**: webhooks → Google Sheets (gratuito, sin límites)

Configura en Vercel dashboard → **Settings** → **Environment Variables** → agregar
`B2B_WEBHOOK_URL=https://...`.

### Branches y preview deployments

- `main` → producción
- PRs → preview deployments (URL temporal para revisar cambios)

---

Designed & Developed by **Marketnauta**.
