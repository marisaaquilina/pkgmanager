# Meet pkgmanager 👋

**pkgmanager** is s a JupyterLab UI extension that installs the packages you need within your active kernel. ✨
 * Search for a package and install it with just a button-click
 * Record your package installation history for other notebook readers (or your future self)

## Prerequisites

* JupyterLab

## Installation

```bash
jupyter labextension install pkgmanager
```

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

