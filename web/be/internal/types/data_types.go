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
}
