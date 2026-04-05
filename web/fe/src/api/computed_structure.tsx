import { SelectOption } from "../components/MultiSelect";
import { ResultsSearch } from "../Router";

export type ResidueId = {
	res_name: string,
	res_id: number,
	chain_id: string,
}

export type Motif = {
	surrounding: string,
	sugar: string,
	original_struct: string,
	surrounding_residues: ResidueId[],
	residue_ids: ResidueId[],
	score: number,
	transformation: number[],
}

export type ComputedStructure = { 
	pdb_id: string,
	afdb_id: string,
	title: string,
	organism: string[],
	plddt: number,
	af_version: string,
	af_revision: number,
	motifs: Motif[],
};

export type LastUpdated = {
	date: string,
}

export type PlddtRange = {
    min: number,
    max: number,
}

export type FilterOptions = {
    sugars: SelectOption[],
    plddt_range: PlddtRange,
    organisms: SelectOption[],
    pdb_structures: SelectOption[],
}

export const getResults = async (filters: ResultsSearch): Promise<ComputedStructure[]> => {
    const res = await fetch("/api/results", {
        method: "POST", // TODO: try using get request
        body: JSON.stringify(filters)
    });

    if (!res.ok) throw new Error("Failed to fetch results");
    const data: ComputedStructure[] = await res.json();
    return data;
};

export const getCompStruct = async (afid: string): Promise<ComputedStructure> => {
    const res = await fetch(`/api/results/${afid}`, {
        method: "POST",
        body: JSON.stringify({}) // TODO: add body 
    });
    if (!res.ok) throw new Error("Failed to fetch the computed structure");
    const data: ComputedStructure = await res.json();
    return data;
};

export const getLastModified = async (): Promise<LastUpdated> => {
    const res = await fetch(`/api/last-modified`);
    if (!res.ok) throw new Error("Failed to fetch last modified date");
    const data: LastUpdated = await res.json();
    return data;
}

export const getFilterOptions = async (): Promise<FilterOptions> => {
    const res = await fetch(`/api/filter-options`);
    if (!res.ok) throw new Error("Failed to fetch filter options");
    const data: FilterOptions = await res.json();
    return data;
}
