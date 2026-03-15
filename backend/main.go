package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Product struct {
	ID          uint    `json:"id" gorm:"primaryKey"`
	Name        string  `json:"name" gorm:"size:120;not null"`
	Description string  `json:"description" gorm:"size:500"`
	Price       float64 `json:"price" gorm:"not null"`
	Stock       int     `json:"stock" gorm:"not null"`
}

type ProductInput struct {
	Name        string  `json:"name" binding:"required,max=120"`
	Description string  `json:"description" binding:"max=500"`
	Price       float64 `json:"price" binding:"required,gte=0"`
	Stock       int     `json:"stock" binding:"required,gte=0"`
}

func main() {
	loadEnvironment()
	db := setupDatabase()

	if err := db.AutoMigrate(&Product{}); err != nil {
		log.Fatalf("error en migración: %v", err)
	}

	router := gin.Default()

	allowedOrigin := getEnv("ALLOWED_ORIGIN", "http://localhost:5173")
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowedOrigin},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.GET("/health", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
		})

		api.GET("/products", func(ctx *gin.Context) {
			var products []Product
			if err := db.Order("id desc").Find(&products).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudieron obtener productos"})
				return
			}
			ctx.JSON(http.StatusOK, products)
		})

		api.GET("/products/:id", func(ctx *gin.Context) {
			var product Product
			if err := db.First(&product, ctx.Param("id")).Error; err != nil {
				ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
				return
			}
			ctx.JSON(http.StatusOK, product)
		})

		api.POST("/products", func(ctx *gin.Context) {
			var input ProductInput
			if err := ctx.ShouldBindJSON(&input); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
				return
			}

			product := Product{
				Name:        input.Name,
				Description: input.Description,
				Price:       input.Price,
				Stock:       input.Stock,
			}

			if err := db.Create(&product).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo crear producto"})
				return
			}
			ctx.JSON(http.StatusCreated, product)
		})

		api.PUT("/products/:id", func(ctx *gin.Context) {
			var product Product
			if err := db.First(&product, ctx.Param("id")).Error; err != nil {
				ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
				return
			}

			var input ProductInput
			if err := ctx.ShouldBindJSON(&input); err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "datos inválidos"})
				return
			}

			product.Name = input.Name
			product.Description = input.Description
			product.Price = input.Price
			product.Stock = input.Stock

			if err := db.Save(&product).Error; err != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo actualizar producto"})
				return
			}
			ctx.JSON(http.StatusOK, product)
		})

		api.DELETE("/products/:id", func(ctx *gin.Context) {
			result := db.Delete(&Product{}, ctx.Param("id"))
			if result.Error != nil {
				ctx.JSON(http.StatusInternalServerError, gin.H{"error": "no se pudo eliminar producto"})
				return
			}
			if result.RowsAffected == 0 {
				ctx.JSON(http.StatusNotFound, gin.H{"error": "producto no encontrado"})
				return
			}
			ctx.Status(http.StatusNoContent)
		})
	}

	port := getEnv("SERVER_PORT", "8080")
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("error iniciando servidor: %v", err)
	}
}

func loadEnvironment() {
	appEnv := getEnv("APP_ENV", "development")
	_ = godotenv.Load(".env." + appEnv)
	_ = godotenv.Load()
}

func setupDatabase() *gorm.DB {
	host := getEnv("DB_HOST", "localhost")
	port := getEnv("DB_PORT", "5432")
	user := getEnv("DB_USER", "postgres")
	password := getEnv("DB_PASSWORD", "postgres")
	dbName := getEnv("DB_NAME", "products_db")
	sslMode := getEnv("DB_SSLMODE", "disable")

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		host, port, user, password, dbName, sslMode,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("error conectando a PostgreSQL: %v", err)
	}

	return db
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists && value != "" {
		return value
	}
	return fallback
}
