package graph

import (
	"backend/models"
	"backend/services"
	"context"
	"errors"
	"net/http"
	"strings"
)

type contextKey string

const currentUserContextKey contextKey = "graphqlCurrentUser"

var (
	ErrUnauthorized      = errors.New("no autorizado")
	ErrInsufficientScope = errors.New("permiso insuficiente")
)

func AttachCurrentUserFromRequest(request *http.Request, jwtService services.JWTService, userService services.UserService) (*http.Request, error) {
	header := strings.TrimSpace(request.Header.Get("Authorization"))
	if header == "" {
		return request, nil
	}

	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") || strings.TrimSpace(parts[1]) == "" {
		return nil, ErrUnauthorized
	}

	claims, err := jwtService.ValidateToken(strings.TrimSpace(parts[1]))
	if err != nil {
		return nil, ErrUnauthorized
	}

	user, err := userService.FindByID(claims.UserID)
	if err != nil {
		return nil, ErrUnauthorized
	}

	return request.WithContext(WithCurrentUser(request.Context(), user)), nil
}

func WithCurrentUser(ctx context.Context, user models.User) context.Context {
	return context.WithValue(ctx, currentUserContextKey, user)
}

func CurrentUser(ctx context.Context) (models.User, error) {
	value := ctx.Value(currentUserContextKey)
	if value == nil {
		return models.User{}, ErrUnauthorized
	}

	user, ok := value.(models.User)
	if !ok {
		return models.User{}, ErrUnauthorized
	}

	return user, nil
}

func RequireAnyPermission(ctx context.Context, permissionNames ...string) (models.User, error) {
	user, err := CurrentUser(ctx)
	if err != nil {
		return models.User{}, err
	}

	if len(permissionNames) == 0 || userHasAnyPermission(user, permissionNames...) {
		return user, nil
	}

	return models.User{}, ErrInsufficientScope
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
