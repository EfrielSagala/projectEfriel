package middleware

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

const (
	SECRET = "dokumen-negara"
)

func AuthValidate(c *gin.Context) {
	tokenString := c.Request.Header.Get("Authorization")

	if tokenString == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "masukan token woi"})
		c.Abort()
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, valid := token.Method.(*jwt.SigningMethodHMAC); !valid {
			return nil, fmt.Errorf("Invalid token %v", token.Header["alg"])
		}
		return []byte(SECRET), nil
	})

	if token != nil && err == nil {
		fmt.Println("token benarrrrrr")
		c.Next()
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "token udah basi", "error": err.Error()})
		c.Abort()
	}
}
