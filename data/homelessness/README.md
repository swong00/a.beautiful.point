# Homelessness Data Pipeline

Status: runtime scaffold.

Plan 004 uses a hybrid runtime:

- Python owns source discovery, downloads, spreadsheet parsing, normalization, validation, and static asset generation.
- TypeScript and Astro own frontend loading, controls, and rendering.

Set up the Python ETL environment from the repo root:

```sh
export PATH="$HOME/Library/pnpm/bin:$HOME/.local/share/pnpm/bin:$PATH"
pnpm data:setup
pnpm data:doctor
pnpm data:discover
```

Raw HUD, Census, and geography downloads are ignored by git. Keep source provenance, manifests, validation reports, and public static assets versioned when a plan step explicitly promotes them.

Source discovery writes the versioned manifest at:

```text
data/homelessness/raw/manifest.json
```
