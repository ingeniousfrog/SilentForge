export function workbenchHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RepoSite Workbench</title>
    <style>
      :root {
        --bg: #06090f;
        --panel: rgba(12, 20, 32, 0.78);
        --panel-strong: rgba(15, 27, 43, 0.94);
        --line: rgba(126, 232, 255, 0.18);
        --line-strong: rgba(126, 232, 255, 0.42);
        --text: #e8f4ff;
        --muted: #8ea4b7;
        --dim: #52697d;
        --cyan: #62e6ff;
        --mint: #6ef7b1;
        --amber: #ffcb63;
        --red: #ff6d7a;
        --violet: #a9a2ff;
        --shadow: rgba(0, 0, 0, 0.34);
        --mono: "SFMono-Regular", "Cascadia Code", "Liberation Mono", Menlo, monospace;
        --sans: "Avenir Next", "Segoe UI", "Helvetica Neue", sans-serif;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 18% 12%, rgba(98, 230, 255, 0.16), transparent 32%),
          radial-gradient(circle at 84% 20%, rgba(110, 247, 177, 0.1), transparent 28%),
          linear-gradient(135deg, #04070c 0%, #07111d 48%, #04070c 100%);
        color: var(--text);
        font-family: var(--sans);
      }
      body::before {
        position: fixed;
        inset: 0;
        pointer-events: none;
        content: "";
        background:
          linear-gradient(rgba(126, 232, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(126, 232, 255, 0.05) 1px, transparent 1px),
          linear-gradient(rgba(255, 255, 255, 0.025) 50%, transparent 50%);
        background-size: 42px 42px, 42px 42px, 100% 4px;
        mask-image: linear-gradient(to bottom, black 0%, transparent 92%);
      }
      button, input {
        font: inherit;
      }
      button {
        border: 0;
      }
      .shell {
        min-height: 100vh;
        padding: 28px;
        position: relative;
      }
      .hero {
        min-height: calc(100vh - 56px);
        display: grid;
        place-items: center;
      }
      .search-console {
        width: min(1040px, 100%);
        padding: clamp(22px, 5vw, 48px);
        border: 1px solid var(--line);
        border-radius: 8px;
        background: linear-gradient(145deg, rgba(10, 18, 30, 0.9), rgba(8, 12, 20, 0.68));
        box-shadow: 0 24px 80px var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(18px);
      }
      .brand-row {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        align-items: flex-start;
        margin-bottom: 34px;
      }
      .eyebrow {
        color: var(--cyan);
        font-family: var(--mono);
        font-size: 12px;
        letter-spacing: 0;
        text-transform: uppercase;
      }
      h1 {
        max-width: 820px;
        margin: 10px 0 0;
        font-size: clamp(40px, 7vw, 92px);
        line-height: 0.9;
        letter-spacing: 0;
      }
      .beacon {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
        white-space: nowrap;
      }
      .beacon::before {
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--mint);
        box-shadow: 0 0 18px var(--mint);
        content: "";
      }
      .repo-form {
        display: grid;
        gap: 16px;
      }
      .search-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 12px;
        align-items: stretch;
      }
      .search-field {
        position: relative;
      }
      .search-field::before {
        position: absolute;
        left: 18px;
        top: 50%;
        width: 12px;
        height: 12px;
        border: 2px solid var(--cyan);
        border-radius: 50%;
        transform: translateY(-50%);
        content: "";
      }
      .search-field::after {
        position: absolute;
        left: 31px;
        top: calc(50% + 8px);
        width: 8px;
        height: 2px;
        background: var(--cyan);
        transform: rotate(45deg);
        content: "";
      }
      input {
        width: 100%;
        min-width: 0;
        min-height: 64px;
        border: 1px solid var(--line-strong);
        border-radius: 8px;
        padding: 18px 18px 18px 52px;
        outline: none;
        background: rgba(2, 8, 14, 0.76);
        color: var(--text);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        font-family: var(--mono);
        font-size: 16px;
      }
      input:focus {
        border-color: var(--cyan);
        box-shadow: 0 0 0 4px rgba(98, 230, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.06);
      }
      .primary-button, .download {
        min-height: 64px;
        border-radius: 8px;
        padding: 0 24px;
        background: linear-gradient(135deg, var(--cyan), var(--mint));
        color: #031018;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-family: var(--mono);
        font-weight: 800;
        box-shadow: 0 14px 42px rgba(98, 230, 255, 0.2);
      }
      .primary-button:disabled, .download[aria-disabled="true"] {
        cursor: not-allowed;
        filter: grayscale(0.9);
        opacity: 0.5;
      }
      .hint {
        margin: 0;
        color: var(--muted);
        font-size: 14px;
      }
      .ai-option {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 13px 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(98, 230, 255, 0.05);
        color: var(--muted);
        font-size: 13px;
      }
      .ai-option input {
        width: 18px;
        min-height: 18px;
        margin: 1px 0 0;
        padding: 0;
        accent-color: var(--mint);
      }
      .ai-option strong {
        display: block;
        margin-bottom: 3px;
        color: var(--text);
      }
      .history {
        margin-top: 28px;
        display: none;
      }
      .history.visible {
        display: block;
      }
      .history-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
        text-transform: uppercase;
      }
      .history-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .history-chip {
        max-width: 100%;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 10px 13px;
        background: rgba(126, 232, 255, 0.08);
        color: var(--text);
        cursor: pointer;
        font-family: var(--mono);
        font-size: 13px;
        overflow-wrap: anywhere;
      }
      .history-chip:hover {
        border-color: var(--cyan);
        color: var(--cyan);
      }
      .workbench {
        display: none;
        width: min(1500px, 100%);
        margin: 0 auto;
      }
      .shell[data-mode="active"] .hero {
        display: block;
        min-height: auto;
      }
      .shell[data-mode="active"] .search-console {
        width: min(1500px, 100%);
        margin: 0 auto 18px;
        padding: 18px;
      }
      .shell[data-mode="active"] h1 {
        font-size: clamp(28px, 4vw, 54px);
      }
      .shell[data-mode="active"] .brand-row {
        margin-bottom: 16px;
      }
      .shell[data-mode="active"] .history {
        display: none;
      }
      .shell[data-mode="active"] .workbench {
        display: grid;
        grid-template-columns: 360px minmax(0, 1fr);
        gap: 18px;
      }
      .panel {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: 0 20px 54px var(--shadow), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(16px);
      }
      .panel-header {
        padding: 15px 16px;
        border-bottom: 1px solid var(--line);
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
      }
      .panel-title {
        margin: 0;
        font-family: var(--mono);
        font-size: 13px;
        letter-spacing: 0;
        text-transform: uppercase;
      }
      .status-pill {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 10px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
      }
      .status-pill.complete {
        border-color: rgba(110, 247, 177, 0.46);
        color: var(--mint);
      }
      .status-pill.error {
        border-color: rgba(255, 109, 122, 0.52);
        color: var(--red);
      }
      .panel-body {
        padding: 16px;
      }
      .status-copy {
        margin: 0 0 14px;
        color: var(--muted);
        line-height: 1.55;
      }
      .timeline {
        display: grid;
        gap: 10px;
      }
      .event {
        display: grid;
        grid-template-columns: 16px minmax(0, 1fr);
        gap: 10px;
        align-items: start;
      }
      .dot {
        width: 10px;
        height: 10px;
        margin-top: 6px;
        border-radius: 999px;
        background: var(--amber);
        box-shadow: 0 0 18px rgba(255, 203, 99, 0.38);
      }
      .event.complete .dot {
        background: var(--mint);
        box-shadow: 0 0 18px rgba(110, 247, 177, 0.38);
      }
      .event.error .dot {
        background: var(--red);
        box-shadow: 0 0 18px rgba(255, 109, 122, 0.4);
      }
      .event p {
        margin: 0;
        color: var(--text);
        line-height: 1.45;
      }
      .event time {
        display: block;
        margin-top: 3px;
        color: var(--dim);
        font-family: var(--mono);
        font-size: 12px;
      }
      .actions {
        margin-top: 16px;
      }
      .download {
        min-height: 48px;
        width: 100%;
      }
      .tabs {
        display: flex;
        gap: 8px;
        padding: 10px;
        border-bottom: 1px solid var(--line);
        overflow-x: auto;
      }
      .tab {
        min-height: 40px;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0 14px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-family: var(--mono);
        white-space: nowrap;
      }
      .tab.active {
        border-color: var(--line-strong);
        background: rgba(98, 230, 255, 0.1);
        color: var(--cyan);
      }
      .content {
        min-height: 660px;
      }
      h2 {
        margin: 24px 0 10px;
        font-size: 18px;
        letter-spacing: 0;
      }
      h2:first-child {
        margin-top: 0;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .metric, .resource, .signal, .empty-card {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(3, 10, 18, 0.58);
        min-width: 0;
      }
      .metric {
        padding: 14px;
      }
      .metric strong {
        display: block;
        color: var(--text);
        font-size: 26px;
        line-height: 1.05;
        overflow-wrap: anywhere;
      }
      .metric span {
        display: block;
        margin-top: 7px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
      }
      .resource-grid, .signal-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .resource, .signal, .empty-card {
        padding: 13px;
      }
      .resource strong, .signal strong {
        color: var(--text);
      }
      .resource p, .signal p, .empty-card p {
        margin: 7px 0 0;
        color: var(--muted);
        line-height: 1.5;
      }
      .resource code, pre {
        font-family: var(--mono);
      }
      .resource code {
        color: var(--cyan);
        overflow-wrap: anywhere;
      }
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tag {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 7px 10px;
        background: rgba(169, 162, 255, 0.08);
        color: var(--text);
        font-family: var(--mono);
        font-size: 12px;
      }
      .confidence {
        color: var(--mint);
        font-family: var(--mono);
        font-size: 12px;
        text-transform: uppercase;
      }
      pre {
        margin: 0;
        overflow: auto;
        max-height: 360px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #030810;
        color: #dff6ff;
      }
      iframe {
        width: 100%;
        height: 700px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: white;
      }
      .empty {
        color: var(--muted);
        line-height: 1.6;
      }
      .preview-placeholder {
        min-height: 520px;
        display: grid;
        place-items: center;
        border: 1px dashed var(--line-strong);
        border-radius: 8px;
        background: rgba(3, 10, 18, 0.48);
        text-align: center;
      }
      .preview-placeholder strong {
        display: block;
        margin-bottom: 8px;
        color: var(--text);
        font-size: 20px;
      }
      @media (max-width: 1020px) {
        .shell {
          padding: 18px;
        }
        .shell[data-mode="active"] .workbench {
          grid-template-columns: 1fr;
        }
        .metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 640px) {
        .brand-row, .search-row {
          grid-template-columns: 1fr;
          display: grid;
        }
        .beacon {
          white-space: normal;
        }
        .metrics {
          grid-template-columns: 1fr;
        }
        .primary-button {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell" data-mode="idle" data-status="idle">
      <section class="hero">
        <div class="search-console">
          <div class="brand-row">
            <div>
              <div class="eyebrow">RepoSite local intelligence workbench</div>
              <h1>Forge repository signals into a site.</h1>
            </div>
            <div class="beacon" id="mode-label">standby</div>
          </div>
          <form id="repo-form" class="repo-form">
            <div class="search-row">
              <label class="search-field">
                <input id="repo-url" name="repoUrl" placeholder="https://github.com/openai/openai-node" autocomplete="off" />
              </label>
              <button id="start-button" class="primary-button" type="submit">Generate</button>
            </div>
            <p class="hint" id="form-hint">Paste a public GitHub repository URL or owner/repo shorthand.</p>
            <label class="ai-option">
              <input id="use-ai" type="checkbox" />
              <span><strong>AI-assisted structure</strong>When enabled, extracted repository information is sent to OpenAI to arrange the presentation. Repository facts remain source-bound, and failures fall back to local rules.</span>
            </label>
          </form>
          <section id="history" class="history" aria-label="Recent repositories">
            <div class="history-header">
              <span>Recent targets</span>
              <span>local browser history</span>
            </div>
            <div id="history-list" class="history-list"></div>
          </section>
        </div>
      </section>
      <main class="workbench" aria-live="polite">
        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title">Generation stream</h2>
            <span id="status-pill" class="status-pill">idle</span>
          </div>
          <div class="panel-body">
            <p id="status" class="status-copy">Waiting for a GitHub repository target.</p>
            <div id="timeline" class="timeline"></div>
            <div class="actions">
              <a id="download" class="download" href="#" aria-disabled="true">Download ZIP</a>
            </div>
          </div>
        </section>
        <section class="panel content">
          <div class="tabs">
            <button class="tab active" type="button" data-tab="overview">Overview</button>
            <button class="tab" type="button" data-tab="resources">Resources</button>
            <button class="tab" type="button" data-tab="wiki">Code Wiki</button>
            <button class="tab" type="button" data-tab="preview">Preview</button>
          </div>
          <div id="content" class="panel-body">
            <div class="preview-placeholder">
              <p><strong>No generation started</strong><span class="empty">Generate a repository to inspect source signals, wiki coverage, and the site preview.</span></p>
            </div>
          </div>
        </section>
      </main>
    </div>
    <script>
      const historyKey = "reposite.recentRepositories";
      const maxHistory = 6;
      const state = {
        mode: "idle",
        job: null,
        resources: null,
        activeTab: "overview"
      };

      const shell = document.querySelector(".shell");
      const form = document.querySelector("#repo-form");
      const input = document.querySelector("#repo-url");
      const startButton = document.querySelector("#start-button");
      const useAiInput = document.querySelector("#use-ai");
      const statusEl = document.querySelector("#status");
      const statusPill = document.querySelector("#status-pill");
      const modeLabel = document.querySelector("#mode-label");
      const formHint = document.querySelector("#form-hint");
      const timelineEl = document.querySelector("#timeline");
      const contentEl = document.querySelector("#content");
      const downloadEl = document.querySelector("#download");
      const historyEl = document.querySelector("#history");
      const historyListEl = document.querySelector("#history-list");
      const tabs = Array.from(document.querySelectorAll(".tab"));

      renderHistory();
      renderMode("idle");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const repoUrl = input.value.trim();
        if (!repoUrl) {
          renderStatus("error", "Enter a GitHub repository URL first.");
          formHint.textContent = "A repository target is required before generation can start.";
          return;
        }

        saveHistory(repoUrl);
        renderHistory();
        renderMode("active");
        renderStatus("submitting", "Creating local generation job...");
        startButton.disabled = true;
        timelineEl.innerHTML = "";
        state.job = null;
        state.resources = null;
        downloadEl.setAttribute("aria-disabled", "true");
        downloadEl.href = "#";
        renderContent();

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ repoUrl: repoUrl, useAi: useAiInput.checked })
        });

        if (!response.ok) {
          const error = await response.json();
          renderStatus("error", error.error || "Could not start job.");
          startButton.disabled = false;
          return;
        }

        state.job = await response.json();
        renderStatus("running", "Generation started. Listening for repository signals...");
        connectEvents(state.job.id);
      });

      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          state.activeTab = tab.dataset.tab;
          tabs.forEach((item) => item.classList.toggle("active", item === tab));
          renderContent();
        });
      });

      function connectEvents(id) {
        const source = new EventSource("/api/jobs/" + id + "/events");

        ["step", "complete", "error"].forEach((type) => {
          source.addEventListener(type, async (event) => {
            const payload = JSON.parse(event.data);
            appendEvent(payload);

            if (type === "complete") {
              renderStatus("complete", "Ready. Preview and ZIP now use the same static presentation files.");
              source.close();
              await loadResources(id);
              downloadEl.href = "/api/jobs/" + id + "/download";
              downloadEl.removeAttribute("aria-disabled");
              startButton.disabled = false;
            }

            if (type === "error") {
              renderStatus("error", "Generation failed.");
              source.close();
              startButton.disabled = false;
              renderContent();
            }
          });
        });
      }

      async function loadResources(id) {
        const response = await fetch("/api/jobs/" + id + "/resources");
        state.resources = await response.json();
        renderContent();
      }

      function renderMode(mode) {
        state.mode = mode;
        shell.dataset.mode = mode === "idle" ? "idle" : "active";
        modeLabel.textContent = mode === "idle" ? "standby" : "analysis running";
      }

      function renderStatus(status, message) {
        shell.dataset.status = status;
        statusEl.textContent = message;
        statusPill.textContent = status;
        statusPill.className = "status-pill " + (status === "complete" || status === "error" ? status : "");
        formHint.textContent = status === "error"
          ? "Check the repository URL and try again."
          : "Paste a public GitHub repository URL or owner/repo shorthand.";
      }

      function appendEvent(event) {
        const item = document.createElement("div");
        item.className = "event " + event.type;
        item.innerHTML = '<div class="dot"></div><div><p></p><time></time></div>';
        item.querySelector("p").textContent = event.message;
        item.querySelector("time").textContent = new Date(event.timestamp).toLocaleTimeString();
        timelineEl.appendChild(item);
      }

      function renderContent() {
        if (!state.resources) {
          contentEl.innerHTML = renderPending();
          return;
        }

        const renderers = {
          overview: renderOverview,
          resources: renderResources,
          wiki: renderWiki,
          preview: renderPreview
        };
        contentEl.innerHTML = renderers[state.activeTab]();
      }

      function renderPending() {
        const title = state.job ? "Building repository workspace" : "No generation started";
        const copy = state.job
          ? "Preview and wiki panels will activate when GitHub metadata, README, releases, and file tree signals are ready."
          : "Generate a repository to inspect source signals, wiki coverage, and the site preview.";
        return '<div class="preview-placeholder"><p><strong>' + title + '</strong><span class="empty">' + copy + '</span></p></div>';
      }

      function renderOverview() {
        const repo = state.resources.repository;
        const readme = state.resources.readme;
        return '<div class="metrics">' +
          metric(repo.stars, "Stars") +
          metric(repo.language || "not detected", "Primary language") +
          metric(repo.topics.length, "Topics") +
          metric(state.resources.releases.length, "Releases") +
          '</div>' +
          '<h2>' + escapeHtml(readme.title || repo.name) + '</h2>' +
          '<p class="empty">' + escapeHtml(readme.summary || repo.description || "No summary was detected in the README or repository metadata.") + '</p>' +
          '<h2>Source Signals</h2>' +
          '<div class="signal-grid">' +
          signal("README title", readme.title ? "detected" : "not detected", "Parsed README") +
          signal("README summary", readme.summary ? "detected" : "not detected", "Parsed README") +
          signal("License", repo.license ? repo.license.name : "not detected", "GitHub metadata") +
          signal("Homepage", repo.homepage || "not detected", "GitHub metadata") +
          signal("Screenshots", String(state.resources.screenshots.length), "README images and repository image paths") +
          signal("Default branch", repo.defaultBranch, "GitHub metadata") +
          '</div>' +
          '<h2>Extracted Features</h2>' +
          listOrEmpty(readme.features, "No feature list was detected in README sections.") +
          '<h2>Topics</h2>' +
          tagList(repo.topics, "No repository topics were found in GitHub metadata.");
      }

      function renderResources() {
        return '<h2>Configuration Files</h2>' +
          configCards(state.resources.knowledgeBase.configFiles) +
          '<h2>Repository Files</h2>' +
          resourceCards(state.resources.files.slice(0, 120));
      }

      function renderWiki() {
        const wiki = state.resources.knowledgeBase;
        return '<div class="metrics">' +
          metric(wiki.projectStructure.length, "Top-level paths") +
          metric(wiki.techStack.length, "Detected stack") +
          metric(wiki.entryFiles.length, "Entry files") +
          metric(wiki.configFiles.length, "Config files") +
          '</div>' +
          '<h2>Detection Signals</h2>' +
          '<div class="signal-grid">' + wiki.detectionSignals.map((item) =>
            '<div class="signal"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.value) + '</p><p><span class="confidence">' + escapeHtml(item.confidence) + '</span> · ' + escapeHtml(item.source) + '</p></div>'
          ).join("") + '</div>' +
          '<h2>Technology Stack</h2>' + tagList(wiki.techStack, "No stack markers were detected from config files or file extensions.") +
          '<h2>Entry Files</h2>' + tagList(wiki.entryFiles, "No common entry file names were detected in the repository tree.") +
          '<h2>File Mix</h2>' +
          '<div class="resource-grid">' + wiki.fileTypeDistribution.map((item) =>
            '<div class="resource"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(String(item.count)) + ' files</p></div>'
          ).join("") + '</div>' +
          '<h2>Top Directories</h2>' +
          '<div class="resource-grid">' + wiki.directorySummaries.map((item) =>
            '<div class="resource"><strong>' + escapeHtml(item.path) + '</strong><p>' + escapeHtml(item.summary) + '</p></div>'
          ).join("") + '</div>' +
          '<h2>Key Configuration</h2>' + configCards(wiki.configFiles) +
          '<h2>Module Map</h2><div class="resource-grid">' +
          wiki.moduleMap.map((item) => '<div class="resource"><strong>' + escapeHtml(item.heading) + '</strong><p>' + escapeHtml(item.content) + '</p></div>').join("") +
          '</div><h2>Mermaid Source</h2><pre>' + escapeHtml(wiki.mermaid) + '</pre>';
      }

      function renderPreview() {
        if (!state.job || !state.resources) {
          return renderPending();
        }
        return '<iframe title="Generated RepoSite preview" src="/preview/' + state.job.id + '/"></iframe>';
      }

      function metric(value, label) {
        return '<div class="metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
      }

      function signal(label, value, source) {
        return '<div class="signal"><strong>' + escapeHtml(label) + '</strong><p>' + escapeHtml(value) + '</p><p>' + escapeHtml(source) + '</p></div>';
      }

      function resourceCards(items) {
        if (!items.length) {
          return '<div class="empty-card"><p>No resources were found in the repository tree.</p></div>';
        }
        return '<div class="resource-grid">' + items.map((item) =>
          '<div class="resource"><code>' + escapeHtml(item.path) + '</code><p>' + escapeHtml(item.type) + (item.size ? " · " + item.size + " bytes" : "") + '</p></div>'
        ).join("") + '</div>';
      }

      function configCards(items) {
        if (!items.length) {
          return '<div class="empty-card"><p>No known configuration files were detected from the repository tree.</p></div>';
        }
        return '<div class="resource-grid">' + items.map((item) =>
          '<div class="resource"><code>' + escapeHtml(item.path) + '</code><p>' + escapeHtml(item.purpose) + '</p></div>'
        ).join("") + '</div>';
      }

      function tagList(items, emptyMessage) {
        return items.length
          ? '<div class="tag-row">' + items.map((item) => '<span class="tag">' + escapeHtml(item) + '</span>').join("") + '</div>'
          : '<div class="empty-card"><p>' + escapeHtml(emptyMessage) + '</p></div>';
      }

      function listOrEmpty(items, emptyMessage) {
        return items.length
          ? '<ul>' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>'
          : '<div class="empty-card"><p>' + escapeHtml(emptyMessage) + '</p></div>';
      }

      function renderHistory() {
        const history = readHistory();
        historyEl.classList.toggle("visible", history.length > 0);
        historyListEl.innerHTML = history.map((item) =>
          '<button class="history-chip" type="button" data-url="' + escapeAttribute(item) + '">' + escapeHtml(item) + '</button>'
        ).join("");
        Array.from(historyListEl.querySelectorAll(".history-chip")).forEach((button) => {
          button.addEventListener("click", () => {
            input.value = button.dataset.url || "";
            input.focus();
          });
        });
      }

      function readHistory() {
        try {
          const parsed = JSON.parse(localStorage.getItem(historyKey) || "[]");
          return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string").slice(0, maxHistory) : [];
        } catch {
          return [];
        }
      }

      function saveHistory(repoUrl) {
        const nextHistory = [repoUrl].concat(readHistory().filter((item) => item !== repoUrl)).slice(0, maxHistory);
        localStorage.setItem(historyKey, JSON.stringify(nextHistory));
      }

      function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char]));
      }

      function escapeAttribute(value) {
        return escapeHtml(value).replace(/"/g, "&quot;");
      }
    </script>
  </body>
</html>`;
}
