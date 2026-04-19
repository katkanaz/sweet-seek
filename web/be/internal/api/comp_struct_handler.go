package api

import (
	"cmp"
	"encoding/json"
	"fmt"
	"log/slog"
	"math"
	"net/http"
	"os"
	"path/filepath"
	"slices"
	"strings"
	"sweetseek-be/internal/functools"
	preview "sweetseek-be/internal/preview_image"
	"sweetseek-be/internal/set"
	"sweetseek-be/internal/statistics"
	. "sweetseek-be/internal/types"
	"sync"
	"time"
)


type resultsFilter struct {
	Sugar        []string
	Plddt        []float32
	Organism     []string
	PdbStructure *string
	Title		 *string
}

type computedStructureCache struct {
	data []ComputedStructure
	lock sync.RWMutex
	dateTime *time.Time
}

func (c *computedStructureCache) read() (*time.Time, []ComputedStructure) {
	c.lock.RLock()
	defer c.lock.RUnlock()

	return c.dateTime, c.data
}

func (c *computedStructureCache) write(dateTime *time.Time, data []ComputedStructure)  {
	c.lock.Lock()
	defer c.lock.Unlock()

	c.dateTime = dateTime
	c.data = data
}

var compStructCache computedStructureCache

func getNewest(dir string, sufix string) (string, *time.Time, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return "", nil, err
	}

	var newestTime time.Time
	var newestFile string
	layout := "2006-01-02T15-04-05"

	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}

		name := entry.Name()

		if !strings.HasSuffix(name, sufix) {
			continue
		}

		datetimePart := strings.TrimSuffix(name, sufix)

		t, err := time.Parse(layout, datetimePart)
		if err != nil {
			continue
		}

		if t.After(newestTime) {
			newestTime = t
			newestFile = filepath.Join(dir, name)
		}
	}

	if newestFile == "" {
		return "", nil, fmt.Errorf("No matching files found")
	}

	return newestFile, &newestTime, nil
}


func getDateTime(dir_path string, file_sufix string) (string, string) {
	file, _, err := getNewest(dir_path, file_sufix)
	if err != nil {
		panic (err)
	}

	fileName := filepath.Base(file)
	datetimePart := strings.TrimSuffix(fileName, file_sufix)
	layout := "2006-01-02T15-04-05"

	t, err := time.Parse(layout, datetimePart)
	if err != nil {
		panic(err)
	}

	dateOnly := t.Format("2006-01-02")
	timeOnly := t.Format("15-04-05")
	return dateOnly, timeOnly
}


