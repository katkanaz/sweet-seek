import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, List

import matplotlib.pyplot as plt
import numpy as np

plt.style.use("seaborn-v0_8")

SATURATED_COLORS = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
]
PIE_COLORS = plt.cm.tab10(np.linspace(0, 1, 10))


def load_stats(json_path: str) -> Dict[str, Any]:
    """Load statistics from JSON file."""
    with open(json_path, "r") as f:
        return json.load(f)


def plot_motif_matches_per_protein(
    motif_matches: Dict[str, int], output_dir: str
) -> None:
    """Bar chart: Number of motif matches per protein."""
    fig, ax = plt.subplots(figsize=(8, 6))

    proteins = list(motif_matches.keys())
    counts = list(motif_matches.values())

    ax.bar(proteins, counts, color=SATURATED_COLORS[0], edgecolor="black")
    ax.set_xlabel("Number of motif matches", fontsize=16)
    ax.set_ylabel("Number of proteins", fontsize=16)
    ax.set_title("Number of motif matches per protein", fontsize=18, fontweight="bold")
    ax.grid(axis="y", alpha=0.3)

    ax.tick_params(axis="x", labelsize=14)
    ax.tick_params(axis="y", labelsize=14)
    plt.xticks(rotation=0)
    plt.tight_layout()
    plt.savefig(
        os.path.join(output_dir, "motif_matches_per_protein.pdf"),
        dpi=300,
        bbox_inches="tight",
    )
    plt.close()


def plot_motif_matches_per_sugar(
    motif_matches: Dict[str, int], output_dir: str
) -> None:
    """Doughnut chart: Number of motif matches per sugar."""
    fig, ax = plt.subplots(figsize=(10, 8))

    sugars = list(motif_matches.keys())
    counts = list(motif_matches.values())

    colors = plt.cm.tab10(np.linspace(0, 1, len(sugars)))
    wedges, texts, autotexts = ax.pie(
        counts,
        labels=sugars,
        autopct=lambda pct: f"{pct:.1f}%\n(n={int(pct/100.*sum(counts))})",
        colors=colors,
        startangle=90,
        pctdistance=0.8,
        wedgeprops=dict(width=0.5, edgecolor="white", linewidth=2),
    )

    for text in texts:
        text.set_fontsize(18)

    for autotext in autotexts:
        autotext.set_color("black")
        autotext.set_fontsize(18)
        autotext.set_fontweight("bold")

    ax.set_title("Number of motif matches per sugar", fontsize=22, fontweight="bold")
    plt.tight_layout()
    plt.savefig(
        os.path.join(output_dir, "motif_matches_per_sugar.pdf"),
        dpi=300,
        bbox_inches="tight",
    )
    plt.close()


def plot_plddt_distribution(plddt_values: List[float], output_dir: str) -> None:
    """Bar chart: Distribution of global pLDDT values."""
    fig, ax = plt.subplots(figsize=(8, 6))

    if not plddt_values:
        print("Warning: No pLDDT data to plot")
        plt.close()
        return

    ax.hist(
        plddt_values,
        bins=np.arange(int(min(plddt_values)), int(max(plddt_values)) + 2, 1),
        color=SATURATED_COLORS[1],
        edgecolor="black",
    )
    ax.set_xlabel("Global pLDDT", fontsize=16)
    ax.set_ylabel("Number of computed structures", fontsize=16)
    ax.set_title("Global pLDDT of computed structures", fontsize=18, fontweight="bold")
    ax.grid(axis="y", alpha=0.3)

    ax.tick_params(axis="x", labelsize=14)
    ax.tick_params(axis="y", labelsize=14)
    plt.tight_layout()
    plt.savefig(
        os.path.join(output_dir, "plddt_distribution.pdf"), dpi=300, bbox_inches="tight"
    )
    plt.close()


