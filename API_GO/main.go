package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"simpel-app-auth/auth"
	"simpel-app-auth/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

type GormBook struct {
	Book_id      uint64 `json:"book_id" gorm:"AUTO_INCREMENT"`
	Book_title   string `json:"book_title" binding:"required"`
	Book_author  string `json:"book_author" binding:"required"`
	Book_release string `json:"book_release" binding:"required"`
}

func postHandler(ctx *gin.Context, db *gorm.DB) {
	var data GormBook

	if ctx.Bind(&data) == nil {
		db.Create(&data)
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"massage": "succes created",
			"data":    data,
		})
		return
	}
	ctx.JSON(http.StatusBadRequest, gin.H{
		"massage": "error",
	})

}

func getHandler(ctx *gin.Context, db *gorm.DB) {

	var data GormBook

	BookId := ctx.Param("book_id")

	if db.Find(&data, "book_id=?", BookId).RecordNotFound() {
		ctx.JSON(http.StatusNotFound, gin.H{
			"massage": "data dicuri heker",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data, //karena variabel data ini telah memiliki nilai baru setelah di prosen oleh find()
	})

}

func getAllHandler(ctx *gin.Context, db *gorm.DB) {

	var data []GormBook

	db.Find(&data) //untuk mencari /men get semua data yang ada di tabel di database
	ctx.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"data":   data,
	})

}

func putHandler(c *gin.Context, db *gorm.DB) {

	var data GormBook

	bookId := c.Param("book_id")

	if db.Find(&data, "book_id=?", bookId).RecordNotFound() {
		c.JSON(http.StatusNotFound, gin.H{
			"massage": "tidak ada data dengan id :" + bookId,
		})
		return
	}

	reqBook := data

	if c.Bind(&reqBook) == nil { //jika nill artinya proses biding berhasil
		db.Model(&data).Where("book_id=?", bookId).Update(reqBook)
		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"data":    data,
			"massage": "data berhasil di update",
		})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{
		"massage": "error gagal binding",
	})

}

func delHandler(c *gin.Context, db *gorm.DB) {

	var data GormBook
	bookId := c.Param("book_id")

	db.Delete(&data, "book_id=?", bookId)
	c.JSON(http.StatusOK, gin.H{
		"massage": "delete sucess",
	})
}

func setupRouter() *gin.Engine {
	errEnv := godotenv.Load(".env")

	if errEnv != nil {
		log.Fatal("Error load env")

	}
	conn := os.Getenv("POSTGRES_URL")
	db, err := gorm.Open("postgres", conn)

	if err != nil {
		log.Fatal(err)

	}
	Migrate(db)

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Ganti sesuai dengan alamat React aplikasi Anda
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}
	config.AllowHeaders = []string{"Authorization", "Content-Type"}
	r.Use(cors.New(config))
	r.GET("/", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"message": "succes",
		})
	})

	r.POST("/login", auth.LoginHandler)

	v1 := r.Group("v1")

	v1.POST("/book", middleware.AuthValidate, func(ctx *gin.Context) {
		postHandler(ctx, db)
	})

	v1.GET("/book", middleware.AuthValidate, func(ctx *gin.Context) {
		getAllHandler(ctx, db)
	})

	v1.GET("/book/:book_id", middleware.AuthValidate, func(ctx *gin.Context) {
		getHandler(ctx, db)
	})

	v1.PUT("/book/:book_id", middleware.AuthValidate, func(ctx *gin.Context) {
		putHandler(ctx, db)
	})
	v1.DELETE("/book/:book_id", middleware.AuthValidate, func(ctx *gin.Context) {
		delHandler(ctx, db)
	})

	return r
}

func main() {
	r := setupRouter()

	r.Run(":8080")

}

func Migrate(DB *gorm.DB) {
	DB.AutoMigrate(&GormBook{})

	data := GormBook{}
	if DB.Find(&data).RecordNotFound() {
		fmt.Println("=============run seeder user ==================")
		seederUser(DB)
	}

}

func seederUser(DB *gorm.DB) {
	data := GormBook{

		Book_title:   "Karma Ga ikut Kerkom",
		Book_author:  "Efriel",
		Book_release: "24 november 2024",
	}

	DB.Create(&data)

}
