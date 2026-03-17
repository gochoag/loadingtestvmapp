package middleware

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const currentUserContextKey = "authUser"

func AuthRequired(jwtService services.JWTService, userService services.UserService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authenticateRequest(ctx, jwtService, userService)
	}
}

func BootstrapOrAuth(jwtService services.JWTService, userService services.UserService) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		hasUsers, err := userService.HasConfiguredUsers()
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "no se pudo validar el estado de autenticación"})
			return
		}

		if !hasUsers {
			ctx.Next()
			return
		}

		authenticateRequest(ctx, jwtService, userService)
	}
}

func CurrentUser(ctx *gin.Context) (models.User, bool) {
	value, exists := ctx.Get(currentUserContextKey)
	if !exists {
		return models.User{}, false
	}

	user, ok := value.(models.User)
	return user, ok
}

func RequireAnyPermission(userService services.UserService, permissionNames ...string) gin.HandlerFunc {
	required := make([]string, 0, len(permissionNames))
	for _, permissionName := range permissionNames {
		permissionName = strings.TrimSpace(permissionName)
		if permissionName == "" {
			continue
		}
		required = append(required, permissionName)
	}

	return func(ctx *gin.Context) {
		hasUsers, err := userService.HasConfiguredUsers()
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "no se pudo validar permisos"})
			return
		}

		if !hasUsers {
			ctx.Next()
			return
		}

		user, ok := CurrentUser(ctx)
		if !ok {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "no autorizado"})
			return
		}

		if len(required) == 0 || userHasAnyPermission(user, required...) {
			ctx.Next()
			return
		}

		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "permiso insuficiente"})
	}
}

func userHasAnyPermission(user models.User, permissionNames ...string) bool {
	if len(permissionNames) == 0 {
		return true
	}

	granted := make(map[string]struct{}, len(user.Role.Permissions))
	for _, permission := range user.Role.Permissions {
		granted[strings.TrimSpace(permission.Name)] = struct{}{}
	}

	for _, permissionName := range permissionNames {
		if _, exists := granted[strings.TrimSpace(permissionName)]; exists {
			return true
		}
	}

	return false
}

func authenticateRequest(ctx *gin.Context, jwtService services.JWTService, userService services.UserService) {
	header := strings.TrimSpace(ctx.GetHeader("Authorization"))
	if header == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token requerido"})
		return
	}

	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "formato de token inválido"})
		return
	}

	claims, err := jwtService.ValidateToken(strings.TrimSpace(parts[1]))
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token inválido o expirado"})
		return
	}

	user, err := userService.FindByID(claims.UserID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "usuario no autorizado"})
		return
	}

	ctx.Set(currentUserContextKey, user)
	ctx.Next()
}
