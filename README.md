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

## Despliegue en Vercel (vía GitHub)

1. Crea un repo vacío en GitHub (ej. `flor-de-altura-cafe`).
2. Conecta este repo local y empuja:

   ```bash
   git remote add origin https://github.com/<usuario>/flor-de-altura-cafe.git
   git push -u origin main
   ```

3. En [vercel.com](https://vercel.com) → **New Project** → importa el repo.
   Vercel detecta Next.js automáticamente (sin configuración). Cada `push` a
   `main` dispara un despliegue de producción.

---

Designed & Developed by **Marketnauta**.
