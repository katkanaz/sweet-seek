from argparse import ArgumentParser
import json
from pathlib import Path
from typing import Dict

from utils.parse_surrounding_name import parse_surrounding_name


def simplify_motif_data(motif: Dict) -> Dict:
    """
    Simplify motif residue data by merging "residue_ids" and "residue_types".

    :param motif: Computed structure motif
    :return: Simplified motif
    """

    residue_ids = [{"res_name": t, "res_id": r["label_seq_id"], "chain_id": r["label_asym_id"]} for (r, t) in zip(motif["residue_ids"], motif["residue_types"])]
    motif["residue_ids"] = residue_ids
    del motif["residue_types"]
    return motif


def create_merged_results(source: list[Path], output: Path) -> None:
    """
    Create a JSON file all given source files merged.

    :param source: List of source files to merge
    :param output: Single JSON file
    """

    merged = {}

    for file_name in source:
        with open(file_name, "r") as f:
            results: dict = json.load(f)
            for surrounding, structs_and_res in results.items():
                for struct, data in structs_and_res["structures"].items():
                    if struct not in merged:
                        merged[struct] = {
                            "pdb_id": struct,
                            "afdb_id": data["afdb_id"],
                            "title": data["title"],
                            "organism": data["organism"],
                            "plddt": data["plddt"],
                            "af_version": data["af_version"],
                            "af_revision": data["af_revision"],
                            "motifs": []
                        }
                    surrounding_name = parse_surrounding_name(surrounding)
                    motif_metadata = {"surrounding": surrounding, "sugar": surrounding_name["sugar"], "original_struct": surrounding_name["pdb_id"], "surrounding_residues": structs_and_res["residue_ids"]}
                    motifs = [simplify_motif_data(d) for d in data["motifs"]]
                    merged[struct]["motifs"].extend(map(lambda x: {**motif_metadata, **x}, motifs))

    with open(output, "w") as f:
        json.dump(list(merged.values()), f, indent=4)



if __name__ == "__main__":
    parser = ArgumentParser()

    parser.add_argument("-s", "--source", help="Source of the results for one sugar", type=Path, action="append", required=True)
    parser.add_argument("-o", "--output", help="Path to output file", type=Path, required=True)

    args = parser.parse_args()

    create_merged_results(args.source, args.output)
