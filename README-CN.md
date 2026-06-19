# SilentForge

**将 GitHub 仓库一键生成为可离线打开的静态演示站点与轻量代码百科。**

SilentForge 提供 `reposite` 命令行工具与本地 **Workbench** 网页界面。它会读取公开仓库中的 README、元数据、文件树、Release 等信号，输出可直接打开、预览或部署到任意静态托管的 HTML 文件。

默认流程是**确定性的、以仓库事实为准**：只提取仓库里真实存在的内容，不会臆造产品卖点。可选的 OpenAI 辅助规划可以重新编排叙事结构，但仍不能引入新事实或任意 HTML/CSS。

[English](./README.md)

## 核心能力

- **滚动叙事演示页** — 粘性章节导航、详情页、本地 Mermaid 结构图
- **代码百科** — 技术栈、入口文件、配置信号、模块地图、目录摘要
- **仓库就绪度诊断** — 发布前给出评分、短板与改进建议
- **本地 Workbench** — 粘贴 URL、查看生成步骤、浏览资源、预览产物、下载 ZIP
- **中英双语壳层** — Workbench 与生成站点的框架文案支持 **EN / 中文**（README 正文保持原样）
- **纯静态产物** — HTML、CSS、JavaScript、JSON，可手工二次编辑

## 环境要求

- Node.js **20+**
- 公开的 `github.com` 仓库地址（或 `owner/repo` 简写）
- 可选：`GITHUB_TOKEN` 提高 GitHub API 限额
- 可选：`OPENAI_API_KEY` 启用 `--ai` 演示结构规划

## 快速开始

```sh
git clone <this-repo>
cd SilentForge
npm install
npm run build
```

用 CLI 生成站点：

```sh
node dist/cli.js init openai/openai-node
```

在输出目录中直接用浏览器打开 `index.html`，或用任意静态文件服务器托管该目录。

## Workbench

从源码启动本地 Web 界面：

```sh
npm run web
```

浏览器访问 [http://127.0.0.1:4177/](http://127.0.0.1:4177/)

指定端口：

```sh
npm run web -- --port 4188
```

验证打包后的 CLI 路径：

```sh
npm run build
npm run web:dist
```

Workbench 中可以：

1. 点击右上角 **EN | 中文** 胶囊切换语言（写入 `localStorage`，键名 `silentforge.locale`）
2. 粘贴 GitHub 地址并点击 **Generate**
3. 在 **Overview / Resources / Code Wiki / Preview** 中查看结果
4. 下载与预览一致的 ZIP 静态包

语言切换会立即更新 Workbench 文案，并将 `locale` 传入下一次生成任务，影响 Preview、ZIP 及所有生成页面的框架文案。

## CLI 参考

### `reposite init`

从仓库生成静态演示站点：

```sh
reposite init https://github.com/openai/openai-node
reposite init openai/openai-node
```

| 选项 | 说明 |
|------|------|
| `-o, --output <dir>` | 输出目录（默认：`<repo-name>-site`） |
| `--ai` | 使用 OpenAI 编排有证据支撑的结构（失败时回退到规则引擎） |
| `--mode <mode>` | `auto`、`developer-deck`、`architecture-map`、`visual-showcase`、`compact-story` |
| `--theme <theme>` | `auto`、`signal-dark`、`editorial-light`、`blueprint` |
| `--chapters <kinds>` | 逗号分隔的章节类型 |
| `--locale <locale>` | 生成站点 UI 语言：`en`（默认）或 `zh` |
| `--token <token>` | GitHub Token（可回退到 `GITHUB_TOKEN`） |

示例：

```sh
# 可选 AI 规划
OPENAI_API_KEY=your_key reposite init openai/openai-node --ai

# 显式指定演示选项
reposite init openai/openai-node \
  --mode developer-deck \
  --theme signal-dark \
  --chapters features,usage,architecture \
  --locale zh \
  --token "$GITHUB_TOKEN"
```

### `reposite web`

启动本地 Workbench：

```sh
reposite web
reposite web --host 127.0.0.1 --port 4177
```

## 生成产物

`reposite init` 会写入一套自包含的静态站点：

| 路径 | 用途 |
|------|------|
| `index.html` | 滚动叙事主页，含粘性章节导航 |
| `assets/site.css` | 主题样式 |
| `assets/site.js` | 章节导航、阅读进度、Mermaid 启动逻辑 |
| `assets/mermaid.js` | 内置 Mermaid 运行时（无需 CDN） |
| `details/*.html` | 安装、用法、架构、Release、README 章节详情页 |
| `data/site.json` | 结构化仓库模型与最终演示规划 |
| `README.md` | 如何打开或部署生成站点的简短说明 |

内容均来自仓库事实，例如：

- README 标题、摘要、特性、安装/用法、FAQ、截图、链接及长章节
- GitHub 元数据：Stars、Topics、许可证、Release、默认分支、语言、主页
- 轻量代码百科：目录结构、技术栈、入口文件、配置文件、模块地图、Mermaid 图
- 仓库就绪度诊断（Workbench Overview 面板也会展示）

## 演示主题

| 主题 ID | 名称 | 风格 |
|---------|------|------|
| `signal-dark` | Dark Signal | 默认深色开发者工具风 |
| `editorial-light` | Editorial Light | 浅色编辑排版，标题使用衬线字体 |
| `blueprint` | Blueprint | 工程网格背景 |

在 Workbench 的 **Output settings** 中选择，或通过 CLI 传入 `--theme`。`auto` 会跟随所选演示模式。

## 国际化说明

| 范围 | 是否翻译 |
|------|----------|
| Workbench 界面 | 是 — EN / 中文胶囊 |
| 生成站点框架（导航、标签、页脚、诊断文案等） | 是 — 由 `locale` / `--locale` 控制 |
| README 与仓库事实内容 | **否** — 始终按仓库原文展示 |

默认语言为 `en`。在 Workbench 切换语言不会追溯翻译历史任务日志，只影响当前界面与下一次生成。

## 环境变量

| 变量 | 用途 |
|------|------|
| `GITHUB_TOKEN` | GitHub API 访问与速率限制 |
| `OPENAI_API_KEY` | 可选 `--ai` 演示规划 |
| `OPENAI_MODEL` | 覆盖 OpenAI 模型（默认：`gpt-5.5`） |

## 设计原则

- **以仓库为准** — 优先使用仓库内容，不做无依据猜测
- **不留占位** — 无内容的章节直接省略
- **产物可编辑** — 纯 HTML / CSS / JS / JSON
- **预览即产物** — Preview 与 ZIP 使用同一套生成文件
- **本地优先** — 静态站点，无需托管构建流水线

## 开发

```sh
npm test
npm run test:coverage
npm run dev -- init owner/repo
```

## 许可证

Apache-2.0 — 见 [LICENSE](./LICENSE)。
