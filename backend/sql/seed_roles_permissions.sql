INSERT INTO permissions (name, description) VALUES
    ('ADM_R_PRODUCTO', 'Permite consultar productos'),
    ('ADM_C_PRODUCTO', 'Permite crear productos'),
    ('ADM_U_PRODUCTO', 'Permite actualizar productos'),
    ('ADM_D_PRODUCTO', 'Permite eliminar productos'),
    ('ADM_R_USUARIO', 'Permite consultar usuarios'),
    ('ADM_C_USUARIO', 'Permite crear usuarios'),
    ('ADM_U_USUARIO', 'Permite actualizar usuarios'),
    ('ADM_D_USUARIO', 'Permite eliminar usuarios'),
    ('ADM_R_ROL', 'Permite consultar roles'),
    ('ADM_C_ROL', 'Permite crear roles'),
    ('ADM_U_ROL', 'Permite actualizar roles'),
    ('ADM_D_ROL', 'Permite eliminar roles'),
    ('ADM_R_PERMISO', 'Permite consultar permisos'),
    ('ADM_C_PERMISO', 'Permite crear permisos'),
    ('ADM_U_PERMISO', 'Permite actualizar permisos'),
    ('ADM_D_PERMISO', 'Permite eliminar permisos'),
    ('VEN_R_PRODUCTO', 'Permite consultar productos'),
    ('VEN_C_PRODUCTO', 'Permite crear productos'),
    ('VEN_U_PRODUCTO', 'Permite actualizar productos')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

INSERT INTO roles (name, description) VALUES
    ('Admin', 'Rol con acceso administrativo completo'),
    ('Vendedor', 'Rol comercial con gestión operativa de productos')
ON CONFLICT (name) DO UPDATE
SET description = EXCLUDED.description;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'ADM_R_PRODUCTO',
    'ADM_C_PRODUCTO',
    'ADM_U_PRODUCTO',
    'ADM_D_PRODUCTO',
    'ADM_R_USUARIO',
    'ADM_C_USUARIO',
    'ADM_U_USUARIO',
    'ADM_D_USUARIO',
    'ADM_R_ROL',
    'ADM_C_ROL',
    'ADM_U_ROL',
    'ADM_D_ROL',
    'ADM_R_PERMISO',
    'ADM_C_PERMISO',
    'ADM_U_PERMISO',
    'ADM_D_PERMISO'
)
WHERE r.name = 'Admin'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN (
    'VEN_R_PRODUCTO',
    'VEN_C_PRODUCTO',
    'VEN_U_PRODUCTO'
)
WHERE r.name = 'Vendedor'
ON CONFLICT DO NOTHING;
