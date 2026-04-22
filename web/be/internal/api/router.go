package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func NewRouter() *chi.Mux {
	r := chi.NewRouter()

	fileServer := http.FileServer(http.Dir("./data/img"))
	r.Handle("/img/*", http.StripPrefix("/img/", fileServer))
	r.Get("/last-modified", getLastModifiedDate)
	r.Get("/stats", getStats)

	r.Post("/results", getAllResults)
	r.Get("/results/count", getResultsCount)
	r.Get("/filter-options", getFilterOptions)
	r.Get("/results/{afid}", getCompStructDetail)

	return r
}

