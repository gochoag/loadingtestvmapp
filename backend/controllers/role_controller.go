package controllers

import (
	"backend/models"
	"backend/services"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type RoleController struct {
	service services.RoleService
}

func NewRoleController(service services.RoleService) *RoleController {
	return &RoleController{service: service}
}

func (c *RoleController) GetRoles(ctx *gin.Context) {
	roles, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudieron obtener roles"})
		return
	}
	ctx.JSON(http.StatusOK, roles)
}

func (c *RoleController) GetRole(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de rol inválido"})
		return
	}

	role, err := c.service.FindByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "rol no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo obtener el rol"})
		}
		return
	}
	ctx.JSON(http.StatusOK, role)
}

func (c *RoleController) CreateRole(ctx *gin.Context) {
	var input models.RoleInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	role, err := c.service.Create(input)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrPermissionNotFound):
			ctx.JSON(http.StatusNotFound, gin.H{"error": "uno o más permisos no existen"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear rol"})
		}
		return
	}
	ctx.JSON(http.StatusCreated, role)
}

func (c *RoleController) UpdateRole(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de rol inválido"})
		return
	}

	var input models.RoleInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	role, err := c.service.Update(uint(id), input)
	if err != nil {
		switch {
		case errors.Is(err, gorm.ErrRecordNotFound):
			ctx.JSON(http.StatusNotFound, gin.H{"error": "rol no encontrado"})
		case errors.Is(err, services.ErrPermissionNotFound):
			ctx.JSON(http.StatusNotFound, gin.H{"error": "uno o más permisos no existen"})
		default:
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo actualizar rol"})
		}
		return
	}
	ctx.JSON(http.StatusOK, role)
}

func (c *RoleController) DeleteRole(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de rol inválido"})
		return
	}

	err = c.service.Delete(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "rol no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo eliminar rol"})
		}
		return
	}
	ctx.Status(http.StatusNoContent)
}
