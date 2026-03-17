package services

import (
	"backend/models"
	"backend/repositories"
)

type RoleService interface {
	FindAll() ([]models.Role, error)
	FindByID(id uint) (models.Role, error)
	Create(input models.RoleInput) (models.Role, error)
	Update(id uint, input models.RoleInput) (models.Role, error)
	Delete(id uint) error
}

type roleService struct {
	repository           repositories.RoleRepository
	permissionRepository repositories.PermissionRepository
}

func NewRoleService(repository repositories.RoleRepository, permissionRepository repositories.PermissionRepository) RoleService {
	return &roleService{
		repository:           repository,
		permissionRepository: permissionRepository,
	}
}

func (s *roleService) FindAll() ([]models.Role, error) {
	return s.repository.FindAll()
}

func (s *roleService) FindByID(id uint) (models.Role, error) {
	return s.repository.FindByID(id)
}

func (s *roleService) Create(input models.RoleInput) (models.Role, error) {
	permissions, err := s.resolvePermissions(input.PermissionIDs)
	if err != nil {
		return models.Role{}, err
	}

	role := models.Role{
		Name:        input.Name,
		Description: input.Description,
		Permissions: permissions,
	}

	return s.repository.Save(role)
}

func (s *roleService) Update(id uint, input models.RoleInput) (models.Role, error) {
	role, err := s.repository.FindByID(id)
	if err != nil {
		return role, err
	}

	permissions, err := s.resolvePermissions(input.PermissionIDs)
	if err != nil {
		return role, err
	}

	role.Name = input.Name
	role.Description = input.Description
	role.Permissions = permissions

	return s.repository.Update(role)
}

func (s *roleService) Delete(id uint) error {
	return s.repository.Delete(id)
}

func (s *roleService) resolvePermissions(ids []uint) ([]models.Permission, error) {
	uniqueIDs := uniqueUintIDs(ids)
	if len(uniqueIDs) == 0 {
		return []models.Permission{}, nil
	}

	permissions, err := s.permissionRepository.FindByIDs(uniqueIDs)
	if err != nil {
		return nil, err
	}

	if len(permissions) != len(uniqueIDs) {
		return nil, ErrPermissionNotFound
	}

	return permissions, nil
}
