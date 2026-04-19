import { PlddtRange } from "./computed_structure";

export type ResultsStats = {
    num_results: number;
    num_motif_matches: number;
    motif_matches_per_sugar: Record<string, number>;
    motif_matches_per_protein: Record<number, number>;
    plddt_range_per_sugar: Record<string, PlddtRange>;
    plddt_per_protein: number[];
};

export type PreprocStats = {
    pdb_mirror_date: string;
    pdb_mirror_count: number;
    structs_with_sugars: number;
    structs_with_ligands: number;
    structs_with_altlocs: number;
    structs_unsupp_altlocs: number;
    structs_after_filter: number;
};

export type RawFilteredSurroundings = {
    raw: number;
    filtered: number;
};

export type SurroundingsDataStats = { [key: string]: RawFilteredSurroundings };

export type GetStatsResponse = {
    preproc: PreprocStats;
    surroundings: SurroundingsDataStats;
    results: ResultsStats;
};

export const getStats = async (): Promise<GetStatsResponse> => {
    const res = await fetch("/api/stats", {
        method: "GET",
    });

    if (!res.ok) throw new Error("Failed to fetch stats");
    const data: GetStatsResponse = await res.json();
    return data;
};
