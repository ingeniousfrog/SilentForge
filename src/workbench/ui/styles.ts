import { designTokensCss, workbenchShellCss } from "../../shared/designTokens.js";

export function workbenchStyles(): string {
  return `${designTokensCss()}
${workbenchShellCss()}
      * {
        box-sizing: border-box;
      }
      button, input, select {
        font: inherit;
      }
      button {
        border: 0;
      }
      .shell {
        min-height: 100vh;
        padding: var(--space-2) var(--space-3) var(--space-3);
        position: relative;
      }
      .page-header {
        position: sticky;
        top: 0;
        z-index: 10;
        width: min(720px, 100%);
        margin: 0 auto;
        padding: var(--space-1) 0;
        background: transparent;
      }
      .brand-row {
        display: flex;
        justify-content: space-between;
        gap: var(--space-2);
        align-items: center;
      }
      .eyebrow {
        color: var(--muted);
        font-size: 0.8125rem;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
      .brand-actions {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
      .lang-switch,
      .theme-switch {
        display: inline-flex;
        padding: 2px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: var(--panel);
        backdrop-filter: blur(12px);
      }
      .lang-pill,
      .theme-pill {
        border: 0;
        background: transparent;
        color: var(--muted);
        font-size: 0.75rem;
        line-height: 1;
        padding: 6px 10px;
        border-radius: var(--radius-pill);
        cursor: pointer;
      }
      .lang-pill.active,
      .theme-pill.active {
        color: var(--text);
        background: var(--surface);
      }
      .beacon {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--muted);
        font-size: 0.75rem;
        white-space: nowrap;
      }
      .beacon::before {
        width: 6px;
        height: 6px;
        border-radius: var(--radius-pill);
        background: var(--dim);
        content: "";
      }
      .shell[data-status="running"] .beacon::before,
      .shell[data-status="submitting"] .beacon::before {
        background: var(--mint);
      }
      .hero {
        min-height: calc(100vh - 72px);
        display: grid;
        place-items: center;
        padding: var(--space-2) 0;
      }
      .search-console {
        width: min(720px, 100%);
        display: grid;
        gap: var(--space-3);
        padding: 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        box-shadow: none;
        text-align: center;
      }
      h1 {
        max-width: 640px;
        margin: 0 auto;
        font-size: clamp(32px, 5vw, 52px);
        line-height: 1.12;
        font-weight: 500;
        letter-spacing: -0.03em;
      }
      .repo-form {
        display: grid;
        gap: var(--space-2);
        text-align: left;
      }
      .search-pill {
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: var(--panel);
        backdrop-filter: blur(12px);
        box-shadow: 0 4px 24px var(--shadow);
        transition: border-color 160ms ease, box-shadow 160ms ease;
      }
      .search-pill:focus-within {
        border-color: var(--focus-border);
        box-shadow:
          0 4px 24px var(--shadow),
          0 0 0 3px var(--focus-ring);
      }
      .search-row {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        padding: 6px 6px 6px 20px;
      }
      .search-field {
        position: relative;
        min-width: 0;
      }
      input {
        width: 100%;
        min-width: 0;
        min-height: 44px;
        border: 0;
        border-radius: 0;
        padding: 10px 0;
        outline: none;
        background: transparent;
        color: var(--text);
        font-family: var(--sans);
        font-size: 1rem;
      }
      input::placeholder {
        color: var(--dim);
      }
      .primary-button, .download {
        min-height: 44px;
        border-radius: var(--radius-pill);
        padding: 0 22px;
        background: var(--cyan);
        color: var(--on-accent);
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: var(--sans);
        font-weight: 600;
        font-size: 0.875rem;
        transition: filter 160ms ease, opacity 160ms ease;
      }
      .primary-button:hover, .download:hover:not([aria-disabled="true"]) {
        filter: brightness(1.08);
      }
      .primary-button:disabled, .download[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .hint {
        margin: 0;
        color: var(--dim);
        font-size: 0.8125rem;
        text-align: center;
      }
      .ai-option {
        display: flex;
        gap: 10px;
        align-items: flex-start;
        padding: 4px 0;
        border: 0;
        border-radius: 0;
        background: transparent;
        color: var(--muted);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .ai-option input {
        width: 16px;
        min-height: 16px;
        margin: 3px 0 0;
        padding: 0;
        accent-color: var(--cyan);
      }
      .ai-option strong {
        display: inline;
        color: var(--text);
        font-weight: 500;
      }
      .advanced-options {
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--surface);
      }
      .output-settings {
        border: 0;
        border-radius: var(--radius-md);
        background: transparent;
        box-shadow: none;
      }
      .output-settings > summary {
        list-style: none;
        cursor: pointer;
      }
      .output-settings > summary::-webkit-details-marker {
        display: none;
      }
      .output-settings-summary {
        position: relative;
        padding-right: 24px;
      }
      .output-settings-summary::after {
        position: absolute;
        top: 50%;
        right: 0;
        color: var(--muted);
        font-size: 0.875rem;
        transform: translateY(-50%);
        content: "›";
        transition: transform 160ms ease;
      }
      .output-settings[open] > .output-settings-summary::after {
        transform: translateY(-50%) rotate(90deg);
      }
      .output-settings-header {
        padding: 8px 0;
      }
      .output-settings[open] .output-settings-header {
        padding-bottom: 4px;
        border-bottom: 1px solid var(--line);
      }
      .output-settings .generation-options {
        padding: var(--space-2) 0 0;
      }
      .output-settings-copy {
        display: grid;
        gap: 4px;
      }
      .output-settings-badge {
        display: inline-flex;
        width: fit-content;
        padding: 2px 8px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--muted);
        font-size: 0.6875rem;
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .output-settings-title-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .output-settings-title {
        margin: 0;
        color: var(--text);
        font-size: 0.9375rem;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
      .output-settings-lead {
        margin: 0;
        max-width: 52rem;
        color: var(--dim);
        font-size: 0.8125rem;
        line-height: 1.5;
      }
      .info-tip {
        position: relative;
        display: inline-flex;
        align-items: center;
      }
      .info-tip-inline {
        vertical-align: middle;
      }
      .info-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--muted);
        cursor: help;
        font-size: 0.6875rem;
        font-weight: 600;
        line-height: 1;
        padding: 0;
      }
      .info-button:hover,
      .info-button:focus-visible {
        border-color: var(--line-strong);
        color: var(--text);
        outline: none;
      }
      .info-tooltip {
        position: absolute;
        z-index: 20;
        top: calc(100% + 8px);
        left: 50%;
        width: min(280px, calc(100vw - 48px));
        padding: 10px 12px;
        border: 1px solid var(--line-strong);
        border-radius: var(--radius-md);
        background: var(--tooltip-bg);
        backdrop-filter: blur(12px);
        box-shadow: 0 14px 40px var(--shadow);
        color: var(--muted);
        font-size: 0.78rem;
        line-height: 1.45;
        opacity: 0;
        pointer-events: none;
        transform: translate(-50%, -4px);
        transition: opacity 120ms ease, transform 120ms ease;
      }
      .info-tip:hover .info-tooltip,
      .info-tip:focus-within .info-tooltip {
        opacity: 1;
        pointer-events: auto;
        transform: translate(-50%, 0);
      }
      .output-settings-header .info-tip .info-tooltip {
        left: auto;
        right: 0;
        transform: translate(0, -4px);
      }
      .output-settings-header .info-tip:hover .info-tooltip,
      .output-settings-header .info-tip:focus-within .info-tooltip {
        transform: translate(0, 0);
      }
      .option-label-row,
      .chapter-options-header .option-label-row {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        color: var(--muted);
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .chapter-options-header {
        margin-top: 2px;
      }
      .advanced-options summary {
        cursor: pointer;
        padding: 12px 14px;
        color: var(--muted);
        font-size: 0.8125rem;
        list-style: none;
      }
      .advanced-options summary::-webkit-details-marker { display: none; }
      .advanced-options[open] summary { border-bottom: 1px solid var(--line); color: var(--text); }
      .generation-options {
        display: grid;
        gap: 12px;
        padding: 0;
      }
      .option-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .option-grid label {
        display: grid;
        gap: 6px;
        color: var(--muted);
        font-size: 0.8125rem;
      }
      select {
        min-height: 40px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        padding: 0 12px;
        outline: none;
        background: var(--surface);
        color: var(--text);
        font-family: var(--sans);
        font-size: 0.875rem;
      }
      select:focus {
        border-color: var(--focus-border);
        box-shadow: 0 0 0 3px var(--focus-ring);
      }
      .chapter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .chapter-options label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        padding: 6px 12px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--muted);
        font-size: 0.8125rem;
        cursor: pointer;
        transition: border-color 160ms ease, color 160ms ease;
      }
      .chapter-options label:has(input:checked) {
        border-color: var(--chip-active-border);
        color: var(--text);
        background: var(--chip-active-bg);
      }
      .chapter-options input {
        width: 14px;
        min-height: 14px;
        margin: 0;
        padding: 0;
        accent-color: var(--cyan);
      }
      .history {
        margin-top: var(--space-1);
        display: none;
        text-align: left;
      }
      .history.visible {
        display: block;
      }
      .history-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        color: var(--dim);
        font-size: 0.75rem;
      }
      .history-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
      }
      .history-chip {
        max-width: 100%;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 6px 14px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-family: var(--sans);
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
        transition: border-color 160ms ease, color 160ms ease;
      }
      .history-chip:hover {
        border-color: var(--chip-active-border);
        color: var(--cyan);
      }
      .workbench {
        display: none;
        width: min(1200px, 100%);
        margin: 0 auto;
      }
      .shell[data-mode="active"] .page-header {
        width: min(1200px, 100%);
      }
      .shell[data-mode="active"] .hero {
        display: block;
        min-height: auto;
        padding: 0;
      }
      .shell[data-mode="active"] .search-console {
        width: min(1200px, 100%);
        margin: 0 auto var(--space-2);
        gap: var(--space-2);
        text-align: left;
      }
      .shell[data-mode="active"] h1 {
        display: none;
      }
      .shell[data-mode="active"] .history,
      .shell[data-mode="active"] .output-settings,
      .shell[data-mode="active"] .ai-option,
      .shell[data-mode="active"] .hint {
        display: none;
      }
      .shell[data-mode="active"] .workbench {
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr);
        gap: var(--space-2);
      }
      .panel {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--panel);
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
      }
      .panel-header {
        padding: 14px 16px;
        border-bottom: 1px solid var(--line);
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
      }
      .panel-title {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .status-pill {
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 4px 10px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      .status-pill.complete {
        border-color: rgba(52, 211, 153, 0.35);
        color: var(--mint);
      }
      .status-pill.error {
        border-color: rgba(255, 109, 122, 0.35);
        color: var(--red);
      }
      .panel-body {
        padding: var(--space-2);
      }
      .status-copy {
        margin: 0 0 14px;
        color: var(--muted);
        line-height: 1.55;
        font-size: 0.875rem;
      }
      .timeline {
        display: grid;
        gap: 10px;
      }
      .event {
        display: grid;
        grid-template-columns: 12px minmax(0, 1fr);
        gap: 10px;
        align-items: start;
      }
      .dot {
        width: 6px;
        height: 6px;
        margin-top: 7px;
        border-radius: var(--radius-pill);
        background: var(--amber);
      }
      .event.complete .dot { background: var(--mint); }
      .event.error .dot { background: var(--red); }
      .event p {
        margin: 0;
        color: var(--text);
        line-height: 1.45;
        font-size: 0.875rem;
      }
      .event time {
        display: block;
        margin-top: 2px;
        color: var(--dim);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      .actions {
        display: grid;
        gap: 10px;
        margin-top: var(--space-2);
      }
      .back-home-button[hidden] {
        display: none;
      }
      .secondary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 10px 14px;
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-family: var(--sans);
        font-size: 0.8125rem;
        text-decoration: none;
        transition: border-color 160ms ease, color 160ms ease;
      }
      .secondary-button:hover {
        border-color: var(--line-strong);
        color: var(--text);
      }
      .download {
        min-height: 44px;
        width: 100%;
      }
      .tabs {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        border-bottom: 1px solid var(--line);
        overflow-x: auto;
      }
      .tab {
        min-height: 44px;
        border: 0;
        border-bottom: 2px solid transparent;
        border-radius: 0;
        padding: 0 12px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-size: 0.875rem;
        white-space: nowrap;
        transition: color 160ms ease, border-color 160ms ease;
      }
      .tab:hover {
        color: var(--text);
      }
      .tab.active {
        border-bottom-color: var(--cyan);
        color: var(--cyan);
      }
      .content {
        min-height: 620px;
      }
      h2 {
        margin: var(--space-3) 0 10px;
        font-size: 1rem;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
      h2:first-child {
        margin-top: 0;
      }
      .metrics {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
      }
      .metric, .resource, .signal, .empty-card, .dimension-card {
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--surface);
        min-width: 0;
      }
      .metric, .dimension-card {
        padding: 14px;
      }
      .metric strong {
        display: block;
        color: var(--text);
        font-size: 1.4rem;
        line-height: 1.1;
        overflow-wrap: anywhere;
      }
      .metric span {
        display: block;
        margin-top: 6px;
        color: var(--muted);
        font-size: 0.75rem;
      }
      .readiness-progress {
        position: relative;
        height: 6px;
        margin: 0 0 var(--space-2);
        border-radius: var(--radius-pill);
        background: var(--line);
        overflow: hidden;
      }
      .readiness-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--cyan), var(--mint));
        border-radius: var(--radius-pill);
      }
      .readiness-progress-label {
        position: absolute;
        right: 0;
        top: -22px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      .dimension-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
        margin-bottom: var(--space-2);
      }
      .dimension-card-header {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.875rem;
      }
      .dimension-card-header span {
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      .dimension-progress {
        height: 4px;
        border-radius: var(--radius-pill);
        background: var(--line);
        overflow: hidden;
      }
      .dimension-progress span {
        display: block;
        height: 100%;
        background: var(--cyan);
        border-radius: var(--radius-pill);
      }
      .dimension-gap, .dimension-strength {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 0.8125rem;
        line-height: 1.4;
      }
      .feature-list {
        margin: 0;
        padding-left: 1.2rem;
        color: var(--text);
      }
      .feature-list li {
        margin: 0.35rem 0;
        line-height: 1.5;
        font-size: 0.875rem;
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
        font-size: 0.875rem;
      }
      .resource p, .signal p, .empty-card p {
        margin: 6px 0 0;
        color: var(--muted);
        line-height: 1.5;
        font-size: 0.8125rem;
      }
      .signal-source {
        font-size: 0.75rem !important;
        color: var(--dim) !important;
      }
      .resource code, pre {
        font-family: var(--mono);
      }
      .resource code {
        color: var(--cyan);
        overflow-wrap: anywhere;
        font-size: 0.8125rem;
      }
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tag {
        border: 1px solid var(--line);
        border-radius: var(--radius-pill);
        padding: 6px 10px;
        background: var(--surface);
        color: var(--text);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      .confidence {
        color: var(--mint);
        font-family: var(--mono);
        font-size: 0.6875rem;
      }
      pre {
        margin: 0;
        overflow: auto;
        max-height: 360px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--code-bg);
        color: var(--code-text);
        font-size: 0.8125rem;
      }
      .mermaid-block summary {
        cursor: pointer;
        color: var(--muted);
        font-size: 0.8125rem;
        margin-bottom: 8px;
      }
      .preview-frame {
        position: relative;
        min-height: 640px;
        border: 1px solid var(--line);
        border-radius: var(--radius-lg);
        background: var(--preview-bg);
        overflow: hidden;
        box-shadow: inset 0 2px 8px var(--shadow);
      }
      .preview-frame iframe {
        width: 100%;
        height: 640px;
        border: 0;
        background: var(--preview-bg);
      }
      .preview-frame::before {
        content: "Loading preview…";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: var(--muted);
        font-size: 0.875rem;
        pointer-events: none;
        opacity: 0.6;
      }
      .preview-frame iframe:not([src=""]) ~ ::before,
      .preview-frame:has(iframe[src])::before {
        display: none;
      }
      .empty {
        color: var(--muted);
        line-height: 1.6;
        font-size: 0.875rem;
      }
      .preview-placeholder {
        min-height: 480px;
        display: grid;
        place-items: center;
        border: 0;
        border-radius: var(--radius-md);
        background: transparent;
        text-align: center;
        padding: var(--space-3);
      }
      .preview-placeholder strong {
        display: block;
        margin-bottom: 8px;
        color: var(--text);
        font-size: 1rem;
        font-weight: 500;
      }
      @media (max-width: 1020px) {
        .shell {
          padding: var(--space-2);
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
        .brand-row {
          display: grid;
        }
        .search-pill:focus-within {
          box-shadow: 0 4px 24px var(--shadow);
        }
        .search-row {
          grid-template-columns: 1fr;
          padding: 12px 16px;
          gap: 10px;
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
