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

type PermissionController struct {
	service services.PermissionService
}

func NewPermissionController(service services.PermissionService) *PermissionController {
	return &PermissionController{service: service}
}

func (c *PermissionController) GetPermissions(ctx *gin.Context) {
	permissions, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudieron obtener permisos"})
		return
	}
	ctx.JSON(http.StatusOK, permissions)
}

func (c *PermissionController) GetPermission(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de permiso inválido"})
		return
	}

	permission, err := c.service.FindByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "permiso no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo obtener el permiso"})
		}
		return
	}
	ctx.JSON(http.StatusOK, permission)
}

func (c *PermissionController) CreatePermission(ctx *gin.Context) {
	var input models.PermissionInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	permission, err := c.service.Create(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear permiso"})
		return
	}
	ctx.JSON(http.StatusCreated, permission)
}

func (c *PermissionController) UpdatePermission(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de permiso inválido"})
		return
	}

	var input models.PermissionInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	permission, err := c.service.Update(uint(id), input)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "permiso no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo actualizar permiso"})
		}
		return
	}
	ctx.JSON(http.StatusOK, permission)
}

func (c *PermissionController) DeletePermission(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de permiso inválido"})
		return
	}

	err = c.service.Delete(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "permiso no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo eliminar permiso"})
		}
		return
	}
	ctx.Status(http.StatusNoContent)
}
