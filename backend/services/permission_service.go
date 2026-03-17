package services

import (
	"backend/models"
	"backend/repositories"
)

type PermissionService interface {
	FindAll() ([]models.Permission, error)
	FindByID(id uint) (models.Permission, error)
	Create(input models.PermissionInput) (models.Permission, error)
	Update(id uint, input models.PermissionInput) (models.Permission, error)
	Delete(id uint) error
}

type permissionService struct {
	repository repositories.PermissionRepository
}

func NewPermissionService(repository repositories.PermissionRepository) PermissionService {
	return &permissionService{repository: repository}
}

func (s *permissionService) FindAll() ([]models.Permission, error) {
	return s.repository.FindAll()
}

func (s *permissionService) FindByID(id uint) (models.Permission, error) {
	return s.repository.FindByID(id)
}

func (s *permissionService) Create(input models.PermissionInput) (models.Permission, error) {
	permission := models.Permission{
		Name:        input.Name,
		Description: input.Description,
	}
	return s.repository.Save(permission)
}

func (s *permissionService) Update(id uint, input models.PermissionInput) (models.Permission, error) {
	permission, err := s.repository.FindByID(id)
	if err != nil {
		return permission, err
	}

	permission.Name = input.Name
	permission.Description = input.Description

	return s.repository.Update(permission)
}

func (s *permissionService) Delete(id uint) error {
	return s.repository.Delete(id)
}
