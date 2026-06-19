export function workbenchTemplate(styles: string, clientScript: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>RepoSite Workbench</title>
    <style>${styles}</style>
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
            <section class="generation-options" aria-label="Generation options">
              <div class="option-grid">
                <label>
                  <span>Mode</span>
                  <select id="generation-mode">
                    <option value="auto">Auto</option>
                    <option value="developer-deck">Developer docs</option>
                    <option value="architecture-map">Architecture handoff</option>
                    <option value="visual-showcase">Visual showcase</option>
                    <option value="compact-story">Compact story</option>
                  </select>
                </label>
                <label>
                  <span>Theme</span>
                  <select id="generation-theme">
                    <option value="auto">Auto</option>
                    <option value="signal-dark">signal-dark</option>
                    <option value="editorial-light">editorial-light</option>
                    <option value="blueprint">blueprint</option>
                  </select>
                </label>
              </div>
              <div class="chapter-options" aria-label="Chapter switches">
                <label><input type="checkbox" data-chapter-toggle="features" checked /> Features</label>
                <label><input type="checkbox" data-chapter-toggle="visuals" checked /> Visuals</label>
                <label><input type="checkbox" data-chapter-toggle="usage" checked /> Usage</label>
                <label><input type="checkbox" data-chapter-toggle="readme-insights" checked /> README insights</label>
                <label><input type="checkbox" data-chapter-toggle="technology" checked /> Technology</label>
                <label><input type="checkbox" data-chapter-toggle="architecture" checked /> Architecture</label>
                <label><input type="checkbox" data-chapter-toggle="resources" checked /> Resources</label>
              </div>
            </section>
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
    <script>${clientScript}</script>
  </body>
</html>`;
}
