package services

import "errors"

var (
	ErrPermissionNotFound = errors.New("uno o más permisos no existen")
	ErrInvalidCredentials = errors.New("credenciales inválidas")
	ErrInvalidToken       = errors.New("token inválido")
)
