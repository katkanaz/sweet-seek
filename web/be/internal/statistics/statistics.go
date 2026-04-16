package statistics

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
	. "sweetseek-be/internal/types"
)

const (
	statsDir = "./data/workflow_runs/statistics"
)

func LoadPreProcessedDataStats(filePath string) PreProcessedDataStats {
	var stats PreProcessedDataStats

	data, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer data.Close()

	if err := json.NewDecoder(data).Decode(&stats); err != nil {
		panic(err)
	}
	return stats
}

func LoadSurroundingsStats(filePath string) SurroundingsDataStats {
	var stats SurroundingsDataStats

	data, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer data.Close()

	if err := json.NewDecoder(data).Decode(&stats); err != nil {
		panic(err)
	}
	return stats
}

func LoadResultsStats(filePath string) ResultsStats {
	var stats ResultsStats

	data, err := os.Open(filePath)
	if err != nil {
		panic(err)
	}
	defer data.Close()

	if err := json.NewDecoder(data).Decode(&stats); err != nil {
		panic(err)
	}
	return stats
}

func ComputeResultsStatistics(data []ComputedStructure) ResultsStats {
	stats := ResultsStats{
		NumResults: len(data),
		MotifMatchesPerSugar: make(map[string]int),
		MotifMatchesPerProtein: make(map[int]int),
		PlddtRangePerSugar: make(map[string]PlddtRange),
		PlddtPerProtein: make([]float32, 0, len(data)),
	}

	for _, s := range data {
		motifsPerProtein := len(s.AcceptedMotifs)
		stats.MotifMatchesPerProtein[motifsPerProtein] += 1

		stats.NumMotifMatches += motifsPerProtein

		stats.PlddtPerProtein = append(stats.PlddtPerProtein, s.Plddt)

		for _, motif := range s.AcceptedMotifs {
			stats.MotifMatchesPerSugar[motif.Sugar] += 1

			if _, exists := stats.PlddtRangePerSugar[motif.Sugar]; !exists {
				stats.PlddtRangePerSugar[motif.Sugar] = PlddtRange{
					Min: float32(math.Inf(+1)),
					Max: float32(math.Inf(-1)),
				}
			}

			if stats.PlddtRangePerSugar[motif.Sugar].Max < s.Plddt {
				p := stats.PlddtRangePerSugar[motif.Sugar]
				p.Max = s.Plddt
				stats.PlddtRangePerSugar[motif.Sugar] = p
			}
			if stats.PlddtRangePerSugar[motif.Sugar].Min > s.Plddt {
				p := stats.PlddtRangePerSugar[motif.Sugar]
				p.Min = s.Plddt
				stats.PlddtRangePerSugar[motif.Sugar] = p
			}
		}
	}

	return stats
}

func GenerateResultsStatistics(data []ComputedStructure, date string) error {
	stats := ComputeResultsStatistics(data)

	statsJson, err := json.MarshalIndent(stats, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(fmt.Sprintf("%s/%s_results.json", statsDir, date), statsJson, 0644)

}
