package services

import (
	"backend/models"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTService interface {
	GenerateToken(user models.User) (string, time.Time, error)
	ValidateToken(token string) (*TokenClaims, error)
}

type TokenClaims struct {
	UserID uint   `json:"userId"`
	RoleID uint   `json:"roleId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

type jwtService struct {
	secret []byte
	issuer string
	ttl    time.Duration
}

func NewJWTService(secret, issuer string, ttl time.Duration) JWTService {
	if ttl <= 0 {
		ttl = 24 * time.Hour
	}

	if issuer == "" {
		issuer = "backend"
	}

	return &jwtService{
		secret: []byte(secret),
		issuer: issuer,
		ttl:    ttl,
	}
}

func (s *jwtService) GenerateToken(user models.User) (string, time.Time, error) {
	now := time.Now().UTC()
	expiresAt := now.Add(s.ttl)

	claims := TokenClaims{
		UserID: user.ID,
		RoleID: user.RoleID,
		Role:   user.Role.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.issuer,
			Subject:   strconv.FormatUint(uint64(user.ID), 10),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(s.secret)
	if err != nil {
		return "", time.Time{}, err
	}

	return signedToken, expiresAt, nil
}

func (s *jwtService) ValidateToken(tokenString string) (*TokenClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&TokenClaims{},
		func(token *jwt.Token) (any, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, ErrInvalidToken
			}
			return s.secret, nil
		},
		jwt.WithIssuer(s.issuer),
	)
	if err != nil {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