def plot_raw_vs_filtered(data: Dict[str, Dict[str, int]], output_dir: str) -> None:
    """Grouped bar chart: Raw vs filtered surroundings for each sugar."""
    fig, ax = plt.subplots(figsize=(10, 6))

    if not data:
        print("Warning: No raw/filtered data to plot")
        plt.close()
        return

    abbrevs = list(data.keys())
    raw_values = [data[abbrev]["raw"] for abbrev in abbrevs]
    filtered_values = [data[abbrev]["filtered"] for abbrev in abbrevs]

    x = np.arange(len(abbrevs))
    width = 0.35

    bars1 = ax.bar(
        x - width / 2,
        raw_values,
        width,
        label="Raw",
        color=SATURATED_COLORS[0],
        edgecolor="black",
    )
    bars2 = ax.bar(
        x + width / 2,
        filtered_values,
        width,
        label="Filtered",
        color=SATURATED_COLORS[1],
        edgecolor="black",
    )

    ax.set_xlabel("Sugars", fontsize=16)
    ax.set_ylabel("Number of surroundings", fontsize=16)
    ax.set_title(
        "Raw vs filtered surroundings for each sugar", fontsize=18, fontweight="bold"
    )
    ax.set_xticks(x)
    ax.set_xticklabels(abbrevs)
    ax.legend(fontsize=15)
    ax.grid(axis="y", alpha=0.3)

    ax.tick_params(axis="x", labelsize=14)
    ax.tick_params(axis="y", labelsize=14)

    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax.text(
                bar.get_x() + bar.get_width() / 2.0,
                height,
                f"{int(height)}",
                ha="center",
                va="bottom",
                fontsize=13.5,
            )

    plt.tight_layout()
    plt.savefig(
        os.path.join(output_dir, "raw_vs_filtered.pdf"), dpi=300, bbox_inches="tight"
    )
    plt.close()


def main():
    parser = argparse.ArgumentParser(
        description="Generate statistics visualizations from JSON data"
    )
    parser.add_argument(
        "preproc_file", help="Path to the JSON file containing preprocessing statistics"
    )
    parser.add_argument(
        "results_file", help="Path to the JSON file containing results statistics"
    )
    parser.add_argument(
        "raw_filtered_file",
        help="Path to the JSON file containing raw vs filtered data",
    )
    parser.add_argument(
        "-o",
        "--output",
        default=".",
        help="Output directory for charts (default: current directory)",
    )

    args = parser.parse_args()

    if not os.path.exists(args.preproc_file):
        print(f"Error: Preprocessing JSON file not found: {args.preproc_file}")
        return

    if not os.path.exists(args.results_file):
        print(f"Error: Results JSON file not found: {args.results_file}")
        return

    if not os.path.exists(args.raw_filtered_file):
        print(f"Error: Raw/filtered JSON file not found: {args.raw_filtered_file}")
        return

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Loading preprocessing statistics from {args.preproc_file}...")
    preproc = load_stats(args.preproc_file)

    print(f"Loading results statistics from {args.results_file}...")
    results = load_stats(args.results_file)

    print(f"Loading raw/filtered statistics from {args.raw_filtered_file}...")
    raw_filtered = load_stats(args.raw_filtered_file)

    print("Generating charts...")

    if "motif_matches_per_protein" in results:
        plot_motif_matches_per_protein(
            results["motif_matches_per_protein"], str(output_dir)
        )
        print("Motif matches per protein chart saved")

    if "motif_matches_per_sugar" in results:
        plot_motif_matches_per_sugar(
            results["motif_matches_per_sugar"], str(output_dir)
        )
        print("Motif matches per sugar chart saved")

    if "plddt_per_protein" in results:
        plot_plddt_distribution(results["plddt_per_protein"], str(output_dir))
        print("pLDDT distribution chart saved")

    if raw_filtered:
        plot_raw_vs_filtered(raw_filtered, str(output_dir))
        print("Raw vs filtered chart saved")

    print(f"\nAll charts saved to: {output_dir.absolute()}")


if __name__ == "__main__":
    main()
