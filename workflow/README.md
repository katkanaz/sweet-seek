# Workflow


## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)


## Overview

This project provides an automated bioinformatics workflow to identify candidate
sugar-binding proteins using structural data. The workflow consists of two main
stages: Data Pre-processing and Surrounding Analysis. The workflow steps are shown in this flowchart:

![Flowchart showing steps of the workflow](../docs/workflow-flowchart.svg)

## Installation

The workflow can be installed locally (best for development) or as a docker container. Local installation requires setup of
[Prerequisites](#prerequisites) and a [manual installation](#steps) of main workflow dependencies. The [docker image](#docker-image) contains all prerequisites **except** the PDB mirror, which needs to be setup independently.

### Prerequisites

- PDB mirror
- `mono` (.NET) from `https://www.mono-project.com/`, when using the mono package repository, use the package `mono-complete`
- `python` versions 3.12.3 and 3.8.20
- `pymol open-source` version 2.4.0
    - clone the repository (<https://github.com/schrodinger/pymol-open-source>) and checkout tag `2.4.0`
    - prepare a virtual environment with python 3.8.20
    - before installing `pymol`, install requirements listed in `requirements-pymol.txt` into the virtual environment
    - install `pymol` by running the following command **from** the `pymol open-source` directory, while having the virtual environment activated
        - ```bash
            python setup.py install --no-vmd-plugins
          ```
- `MotiveValidator` version 1.1.23.12.27b
- `PatternQuery` version 1.1.23.12.27b

### Steps

1. Clone the repository
2. Create a python virtual environment with python 3.12.3
3. Install the required packages into the virtual environment:
    - ```bash
        pip install -r requirements.txt
      ```

### Docker Image

To build a docker image a `Dockerfile` is provided. The resulting image provides a pre-configured environment with all necessary prerequisites and external tools installed. When building, the file `docker-config.json` is saved into the image and is used as the configuration file while running the workflow in the docker container. To build the image run:

```bash
docker build -t workflow .
```

In order to run the container on MetaCentrum, it needs to be converted into a `singularity` container. First, save the built docker image into a file:

```bash
docker save -o workflow.tar workflow
```

Then convert to a `singularity` image (run this command on MetaCentrum):

```bash
singularity build workflow-singularity.sif docker-archive://workflow.tar
```

## Usage

When running the workflow, it is necessary to configure if the data needed for
analysis (PDB mirror, initial PQ results) is located locally or on a remote
host. This is configured via environment variables. The following environment
variables are read by the workflow:

- `DATA_SOURCE`: `"remote"` or `"local"`, if not set, uses the default value of "local"
- `RSYNC_USER`: `"[USERNAME]"` for the remote host. Used when running in `remote` mode.
- `RSYNC_PASSWORD`: `"[PASSWORD]"`. Used when running in `remote` mode.
- `RSYNC_HOST`: `"[remote-host-address]"`. Used when running in `remote` mode.


The workflow consists of 2 main parts:

1. `src/data_preprocessing.py`
2. `src/surrounding_analysis.py`

To see a detailed usage of these scripts use the `--help` flag when running them.

Both of these programs can be ran in `test` mode, which is primarily useful for
development and debugging. To run the workflow in `test` mode, use the `-t`
flag (see [Configuration](#configuration) for options related to `test` mode).
When ran in `test` mode, the workflow processes only a limited number of PDB
structures, greatly reducing the run time time.

An optional third step is to merge the individual result files (which are
created for each processed sugar) into a unified result JSON file. This is done
using the `/src/create_merged_results.py` script. It takes paths to each result
file and outputs a single JSON file.

For ease of use when running on MetaCentrum, the
`pipeline_handlers/pipeline.sh` script is provided. It sets up batch jobs,
which execute all the steps of the workflow, including PDB mirror setup,
initial PQ processing, running the (2) main workflow parts and merging of
results into the unified results file described above.

## Configuration

The workflow can be configured using a configuration file, defaulting to a `config.json` in the `src/` directory. 
The `--config` flag can be used to specify a different config file.

The configuration file has the following options:

- `pdb_mirror_dir`
    - Location of the PDB mirror. When using a remote PDB mirror, the path should be an absolute path on the remote hosting the mirror.
- `init_pq_dir`
    - Path where to load "initial PQ run" results from.
- `data_dir`
    - Path where to download data from mirror for processing.
- `results_dir`
    - Path where to save the workflow results.
- `images_dir`
    - Path where to save generated images.
- `mv_dir`
    - Path to the MotiveValidator CLI tool.
- `pq_dir`
    - Path to the PatternQuery CLI tool.
- `current_run_dir`
    - Path where to save the `.current_run` file
- `pdb_ids_list`
    - When running in test mode, this option can be used to specify what PDB structures should be used.
- `skip_ids`
    - PDB IDs of structures which should be excluded from the workflow.
- `data_run`
    - Can be used to override the default data directory selection. Should be the name of a particular directory located in the `data_dir` directory.

Example configuration file:

```json
{
    "pdb_mirror_dir": "../pdb-mirror",
    "init_pq_dir": "../init-pq-dir",
    "data_dir": "../data",
    "results_dir": "../results",
    "images_dir": "../img",
    "mv_dir": "../mv",
    "pq_dir": "../pq",
    "current_run_dir": "..",
    "pdb_ids_list": ["7khu", "6nmp", "1gww", "5x3j", "6rig", "3l2j", "4d6d"],
    "skip_ids": ["7zll", "5x7p"],
    "data_run": "2025-10-07T20-00-00"
}
```
