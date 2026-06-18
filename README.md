# SilentForge

SilentForge provides the `reposite` CLI: a TypeScript tool that turns a GitHub repository into a portable adaptive HTML presentation with a lightweight code knowledge base.

The default path is deterministic: it reads the repository itself, extracts what is documented, and avoids inventing product claims. Optional OpenAI-assisted structure can rearrange the evidence into a stronger narrative, but it cannot introduce facts or arbitrary HTML/CSS.

## Commands

```sh
npm install
npm run build
```

## Start the Frontend Workbench

For local development, start the RepoSite web UI directly from source:

```sh
npm run web
```

Then open:

```text
http://127.0.0.1:4177/
```

To use a different port:

```sh
npm run web -- --port 4188
```

To verify the packaged CLI path first:

```sh
npm run build
npm run web:dist
```

The workbench lets you paste a GitHub URL, watch each generation step, browse fetched repository resources, inspect the generated code wiki, preview the exact generated files, and download the same static presentation as a ZIP file.

Generate a site from a public GitHub repository:

```sh
node dist/cli.js init openai/openai-node
```

Enable optional evidence-bound OpenAI presentation planning:

```sh
OPENAI_API_KEY=your_key node dist/cli.js init openai/openai-node --ai
```

Or, after installing the package globally or linking it locally:

```sh
reposite init https://github.com/openai/openai-node
```

Run the local web workbench:

```sh
reposite web
```

## What `reposite init` Generates

- `index.html` adaptive presentation entry point
- Local Reveal.js runtime plus project-specific CSS and interaction scripts under `assets/`
- Content-backed detail pages for installation, usage, architecture, releases, and README sections
- README-derived insight slides for project-specific topics such as CLI usage, APIs, presets, development, and operational notes
- Locally rendered Mermaid repository diagrams and expandable license metadata
- `data/site.json` with structured repository data and the final presentation plan
- README-derived title, summary, features, install notes, usage notes, FAQ, screenshots, and links
- GitHub metadata including stars, topics, license, releases, default branch, language, and file tree
- Lightweight code wiki with project structure, detected stack, entry files, common config files, module map, and Mermaid diagram
- Optional local workbench UI for generation progress, resource browsing, preview, and ZIP download

## Design Constraints

- Prefer repository content over guesses.
- Omit empty presentation sections instead of filling the deck with placeholders.
- Keep generated output editable: pages are plain HTML, CSS, JavaScript, and JSON.
- Keep Preview and ZIP output on the same generated-file path.
- Keep the tool local and static-site focused.
