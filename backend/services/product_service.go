package services

import (
	"backend/models"
	"backend/repositories"
)

type ProductService interface {
	FindAll() ([]models.Product, error)
	FindByID(id uint) (models.Product, error)
	Create(input models.ProductInput) (models.Product, error)
	Update(id uint, input models.ProductInput) (models.Product, error)
	Delete(id uint) error
}

type productService struct {
	repository repositories.ProductRepository
}

func NewProductService(repository repositories.ProductRepository) ProductService {
	return &productService{repository: repository}
}

func (s *productService) FindAll() ([]models.Product, error) {
	return s.repository.FindAll()
}

func (s *productService) FindByID(id uint) (models.Product, error) {
	return s.repository.FindByID(id)
}

func (s *productService) Create(input models.ProductInput) (models.Product, error) {
	product := models.Product{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
	}
	return s.repository.Save(product)
}

func (s *productService) Update(id uint, input models.ProductInput) (models.Product, error) {
	product, err := s.repository.FindByID(id)
	if err != nil {
		return product, err
	}

	product.Name = input.Name
	product.Description = input.Description
	product.Price = input.Price
	product.Stock = input.Stock

	return s.repository.Update(product)
}

func (s *productService) Delete(id uint) error {
	return s.repository.Delete(id)
}
