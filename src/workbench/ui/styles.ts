export function workbenchStyles(): string {
  return `      :root {
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
      button, input, select {
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
      .generation-options {
        display: grid;
        gap: 12px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(3, 10, 18, 0.38);
      }
      .option-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .option-grid label {
        display: grid;
        gap: 7px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
        text-transform: uppercase;
      }
      select {
        min-height: 42px;
        border: 1px solid var(--line-strong);
        border-radius: 8px;
        padding: 0 12px;
        outline: none;
        background: rgba(2, 8, 14, 0.86);
        color: var(--text);
        font-family: var(--mono);
        font-size: 13px;
      }
      select:focus {
        border-color: var(--cyan);
        box-shadow: 0 0 0 4px rgba(98, 230, 255, 0.12);
      }
      .chapter-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
        gap: 8px;
      }
      .chapter-options label {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        padding: 9px 10px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(126, 232, 255, 0.06);
        color: var(--muted);
        font-family: var(--mono);
        font-size: 12px;
      }
      .chapter-options input {
        width: 16px;
        min-height: 16px;
        margin: 0;
        padding: 0;
        accent-color: var(--mint);
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
        .brand-row, .search-row, .option-grid {
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
      }`;
}
