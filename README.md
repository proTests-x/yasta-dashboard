# yasta

La nueva aplicación está separada en dos proyectos independientes:

- `frontend/`: Next.js, Server Components, SSR para el panel y renderizado optimizado para la landing.
- `backend/`: Node.js + Express con arquitectura hexagonal y módulos verticales.

Esta copia publica solo la versión Next.js/Express. No incluye la versión Flask anterior, datos reales, historial Git ni imágenes de marca.

## Iniciar la nueva versión

Abre dos terminales.

```powershell
cd backend
pnpm install
pnpm dev
```

```powershell
cd frontend
pnpm install
pnpm dev
```

- Web: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:4000/api/v1`
- Salud: `http://127.0.0.1:4000/api/v1/health`

Cuenta demo: `demo@example.invalid` / `YastaDemo2026!`

## Arquitectura

El backend separa dominio, casos de uso, puertos y adaptadores dentro de cada funcionalidad. El almacenamiento JSON es un adaptador local persistente y puede cambiarse luego por PostgreSQL sin reescribir las reglas de negocio o las rutas HTTP.

El frontend mantiene la mayor parte de la interfaz en el servidor. La landing usa contenido prerenderizado y revalidado para velocidad y posicionamiento; el panel protegido se genera por SSR en cada solicitud. Solo los formularios y el fondo vectorial cargan JavaScript interactivo.

Consulta [backend/README.md](backend/README.md) y [frontend/README.md](frontend/README.md) para más detalle.

## Verificar

```powershell
cd backend
pnpm test
```

```powershell
cd frontend
pnpm typecheck
pnpm build
```

## Alcance de seguridad

Prototipo de demostración local, no listo para producción. La cuenta demo y la clave de desarrollo son valores públicos de ejemplo. No uses esta copia con datos reales ni la expongas a Internet sin deshabilitar el usuario de muestra y revisar autenticación, almacenamiento y permisos. Los registros de muestra son ficticios. Las dependencias se instalan por separado y conservan sus licencias originales.
