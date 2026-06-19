export function workbenchClientScript(): string {
  return `      const historyKey = "silentforge.recentRepositories";
      const legacyHistoryKey = "reposite.recentRepositories";
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
      const generationModeEl = document.querySelector("#generation-mode");
      const generationThemeEl = document.querySelector("#generation-theme");
      const chapterToggleEls = Array.from(document.querySelectorAll("[data-chapter-toggle]"));
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
          body: JSON.stringify({ repoUrl: repoUrl, useAi: useAiInput.checked, generationOptions: collectGenerationOptions() })
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
        return renderDiagnostics(state.resources.diagnostics) +
          '<div class="metrics">' +
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
          '</div><details class="mermaid-block"><summary>Mermaid source</summary><pre>' + escapeHtml(wiki.mermaid) + '</pre></details>';
      }

      function renderPreview() {
        if (!state.job || !state.resources) {
          return renderPending();
        }
        return '<div class="preview-frame"><iframe title="Generated SilentForge preview" src="/preview/' + state.job.id + '/"></iframe></div>';
      }

      function metric(value, label) {
        return '<div class="metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
      }

      function renderDiagnostics(diagnostics) {
        if (!diagnostics) {
          return "";
        }
        const percent = diagnostics.maxScore > 0 ? Math.round((diagnostics.score / diagnostics.maxScore) * 100) : 0;
        const dimensions = (diagnostics.dimensions || []).map((dimension) => {
          const dimPercent = dimension.maxScore > 0 ? Math.round((dimension.score / dimension.maxScore) * 100) : 0;
          const note = dimension.gaps.length > 0 ? dimension.gaps[0] : (dimension.strengths[0] || "No gaps detected.");
          const noteClass = dimension.gaps.length > 0 ? "dimension-gap" : "dimension-strength";
          return '<article class="dimension-card"><div class="dimension-card-header"><strong>' + escapeHtml(dimension.label) + '</strong><span>' + escapeHtml(String(dimension.score)) + '/' + escapeHtml(String(dimension.maxScore)) + '</span></div><div class="dimension-progress"><span style="width:' + dimPercent + '%"></span></div><p class="' + noteClass + '">' + escapeHtml(note) + '</p></article>';
        }).join("");
        return '<h2>Repository Readiness</h2>' +
          '<div class="readiness-progress" role="progressbar" aria-valuenow="' + diagnostics.score + '" aria-valuemin="0" aria-valuemax="' + diagnostics.maxScore + '"><div class="readiness-progress-bar" style="width:' + percent + '%"></div><span class="readiness-progress-label">' + escapeHtml(String(diagnostics.score)) + '/' + escapeHtml(String(diagnostics.maxScore)) + ' · ' + escapeHtml(diagnostics.grade) + '</span></div>' +
          (dimensions ? '<div class="dimension-grid">' + dimensions + '</div>' : "") +
          '<div class="signal-grid">' +
          signal("Top strengths", diagnostics.strengths.slice(0, 3).join(" · ") || "No strong signals yet.", "Repository diagnostics") +
          signal("Next improvements", diagnostics.recommendations.slice(0, 3).join(" · ") || "No immediate recommendations.", "Repository diagnostics") +
          '</div>';
      }

      function signal(label, value, source) {
        return '<div class="signal"><strong>' + escapeHtml(label) + '</strong><p>' + escapeHtml(value) + '</p><p class="signal-source">' + escapeHtml(source) + '</p></div>';
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
          ? '<ul class="feature-list">' + items.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") + '</ul>'
          : '<div class="empty-card"><p>' + escapeHtml(emptyMessage) + '</p></div>';
      }

      function collectGenerationOptions() {
        const mode = generationModeEl.value || "auto";
        const theme = generationThemeEl.value || "auto";
        const enabledChapters = chapterToggleEls
          .filter((item) => item.checked)
          .map((item) => item.dataset.chapterToggle)
          .filter(Boolean);
        return {
          ...(mode === "auto" ? {} : { mode: mode }),
          ...(theme === "auto" ? {} : { theme: theme }),
          enabledChapters: enabledChapters
        };
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
          const raw = localStorage.getItem(historyKey) || localStorage.getItem(legacyHistoryKey) || "[]";
          const parsed = JSON.parse(raw);
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
      }`;
}