func getLastModifiedDate(w http.ResponseWriter, r *http.Request) {
	dateOnly, _ := getDateTime("data/workflow_runs/", "_merged.json")
	lastUpdated := LastUpdated{
		Date: dateOnly,
	}

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(lastUpdated); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


func isFilterEmpty(filter *resultsFilter) bool {
	return len(filter.Sugar) == 0 && len(filter.Plddt) == 0 && len(filter.Organism) == 0 && filter.PdbStructure == nil && filter.Title == nil
}


func constructFilter(searchParams *ResultsSearchParams) resultsFilter {
	filterOptions := loadFilterOptions()

	filteredSugars := make([]string, 0, len(filterOptions.Sugars))
	filteredOrganism := make([]string, 0, len(filterOptions.Organisms))
	var filteredPdbStructure *string

	for _, sugar := range filterOptions.Sugars {
		if slices.Contains(searchParams.Sugar, sugar.Id) {
			filteredSugars = append(filteredSugars, sugar.Value)
		}
	}

	for _, organism := range filterOptions.Organisms {
		if slices.Contains(searchParams.Organism, organism.Id) {
			filteredOrganism = append(filteredOrganism, organism.Value)
		}
	}

	if searchParams.PdbStructure != nil {
		idx := slices.IndexFunc(filterOptions.PdbStructures, func(o OptionItem) bool {return o.Id == *searchParams.PdbStructure})
		if idx == -1 {
			slog.Warn("Invalid PDB structure filter ID", "PdbStructure", *searchParams.PdbStructure)
		} else {
			pdb := filterOptions.PdbStructures[idx].Value
			filteredPdbStructure = &pdb
		}
	}
	
	filter := resultsFilter{
		Sugar: filteredSugars,
		Plddt: searchParams.Plddt,
		Title: searchParams.Title,
		Organism: filteredOrganism,
		PdbStructure: filteredPdbStructure,
	}
	
	return filter
}

func findBestMotifMatch(motifs []Motif) *Match {
	if len(motifs) == 0 {
		return nil
	}

	match := Match{ Rmsd: float32(math.Inf(+1)) }
	for _, m := range motifs {
		if m.Score < match.Rmsd {
			match.Rmsd = m.Score
			match.Sugar = m.Sugar
		}
	}
	return &match
}

func processRawComputedStructs(rawStructs []RawComputedStructure) []ComputedStructure {
	compStructs := make([]ComputedStructure, 0, len(rawStructs))

	for _, s := range rawStructs {
		newStruct := ComputedStructure{
			PdbId: s.PdbId,
			AfdbId: s.AfdbId,
			Title: s.Title,
			Organism: s.Organism,
			Plddt: s.Plddt,
			AfVersion: s.AfVersion,
			AfRevision: s.AfRevision,
			BestMatch: findBestMotifMatch(s.Motifs),
			AcceptedMotifs: s.Motifs,
			RejectedMotifs: nil,
		}
		compStructs = append(compStructs, newStruct)
	}

	return compStructs
}

func sortComputedStructures(computedStructures []ComputedStructure) []ComputedStructure {
	start := time.Now()
	slices.SortFunc(computedStructures, func(a, b ComputedStructure) int {
		return cmp.Compare(a.BestMatch.Rmsd, b.BestMatch.Rmsd)
	})
	slog.Debug("sort structures", "duration", time.Since(start))
	return computedStructures
}


func filterMotifs(motifs []Motif, filter *resultsFilter) ([]Motif, []Motif) {
	acceptedMotifs := make([]Motif, 0, len(motifs))
	rejectedMotifs := make([]Motif, 0, len(motifs))
	
	for _, motif := range motifs {
		if filter.PdbStructure != nil {
			if *filter.PdbStructure != motif.OriginalStructure {
				rejectedMotifs = append(rejectedMotifs, motif)
				continue
			}
		}
		if len(filter.Sugar) != 0 {
			if !slices.Contains(filter.Sugar, motif.Sugar) {
				rejectedMotifs = append(rejectedMotifs, motif)
				continue
			}
		}
		acceptedMotifs = append(acceptedMotifs, motif)
	}

	return acceptedMotifs, rejectedMotifs
}


func filterComputedStructures(computedStructures []ComputedStructure, filter *resultsFilter) []ComputedStructure {
	start := time.Now()
	if filter == nil || isFilterEmpty(filter) {
		return computedStructures
	}

	filteredComputedStrucutres := make([]ComputedStructure, 0, len(computedStructures))
	
	for _, computedStructure := range computedStructures {
		if len(filter.Plddt) != 0 {
			if computedStructure.Plddt < filter.Plddt[0] || computedStructure.Plddt > filter.Plddt[1] {
				continue
			}
		}
		if len(filter.Organism) != 0 {
			containsOrganism := false
			for _, organism := range computedStructure.Organism {
				if slices.Contains(filter.Organism, organism) {
					containsOrganism = true
					continue
				}
			}
			if !containsOrganism {
				continue
			}
		}
		if filter.Title != nil {
			if !strings.Contains(strings.ToLower(computedStructure.Title), strings.ToLower(*filter.Title)) {
				continue
			}
		}

		acceptedMotifs, rejectedMotifs := filterMotifs(computedStructure.AcceptedMotifs, filter)

		if len(acceptedMotifs) == 0 {
			continue
		}

		computedStructure.AcceptedMotifs = acceptedMotifs
		computedStructure.RejectedMotifs = rejectedMotifs
		
		computedStructure.BestMatch = findBestMotifMatch(acceptedMotifs)

		filteredComputedStrucutres = append(filteredComputedStrucutres, computedStructure)
	}

	end := time.Now()

	slog.Debug("filter duration", "duration", end.Sub(start))
	return filteredComputedStrucutres
}


func loadFromJson(file string, v any) {
	data, err := os.Open(file)
	if err != nil {
		panic(err)
	}
	defer data.Close()

	if err := json.NewDecoder(data).Decode(v); err != nil {
		panic(err)
	}
}

func paginateComputedStructures(computedStructures []ComputedStructure, pagination *PaginationInfo) []ComputedStructure {
	if pagination == nil {
		return computedStructures
	}


	startIdx := pagination.Count * (pagination.Page - 1)
	endIdx := min(startIdx + pagination.Count, len(computedStructures))

	return computedStructures[startIdx:endIdx]
}

func getComputedStructures(filter *resultsFilter, pagination *PaginationInfo) (int, []ComputedStructure) {
	start := time.Now()
	var computedStructures []ComputedStructure
	file, newestTime, err := getNewest("data/workflow_runs/", "_merged.json")
	if err != nil {
		panic (err)
	}

	dateTime, computedStructures := compStructCache.read()

	if dateTime == nil || !dateTime.Equal(*newestTime) {
		slog.Debug("Loading data from JSON")
		var rawStructs []RawComputedStructure
		loadFromJson(file, &rawStructs)
		computedStructures = processRawComputedStructs(rawStructs)
		compStructCache.write(newestTime, computedStructures)
	}

	end := time.Now()

	slog.Debug("data load duartion", "duration", end.Sub(start))

	filteredStructs := filterComputedStructures(computedStructures, filter)

	sortedCompStructs := sortComputedStructures(filteredStructs)

	return len(sortedCompStructs), paginateComputedStructures(sortedCompStructs, pagination)
}


func loadFilterOptions() FilterOptions {
	var filterOptions FilterOptions
	file, _, err := getNewest("data/workflow_runs/", "_options.json")
	if err != nil {
		panic (err)
	}

	loadFromJson(file, &filterOptions)
	
	return filterOptions
}


func getFilterOptions(w http.ResponseWriter, r *http.Request) {
	filterOptions := loadFilterOptions()

	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(filterOptions); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


func getPaginationInfo(searchParams *ResultsSearchParams) PaginationInfo {
	count := 10
	if searchParams.Count != nil {
		count = *searchParams.Count
	}
	return PaginationInfo{
		Page: searchParams.Page,
		Count: count,
	}
}


func getAllResults(w http.ResponseWriter, r *http.Request) {
	var requestBody ResultsSearchParams
	if err := json.NewDecoder(r.Body).Decode(&requestBody); err != nil {
		http.Error(w, "Invalid JSON in request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	slog.Debug("getAllResults", "search", requestBody)

	filter := constructFilter(&requestBody)

	slog.Debug("getAllResults", "filter", filter)

	pagination := getPaginationInfo(&requestBody)
	
	totalCount, results := getComputedStructures(&filter, &pagination)

	data := GetComputedStructuresResponse{
		TotalCount: totalCount,
		Data: results,
	}
	
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


func getCompStructDetail(w http.ResponseWriter, r *http.Request) {
	afid := r.PathValue("afid")
	_, results := getComputedStructures(nil, nil)
	index := slices.IndexFunc(results, func(c ComputedStructure) bool {
		return c.AfdbId == afid
	})
	if index == -1 {
		http.Error(w, "Invalid AlphaFold ID", http.StatusBadRequest)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(results[index]); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}


func extractOptions(data []ComputedStructure, outputPath string) error {
	if _, err := os.Stat(outputPath); err == nil {
		slog.Info("Filter options already exist", "path", outputPath)
		return nil
	}

	slog.Info("Extracting filter options")
	plddtRange := PlddtRange{
		Min: float32(math.Inf(+1)),
		Max: float32(math.Inf(-1)),
	}
	sugarSet := set.NewSet[string]()
	organismSet := set.NewSet[string]() 
	pdbStructSet := set.NewSet[string]()

	for _, structure := range data {
		for _, organism := range structure.Organism {
			organismSet.Add(organism)
		}
		if structure.Plddt < plddtRange.Min {
			plddtRange.Min = structure.Plddt
		}
		if structure.Plddt > plddtRange.Max {
			plddtRange.Max = structure.Plddt
		}
		for _, motif := range structure.AcceptedMotifs {
			sugarSet.Add(motif.Sugar)
			pdbStructSet.Add(motif.OriginalStructure)
		}
	}

	o := FilterOptions{
		PlddtRange: plddtRange,
		Sugars: functools.Map(sugarSet.ToList(), func(e string, i int) OptionItem {return OptionItem{Id: i, Value: e}}),
		Organisms: functools.Map(organismSet.ToList(), func(e string, i int) OptionItem {return OptionItem{Id: i, Value: e}}),
		PdbStructures: functools.Map(pdbStructSet.ToList(), func(e string, i int) OptionItem {return OptionItem{Id: i, Value: e}}),
	}

	options, err := json.MarshalIndent(o, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(outputPath, options, 0644)
}


func EnsureGeneratedData() error {
	dateOnly, timeOnly := getDateTime("data/workflow_runs/", "_merged.json")
	dateTime := fmt.Sprintf("%sT%s", dateOnly, timeOnly)
	optionsPath := fmt.Sprintf("data/workflow_runs/%s_options.json", dateTime)

	_, data := getComputedStructures(nil, nil)

	var err error

	err = extractOptions(data, optionsPath)
	if err != nil {
		return err
	}

	err = preview.GenerateImages(data)
	if err != nil {
		return err
	}

	err = statistics.GenerateResultsStatistics(data, dateTime)
	if err != nil {
		return err
	}

	return nil
}
