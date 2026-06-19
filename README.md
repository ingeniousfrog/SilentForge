# SilentForge

**Turn a GitHub repository into a portable static presentation site and lightweight code wiki.**

SilentForge ships the `reposite` CLI and a local **Workbench** web UI. It reads public repository signals—README, metadata, file tree, releases—and builds editable HTML you can open locally, preview in the browser, or deploy to any static host.

The default path is **deterministic and source-bound**: it extracts what the repository actually documents and does not invent product claims. Optional OpenAI-assisted planning can rearrange the evidence into a stronger narrative, but it still cannot introduce new facts or arbitrary markup.

[中文文档](./README-CN.md)

## Highlights

- **Scroll-story presentation** — sticky chapter navigation, detail pages, local Mermaid diagrams
- **Code wiki** — detected stack, entry files, config signals, module map, directory summaries
- **Repository readiness diagnostics** — scored gaps and recommendations before you publish
- **Local Workbench** — paste a URL, watch generation steps, browse resources, preview output, download ZIP
- **Bilingual UI shell** — Workbench and generated site chrome support **EN** and **中文** (README content stays as-is)
- **Plain static output** — HTML, CSS, JavaScript, and JSON you can edit by hand

## Requirements

- Node.js **20+**
- A public `github.com` repository URL (or `owner/repo` shorthand)
- Optional: `GITHUB_TOKEN` for higher rate limits
- Optional: `OPENAI_API_KEY` for `--ai` presentation planning

## Quick start

```sh
git clone <this-repo>
cd SilentForge
npm install
npm run build
```

Generate a site from the CLI:

```sh
node dist/cli.js init openai/openai-node
```

Open the generated directory and load `index.html` in a browser, or serve the folder with any static file server.

## Workbench

Start the local web UI from source:

```sh
npm run web
```

Open [http://127.0.0.1:4177/](http://127.0.0.1:4177/)

Use a different port:

```sh
npm run web -- --port 4188
```

To exercise the packaged CLI entrypoint:

```sh
npm run build
npm run web:dist
```

In the Workbench you can:

1. Switch **EN | 中文** in the top-right capsule (saved to `localStorage` as `silentforge.locale`)
2. Paste a GitHub URL and click **Generate**
3. Follow the generation stream, then inspect **Overview**, **Resources**, **Code Wiki**, and **Preview**
4. Download the same static files as a ZIP

The language capsule updates Workbench copy immediately and passes `locale` into the next generation job, affecting Preview, ZIP, and all generated page chrome.

## CLI reference

### `reposite init`

Generate a static presentation site from a repository:

```sh
reposite init https://github.com/openai/openai-node
reposite init openai/openai-node
```

| Option | Description |
|--------|-------------|
| `-o, --output <dir>` | Output directory (default: `<repo-name>-site`) |
| `--ai` | Use OpenAI to arrange evidence-backed structure (falls back to rules on failure) |
| `--mode <mode>` | `auto`, `developer-deck`, `architecture-map`, `visual-showcase`, `compact-story` |
| `--theme <theme>` | `auto`, `signal-dark`, `editorial-light`, `blueprint` |
| `--chapters <kinds>` | Comma-separated chapter kinds to include |
| `--locale <locale>` | Generated site UI language: `en` (default) or `zh` |
| `--token <token>` | GitHub token (falls back to `GITHUB_TOKEN`) |

Examples:

```sh
# Optional AI planning
OPENAI_API_KEY=your_key reposite init openai/openai-node --ai

# Explicit presentation options
reposite init openai/openai-node \
  --mode developer-deck \
  --theme signal-dark \
  --chapters features,usage,architecture \
  --locale zh \
  --token "$GITHUB_TOKEN"
```

### `reposite web`

Run the local Workbench:

```sh
reposite web
reposite web --host 127.0.0.1 --port 4177
```

## Generated output

Running `reposite init` writes a self-contained static site:

| Path | Purpose |
|------|---------|
| `index.html` | Scroll-story entry with sticky chapter navigation |
| `assets/site.css` | Theme-aware presentation styles |
| `assets/site.js` | Chapter navigation, progress, Mermaid bootstrapping |
| `assets/mermaid.js` | Bundled Mermaid runtime (no CDN) |
| `details/*.html` | Installation, usage, architecture, releases, README sections |
| `data/site.json` | Structured repository model and final presentation plan |
| `README.md` | Short note on opening or deploying the generated site |

Content is assembled from repository facts:

- README title, summary, features, install/usage notes, FAQ, screenshots, links, and long-form sections
- GitHub metadata: stars, topics, license, releases, default branch, language, homepage
- Lightweight code wiki: project structure, detected stack, entry files, config files, module map, Mermaid diagram
- Repository readiness diagnostics (also surfaced in the Workbench Overview tab)

## Presentation themes

| Theme ID | Label | Character |
|----------|-------|-----------|
| `signal-dark` | Dark Signal | Default dark developer-tool palette |
| `editorial-light` | Editorial Light | Light editorial layout with serif headings |
| `blueprint` | Blueprint | Engineering grid background |

Select a theme in Workbench **Output settings** or pass `--theme` on the CLI. `auto` follows the chosen presentation mode.

## Internationalization

| Surface | Localized? |
|---------|------------|
| Workbench UI | Yes — EN / 中文 capsule |
| Generated site chrome (nav, labels, footers, diagnostics text) | Yes — via `locale` / `--locale` |
| README and repository facts | **No** — always shown as extracted from the repo |

Default locale is `en`. Switching language in the Workbench does not retroactively translate past job events; it affects the UI and the next generation run.

## Environment variables

| Variable | Used for |
|----------|----------|
| `GITHUB_TOKEN` | GitHub API access and rate limits |
| `OPENAI_API_KEY` | Optional `--ai` presentation planning |
| `OPENAI_MODEL` | Override the OpenAI model (default: `gpt-5.5`) |

## Design principles

- **Source-bound** — prefer repository content over guesses
- **No filler** — omit empty sections instead of placeholder slides
- **Editable output** — plain HTML, CSS, JavaScript, and JSON
- **One artifact path** — Preview and ZIP use the same generated files
- **Local-first** — static sites, no hosted build pipeline required

## Development

```sh
npm test
npm run test:coverage
npm run dev -- init owner/repo
```

## License

Apache-2.0 — see [LICENSE](./LICENSE).
