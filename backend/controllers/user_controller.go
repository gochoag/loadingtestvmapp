package controllers

import (
	"backend/middleware"
	"backend/models"
	"backend/services"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type UserController struct {
	service    services.UserService
	jwtService services.JWTService
}

func NewUserController(service services.UserService, jwtService services.JWTService) *UserController {
	return &UserController{
		service:    service,
		jwtService: jwtService,
	}
}

func (c *UserController) GetUsers(ctx *gin.Context) {
	users, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudieron obtener usuarios"})
		return
	}
	ctx.JSON(http.StatusOK, users)
}

func (c *UserController) GetUser(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	user, err := c.service.FindByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "usuario no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo obtener el usuario"})
		}
		return
	}
	ctx.JSON(http.StatusOK, user)
}

func (c *UserController) CreateUser(ctx *gin.Context) {
	var input models.CreateUserInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	user, err := c.service.Create(input)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "rol no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear usuario"})
		}
		return
	}
	ctx.JSON(http.StatusCreated, user)
}

func (c *UserController) UpdateUser(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	var input models.UpdateUserInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	user, err := c.service.Update(uint(id), input)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "usuario o rol no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo actualizar usuario"})
		}
		return
	}
	ctx.JSON(http.StatusOK, user)
}

func (c *UserController) DeleteUser(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	err = c.service.Delete(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "usuario no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo eliminar usuario"})
		}
		return
	}
	ctx.Status(http.StatusNoContent)
}

func (c *UserController) Login(ctx *gin.Context) {
	var input models.LoginInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "credenciales inválidas"})
		return
	}

	user, err := c.service.Authenticate(input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrInvalidCredentials):
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "email o contraseña incorrectos"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo iniciar sesión"})
		}
		return
	}

	token, expiresAt, err := c.jwtService.GenerateToken(user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo generar el token"})
		return
	}

	ctx.JSON(http.StatusOK, models.AuthResponse{
		Token:     token,
		ExpiresAt: expiresAt,
		User:      user,
	})
}

func (c *UserController) Me(ctx *gin.Context) {
	user, ok := middleware.CurrentUser(ctx)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "no autorizado"})
		return
	}

	ctx.JSON(http.StatusOK, user)
}
