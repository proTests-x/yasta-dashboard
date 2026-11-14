# yasta frontend

Frontend Next.js con App Router, Server Components y SSR para las vistas con datos. La landing entrega HTML indexable, metadatos por página, datos estructurados, `sitemap.xml` y `robots.txt`. Solo el fondo vectorial y los formularios hidratan JavaScript en el navegador.

## Ejecutar

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Web: `http://127.0.0.1:3000`

El backend debe estar disponible en `BACKEND_URL` (por defecto `http://127.0.0.1:4000`).
