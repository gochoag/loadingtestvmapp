package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type PermissionRepository interface {
	FindAll() ([]models.Permission, error)
	FindByID(id uint) (models.Permission, error)
	FindByIDs(ids []uint) ([]models.Permission, error)
	Save(permission models.Permission) (models.Permission, error)
	Update(permission models.Permission) (models.Permission, error)
	Delete(id uint) error
}

type permissionRepository struct {
	db *gorm.DB
}

func NewPermissionRepository(db *gorm.DB) PermissionRepository {
	return &permissionRepository{db: db}
}

func (r *permissionRepository) FindAll() ([]models.Permission, error) {
	var permissions []models.Permission
	err := r.db.Order("id desc").Find(&permissions).Error
	return permissions, err
}

func (r *permissionRepository) FindByID(id uint) (models.Permission, error) {
	var permission models.Permission
	err := r.db.First(&permission, id).Error
	return permission, err
}

func (r *permissionRepository) FindByIDs(ids []uint) ([]models.Permission, error) {
	if len(ids) == 0 {
		return []models.Permission{}, nil
	}

	var permissions []models.Permission
	err := r.db.Where("id IN ?", ids).Find(&permissions).Error
	return permissions, err
}

func (r *permissionRepository) Save(permission models.Permission) (models.Permission, error) {
	err := r.db.Create(&permission).Error
	return permission, err
}

func (r *permissionRepository) Update(permission models.Permission) (models.Permission, error) {
	err := r.db.Save(&permission).Error
	return permission, err
}

func (r *permissionRepository) Delete(id uint) error {
	result := r.db.Delete(&models.Permission{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
