package models

import "time"

type Permission struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"size:80;not null;uniqueIndex"`
	Description string `json:"description" gorm:"size:255"`
}

type PermissionInput struct {
	Name        string `json:"name" binding:"required,max=80"`
	Description string `json:"description" binding:"max=255"`
}

type Role struct {
	ID          uint         `json:"id" gorm:"primaryKey"`
	Name        string       `json:"name" gorm:"size:80;not null;uniqueIndex"`
	Description string       `json:"description" gorm:"size:255"`
	Permissions []Permission `json:"permissions" gorm:"many2many:role_permissions;"`
}

type RoleInput struct {
	Name          string `json:"name" binding:"required,max=80"`
	Description   string `json:"description" binding:"max=255"`
	PermissionIDs []uint `json:"permissionIds"`
}

type User struct {
	ID           uint   `json:"id" gorm:"primaryKey"`
	Name         string `json:"name" gorm:"size:120;not null"`
	Email        string `json:"email" gorm:"size:160;not null;uniqueIndex"`
	PasswordHash string `json:"-" gorm:"column:password_hash;size:255"`
	RoleID       uint   `json:"roleId" gorm:"not null;index"`
	Role         Role   `json:"role" gorm:"constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}

type CreateUserInput struct {
	Name     string `json:"name" binding:"required,max=120"`
	Email    string `json:"email" binding:"required,email,max=160"`
	Password string `json:"password" binding:"required,min=8,max=72"`
	RoleID   uint   `json:"roleId" binding:"required"`
}

type UpdateUserInput struct {
	Name     string `json:"name" binding:"required,max=120"`
	Email    string `json:"email" binding:"required,email,max=160"`
	Password string `json:"password" binding:"omitempty,min=8,max=72"`
	RoleID   uint   `json:"roleId" binding:"required"`
}

type LoginInput struct {
	Email    string `json:"email" binding:"required,email,max=160"`
	Password string `json:"password" binding:"required,min=8,max=72"`
}

type AuthResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	User      User      `json:"user"`
}
