export function workbenchHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RepoSite Workbench</title>
    <style>
      :root {
        --ink: #191813;
        --muted: #6f6b60;
        --paper: #f4efe4;
        --panel: #fffbef;
        --line: #d6c9b2;
        --green: #216b5f;
        --red: #a13f2d;
        --blue: #224f76;
        --coal: #111315;
        --gold: #c58b2b;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        background:
          linear-gradient(90deg, rgba(17, 19, 21, 0.04) 1px, transparent 1px),
          linear-gradient(rgba(17, 19, 21, 0.04) 1px, transparent 1px),
          var(--paper);
        background-size: 22px 22px;
        color: var(--ink);
        font-family: ui-serif, Georgia, "Times New Roman", serif;
      }
      button, input {
        font: inherit;
      }
      .shell {
        min-height: 100vh;
        display: grid;
        grid-template-rows: auto 1fr;
      }
      header {
        border-bottom: 2px solid var(--ink);
        background: rgba(255, 251, 239, 0.92);
        backdrop-filter: blur(12px);
      }
      .masthead {
        max-width: 1440px;
        margin: 0 auto;
        padding: 18px 24px;
        display: grid;
        grid-template-columns: minmax(220px, 1fr) minmax(320px, 760px);
        gap: 24px;
        align-items: end;
      }
      .brand {
        display: grid;
        gap: 4px;
      }
      .eyebrow {
        color: var(--green);
        font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
        font-size: 12px;
        letter-spacing: 0;
        text-transform: uppercase;
      }
      h1 {
        margin: 0;
        font-size: clamp(32px, 5vw, 68px);
        line-height: 0.88;
        letter-spacing: 0;
      }
      .submit-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
      }
      input {
        width: 100%;
        border: 2px solid var(--ink);
        border-radius: 0;
        padding: 13px 14px;
        background: #fffef8;
        color: var(--ink);
        min-width: 0;
      }
      button, .download {
        border: 2px solid var(--ink);
        border-radius: 0;
        background: var(--ink);
        color: var(--panel);
        padding: 13px 16px;
        cursor: pointer;
        text-decoration: none;
        text-align: center;
        min-height: 48px;
      }
      button:disabled, .download[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: 0.55;
      }
      main {
        max-width: 1440px;
        width: 100%;
        margin: 0 auto;
        padding: 20px 24px 28px;
        display: grid;
        grid-template-columns: 360px minmax(0, 1fr);
        gap: 18px;
      }
      .panel {
        border: 2px solid var(--ink);
        background: var(--panel);
        min-width: 0;
      }
      .panel h2 {
        margin: 0;
        padding: 12px 14px;
        border-bottom: 2px solid var(--ink);
        font-size: 16px;
        font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      }
      .panel-body {
        padding: 14px;
      }
      .timeline {
        display: grid;
        gap: 10px;
      }
      .event {
        display: grid;
        grid-template-columns: 26px 1fr;
        gap: 10px;
        align-items: start;
      }
      .dot {
        width: 16px;
        height: 16px;
        margin-top: 2px;
        border: 2px solid var(--ink);
        background: var(--gold);
      }
      .event.complete .dot {
        background: var(--green);
      }
      .event.error .dot {
        background: var(--red);
      }
      .event p {
        margin: 0;
        line-height: 1.45;
      }
      .event time {
        color: var(--muted);
        font-size: 12px;
        font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      }
      .tabs {
        display: flex;
        border-bottom: 2px solid var(--ink);
        overflow-x: auto;
      }
      .tab {
        background: transparent;
        color: var(--ink);
        border-width: 0 2px 0 0;
        min-height: 44px;
        padding: 10px 14px;
      }
      .tab.active {
        background: var(--ink);
        color: var(--panel);
      }
      .content {
        min-height: 640px;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .metric {
        border: 1px solid var(--line);
        padding: 12px;
        background: #fffdf7;
      }
      .metric strong {
        display: block;
        font-size: 24px;
      }
      .metric span {
        color: var(--muted);
        font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
        font-size: 12px;
      }
      .resource-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .resource {
        border: 1px solid var(--line);
        padding: 12px;
        background: #fffdf7;
        min-width: 0;
      }
      .resource code, pre {
        font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
      }
      .resource code {
        overflow-wrap: anywhere;
      }
      pre {
        margin: 0;
        overflow: auto;
        max-height: 360px;
        padding: 14px;
        background: var(--coal);
        color: #f5ead5;
      }
      iframe {
        width: 100%;
        height: 680px;
        border: 0;
        background: white;
      }
      .empty {
        color: var(--muted);
        line-height: 1.6;
      }
      .actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      @media (max-width: 980px) {
        .masthead, main {
          grid-template-columns: 1fr;
        }
        .metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
      @media (max-width: 560px) {
        .submit-row {
          grid-template-columns: 1fr;
        }
        .metrics {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <div class="masthead">
          <div class="brand">
            <div class="eyebrow">RepoSite local workbench</div>
            <h1>Forge a repo into a site.</h1>
          </div>
          <form id="repo-form">
            <div class="submit-row">
              <input id="repo-url" name="repoUrl" placeholder="https://github.com/openai/openai-node" autocomplete="off" />
              <button id="start-button" type="submit">Generate</button>
            </div>
          </form>
        </div>
      </header>
      <main>
        <section class="panel">
          <h2>Process</h2>
          <div class="panel-body">
            <div id="status" class="empty">Waiting for a GitHub repository URL.</div>
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
            <p class="empty">Generated repository data will appear here while the site is built.</p>
          </div>
        </section>
      </main>
    </div>
    <script>
      const state = {
        job: null,
        resources: null,
        activeTab: "overview"
      };

      const form = document.querySelector("#repo-form");
      const input = document.querySelector("#repo-url");
      const startButton = document.querySelector("#start-button");
      const statusEl = document.querySelector("#status");
      const timelineEl = document.querySelector("#timeline");
      const contentEl = document.querySelector("#content");
      const downloadEl = document.querySelector("#download");
      const tabs = Array.from(document.querySelectorAll(".tab"));

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const repoUrl = input.value.trim();
        if (!repoUrl) {
          statusEl.textContent = "Enter a GitHub repository URL first.";
          return;
        }

        startButton.disabled = true;
        timelineEl.innerHTML = "";
        state.resources = null;
        renderContent();
        statusEl.textContent = "Creating local generation job...";
        downloadEl.setAttribute("aria-disabled", "true");
        downloadEl.href = "#";

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ repoUrl })
        });

        if (!response.ok) {
          const error = await response.json();
          statusEl.textContent = error.error ?? "Could not start job.";
          startButton.disabled = false;
          return;
        }

        state.job = await response.json();
        statusEl.textContent = "Generation started.";
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
              statusEl.textContent = "Ready.";
              source.close();
              await loadResources(id);
              downloadEl.href = "/api/jobs/" + id + "/download";
              downloadEl.removeAttribute("aria-disabled");
              startButton.disabled = false;
            }

            if (type === "error") {
              statusEl.textContent = "Generation failed.";
              source.close();
              startButton.disabled = false;
            }
          });
        });
      }

      async function loadResources(id) {
        const response = await fetch("/api/jobs/" + id + "/resources");
        state.resources = await response.json();
        renderContent();
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
          contentEl.innerHTML = '<p class="empty">Generated repository data will appear here while the site is built.</p>';
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

      function renderOverview() {
        const repo = state.resources.repository;
        const readme = state.resources.readme;
        return '<div class="metrics">' +
          metric(repo.stars, "Stars") +
          metric(repo.language ?? "n/a", "Language") +
          metric(repo.topics.length, "Topics") +
          metric(state.resources.releases.length, "Releases") +
          '</div>' +
          '<h2>' + escapeHtml(readme.title ?? repo.name) + '</h2>' +
          '<p>' + escapeHtml(readme.summary ?? repo.description ?? "Not documented in repository.") + '</p>' +
          '<h2>Extracted Features</h2>' +
          listOrEmpty(readme.features) +
          '<h2>Screenshots</h2>' +
          (state.resources.screenshots.length
            ? '<div class="resource-grid">' + state.resources.screenshots.map((image) => '<div class="resource"><code>' + escapeHtml(image.src) + '</code></div>').join("") + '</div>'
            : '<p class="empty">No screenshots were found.</p>');
      }

      function renderResources() {
        return '<h2>Configuration Files</h2>' +
          resourceCards(state.resources.configFiles) +
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
          '<h2>Technology Stack</h2>' + listOrEmpty(wiki.techStack) +
          '<h2>Entry Files</h2>' + listOrEmpty(wiki.entryFiles) +
          '<h2>Module Map</h2><div class="resource-grid">' +
          wiki.moduleMap.map((item) => '<div class="resource"><strong>' + escapeHtml(item.heading) + '</strong><p>' + escapeHtml(item.content) + '</p></div>').join("") +
          '</div><h2>Mermaid</h2><pre>' + escapeHtml(wiki.mermaid) + '</pre>';
      }

      function renderPreview() {
        return state.job
          ? '<iframe title="Generated RepoSite preview" src="/preview/' + state.job.id + '"></iframe>'
          : '<p class="empty">Preview is not ready.</p>';
      }

      function metric(value, label) {
        return '<div class="metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
      }

      function resourceCards(items) {
        if (!items.length) {
          return '<p class="empty">No resources found.</p>';
        }
        return '<div class="resource-grid">' + items.map((item) =>
          '<div class="resource"><code>' + escapeHtml(item.path) + '</code><p>' + escapeHtml(item.type) + (item.size ? " · " + item.size + " bytes" : "") + '</p></div>'
        ).join("") + '</div>';
      }

      function listOrEmpty(items) {
        return items.length
          ? '<ul>' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>'
          : '<p class="empty">Not documented in repository.</p>';
      }

      function escapeHtml(value) {
        return value.replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char]));
      }
    </script>
  </body>
</html>`;
}
