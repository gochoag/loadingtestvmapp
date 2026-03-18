package graph

import "backend/services"

type Resolver struct {
	JWTService        services.JWTService
	PermissionService services.PermissionService
	ProductService    services.ProductService
	RoleService       services.RoleService
	UserService       services.UserService
}
