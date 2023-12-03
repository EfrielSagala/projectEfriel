package auth

import (
	"net/http"
	"simpel-app-auth/models"
	"time"

	jwt "github.com/golang-jwt/jwt/v4"

	"github.com/gin-gonic/gin"
)

const (
	USER     = "efriel"
	PASSWORD = "sagala"
	SECRET   = "dokumen-negara"
)

func LoginHandler(c *gin.Context) {
	var user models.Credential

	err := c.Bind(&user)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "bad request",
			"error":   err.Error(),
		})
		return
	}

	if user.Username != USER {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "User Invalid",
		})
		return
	} else {
		if user.Password != PASSWORD {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": " wrong password ",
			})
			return
		}
	}

	//token
	claim := jwt.StandardClaims{
		ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
		Issuer:    "test",
		IssuedAt:  time.Now().Unix(),
	}

	sign := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	token, err := sign.SignedString([]byte(SECRET))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		c.Abort()
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "successfully",
		"token":   token,
	})

}
