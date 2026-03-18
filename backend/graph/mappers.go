package graph

import (
	"backend/graph/model"
	"backend/models"
	"strings"
)

func mapLoginInput(input model.LoginCredentialsInput) models.LoginInput {
	return models.LoginInput{
		Email:    strings.TrimSpace(input.Email),
		Password: input.Password,
	}
}

func mapProductInput(input model.ProductMutationInput) models.ProductInput {
	return models.ProductInput{
		Name:        strings.TrimSpace(input.Name),
		Description: strings.TrimSpace(input.Description),
		Price:       input.Price,
		Stock:       input.Stock,
	}
}

func mapPermissionInput(input model.PermissionMutationInput) models.PermissionInput {
	return models.PermissionInput{
		Name:        strings.TrimSpace(input.Name),
		Description: strings.TrimSpace(input.Description),
	}
}

func mapRoleInput(input model.RoleMutationInput) models.RoleInput {
	return models.RoleInput{
		Name:          strings.TrimSpace(input.Name),
		Description:   strings.TrimSpace(input.Description),
		PermissionIDs: input.PermissionIds,
	}
}

func mapCreateUserInput(input model.UserCreateInput) models.CreateUserInput {
	return models.CreateUserInput{
		Name:     strings.TrimSpace(input.Name),
		Email:    strings.TrimSpace(input.Email),
		Password: input.Password,
		RoleID:   input.RoleID,
	}
}

func mapUpdateUserInput(input model.UserUpdateInput) models.UpdateUserInput {
	password := ""
	if input.Password != nil {
		password = *input.Password
	}

	return models.UpdateUserInput{
		Name:     strings.TrimSpace(input.Name),
		Email:    strings.TrimSpace(input.Email),
		Password: password,
		RoleID:   input.RoleID,
	}
}
