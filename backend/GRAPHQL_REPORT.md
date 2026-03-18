# Reporte: Estado Actual de GraphQL en Backend

Fecha del reporte: 2026-03-18

## 1) Resumen ejecutivo

- El backend expone GraphQL en `POST /api/graphql` y Playground en `GET /api/playground`.
- La app frontend actual no consume GraphQL para productos; usa REST (`/api/products`).
- GraphQL reutiliza exactamente los mismos `services` y `repositories` de REST.
- No hay paginación nativa en GraphQL hoy: consultas como `products`, `users`, `roles`, `permissions` devuelven listas completas.

## 2) Flujo técnico actual

1. `main.go` crea el servidor gqlgen con `generated.NewExecutableSchema(...)`.
2. Cada request a `POST /api/graphql` pasa por `AttachCurrentUserFromRequest(...)`.
3. Si llega JWT válido, se agrega `currentUser` al contexto GraphQL.
4. Los resolvers validan permisos con `RequireAnyPermission(...)` antes de operar.
5. Resolver -> Service -> Repository -> GORM/PostgreSQL.

## 3) Endpoint y autenticación

- Endpoint GraphQL:
  - `POST /api/graphql`
- Playground:
  - `GET /api/playground`
- JWT:
  - Si el header `Authorization` no existe, el request igual entra a GraphQL.
  - Las operaciones protegidas fallan en resolver con `ErrUnauthorized` o `ErrInsufficientScope`.
  - `login` no requiere usuario autenticado.

## 4) Operaciones disponibles

### Query

- `users`, `user(id)`
- `roles`, `role(id)`
- `permissions`, `permission(id)`
- `me`
- `products`, `product(id)`

### Mutation

- `login`
- `createUser`, `updateUser`, `deleteUser`
- `createRole`, `updateRole`, `deleteRole`
- `createPermission`, `updatePermission`, `deletePermission`
- `createProduct`, `updateProduct`, `deleteProduct`

## 5) Permisos por dominio

- Productos: `ADM_*_PRODUCTO` y algunos `VEN_*_PRODUCTO`.
- Usuarios: `ADM_*_USUARIO`.
- Roles: `ADM_*_ROL`.
- Permisos: `ADM_*_PERMISO`.
- `me` requiere usuario autenticado en contexto.

## 6) Manejo de errores actual

- No hay `ErrorPresenter` custom en gqlgen.
- Los errores de negocio (por ejemplo `ErrInvalidCredentials`) y de autorización salen como errores GraphQL estándar.
- `record not found` en queries por `id` retorna `null` (cuando aplica), no error fatal.

## 7) Observaciones importantes

- REST y GraphQL conviven sobre la misma capa de negocio.
- No hay filtros ni paginación en schema GraphQL.
- No hay dataloaders/caching en GraphQL.
- No se observa endpoint `GET /api/graphql`; solo `POST`.
