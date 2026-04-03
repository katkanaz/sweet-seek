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
	LabelAsymId string `json:"label_asym_id"`
	StructOperId string `json:"struct_oper_id"`
	LabelSeqId int `json:"label_seq_id"`
}

type Motif struct {
	Surrounding string `json:"surrounding"`
	Sugar string `json:"sugar"`
	OriginalStructure string `json:"original_struct"`
	ResidueIds []ResidueId `json:"residue_ids"`
	Score float32 `json:"score"`
	ResidueTypes []string `json:"residue_types"`
	Transformation []float32 `json:"transformation"`
}

type ComputedStructure struct {
	PdbId string `json:"pdb_id"`
	AfdbId string `json:"afdb_id"`
	Title string `json:"title"`
	Organism []string `json:"organism"`
	Plddt float32 `json:"plddt"`
	AfVersion string `json:"af_version"`
	AfRevision int `json:"af_revision"`
	Motifs []Motif `json:"motifs"`
}

type LastUpdated struct {
	Date string `json:"date"`
}
