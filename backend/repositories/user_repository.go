package repositories

import (
	"backend/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	FindAll() ([]models.User, error)
	FindByID(id uint) (models.User, error)
	FindByEmail(email string) (models.User, error)
	CountWithPassword() (int64, error)
	Save(user models.User) (models.User, error)
	Update(user models.User) (models.User, error)
	Delete(id uint) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) FindAll() ([]models.User, error) {
	var users []models.User
	err := r.db.Preload("Role").Preload("Role.Permissions").Order("id desc").Find(&users).Error
	return users, err
}

func (r *userRepository) FindByID(id uint) (models.User, error) {
	var user models.User
	err := r.db.Preload("Role").Preload("Role.Permissions").First(&user, id).Error
	return user, err
}

func (r *userRepository) FindByEmail(email string) (models.User, error) {
	var user models.User
	err := r.db.
		Preload("Role").
		Preload("Role.Permissions").
		Where("LOWER(email) = LOWER(?)", email).
		First(&user).Error
	return user, err
}

func (r *userRepository) CountWithPassword() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).
		Where("COALESCE(password_hash, '') <> ''").
		Count(&count).Error
	return count, err
}

func (r *userRepository) Save(user models.User) (models.User, error) {
	err := r.db.Create(&user).Error
	if err != nil {
		return user, err
	}
	return r.FindByID(user.ID)
}

func (r *userRepository) Update(user models.User) (models.User, error) {
	err := r.db.Model(&models.User{}).
		Where("id = ?", user.ID).
		Updates(map[string]any{
			"name":          user.Name,
			"email":         user.Email,
			"password_hash": user.PasswordHash,
			"role_id":       user.RoleID,
		}).Error
	if err != nil {
		return user, err
	}
	return r.FindByID(user.ID)
}

func (r *userRepository) Delete(id uint) error {
	result := r.db.Delete(&models.User{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
