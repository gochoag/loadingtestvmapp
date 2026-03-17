package services

import (
	"backend/models"
	"backend/repositories"
	"errors"
	"fmt"
	"strings"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type SeedUserConfig struct {
	Enabled  bool
	Name     string
	Email    string
	Password string
	RoleName string
}

type UserService interface {
	FindAll() ([]models.User, error)
	FindByID(id uint) (models.User, error)
	Create(input models.CreateUserInput) (models.User, error)
	Update(id uint, input models.UpdateUserInput) (models.User, error)
	Authenticate(input models.LoginInput) (models.User, error)
	HasConfiguredUsers() (bool, error)
	EnsureSeedUser(config SeedUserConfig) error
	Delete(id uint) error
}

type userService struct {
	repository     repositories.UserRepository
	roleRepository repositories.RoleRepository
}

func NewUserService(repository repositories.UserRepository, roleRepository repositories.RoleRepository) UserService {
	return &userService{
		repository:     repository,
		roleRepository: roleRepository,
	}
}

func (s *userService) FindAll() ([]models.User, error) {
	return s.repository.FindAll()
}

func (s *userService) FindByID(id uint) (models.User, error) {
	return s.repository.FindByID(id)
}

func (s *userService) Create(input models.CreateUserInput) (models.User, error) {
	role, err := s.roleRepository.FindByID(input.RoleID)
	if err != nil {
		return models.User{}, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{
		Name:         strings.TrimSpace(input.Name),
		Email:        normalizeEmail(input.Email),
		PasswordHash: string(passwordHash),
		RoleID:       role.ID,
	}

	return s.repository.Save(user)
}

func (s *userService) Update(id uint, input models.UpdateUserInput) (models.User, error) {
	user, err := s.repository.FindByID(id)
	if err != nil {
		return user, err
	}

	role, err := s.roleRepository.FindByID(input.RoleID)
	if err != nil {
		return user, err
	}

	user.Name = strings.TrimSpace(input.Name)
	user.Email = normalizeEmail(input.Email)
	user.RoleID = role.ID

	if strings.TrimSpace(input.Password) != "" {
		passwordHash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
		if err != nil {
			return user, err
		}
		user.PasswordHash = string(passwordHash)
	}

	return s.repository.Update(user)
}

func (s *userService) Authenticate(input models.LoginInput) (models.User, error) {
	user, err := s.repository.FindByEmail(normalizeEmail(input.Email))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return models.User{}, ErrInvalidCredentials
		}
		return models.User{}, err
	}

	if user.PasswordHash == "" {
		return models.User{}, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return models.User{}, ErrInvalidCredentials
	}

	return user, nil
}

func (s *userService) HasConfiguredUsers() (bool, error) {
	count, err := s.repository.CountWithPassword()
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (s *userService) EnsureSeedUser(config SeedUserConfig) error {
	if !config.Enabled {
		return nil
	}

	name := strings.TrimSpace(config.Name)
	email := normalizeEmail(config.Email)
	password := strings.TrimSpace(config.Password)
	roleName := strings.TrimSpace(config.RoleName)

	if name == "" || email == "" || password == "" || roleName == "" {
		return fmt.Errorf("configuración incompleta para usuario semilla")
	}

	_, err := s.repository.FindByEmail(email)
	switch {
	case err == nil:
		return nil
	case !errors.Is(err, gorm.ErrRecordNotFound):
		return err
	}

	role, err := s.roleRepository.FindByName(roleName)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("rol semilla no encontrado: %s", roleName)
		}
		return err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = s.repository.Save(models.User{
		Name:         name,
		Email:        email,
		PasswordHash: string(passwordHash),
		RoleID:       role.ID,
	})
	return err
}

func (s *userService) Delete(id uint) error {
	return s.repository.Delete(id)
}
