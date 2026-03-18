package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"backend/controllers"
	"backend/graph"
	"backend/graph/generated"
	"backend/middleware"
	"backend/models"
	"backend/repositories"
	"backend/services"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	loadEnvironment()
	db := setupDatabase()

	if err := db.AutoMigrate(
		&models.Product{},
		&models.Permission{},
		&models.Role{},
		&models.User{},
	); err != nil {
		log.Fatalf("error en migración: %v", err)
	}

	productRepository := repositories.NewProductRepository(db)
	productService := services.NewProductService(productRepository)
	productController := controllers.NewProductController(productService)
	permissionRepository := repositories.NewPermissionRepository(db)
	permissionService := services.NewPermissionService(permissionRepository)
	permissionController := controllers.NewPermissionController(permissionService)
	roleRepository := repositories.NewRoleRepository(db)
	roleService := services.NewRoleService(roleRepository, permissionRepository)
	roleController := controllers.NewRoleController(roleService)
	userRepository := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepository, roleRepository)
	ensureSeedUser(userService)
	jwtTTL := time.Duration(getEnvAsInt("JWT_TTL_MINUTES", 1440)) * time.Minute
	jwtService := services.NewJWTService(
		getEnv("JWT_SECRET", "change-this-secret-in-production"),
		getEnv("JWT_ISSUER", "loadingtestvmapp"),
		jwtTTL,
	)
	userController := controllers.NewUserController(userService, jwtService)
	graphQLServer := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: &graph.Resolver{
					JWTService:        jwtService,
					PermissionService: permissionService,
					ProductService:    productService,
					RoleService:       roleService,
					UserService:       userService,
				},
			},
		),
	)

	router := gin.Default()

	allowedOrigins := getAllowedOrigins()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.GET("/health", productController.Health)
		api.POST("/auth/login", userController.Login)
		api.GET("/playground", func(ctx *gin.Context) {
			playground.Handler("Loading Test GraphQL", "/api/graphql").ServeHTTP(ctx.Writer, ctx.Request)
		})
		api.POST("/graphql", func(ctx *gin.Context) {
			request, err := graph.AttachCurrentUserFromRequest(ctx.Request, jwtService, userService)
			if err != nil {
				ctx.AbortWithStatusJSON(401, gin.H{"error": "token inválido o expirado"})
				return
			}

			graphQLServer.ServeHTTP(ctx.Writer, request)
		})

		protected := api.Group("")
		protected.Use(middleware.AuthRequired(jwtService, userService))
		{
			protected.GET("/products", middleware.RequireAnyPermission("ADM_R_PRODUCTO", "VEN_R_PRODUCTO"), productController.GetProducts)
			protected.GET("/products/:id", middleware.RequireAnyPermission("ADM_R_PRODUCTO", "VEN_R_PRODUCTO"), productController.GetProduct)
			protected.POST("/products", middleware.RequireAnyPermission("ADM_C_PRODUCTO", "VEN_C_PRODUCTO"), productController.CreateProduct)
			protected.PUT("/products/:id", middleware.RequireAnyPermission("ADM_U_PRODUCTO", "VEN_U_PRODUCTO"), productController.UpdateProduct)
			protected.DELETE("/products/:id", middleware.RequireAnyPermission("ADM_D_PRODUCTO"), productController.DeleteProduct)
			protected.GET("/permissions", middleware.RequireAnyPermission("ADM_R_PERMISO"), permissionController.GetPermissions)
			protected.GET("/permissions/:id", middleware.RequireAnyPermission("ADM_R_PERMISO"), permissionController.GetPermission)
			protected.POST("/permissions", middleware.RequireAnyPermission("ADM_C_PERMISO"), permissionController.CreatePermission)
			protected.PUT("/permissions/:id", middleware.RequireAnyPermission("ADM_U_PERMISO"), permissionController.UpdatePermission)
			protected.DELETE("/permissions/:id", middleware.RequireAnyPermission("ADM_D_PERMISO"), permissionController.DeletePermission)
			protected.GET("/roles", middleware.RequireAnyPermission("ADM_R_ROL"), roleController.GetRoles)
			protected.GET("/roles/:id", middleware.RequireAnyPermission("ADM_R_ROL"), roleController.GetRole)
			protected.POST("/roles", middleware.RequireAnyPermission("ADM_C_ROL"), roleController.CreateRole)
			protected.PUT("/roles/:id", middleware.RequireAnyPermission("ADM_U_ROL"), roleController.UpdateRole)
			protected.DELETE("/roles/:id", middleware.RequireAnyPermission("ADM_D_ROL"), roleController.DeleteRole)
			protected.GET("/users", middleware.RequireAnyPermission("ADM_R_USUARIO"), userController.GetUsers)
			protected.GET("/users/:id", middleware.RequireAnyPermission("ADM_R_USUARIO"), userController.GetUser)
			protected.POST("/users", middleware.RequireAnyPermission("ADM_C_USUARIO"), userController.CreateUser)
			protected.PUT("/users/:id", middleware.RequireAnyPermission("ADM_U_USUARIO"), userController.UpdateUser)
			protected.DELETE("/users/:id", middleware.RequireAnyPermission("ADM_D_USUARIO"), userController.DeleteUser)
		}

		authOnly := api.Group("")
		authOnly.Use(middleware.AuthRequired(jwtService, userService))
		{
			authOnly.GET("/auth/me", userController.Me)
		}
	}

	port := getEnv("SERVER_PORT", "8080")
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("error iniciando servidor: %v", err)
	}
}

func loadEnvironment() {
	appEnv := getEnv("APP_ENV", "development")
	envFiles := []string{".env." + appEnv}

	switch strings.ToLower(appEnv) {
	case "development":
		envFiles = append(envFiles, ".env.dev")
	case "dev":
		envFiles = append(envFiles, ".env.development")
	}

	for _, envFile := range envFiles {
		_ = godotenv.Load(envFile)
	}
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

func getAllowedOrigins() []string {
	rawValue := getEnv("ALLOWED_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")
	parts := strings.Split(rawValue, ",")
	origins := make([]string, 0, len(parts))

	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin == "" {
			continue
		}

		origins = append(origins, origin)
	}

	if len(origins) == 0 {
		return []string{"http://localhost:5173", "http://127.0.0.1:5173"}
	}

	return origins
}

func getEnvAsInt(key string, fallback int) int {
	value := getEnv(key, "")
	if value == "" {
		return fallback
	}

	parsed, err := strconv.Atoi(value)
	if err != nil {
		return fallback
	}

	return parsed
}

func getEnvAsBool(key string, fallback bool) bool {
	value := strings.TrimSpace(strings.ToLower(getEnv(key, "")))
	switch value {
	case "1", "true", "yes", "on":
		return true
	case "0", "false", "no", "off":
		return false
	case "":
		return fallback
	default:
		return fallback
	}
}

func ensureSeedUser(userService services.UserService) {
	config := services.SeedUserConfig{
		Enabled:  getEnvAsBool("SEED_USER_ENABLED", false),
		Name:     getEnv("SEED_USER_NAME", ""),
		Email:    getEnv("SEED_USER_EMAIL", ""),
		Password: getEnv("SEED_USER_PASSWORD", ""),
		RoleName: getEnv("SEED_USER_ROLE", "Admin"),
	}

	if !config.Enabled {
		return
	}

	if err := userService.EnsureSeedUser(config); err != nil {
		log.Fatalf("error creando usuario semilla: %v", err)
	}
}
