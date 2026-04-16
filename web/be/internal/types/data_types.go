package types

type OptionItem struct {
	Id int `json:"id"`
	Value string `json:"value"`
}

type PlddtRange struct {
	Min float32 `json:"min"`
	Max float32 `json:"max"`
}

type FilterOptions struct {
	Sugars []OptionItem `json:"sugars"`
	PlddtRange PlddtRange `json:"plddt_range"`
	Organisms []OptionItem `json:"organisms"`
	PdbStructures []OptionItem `json:"pdb_structures"`
}

type ResidueId struct {
	ResidueName string `json:"res_name"`
	ResidueId int `json:"res_id"`
	ChainId string `json:"chain_id"`
}

type Motif struct {
	Surrounding string `json:"surrounding"`
	Sugar string `json:"sugar"`
	OriginalStructure string `json:"original_struct"`
	SurroundingResidues []ResidueId `json:"surrounding_residues"`
	ResidueIds []ResidueId `json:"residue_ids"`
	Score float32 `json:"score"`
	Transformation []float32 `json:"transformation"`
}

type RawComputedStructure struct {
	PdbId string `json:"pdb_id"`
	AfdbId string `json:"afdb_id"`
	Title string `json:"title"`
	Organism []string `json:"organism"`
	Plddt float32 `json:"plddt"`
	AfVersion string `json:"af_version"`
	AfRevision int `json:"af_revision"`
	Motifs []Motif `json:"motifs"`
}

type Match struct {
	Sugar string `json:"sugar"`
	Rmsd float32 `json:"rmsd"`
}

type ComputedStructure struct {
	PdbId string `json:"pdb_id"`
	AfdbId string `json:"afdb_id"`
	Title string `json:"title"`
	Organism []string `json:"organism"`
	Plddt float32 `json:"plddt"`
	AfVersion string `json:"af_version"`
	AfRevision int `json:"af_revision"`
	BestMatch *Match `json:"best_match"`
	AcceptedMotifs []Motif `json:"accepted_motifs"`
	RejectedMotifs []Motif `json:"rejected_motifs"`
}

type LastUpdated struct {
	Date string `json:"date"`
}

type ResultsSearchParams struct {
	Sugar        []int     `json:"sugar"`
	Plddt        []float32 `json:"plddt"`
	Organism     []int     `json:"organism"`
	PdbStructure *int      `json:"pdbStructure"`
	Title		 *string   `json:"title"`
	Page 		 int	   `json:"page"`
	Count		 *int	   `json:"count"`
}

type PaginationInfo struct {
	Page  int `json:"page"`
	Count int `json:"count"`
}

type GetComputedStructuresResponse struct {
	TotalCount int 				   `json:"total_count"`
	Data	   []ComputedStructure `json:"data"`
}

type PreProcessedDataStats struct {
	PdbMirrorDate string `json:"pdb_mirror_date"`
	PdbMirrorCount int `json:"pdb_mirror_count"`
	StructsWithSugars int `json:"structs_with_sugars"`
	StructsWithLigands int `json:"structs_with_ligands"`
	StructsWithAltlocs int `json:"structs_with_altlocs"`
	StructsUnsuppAltlocs int `json:"structs_unsupp_altlocs"`
	StructsAfterFilter int `json:"structs_after_filter"`
}

type RawFilteredSurroundings struct {
	Raw int `json:"raw"`
	Filtered int `json:"filtered"`
}

type SurroundingsDataStats map[string]RawFilteredSurroundings

type ResultsStats struct {
	NumResults int `json:"num_results"`
	NumMotifMatches int `json:"num_motif_matches"`
	MotifMatchesPerSugar map[string]int `json:"motif_matches_per_sugar"`
	MotifMatchesPerProtein map[int]int `json:"motif_matches_per_protein"`
	PlddtRangePerSugar map[string]PlddtRange `json:"plddt_range_per_sugar"`
	PlddtPerProtein []float32 `json:"plddt_per_protein"`
}

type StatsResponse struct {
	Preproc PreProcessedDataStats `json:"preproc"`
	Surroundings SurroundingsDataStats `json:"surroundings"`
	Results ResultsStats `json:"results"`
}
