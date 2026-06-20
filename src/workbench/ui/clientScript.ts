export function workbenchClientScript(i18nJson: string, workflowTemplateJson: string, workflowPathJson: string): string {
  return `      const I18N = ${i18nJson};
      const PAGES_WORKFLOW_TEMPLATE = ${workflowTemplateJson};
      const PAGES_WORKFLOW_PATH = ${workflowPathJson};
      const localeKey = "silentforge.locale";
      const uiThemeKey = "silentforge.uiTheme";
      const githubTokenKey = "silentforge.githubToken";
      const rememberGithubTokenKey = "silentforge.rememberGithubToken";
      const openaiApiKeyKey = "silentforge.openaiApiKey";
      const rememberAiCredentialsKey = "silentforge.rememberAiCredentials";
      const generationSettingsKey = "silentforge.generationSettings";
      const historyKey = "silentforge.recentRepositories";
      const legacyHistoryKey = "reposite.recentRepositories";
      const defaultChapterKinds = [
        "features",
        "visuals",
        "usage",
        "readme-insights",
        "technology",
        "architecture",
        "resources"
      ];
      const maxHistory = 6;
      const savedSettings = {
        githubToken: undefined,
        rememberGithubToken: false,
        useAi: false,
        openaiApiKey: undefined,
        openaiBaseUrl: "",
        openaiModel: "",
        rememberAiCredentials: false,
        mode: "auto",
        theme: "auto",
        enabledChapters: defaultChapterKinds.slice()
      };
      const aiBackendStatus = {
        codex: { found: false, loggedIn: false, path: "", detail: "" },
        server: { hasOpenAiKey: false, hasOpenAiBaseUrl: false, hasOpenAiModel: false }
      };
      const state = {
        mode: "idle",
        job: null,
        resources: null,
        activeTab: "overview",
        locale: "en"
      };

      const shell = document.querySelector(".shell");
      const repoConsole = document.querySelector("#repo-console");
      const input = document.querySelector("#repo-url");
      const startButton = document.querySelector("#start-button");
      const useAiInput = document.querySelector("#use-ai");
      const aiSettingsPanel = document.querySelector("#ai-settings-panel");
      const codexStatusEl = document.querySelector("#codex-status");
      const openaiApiKeyInput = document.querySelector("#openai-api-key");
      const openaiBaseUrlInput = document.querySelector("#openai-base-url");
      const openaiModelInput = document.querySelector("#openai-model");
      const rememberAiCredentialsInput = document.querySelector("#remember-ai-credentials");
      const githubTokenInput = document.querySelector("#github-token");
      const rememberGithubTokenInput = document.querySelector("#remember-github-token");
      const statusEl = document.querySelector("#status");
      const statusPill = document.querySelector("#status-pill");
      const modeLabel = document.querySelector("#mode-label");
      const formHint = document.querySelector("#form-hint");
      const timelineEl = document.querySelector("#timeline");
      const contentEl = document.querySelector("#content");
      const downloadEl = document.querySelector("#download");
      const backHomeButton = document.querySelector("#back-home-button");
      const tabsActionsEl = document.querySelector("#tabs-actions");
      const deployButton = document.querySelector("#deploy-button");
      const settingsDialog = document.querySelector("#settings-dialog");
      const openSettingsButton = document.querySelector("#open-settings");
      const settingsDialogClose = document.querySelector("#settings-dialog-close");
      const deployDialog = document.querySelector("#deploy-dialog");
      const deployDialogClose = document.querySelector("#deploy-dialog-close");
      const deployCommandsEl = document.querySelector("#deploy-commands");
      const historyEl = document.querySelector("#history");
      const historyListEl = document.querySelector("#history-list");
      const generationModeEl = document.querySelector("#generation-mode");
      const generationThemeEl = document.querySelector("#generation-theme");
      const chapterToggleEls = Array.from(document.querySelectorAll("[data-chapter-toggle]"));
      const tabs = Array.from(document.querySelectorAll(".tab"));
      const langPills = Array.from(document.querySelectorAll(".lang-pill"));
      const themePills = Array.from(document.querySelectorAll(".theme-pill"));
      const saveSettingsButton = document.querySelector("#save-settings");
      const settingsSummaryEl = document.querySelector("#settings-summary");
      const settingsSaveHintEl = document.querySelector("#settings-save-hint");
      const minGithubTokenLength = 10;
      const minOpenAiKeyLength = 8;

      function normalizeOpenAiApiKey(value) {
        if (typeof value !== "string") {
          return undefined;
        }
        const token = value.trim();
        if (token.length < minOpenAiKeyLength) {
          return undefined;
        }
        return token;
      }

      function normalizeOptionalText(value) {
        if (typeof value !== "string") {
          return "";
        }
        return value.trim();
      }

      function normalizeGithubToken(value) {
        if (typeof value !== "string") {
          return undefined;
        }
        const token = value.trim();
        if (token.length < minGithubTokenLength) {
          return undefined;
        }
        return token;
      }

      function readSettingsForm() {
        const enabledChapters = chapterToggleEls
          .filter((item) => item.checked)
          .map((item) => item.dataset.chapterToggle)
          .filter(Boolean);
        return {
          githubToken: normalizeGithubToken(githubTokenInput ? githubTokenInput.value : undefined),
          rememberGithubToken: Boolean(rememberGithubTokenInput?.checked),
          useAi: Boolean(useAiInput?.checked),
          openaiApiKey: normalizeOpenAiApiKey(openaiApiKeyInput ? openaiApiKeyInput.value : undefined),
          openaiBaseUrl: normalizeOptionalText(openaiBaseUrlInput ? openaiBaseUrlInput.value : ""),
          openaiModel: normalizeOptionalText(openaiModelInput ? openaiModelInput.value : ""),
          rememberAiCredentials: Boolean(rememberAiCredentialsInput?.checked),
          mode: generationModeEl?.value || "auto",
          theme: generationThemeEl?.value || "auto",
          enabledChapters: enabledChapters.length ? enabledChapters : defaultChapterKinds.slice()
        };
      }

      function syncAiSettingsPanel() {
        if (!aiSettingsPanel) return;
        aiSettingsPanel.classList.toggle("is-disabled", !Boolean(useAiInput?.checked));
      }

      function applySettingsToForm(settings) {
        if (generationModeEl) {
          generationModeEl.value = settings.mode || "auto";
        }
        if (generationThemeEl) {
          generationThemeEl.value = settings.theme || "auto";
        }
        if (useAiInput) {
          useAiInput.checked = Boolean(settings.useAi);
        }
        if (openaiApiKeyInput) {
          openaiApiKeyInput.value = settings.openaiApiKey || "";
        }
        if (openaiBaseUrlInput) {
          openaiBaseUrlInput.value = settings.openaiBaseUrl || "";
        }
        if (openaiModelInput) {
          openaiModelInput.value = settings.openaiModel || "";
        }
        if (rememberAiCredentialsInput) {
          rememberAiCredentialsInput.checked = Boolean(settings.rememberAiCredentials);
        }
        syncAiSettingsPanel();
        if (rememberGithubTokenInput) {
          rememberGithubTokenInput.checked = Boolean(settings.rememberGithubToken);
        }
        if (githubTokenInput) {
          githubTokenInput.value = settings.githubToken || "";
        }
        const enabled = new Set(settings.enabledChapters || defaultChapterKinds);
        chapterToggleEls.forEach((item) => {
          item.checked = enabled.has(item.dataset.chapterToggle);
        });
      }

      function persistSavedSettings(settings) {
        try {
          localStorage.setItem(
            generationSettingsKey,
            JSON.stringify({
              useAi: settings.useAi,
              openaiBaseUrl: settings.openaiBaseUrl,
              openaiModel: settings.openaiModel,
              rememberAiCredentials: settings.rememberAiCredentials,
              mode: settings.mode,
              theme: settings.theme,
              enabledChapters: settings.enabledChapters
            })
          );
          if (settings.rememberAiCredentials && settings.openaiApiKey) {
            localStorage.setItem(rememberAiCredentialsKey, "true");
            localStorage.setItem(openaiApiKeyKey, settings.openaiApiKey);
          } else {
            localStorage.removeItem(rememberAiCredentialsKey);
            localStorage.removeItem(openaiApiKeyKey);
          }
          if (settings.rememberGithubToken && settings.githubToken) {
            localStorage.setItem(rememberGithubTokenKey, "true");
            localStorage.setItem(githubTokenKey, settings.githubToken);
          } else {
            localStorage.removeItem(rememberGithubTokenKey);
            localStorage.removeItem(githubTokenKey);
          }
        } catch {
          // Ignore storage failures.
        }
      }

      function loadSavedSettings() {
        let nextSettings = {
          githubToken: undefined,
          rememberGithubToken: false,
          useAi: false,
          openaiApiKey: undefined,
          openaiBaseUrl: "",
          openaiModel: "",
          rememberAiCredentials: false,
          mode: "auto",
          theme: "auto",
          enabledChapters: defaultChapterKinds.slice()
        };
        try {
          const raw = localStorage.getItem(generationSettingsKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === "object") {
              nextSettings = {
                ...nextSettings,
                useAi: Boolean(parsed.useAi),
                openaiBaseUrl: typeof parsed.openaiBaseUrl === "string" ? parsed.openaiBaseUrl : "",
                openaiModel: typeof parsed.openaiModel === "string" ? parsed.openaiModel : "",
                rememberAiCredentials: Boolean(parsed.rememberAiCredentials),
                mode: typeof parsed.mode === "string" ? parsed.mode : "auto",
                theme: typeof parsed.theme === "string" ? parsed.theme : "auto",
                enabledChapters: Array.isArray(parsed.enabledChapters)
                  ? parsed.enabledChapters.filter((item) => typeof item === "string")
                  : defaultChapterKinds.slice()
              };
            }
          }
          if (localStorage.getItem(rememberAiCredentialsKey) === "true") {
            nextSettings.rememberAiCredentials = true;
            nextSettings.openaiApiKey = normalizeOpenAiApiKey(localStorage.getItem(openaiApiKeyKey));
          }
          if (localStorage.getItem(rememberGithubTokenKey) === "true") {
            nextSettings.rememberGithubToken = true;
            nextSettings.githubToken = normalizeGithubToken(localStorage.getItem(githubTokenKey));
          }
        } catch {
          // Ignore storage failures.
        }
        Object.assign(savedSettings, nextSettings);
        applySettingsToForm(savedSettings);
        renderSettingsSummary();
      }

      function saveSettings() {
        const nextSettings = readSettingsForm();
        Object.assign(savedSettings, nextSettings);
        persistSavedSettings(savedSettings);
        renderSettingsSummary();
        if (settingsSaveHintEl) {
          settingsSaveHintEl.hidden = false;
          window.setTimeout(() => {
            settingsSaveHintEl.hidden = true;
          }, 1800);
        }
      }

      function renderSettingsSummary() {
        if (!settingsSummaryEl) return;
        const parts = [];
        if (savedSettings.githubToken) {
          parts.push(t("settingsSummaryToken"));
        }
        if (savedSettings.useAi) {
          parts.push(
            aiBackendStatus.codex.loggedIn ? t("settingsSummaryAiCodex") : t("settingsSummaryAiOpenAi")
          );
        }
        if (savedSettings.mode !== "auto" || savedSettings.theme !== "auto") {
          parts.push(t("settingsSummaryOutput"));
        }
        settingsSummaryEl.textContent = parts.length ? parts.join(" · ") : t("settingsSummaryDefault");
      }

      function bindWorkbenchSettings() {
        if (!settingsDialog) return;
        settingsDialog.querySelectorAll(".info-button").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
          });
        });
        openSettingsButton?.addEventListener("click", () => {
          void openSettingsDialog();
        });
        settingsDialogClose?.addEventListener("click", () => settingsDialog.close());
        settingsDialog.addEventListener("click", (event) => {
          if (event.target === settingsDialog) {
            settingsDialog.close();
          }
        });
        saveSettingsButton?.addEventListener("click", () => saveSettings());
        useAiInput?.addEventListener("change", () => syncAiSettingsPanel());
      }

      async function openSettingsDialog() {
        if (!settingsDialog) return;
        settingsDialog.showModal();
        await refreshCodexStatus();
      }

      async function refreshCodexStatus() {
        if (!codexStatusEl) return;
        codexStatusEl.dataset.state = "unknown";
        codexStatusEl.textContent = t("aiCodexChecking");
        try {
          const response = await fetch("/api/ai/status");
          if (!response.ok) {
            throw new Error("status unavailable");
          }
          const payload = await response.json();
          aiBackendStatus.codex = payload.codex || aiBackendStatus.codex;
          aiBackendStatus.server = payload.server || aiBackendStatus.server;
          renderCodexStatus();
          renderSettingsSummary();
        } catch {
          codexStatusEl.dataset.state = "missing";
          codexStatusEl.textContent = t("aiCodexMissing");
        }
      }

      function renderCodexStatus() {
        if (!codexStatusEl) return;
        const codex = aiBackendStatus.codex;
        if (codex.loggedIn) {
          codexStatusEl.dataset.state = "ready";
          codexStatusEl.textContent = codex.path
            ? t("aiCodexReady") + " " + t("aiCodexDetail", { path: codex.path })
            : t("aiCodexReady");
          return;
        }
        if (codex.found) {
          codexStatusEl.dataset.state = "logged-out";
          codexStatusEl.textContent = t("aiCodexLoggedOut");
          return;
        }
        codexStatusEl.dataset.state = "missing";
        codexStatusEl.textContent = t("aiCodexMissing");
      }

      function savedOpenAiApiKey() {
        return normalizeOpenAiApiKey(savedSettings.openaiApiKey);
      }

      function buildAiConfigPayload() {
        const aiConfig = {};
        const apiKey = savedOpenAiApiKey();
        if (apiKey) {
          aiConfig.openaiApiKey = apiKey;
        }
        if (savedSettings.openaiBaseUrl) {
          aiConfig.openaiBaseUrl = savedSettings.openaiBaseUrl;
        }
        if (savedSettings.openaiModel) {
          aiConfig.openaiModel = savedSettings.openaiModel;
        }
        return Object.keys(aiConfig).length ? aiConfig : undefined;
      }

      function savedGithubToken() {
        return normalizeGithubToken(savedSettings.githubToken);
      }

      function savedGenerationOptions() {
        return {
          locale: state.locale,
          ...(savedSettings.mode === "auto" ? {} : { mode: savedSettings.mode }),
          ...(savedSettings.theme === "auto" ? {} : { theme: savedSettings.theme }),
          enabledChapters: savedSettings.enabledChapters.slice()
        };
      }

      function t(key, params) {
        const catalog = I18N[state.locale] || I18N.en;
        let text = catalog[key] || I18N.en[key] || key;
        if (params) {
          Object.entries(params).forEach(([name, value]) => {
            text = text.replaceAll("{" + name + "}", String(value));
          });
        }
        return text;
      }

      function storedUiTheme() {
        try {
          const stored = localStorage.getItem(uiThemeKey);
          if (stored === "light" || stored === "dark") {
            return stored;
          }
        } catch {
          // Ignore storage failures.
        }
        return null;
      }

      function systemUiTheme() {
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      }

      function applyTheme(theme, persist) {
        const uiTheme = theme === "light" || theme === "dark" ? theme : systemUiTheme();
        document.documentElement.dataset.uiTheme = uiTheme;
        if (persist) {
          try {
            localStorage.setItem(uiThemeKey, uiTheme);
          } catch {
            // Ignore storage failures.
          }
        }
        themePills.forEach((pill) => pill.classList.toggle("active", pill.dataset.uiTheme === uiTheme));
      }

      function syncUiTheme(persist) {
        applyTheme(storedUiTheme(), persist);
      }

      function applyLocale(locale) {
        state.locale = locale === "zh" ? "zh" : "en";
        document.documentElement.lang = state.locale === "zh" ? "zh-CN" : "en";
        localStorage.setItem(localeKey, state.locale);
        langPills.forEach((pill) => pill.classList.toggle("active", pill.dataset.locale === state.locale));
        document.querySelectorAll("[data-i18n]").forEach((node) => {
          node.textContent = t(node.getAttribute("data-i18n"));
        });
        document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
          node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
        });
        document.querySelectorAll("[data-i18n-option]").forEach((node) => {
          node.textContent = t(node.getAttribute("data-i18n-option"));
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
          node.setAttribute("placeholder", t(node.getAttribute("data-i18n-placeholder")));
        });
        const titleNode = document.querySelector("title[data-i18n]");
        if (titleNode) {
          document.title = t(titleNode.getAttribute("data-i18n"));
        }
        if (state.mode === "idle") {
          modeLabel.textContent = t("standby");
        } else {
          modeLabel.textContent = t("running");
        }
        if (shell.dataset.status === "idle") {
          statusEl.textContent = t("statusWaiting");
          statusPill.textContent = t("statusIdle");
        }
        if (state.resources) {
          renderContent();
        }
        renderSettingsSummary();
        renderCodexStatus();
      }

      langPills.forEach((pill) => {
        pill.addEventListener("click", () => applyLocale(pill.dataset.locale));
      });

      themePills.forEach((pill) => {
        pill.addEventListener("click", () => applyTheme(pill.dataset.uiTheme, true));
      });

      syncUiTheme(false);
      window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
        if (!storedUiTheme()) {
          syncUiTheme(false);
        }
      });

      try {
        applyLocale(localStorage.getItem(localeKey) || "en");
      } catch {
        applyLocale("en");
      }

      bindWorkbenchSettings();
      loadSavedSettings();
      void refreshCodexStatus();
      if (window.location.search) {
        const params = new URLSearchParams(window.location.search);
        const legacyRepoUrl = params.get("repoUrl");
        if (legacyRepoUrl && input) {
          input.value = legacyRepoUrl;
        }
        window.history.replaceState({}, "", window.location.pathname);
      }
      backHomeButton?.addEventListener("click", () => resetToHome());
      deployButton?.addEventListener("click", () => {
        if (!state.resources) {
          return;
        }
        renderDeployCommands();
        deployDialog?.showModal();
      });
      deployDialogClose?.addEventListener("click", () => deployDialog?.close());
      deployDialog?.addEventListener("click", (event) => {
        if (event.target === deployDialog) {
          deployDialog.close();
        }
      });

      renderHistory();
      renderMode("idle");

      async function startGeneration() {
        const repoUrl = input.value.trim();
        if (!repoUrl) {
          renderStatus("error", t("urlRequired"));
          formHint.textContent = t("hintRequired");
          return;
        }

        saveSettings();
        saveHistory(repoUrl);
        renderHistory();
        renderMode("active");
        renderStatus("submitting", t("creatingJob"));
        updatePostGenerationActions(false);
        startButton.disabled = true;
        timelineEl.innerHTML = "";
        state.job = null;
        state.resources = null;
        downloadEl.setAttribute("aria-disabled", "true");
        downloadEl.href = "#";
        renderContent();

        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-silentforge-locale": state.locale
          },
          body: JSON.stringify({
            repoUrl: repoUrl,
            useAi: savedSettings.useAi,
            ...(savedGithubToken() ? { githubToken: savedGithubToken() } : {}),
            ...(savedSettings.useAi && buildAiConfigPayload() ? { aiConfig: buildAiConfigPayload() } : {}),
            generationOptions: savedGenerationOptions()
          })
        });

        if (!response.ok) {
          const error = await response.json();
          renderStatus("error", error.error || t("couldNotStart"));
          startButton.disabled = false;
          return;
        }

        state.job = await response.json();
        renderStatus("running", t("generationStarted"));
        connectEvents(state.job.id);
      }

      startButton?.addEventListener("click", () => {
        void startGeneration();
      });

      input?.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          void startGeneration();
        }
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
              renderStatus("complete", t("generationComplete"));
              source.close();
              state.activeTab = "preview";
              tabs.forEach((item) => item.classList.toggle("active", item.dataset.tab === "preview"));
              await loadResources(id);
              downloadEl.href = "/api/jobs/" + id + "/download";
              downloadEl.removeAttribute("aria-disabled");
              startButton.disabled = false;
              updatePostGenerationActions(true);
            }

            if (type === "error") {
              renderStatus("error", t("generationFailed"));
              source.close();
              startButton.disabled = false;
              updatePostGenerationActions(true);
              renderContent();
            }
          });
        });
      }

      async function loadResources(id) {
        const response = await fetch("/api/jobs/" + id + "/resources", {
          headers: { "x-silentforge-locale": state.locale }
        });
        state.resources = await response.json();
        renderContent();
      }

      function renderMode(mode) {
        state.mode = mode;
        shell.dataset.mode = mode === "idle" ? "idle" : "active";
        modeLabel.textContent = mode === "idle" ? t("standby") : t("running");
        if (backHomeButton) {
          backHomeButton.hidden = mode === "idle";
        }
      }

      function renderStatus(status, message) {
        shell.dataset.status = status;
        statusEl.textContent = message;
        statusPill.textContent = status;
        statusPill.className = "status-pill " + (status === "complete" || status === "error" ? status : "");
        formHint.textContent = status === "error" ? t("hintError") : t("hint");
        if (status !== "complete" && status !== "error") {
          updatePostGenerationActions(false);
        }
      }

      function updatePostGenerationActions(visible) {
        if (tabsActionsEl) {
          tabsActionsEl.hidden = !visible;
        }
        if (deployButton) {
          deployButton.disabled = !visible || !state.resources;
        }
        if (visible && state.resources) {
          renderDeployCommands();
        }
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
        if (state.activeTab === "overview") {
          bindCreatorActions(contentEl);
        }
      }

      function resetToHome() {
        if (deployDialog?.open) {
          deployDialog.close();
        }
        if (settingsDialog?.open) {
          settingsDialog.close();
        }
        renderMode("idle");
        shell.dataset.status = "idle";
        state.job = null;
        state.resources = null;
        state.activeTab = "overview";
        timelineEl.innerHTML = "";
        statusEl.textContent = t("statusWaiting");
        statusPill.textContent = t("statusIdle");
        statusPill.className = "status-pill";
        formHint.textContent = t("hint");
        downloadEl.setAttribute("aria-disabled", "true");
        downloadEl.href = "#";
        startButton.disabled = false;
        updatePostGenerationActions(false);
        tabs.forEach((item) => item.classList.toggle("active", item.dataset.tab === "overview"));
        renderContent();
        window.scrollTo({ top: 0, behavior: "smooth" });
        input.focus();
      }

      function renderPending() {
        const title = state.job ? t("buildingTitle") : t("pendingTitle");
        const copy = state.job ? t("buildingBody") : t("pendingBody");
        return '<div class="preview-placeholder"><p><strong>' + escapeHtml(title) + '</strong><span class="empty">' + escapeHtml(copy) + '</span></p></div>';
      }

      function renderOverview() {
        const repo = state.resources.repository;
        const readme = state.resources.readme;
        return renderDiagnostics(state.resources.diagnostics) +
          '<div class="metrics">' +
          metric(repo.stars, t("stars")) +
          metric(repo.language || t("notDetected"), t("primaryLanguage")) +
          metric(repo.topics.length, t("topics")) +
          metric(state.resources.releases.length, t("releases")) +
          '</div>' +
          '<h2>' + escapeHtml(readme.title || repo.name) + '</h2>' +
          '<p class="empty">' + escapeHtml(readme.summary || repo.description || t("noSummary")) + '</p>' +
          '<h2>' + escapeHtml(t("sourceSignals")) + '</h2>' +
          '<div class="signal-grid">' +
          signal(t("readmeTitle"), readme.title ? t("detected") : t("notDetected"), t("parsedReadme")) +
          signal(t("readmeSummary"), readme.summary ? t("detected") : t("notDetected"), t("parsedReadme")) +
          signal(t("license"), repo.license ? repo.license.name : t("notDetected"), t("githubMetadata")) +
          signal(t("homepage"), repo.homepage || t("notDetected"), t("githubMetadata")) +
          signal(t("screenshots"), String(state.resources.screenshots.length), t("screenshotsSource")) +
          signal(t("defaultBranch"), repo.defaultBranch, t("githubMetadata")) +
          '</div>' +
          '<h2>' + escapeHtml(t("extractedFeatures")) + '</h2>' +
          listOrEmpty(readme.features, t("noFeatures")) +
          '<h2>' + escapeHtml(t("topics")) + '</h2>' +
          tagList(repo.topics, t("noTopics"));
      }

      function renderResources() {
        return '<h2>' + escapeHtml(t("configFiles")) + '</h2>' +
          configCards(state.resources.knowledgeBase.configFiles) +
          '<h2>' + escapeHtml(t("repoFiles")) + '</h2>' +
          resourceCards(state.resources.files.slice(0, 120));
      }

      function renderWiki() {
        const wiki = state.resources.knowledgeBase;
        return '<div class="metrics">' +
          metric(wiki.projectStructure.length, t("topLevelPaths")) +
          metric(wiki.techStack.length, t("detectedStack")) +
          metric(wiki.entryFiles.length, t("entryFiles")) +
          metric(wiki.configFiles.length, t("configFilesCount")) +
          '</div>' +
          '<h2>' + escapeHtml(t("detectionSignals")) + '</h2>' +
          '<div class="signal-grid">' + wiki.detectionSignals.map((item) =>
            '<div class="signal"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(item.value) + '</p><p><span class="confidence">' + escapeHtml(item.confidence) + '</span> · ' + escapeHtml(item.source) + '</p></div>'
          ).join("") + '</div>' +
          '<h2>' + escapeHtml(t("technologyStack")) + '</h2>' + tagList(wiki.techStack, t("noStack")) +
          '<h2>' + escapeHtml(t("entryFiles")) + '</h2>' + tagList(wiki.entryFiles, t("noEntryFiles")) +
          '<h2>' + escapeHtml(t("fileMix")) + '</h2>' +
          '<div class="resource-grid">' + wiki.fileTypeDistribution.map((item) =>
            '<div class="resource"><strong>' + escapeHtml(item.label) + '</strong><p>' + escapeHtml(t("filesCount", { count: item.count })) + '</p></div>'
          ).join("") + '</div>' +
          '<h2>' + escapeHtml(t("topDirectories")) + '</h2>' +
          '<div class="resource-grid">' + wiki.directorySummaries.map((item) =>
            '<div class="resource"><strong>' + escapeHtml(item.path) + '</strong><p>' + escapeHtml(item.summary) + '</p></div>'
          ).join("") + '</div>' +
          '<h2>' + escapeHtml(t("keyConfiguration")) + '</h2>' + configCards(wiki.configFiles) +
          '<h2>' + escapeHtml(t("moduleMap")) + '</h2><div class="resource-grid">' +
          wiki.moduleMap.map((item) => '<div class="resource"><strong>' + escapeHtml(item.heading) + '</strong><p>' + escapeHtml(item.content) + '</p></div>').join("") +
          '</div><details class="mermaid-block"><summary>' + escapeHtml(t("mermaidSource")) + '</summary><pre>' + escapeHtml(wiki.mermaid) + '</pre></details>';
      }

      function renderPreview() {
        if (!state.job || !state.resources) {
          return renderPending();
        }
        return '<div class="preview-frame"><iframe title="' + escapeAttribute(t("previewTitle")) + '" src="/preview/' + state.job.id + '/"></iframe></div>';
      }

      function metric(value, label) {
        return '<div class="metric"><strong>' + escapeHtml(String(value)) + '</strong><span>' + escapeHtml(label) + '</span></div>';
      }

      function renderDiagnostics(diagnostics) {
        if (!diagnostics) {
          return "";
        }
        const grade = t("diagnostics.grade." + diagnostics.grade);
        const percent = diagnostics.maxScore > 0 ? Math.round((diagnostics.score / diagnostics.maxScore) * 100) : 0;
        const dimensions = (diagnostics.dimensions || []).map((dimension) => {
          const dimPercent = dimension.maxScore > 0 ? Math.round((dimension.score / dimension.maxScore) * 100) : 0;
          const note = dimension.gaps.length > 0 ? dimension.gaps[0] : (dimension.strengths[0] || t("noGaps"));
          const noteClass = dimension.gaps.length > 0 ? "dimension-gap" : "dimension-strength";
          return '<article class="dimension-card"><div class="dimension-card-header"><strong>' + escapeHtml(dimension.label) + '</strong><span>' + escapeHtml(String(dimension.score)) + '/' + escapeHtml(String(dimension.maxScore)) + '</span></div><div class="dimension-progress"><span style="width:' + dimPercent + '%"></span></div><p class="' + noteClass + '">' + escapeHtml(note) + '</p></article>';
        }).join("");
        return '<div class="diagnostics-panel">' +
          '<div class="creator-actions">' +
          '<span class="creator-actions-label">' + escapeHtml(t("creatorActionsTitle")) + '</span>' +
          copyButton("copy-diagnostics-markdown", t("copyDiagnosticsMarkdown")) +
          copyButton("copy-readme-badge", t("copyReadmeBadge")) +
          copyButton("copy-pages-workflow", t("copyPagesWorkflow")) +
          '</div>' +
          '<h2>' + escapeHtml(t("readinessTitle")) + '</h2>' +
          '<div class="readiness-progress" role="progressbar" aria-valuenow="' + diagnostics.score + '" aria-valuemin="0" aria-valuemax="' + diagnostics.maxScore + '"><div class="readiness-progress-bar" style="width:' + percent + '%"></div><span class="readiness-progress-label">' + escapeHtml(String(diagnostics.score)) + '/' + escapeHtml(String(diagnostics.maxScore)) + ' · ' + escapeHtml(grade) + '</span></div>' +
          (dimensions ? '<div class="dimension-grid">' + dimensions + '</div>' : "") +
          '<div class="signal-grid">' +
          signal(t("topStrengths"), diagnostics.strengths.slice(0, 3).join(" · ") || t("noStrengths"), t("diagnosticsSource")) +
          signal(t("nextImprovements"), diagnostics.recommendations.slice(0, 3).join(" · ") || t("noRecommendations"), t("diagnosticsSource")) +
          '</div></div>';
      }

      function copyButton(id, label) {
        return '<button type="button" class="secondary-button copy-button" id="' + escapeAttribute(id) + '" data-copy-label="' + escapeAttribute(label) + '">' + escapeHtml(label) + '</button>';
      }

      function bindCreatorActions(root) {
        if (!root) return;
        const bindings = [
          ["copy-diagnostics-markdown", () => buildDiagnosticsMarkdown(state.resources.diagnostics, state.resources.repository.fullName)],
          ["copy-readme-badge", () => buildReadmeBadge(state.resources.repository.fullName)],
          ["copy-pages-workflow", () => buildPagesWorkflow(state.resources.repository.fullName)]
        ];
        bindings.forEach(([id, builder]) => {
          const button = root.querySelector("#" + id);
          if (!button) return;
          button.addEventListener("click", async () => {
            await copyText(builder(), button);
          });
        });
      }

      async function copyText(text, button) {
        const original = button.getAttribute("data-copy-label") || button.textContent || "";
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = t("copied");
          window.setTimeout(() => {
            button.textContent = original;
          }, 1600);
        } catch {
          button.textContent = original;
        }
      }

      function pagesSiteUrl(fullName) {
        const parts = String(fullName || "").split("/");
        if (parts.length !== 2 || !parts[0] || !parts[1]) {
          return "https://YOUR_USER.github.io/YOUR_REPO/";
        }
        return "https://" + parts[0] + ".github.io/" + parts[1] + "/";
      }

      function outputDirName(fullName) {
        const repo = String(fullName || "repo").split("/").pop() || "repo";
        return repo + "-site";
      }

      function buildDiagnosticsMarkdown(diagnostics, fullName) {
        if (!diagnostics) {
          return "";
        }
        const grade = t("diagnostics.grade." + diagnostics.grade);
        const lines = [
          "## Repository Readiness · " + fullName,
          "",
          "**Score:** " + diagnostics.score + "/" + diagnostics.maxScore + " · **Grade:** " + grade,
          ""
        ];
        if (diagnostics.strengths.length) {
          lines.push("### Strengths", "");
          diagnostics.strengths.forEach((item) => lines.push("- " + item));
          lines.push("");
        }
        if (diagnostics.gaps.length) {
          lines.push("### Gaps", "");
          diagnostics.gaps.forEach((item) => lines.push("- " + item));
          lines.push("");
        }
        if (diagnostics.recommendations.length) {
          lines.push("### Recommendations", "");
          diagnostics.recommendations.forEach((item) => lines.push("- [ ] " + item));
          lines.push("");
        }
        (diagnostics.dimensions || []).forEach((dimension) => {
          lines.push("### " + dimension.label + " (" + dimension.score + "/" + dimension.maxScore + ")", "");
          if (dimension.strengths.length) {
            dimension.strengths.forEach((item) => lines.push("- Strength: " + item));
          }
          if (dimension.gaps.length) {
            dimension.gaps.forEach((item) => lines.push("- Gap: " + item));
          }
          if (dimension.recommendations.length) {
            dimension.recommendations.forEach((item) => lines.push("- Recommendation: " + item));
          }
          lines.push("");
        });
        lines.push("_Generated with SilentForge diagnostics._");
        return lines.join("\\n");
      }

      function buildReadmeBadge(fullName) {
        const url = pagesSiteUrl(fullName);
        return "[![Presentation site](https://img.shields.io/badge/Presentation-SilentForge-6366f1?style=for-the-badge)](" + url + ")";
      }

      function buildPagesWorkflow(fullName) {
        return PAGES_WORKFLOW_TEMPLATE.replaceAll("__FULL_NAME__", String(fullName || "owner/repo"));
      }

      function buildPagesSetupChecklist(fullName, pagesUrl, repoUrl) {
        return [
          "# " + fullName + " → GitHub Pages",
          "",
          "1. " + t("deployPagesStep1") + " " + repoUrl,
          "2. " + t("deployPagesStep2"),
          "3. " + t("deployPagesStep3"),
          "4. " + t("deployPagesStep4"),
          "   File: " + PAGES_WORKFLOW_PATH,
          "5. " + t("deployPagesStep5"),
          "6. " + t("deployPagesStep6") + " " + pagesUrl
        ].join("\\n");
      }

      function renderDeployCommands() {
        if (!deployCommandsEl || !state.resources) {
          return;
        }
        const repo = state.resources.repository;
        const fullName = repo.fullName;
        const outputDir = outputDirName(fullName);
        const pagesUrl = pagesSiteUrl(fullName);
        const workflowYaml = buildPagesWorkflow(fullName);
        const checklist = buildPagesSetupChecklist(fullName, pagesUrl, repo.htmlUrl);
        const pagesSection =
          '<section class="deploy-block deploy-block-pages">' +
          '<div class="deploy-block-header"><strong>' + escapeHtml(t("deployGithubPagesTitle")) + '</strong>' +
          '<p>' + escapeHtml(t("deployGithubPagesLead")) + '</p></div>' +
          '<ol class="deploy-steps">' +
          '<li>' + escapeHtml(t("deployPagesStep1")) + ' <a href="' + escapeAttribute(repo.htmlUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(t("deployOpenRepo")) + '</a></li>' +
          '<li>' + escapeHtml(t("deployPagesStep2")) + '</li>' +
          '<li>' + escapeHtml(t("deployPagesStep3")) + '</li>' +
          '<li>' + escapeHtml(t("deployPagesStep4")) + '</li>' +
          '<li>' + escapeHtml(t("deployPagesStep5")) + '</li>' +
          '<li>' + escapeHtml(t("deployPagesStep6")) + ' <a href="' + escapeAttribute(pagesUrl) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(pagesUrl) + '</a></li>' +
          '</ol>' +
          '<p class="deploy-hint">' + escapeHtml(t("deployPages404Hint")) + '</p>' +
          '<div class="deploy-meta">' +
          '<p><span class="deploy-meta-label">' + escapeHtml(t("deployWorkflowPathLabel")) + '</span> <code class="deploy-path">' + escapeHtml(PAGES_WORKFLOW_PATH) + '</code></p>' +
          '<p><span class="deploy-meta-label">' + escapeHtml(t("deployExpectedUrl")) + '</span> <code>' + escapeHtml(pagesUrl) + '</code></p>' +
          '</div>' +
          '<p class="deploy-workflow-label">' + escapeHtml(t("deployWorkflowLabel")) + '</p>' +
          '<pre class="deploy-command deploy-workflow"><code>' + escapeHtml(workflowYaml) + '</code></pre>' +
          '<div class="deploy-button-row">' +
          '<button type="button" class="secondary-button copy-button" id="copy-pages-workflow-deploy" data-copy-label="' + escapeAttribute(t("copyPagesWorkflow")) + '">' + escapeHtml(t("copyPagesWorkflow")) + '</button>' +
          '<button type="button" class="secondary-button copy-button" id="copy-deploy-checklist" data-copy-label="' + escapeAttribute(t("copyDeployChecklist")) + '">' + escapeHtml(t("copyDeployChecklist")) + '</button>' +
          '</div></section>' +
          '<section class="deploy-block deploy-block-other">' +
          '<div class="deploy-block-header"><strong>' + escapeHtml(t("deployOtherHostsTitle")) + '</strong>' +
          '<p>' + escapeHtml(t("deployOtherHostsLead")) + '</p></div>' +
          '<div class="deploy-commands-nested">';
        const otherBlocks = [
          {
            title: t("deployVercelTitle"),
            command: "npx --yes vercel deploy " + outputDir + " --prod"
          },
          {
            title: t("deployCloudflareTitle"),
            command: "npx --yes wrangler pages deploy " + outputDir + " --project-name=" + (fullName.split("/")[1] || "presentation-site")
          },
          {
            title: t("deployStaticTitle"),
            command: "npx --yes serve " + JSON.stringify(outputDir)
          }
        ];
        const otherHtml = otherBlocks.map((block) =>
          '<div class="deploy-block deploy-block-nested">' +
          '<div class="deploy-block-header"><strong>' + escapeHtml(block.title) + '</strong></div>' +
          '<pre class="deploy-command"><code>' + escapeHtml(block.command) + '</code></pre>' +
          '<button type="button" class="secondary-button copy-button deploy-copy" data-copy-label="' + escapeAttribute(t("copyCommand")) + '">' + escapeHtml(t("copyCommand")) + '</button>' +
          '</div>'
        ).join("");
        deployCommandsEl.innerHTML = pagesSection + otherHtml + '</div></section>';
        const workflowButton = deployCommandsEl.querySelector("#copy-pages-workflow-deploy");
        const checklistButton = deployCommandsEl.querySelector("#copy-deploy-checklist");
        workflowButton?.addEventListener("click", async () => {
          await copyText(workflowYaml, workflowButton);
        });
        checklistButton?.addEventListener("click", async () => {
          await copyText(checklist, checklistButton);
        });
        deployCommandsEl.querySelectorAll(".deploy-copy").forEach((button, index) => {
          button.addEventListener("click", async () => {
            await copyText(otherBlocks[index].command, button);
          });
        });
      }

      function signal(label, value, source) {
        return '<div class="signal"><strong>' + escapeHtml(label) + '</strong><p>' + escapeHtml(value) + '</p><p class="signal-source">' + escapeHtml(source) + '</p></div>';
      }

      function resourceCards(items) {
        if (!items.length) {
          return '<div class="empty-card"><p>' + escapeHtml(t("noResources")) + '</p></div>';
        }
        return '<div class="resource-grid">' + items.map((item) =>
          '<div class="resource"><code>' + escapeHtml(item.path) + '</code><p>' + escapeHtml(item.type) + (item.size ? " · " + item.size + " bytes" : "") + '</p></div>'
        ).join("") + '</div>';
      }

      function configCards(items) {
        if (!items.length) {
          return '<div class="empty-card"><p>' + escapeHtml(t("noConfigFiles")) + '</p></div>';
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
