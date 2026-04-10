package main

import (
	"log/slog"
	"net/http"
	"os"
	"sweetseek-be/internal/api"

	"github.com/joho/godotenv"
)


func main() {
	err := godotenv.Load()
	if err != nil {
		msg := "Failed to load .env file"
		slog.Error(msg)
		panic(msg)
	}

	if os.Getenv("LOG_LEVEL") == "debug" {
		slog.SetLogLoggerLevel(slog.LevelDebug)
	}

	err = api.EnsureGeneratedData()
	if err != nil {
		slog.Error(err.Error())
		panic(err.Error())
	}
	r := api.NewRouter()

	port := "8081"
	if os.Getenv("PORT") != "" {
		port = os.Getenv("PORT")
	}

	slog.Info("Starting server")
	http.ListenAndServe(":" + port, r)
}
