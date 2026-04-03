# SweetSeek Backend

## Prerequisites

- `golang`
- `molrender` (<https://github.com/molstar/molrender>)

Optionally:
- `air` (<https://github.com/air-verse/air>)
    - live reloading during development

## Building

```bash
go build .
```

Produces an executable file `sweetseek-be`.

## Running during development

```bash
air
```

### Environment variables

Required environment variables:

- `MOLRENDER_CMD`: command which runs the molrender tool. Example: `node path/to/molrender.js`.

## Data

The server expects a `data/` directory, with a `workflow_runs/` subdirectory, where it looks for the merged workflow result JSON file.
