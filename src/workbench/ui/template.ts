export function workbenchTemplate(styles: string, clientScript: string): string {
  return `<!doctype html>
<html lang="en" data-ui-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title data-i18n="pageTitle">SilentForge Workbench</title>
    <script>
      try {
        var uiTheme = localStorage.getItem("silentforge.uiTheme");
        if (uiTheme === "light" || uiTheme === "dark") {
          document.documentElement.dataset.uiTheme = uiTheme;
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          document.documentElement.dataset.uiTheme = "light";
        } else {
          document.documentElement.dataset.uiTheme = "dark";
        }
      } catch (e) {}
    </script>
    <style>${styles}</style>
  </head>
  <body>
    <div class="shell" data-mode="idle" data-status="idle">
      <header class="page-header">
        <div class="brand-row">
          <div class="brand-start">
            <button type="button" id="back-home-button" class="back-home-link" hidden data-i18n="backToHome">Back to home</button>
            <div class="eyebrow" data-i18n="eyebrow">SilentForge Workbench</div>
          </div>
          <div class="brand-actions">
            <div class="theme-switch" role="group" aria-label="Appearance" data-i18n-aria="themeUiAria">
              <button type="button" class="theme-pill active" data-ui-theme="dark" data-i18n="themeDark">Dark</button>
              <button type="button" class="theme-pill" data-ui-theme="light" data-i18n="themeLight">Light</button>
            </div>
            <div class="lang-switch" role="group" aria-label="Language" data-i18n-aria="langAria">
              <button type="button" class="lang-pill active" data-locale="en">EN</button>
              <button type="button" class="lang-pill" data-locale="zh">中文</button>
            </div>
            <div class="beacon" id="mode-label" data-i18n="standby">standby</div>
          </div>
        </div>
      </header>
      <section class="hero">
        <div class="search-console">
          <h1 data-i18n="heroTitle">Turn a GitHub repository into a static presentation site.</h1>
          <div id="repo-console" class="repo-form">
            <div class="search-pill">
              <div class="search-row">
                <label class="search-field">
                  <input id="repo-url" placeholder="https://github.com/openai/openai-node" autocomplete="off" />
                </label>
                <button id="start-button" class="primary-button" type="button" data-i18n="generate">Generate</button>
              </div>
            </div>
            <p class="hint" id="form-hint" data-i18n="hint">Paste a public GitHub repository URL or owner/repo shorthand.</p>
            <div class="settings-launcher">
              <button type="button" id="open-settings" class="settings-launcher-button" aria-haspopup="dialog" aria-controls="settings-dialog">
                <span class="settings-launcher-label" data-i18n="settingsTitle">Settings</span>
                <span class="settings-summary" id="settings-summary" aria-live="polite"></span>
              </button>
            </div>
          </div>
          <section id="history" class="history" aria-label="Recent repositories">
            <div class="history-header">
              <span data-i18n="historyRecent">Recent targets</span>
              <span data-i18n="historyLocal">local browser history</span>
            </div>
            <div id="history-list" class="history-list"></div>
          </section>
        </div>
      </section>
      <main class="workbench" aria-live="polite">
        <section class="panel">
          <div class="panel-header">
            <h2 class="panel-title" data-i18n="generationStream">Generation stream</h2>
            <span id="status-pill" class="status-pill" data-i18n="statusIdle">idle</span>
          </div>
          <div class="panel-body">
            <p id="status" class="status-copy" data-i18n="statusWaiting">Waiting for a GitHub repository target.</p>
            <div id="timeline" class="timeline"></div>
          </div>
        </section>
        <section class="panel content">
          <div class="tabs-bar">
            <div class="tabs">
              <button class="tab active" type="button" data-tab="overview" data-i18n="tabOverview">Overview</button>
              <button class="tab" type="button" data-tab="resources" data-i18n="tabResources">Resources</button>
              <button class="tab" type="button" data-tab="wiki" data-i18n="tabWiki">Code Wiki</button>
              <button class="tab" type="button" data-tab="preview" data-i18n="tabPreview">Preview</button>
            </div>
            <div class="tabs-actions" id="tabs-actions" hidden>
              <a id="download" class="download tabs-download" href="#" aria-disabled="true" data-i18n="downloadZip">Download ZIP</a>
              <button type="button" id="deploy-button" class="secondary-button tabs-deploy" disabled data-i18n="deployTitle">Deploy</button>
            </div>
          </div>
          <div id="content" class="panel-body">
            <div class="preview-placeholder">
              <p><strong data-i18n="pendingTitle">No generation started</strong><span class="empty" data-i18n="pendingBody">Generate a repository to inspect source signals, wiki coverage, and the site preview.</span></p>
            </div>
          </div>
        </section>
      </main>
    </div>
    <dialog class="settings-dialog" id="settings-dialog">
      <div class="settings-dialog-header">
        <div>
          <h2 class="settings-dialog-title" data-i18n="settingsTitle">Settings</h2>
          <p class="settings-dialog-lead" data-i18n="settingsDialogLead">Configure GitHub access, output options, and AI-assisted structure for the next generation.</p>
        </div>
        <button type="button" class="settings-dialog-close" id="settings-dialog-close" aria-label="Close" data-i18n-aria="settingsCloseAria">×</button>
      </div>
      <div class="settings-dialog-body">
        <div class="workbench-settings-body">
          <section class="settings-section">
            <h2 class="settings-section-title" data-i18n="githubAuthTitle">GitHub access (optional)</h2>
            <p class="settings-section-lead" data-i18n="githubTokenHint">
              Raises GitHub API rate limits when fetching repository metadata, README, releases, and file trees. Sent only to your local Workbench server—not to SilentForge or third parties.
            </p>
            <label class="github-token-field">
              <span data-i18n="githubTokenLabel">Personal access token</span>
              <input
                id="github-token"
                type="password"
                autocomplete="off"
                spellcheck="false"
                data-i18n-placeholder="githubTokenPlaceholder"
                placeholder="ghp_…"
              />
            </label>
            <label class="remember-token">
              <input id="remember-github-token" type="checkbox" />
              <span data-i18n="rememberGithubToken">Remember on this device</span>
            </label>
          </section>
          <section class="settings-section">
            <div class="settings-section-heading">
              <h2 class="settings-section-title" data-i18n="outputTitle">Output settings</h2>
              <span class="info-tip info-tip-inline">
                <button type="button" class="info-button" aria-label="What do output settings control?" data-i18n-aria="outputInfoAria">i</button>
                <span class="info-tooltip" role="tooltip" data-i18n="outputInfo">
                  These options shape the static site files SilentForge generates: index.html, detail pages, Preview, and ZIP download.
                  They do not change this Workbench interface.
                  Mode controls narrative structure. Theme controls colors and typography on every generated page.
                  Chapter toggles include or omit sections when the repository has matching content.
                </span>
              </span>
            </div>
            <p class="settings-section-lead" data-i18n="outputLead">Applies to Preview, ZIP, and every generated HTML page—not this Workbench UI.</p>
            <div class="generation-options">
              <div class="option-grid">
                <label>
                  <span class="option-label-row">
                    <span data-i18n="modeLabel">Mode</span>
                    <span class="info-tip info-tip-inline">
                      <button type="button" class="info-button" aria-label="What does Mode control?" data-i18n-aria="modeInfoAria">i</button>
                      <span class="info-tooltip" role="tooltip" data-i18n="modeInfo">
                        Chooses how the repository story is arranged: developer docs, architecture handoff, visual showcase, or a compact narrative.
                        Auto picks based on README, screenshots, and codebase signals.
                      </span>
                    </span>
                  </span>
                  <select id="generation-mode">
                    <option value="auto" data-i18n-option="presentation.mode.auto">Auto</option>
                    <option value="developer-deck" data-i18n-option="presentation.mode.developer-deck">Developer docs</option>
                    <option value="architecture-map" data-i18n-option="presentation.mode.architecture-map">Architecture handoff</option>
                    <option value="visual-showcase" data-i18n-option="presentation.mode.visual-showcase">Visual showcase</option>
                    <option value="compact-story" data-i18n-option="presentation.mode.compact-story">Compact story</option>
                  </select>
                </label>
                <label>
                  <span class="option-label-row">
                    <span data-i18n="themeLabel">Theme</span>
                    <span class="info-tip info-tip-inline">
                      <button type="button" class="info-button" aria-label="What does Theme control?" data-i18n-aria="themeInfoAria">i</button>
                      <span class="info-tooltip" role="tooltip" data-i18n="themeInfo">
                        Sets the visual style on all generated pages: Dark Signal, Editorial Light, or Blueprint.
                        Auto follows the selected mode. This is not the Workbench theme.
                      </span>
                    </span>
                  </span>
                  <select id="generation-theme">
                    <option value="auto" data-i18n-option="presentation.theme.auto">Auto</option>
                    <option value="signal-dark" data-i18n-option="presentation.theme.signal-dark">Dark Signal</option>
                    <option value="editorial-light" data-i18n-option="presentation.theme.editorial-light">Editorial Light</option>
                    <option value="blueprint" data-i18n-option="presentation.theme.blueprint">Blueprint</option>
                  </select>
                </label>
              </div>
              <div class="chapter-options-header">
                <span class="option-label-row">
                  <span data-i18n="chaptersLabel">Chapters</span>
                  <span class="info-tip info-tip-inline">
                    <button type="button" class="info-button" aria-label="What do chapter toggles control?" data-i18n-aria="chaptersInfoAria">i</button>
                    <span class="info-tooltip" role="tooltip" data-i18n="chaptersInfo">
                      Turn sections on or off in the generated presentation. Empty sections are skipped even when enabled.
                      The hero chapter is always included.
                    </span>
                  </span>
                </span>
              </div>
              <div class="chapter-options" aria-label="Chapter switches">
                <label><input type="checkbox" data-chapter-toggle="features" checked /> <span data-i18n="chapterFeatures">Features</span></label>
                <label><input type="checkbox" data-chapter-toggle="visuals" checked /> <span data-i18n="chapterVisuals">Visuals</span></label>
                <label><input type="checkbox" data-chapter-toggle="usage" checked /> <span data-i18n="chapterUsage">Usage</span></label>
                <label><input type="checkbox" data-chapter-toggle="readme-insights" checked /> <span data-i18n="chapterReadmeInsights">README insights</span></label>
                <label><input type="checkbox" data-chapter-toggle="technology" checked /> <span data-i18n="chapterTechnology">Technology</span></label>
                <label><input type="checkbox" data-chapter-toggle="architecture" checked /> <span data-i18n="chapterArchitecture">Architecture</span></label>
                <label><input type="checkbox" data-chapter-toggle="resources" checked /> <span data-i18n="chapterResources">Resources</span></label>
              </div>
            </div>
          </section>
          <section class="settings-section">
            <div class="settings-section-heading">
              <h2 class="settings-section-title" data-i18n="aiSectionTitle">AI-assisted structure</h2>
            </div>
            <p class="settings-section-lead" data-i18n="aiSectionLead">
              When enabled, SilentForge arranges extracted repository facts into presentation chapters using AI. Facts stay source-bound; failures fall back to local rules.
            </p>
            <ol class="ai-priority-list">
              <li data-i18n="aiPriorityCodex">1. Local Codex on this machine (run <code>codex login</code> in Terminal)</li>
              <li data-i18n="aiPriorityOpenAi">2. OpenAI-compatible API (optional fallback below, or server env vars)</li>
              <li data-i18n="aiPriorityRules">3. Deterministic local rules if both fail or are unavailable</li>
            </ol>
            <div id="codex-status" class="ai-status-badge" data-state="unknown" aria-live="polite">
              <span data-i18n="aiCodexChecking">Checking local Codex status…</span>
            </div>
            <label class="ai-option">
              <input id="use-ai" type="checkbox" />
              <span data-i18n="aiEnableLabel">Enable AI-assisted structure</span>
            </label>
            <div id="ai-settings-panel" class="ai-settings-panel">
              <h3 class="ai-subheading" data-i18n="aiOpenAiFallbackTitle">OpenAI fallback (optional)</h3>
              <p class="settings-section-lead" data-i18n="aiOpenAiFallbackLead">
                Used only when Codex is missing, not logged in, or fails. You can point Base URL to a local bridge such as gpt2cursor.
              </p>
              <label class="github-token-field">
                <span data-i18n="aiOpenAiKeyLabel">API key</span>
                <input
                  id="openai-api-key"
                  type="password"
                  autocomplete="off"
                  spellcheck="false"
                  data-i18n-placeholder="aiOpenAiKeyPlaceholder"
                  placeholder="sk-…"
                />
              </label>
              <label class="github-token-field">
                <span data-i18n="aiOpenAiBaseUrlLabel">Base URL override</span>
                <input
                  id="openai-base-url"
                  type="url"
                  autocomplete="off"
                  spellcheck="false"
                  data-i18n-placeholder="aiOpenAiBaseUrlPlaceholder"
                  placeholder="http://127.0.0.1:8787/v1"
                />
              </label>
              <label class="github-token-field">
                <span data-i18n="aiOpenAiModelLabel">Model</span>
                <input
                  id="openai-model"
                  type="text"
                  autocomplete="off"
                  spellcheck="false"
                  data-i18n-placeholder="aiOpenAiModelPlaceholder"
                  placeholder="gpt-5.5"
                />
              </label>
              <label class="remember-token">
                <input id="remember-ai-credentials" type="checkbox" />
                <span data-i18n="rememberAiCredentials">Remember API key on this device</span>
              </label>
            </div>
          </section>
          <div class="settings-actions">
            <button type="button" id="save-settings" class="primary-button settings-save" data-i18n="saveSettings">Save settings</button>
            <p class="settings-save-hint" id="settings-save-hint" hidden data-i18n="settingsSaved">Settings saved.</p>
            <p class="settings-save-note" data-i18n="settingsSaveNote">Generate uses saved settings. Click Save settings or Generate to apply changes. GitHub and OpenAI credentials are sent only after you save non-empty values here.</p>
          </div>
        </div>
      </div>
    </dialog>
    <dialog class="deploy-dialog" id="deploy-dialog">
      <div class="deploy-dialog-header">
        <h2 class="deploy-dialog-title" data-i18n="deployTitle">Deploy</h2>
        <button type="button" class="deploy-dialog-close" id="deploy-dialog-close" aria-label="Close" data-i18n-aria="deployCloseAria">×</button>
      </div>
      <div class="deploy-dialog-body">
        <p class="deploy-guide-lead" data-i18n="deployLead">Copy commands for common static hosts. Replace paths if you renamed the output folder.</p>
        <div id="deploy-commands" class="deploy-commands"></div>
      </div>
    </dialog>
    <script>${clientScript}</script>
  </body>
</html>`;
}
