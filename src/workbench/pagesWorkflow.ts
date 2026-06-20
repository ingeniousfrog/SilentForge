export const pagesWorkflowPath = ".github/workflows/silentforge-pages.yml";
export const silentForgeSourceRepo = "ingeniousfrog/SilentForge";
export const silentForgeSourceRef = "main";
export const silentForgeToolPath = ".silentforge-tool";

export function buildPagesWorkflowYaml(_fullName: string): string {
  return `# Requires silentforge >= 0.1.1 on npm (0.1.0 bin entry was broken).

name: Deploy SilentForge presentation site

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Generate presentation site
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        run: npx --yes silentforge@latest init \${{ github.repository }} -o site --locale en

      - uses: actions/upload-pages-artifact@v3
        with:
          path: site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
`;
}

export function buildPagesSetupChecklist(
  fullName: string,
  pagesUrl: string,
  locale: "en" | "zh" = "en"
): string {
  const repoLabel = fullName || "owner/repo";
  if (locale === "zh") {
    return [
      `# 将 ${repoLabel} 发布到 GitHub Pages`,
      "",
      "1. 在浏览器打开你的 GitHub 仓库。",
      "2. 进入 Settings → Pages → Build and deployment。",
      '3. 将 Source 设为 **GitHub Actions**（不要选 Deploy from a branch）。未启用会导致 deploy 404。',
      `4. 在仓库中新建文件 \`${pagesWorkflowPath}\`，粘贴 SilentForge Workbench 提供的 workflow YAML。`,
      "5. Commit 并 push 到 main；在 Actions 标签页等待 workflow 跑完。",
      "6. 若 deploy 报 404，说明第 2–3 步未完成；启用 Pages 后在 Actions 里 Re-run failed jobs。",
      `7. 完成后访问：${pagesUrl}`
    ].join("\n");
  }
  return [
    `# Publish ${repoLabel} to GitHub Pages`,
    "",
    "1. Open your GitHub repository in the browser.",
    "2. Go to Settings → Pages → Build and deployment.",
    '3. Set Source to **GitHub Actions** (not Deploy from a branch). Skipping this causes deploy error 404.',
    `4. Create \`${pagesWorkflowPath}\` in the repository and paste the workflow YAML from SilentForge Workbench.`,
    "5. Commit and push to main, then wait for the workflow to finish in the Actions tab.",
    "6. If deploy returns 404, complete steps 2–3 first, then Re-run failed jobs in Actions.",
    `7. Visit your live site: ${pagesUrl}`
  ].join("\n");
}
