package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type RoleRepository interface {
	FindAll() ([]models.Role, error)
	FindByID(id uint) (models.Role, error)
	FindByName(name string) (models.Role, error)
	Save(role models.Role) (models.Role, error)
	Update(role models.Role) (models.Role, error)
	Delete(id uint) error
}

type roleRepository struct {
	db *gorm.DB
}

func NewRoleRepository(db *gorm.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) FindAll() ([]models.Role, error) {
	var roles []models.Role
	err := r.db.Preload("Permissions").Order("id desc").Find(&roles).Error
	return roles, err
}

func (r *roleRepository) FindByID(id uint) (models.Role, error) {
	var role models.Role
	err := r.db.Preload("Permissions").First(&role, id).Error
	return role, err
}

func (r *roleRepository) FindByName(name string) (models.Role, error) {
	var role models.Role
	err := r.db.Preload("Permissions").Where("LOWER(name) = LOWER(?)", name).First(&role).Error
	return role, err
}

func (r *roleRepository) Save(role models.Role) (models.Role, error) {
	err := r.db.Create(&role).Error
	if err != nil {
		return role, err
	}
	return r.FindByID(role.ID)
}

func (r *roleRepository) Update(role models.Role) (models.Role, error) {
	err := r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Model(&models.Role{}).
			Where("id = ?", role.ID).
			Updates(map[string]any{
				"name":        role.Name,
				"description": role.Description,
			}).Error; err != nil {
			return err
		}

		currentRole := models.Role{ID: role.ID}
		return tx.Model(&currentRole).Association("Permissions").Replace(role.Permissions)
	})
	if err != nil {
		return role, err
	}
	return r.FindByID(role.ID)
}

func (r *roleRepository) Delete(id uint) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var role models.Role
		if err := tx.First(&role, id).Error; err != nil {
			return err
		}

		if err := tx.Model(&role).Association("Permissions").Clear(); err != nil {
			return err
		}

		return tx.Delete(&role).Error
	})
}
