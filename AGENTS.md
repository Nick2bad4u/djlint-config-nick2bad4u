# Repository Instructions

This repository publishes `djlint-config-nick2bad4u` as an npm data package.

## Public surfaces

- Treat `.djlintrc`, `presets/`, and the typed path API as public contracts.
- Never imply that npm installs the Python djLint application.
- Keep template profiles aligned with djLint's official profile names.
- Keep embedded CSS/JavaScript formatting opt-in.

## Verification

Install the documented pinned djLint version, then run `npm run release:verify`.
Every preset must be loaded by the real Python CLI.
