# SilentForge

SilentForge provides the `reposite` CLI: a TypeScript tool that turns a GitHub repository into an editable Astro project website with a lightweight code knowledge base.

The MVP is intentionally deterministic. It reads the repository itself, extracts what is documented, and avoids inventing product claims. AI chat, vector search, login, databases, and SaaS workflows are out of scope.

## Commands

```sh
npm install
npm run build
```

Generate a site from a public GitHub repository:

```sh
node dist/cli.js init openai/openai-node
```

Or, after installing the package globally or linking it locally:

```sh
reposite init https://github.com/openai/openai-node
```

Inside the generated Astro project:

```sh
reposite dev
reposite build
```

Run the local web workbench:

```sh
reposite web
```

The workbench lets you paste a GitHub URL, watch each generation step, browse fetched repository resources, inspect the generated code wiki, preview the result, and download the generated Astro project as a ZIP file.

## What `reposite init` Generates

- Astro static site scaffold
- Home, install, usage, releases, FAQ, GitHub, README sections, and code wiki pages
- `src/data/site.json` with structured repository data
- README-derived title, summary, features, install notes, usage notes, FAQ, screenshots, and links
- GitHub metadata including stars, topics, license, releases, default branch, language, and file tree
- Lightweight code wiki with project structure, detected stack, entry files, common config files, module map, and Mermaid diagram
- Optional local workbench UI for generation progress, resource browsing, preview, and ZIP download

## Design Constraints

- Prefer repository content over guesses.
- Show “Not documented in repository” when source material is missing.
- Keep generated output editable: pages are plain Astro files plus JSON data.
- Keep the tool local and static-site focused.
