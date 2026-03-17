# Backend API - Bruno

## Base

- `baseUrl`: `http://localhost:8080/api`
- Header: `Content-Type: application/json`
- Header autenticado: `Authorization: Bearer <token>`

## Orden sugerido

1. `GET {{baseUrl}}/health`
2. Crear permisos
3. Crear roles
4. Crear el primer usuario con contraseña
5. `POST {{baseUrl}}/auth/login`
6. Probar productos

## Auth

### `POST {{baseUrl}}/auth/login`

```json
{
  "email": "alex@example.com",
  "password": "12345678"
}
```

Respuesta esperada:

```json
{
  "token": "jwt...",
  "expiresAt": "2026-03-18T12:00:00Z",
  "user": {
    "id": 1,
    "name": "Alex Diaz",
    "email": "alex@example.com",
    "roleId": 1,
    "role": {
      "id": 1,
      "name": "admin",
      "description": "Rol con acceso completo",
      "permissions": []
    }
  }
}
```

### `GET {{baseUrl}}/auth/me`

Requiere `Authorization: Bearer <token>`.

## Health

### `GET {{baseUrl}}/health`

Sin body.

## Permissions

### `GET {{baseUrl}}/permissions`

Sin body.

### `GET {{baseUrl}}/permissions/:id`

Sin body.

### `POST {{baseUrl}}/permissions`

```json
{
  "name": "users.read",
  "description": "Permite listar usuarios"
}
```

### `PUT {{baseUrl}}/permissions/:id`

```json
{
  "name": "users.write",
  "description": "Permite crear y actualizar usuarios"
}
```

### `DELETE {{baseUrl}}/permissions/:id`

Sin body. Respuesta esperada: `204 No Content`.

## Roles

### `GET {{baseUrl}}/roles`

Sin body.

### `GET {{baseUrl}}/roles/:id`

Sin body.

### `POST {{baseUrl}}/roles`

```json
{
  "name": "admin",
  "description": "Rol con acceso completo",
  "permissionIds": [1, 2]
}
```

### `PUT {{baseUrl}}/roles/:id`

```json
{
  "name": "supervisor",
  "description": "Rol con permisos operativos",
  "permissionIds": [1]
}
```

### `DELETE {{baseUrl}}/roles/:id`

Sin body. Respuesta esperada: `204 No Content`.

## Users

### `GET {{baseUrl}}/users`

Requiere JWT.

### `GET {{baseUrl}}/users/:id`

Requiere JWT.

### `POST {{baseUrl}}/users`

```json
{
  "name": "Alex Diaz",
  "email": "alex@example.com",
  "password": "12345678",
  "roleId": 1
}
```

Nota: mientras no exista ningún usuario, el backend permite el bootstrap inicial sin token para permisos, roles, usuarios y productos. Después del primer usuario, todas esas rutas requieren JWT.

### `PUT {{baseUrl}}/users/:id`

```json
{
  "name": "Alex Diaz Updated",
  "email": "alex.updated@example.com",
  "password": "newpassword123",
  "roleId": 2
}
```

El campo `password` es opcional en actualización.

### `DELETE {{baseUrl}}/users/:id`

Sin body. Respuesta esperada: `204 No Content`.

## Products

### `GET {{baseUrl}}/products`

Sin body.

### `GET {{baseUrl}}/products/:id`

Sin body.

### `POST {{baseUrl}}/products`

```json
{
  "name": "Monitor 27",
  "description": "Monitor IPS 27 pulgadas",
  "price": 899.99,
  "stock": 12
}
```

### `PUT {{baseUrl}}/products/:id`

```json
{
  "name": "Monitor 27 Pro",
  "description": "Monitor IPS 27 pulgadas actualizado",
  "price": 999.99,
  "stock": 8
}
```

### `DELETE {{baseUrl}}/products/:id`

Sin body. Respuesta esperada: `204 No Content`.

## Notas rápidas

- Si envías un body inválido, el backend responde `400`.
- Si el `id` no existe, normalmente responde `404`.
- Si falla algo interno, responde `500`.
- Todas las rutas, excepto `GET /health` y `POST /auth/login`, requieren JWT una vez exista al menos un usuario.
