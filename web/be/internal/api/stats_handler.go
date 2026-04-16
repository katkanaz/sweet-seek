package api

import (
	"encoding/json"
	"net/http"
	"sweetseek-be/internal/statistics"
	. "sweetseek-be/internal/types"
)

func getStats(w http.ResponseWriter, r *http.Request) {

	preprocFile, _, err := getNewest("data/workflow_runs/statistics", "_preproc.json")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	preProcessedData := statistics.LoadPreProcessedDataStats(preprocFile)

	surroundingsFile, _, err := getNewest("data/workflow_runs/statistics", "_surroundings.json")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	surroundingsData := statistics.LoadSurroundingsStats(surroundingsFile)

	resFile, _, err := getNewest("data/workflow_runs/statistics", "_results.json")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	resData := statistics.LoadResultsStats(resFile)

	stats := StatsResponse{
		Preproc: preProcessedData,
		Surroundings: surroundingsData,
		Results: resData,
	}


	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(stats); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
