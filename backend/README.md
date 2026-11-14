# yasta backend

API Node.js + Express organizada con arquitectura hexagonal y cortes verticales por funcionalidad.

## Estructura

- `domain/`: reglas y entidades sin dependencias de Express.
- `application/`: casos de uso que coordinan los puertos.
- `ports/`: contratos que necesita el dominio.
- `adapters/`: implementaciones reemplazables (JSON local o memoria en pruebas; mañana PostgreSQL).
- `http/`: entrada REST de cada módulo.
- `bootstrap/`: composición de dependencias en un solo punto.

Los módulos `auth`, `plans` y `finance` pueden evolucionar de forma independiente. La sesión viaja en JWT y la API incluye compresión, cabeceras seguras, CORS, límite de intentos de acceso y cierre ordenado. En desarrollo, el adaptador JSON conserva los datos entre reinicios sin acoplar los casos de uso al archivo.

## Ejecutar

```powershell
pnpm install
Copy-Item .env.example .env
pnpm dev
```

API: `http://127.0.0.1:4000/api/v1`

Cuenta demo: `demo@example.invalid` / `YastaDemo2026!`

## Siguiente adaptador

Para migrar a PostgreSQL se implementan `UserRepository`, `PlanRepository` y `FinanceRepository` y se sustituyen en `src/bootstrap/container.js`. Los casos de uso y las rutas no cambian.

Mientras se use el adaptador JSON debe ejecutarse una sola instancia de la API. Para aprovechar varios procesos o servidores, el siguiente paso es activar el adaptador PostgreSQL compartido.
