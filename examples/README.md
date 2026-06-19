# SilentForge examples

These public repositories work well as first targets when trying SilentForge:

| Repository | Why it is a good example | Command |
|------------|--------------------------|---------|
| [openai/openai-node](https://github.com/openai/openai-node) | Mature SDK README with install, usage, and release signals | `npx silentforge init openai/openai-node` |
| [vercel/next.js](https://github.com/vercel/next.js) | Large monorepo with rich metadata and architecture signals | `npx silentforge init vercel/next.js` |
| [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | Visual README content and strong community metadata | `npx silentforge init tailwindlabs/tailwindcss` |
| [axios/axios](https://github.com/axios/axios) | Compact library story with clear developer journey | `npx silentforge init axios/axios` |
| [microsoft/playwright](https://github.com/microsoft/playwright) | Documentation-heavy project with screenshots and releases | `npx silentforge init microsoft/playwright` |

## Live demo

The SilentForge repository publishes its own generated presentation site to GitHub Pages:

**https://ingeniousfrog.github.io/SilentForge/**

Enable Pages with **Settings → Pages → Build and deployment → GitHub Actions**, then run the workflow in [`.github/workflows/silentforge-pages.yml`](../.github/workflows/silentforge-pages.yml).
