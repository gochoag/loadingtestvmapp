package controllers

import (
	"backend/models"
	"backend/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ProductController struct {
	service services.ProductService
}

func NewProductController(service services.ProductService) *ProductController {
	return &ProductController{service: service}
}

func (c *ProductController) Health(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
}

func (c *ProductController) GetProducts(ctx *gin.Context) {
	products, err := c.service.FindAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudieron obtener productos"})
		return
	}
	ctx.JSON(http.StatusOK, products)
}

func (c *ProductController) GetProduct(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	product, err := c.service.FindByID(uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo obtener el producto"})
		}
		return
	}
	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) CreateProduct(ctx *gin.Context) {
	var input models.ProductInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	product, err := c.service.Create(input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear producto"})
		return
	}
	ctx.JSON(http.StatusCreated, product)
}

func (c *ProductController) UpdateProduct(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	var input models.ProductInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
		return
	}

	product, err := c.service.Update(uint(id), input)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo actualizar producto"})
		}
		return
	}
	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) DeleteProduct(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID de producto inválido"})
		return
	}

	err = c.service.Delete(uint(id))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
		} else {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo eliminar producto"})
		}
		return
	}
	ctx.Status(http.StatusNoContent)
}
