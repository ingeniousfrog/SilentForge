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
        padding: var(--space-3);
        position: relative;
      }
      .hero {
        min-height: calc(100vh - 64px);
        display: grid;
        place-items: center;
      }
      .search-console {
        width: min(920px, 100%);
        padding: clamp(24px, 4vw, 40px);
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel);
        box-shadow: 0 16px 48px var(--shadow);
      }
      .brand-row {
        display: flex;
        justify-content: space-between;
        gap: var(--space-2);
        align-items: flex-start;
        margin-bottom: var(--space-3);
      }
      .eyebrow {
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.75rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      h1 {
        max-width: 640px;
        margin: 8px 0 0;
        font-size: clamp(28px, 4vw, 48px);
        line-height: 1.08;
        font-weight: 600;
        letter-spacing: -0.02em;
      }
      .brand-actions {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        flex-shrink: 0;
      }
      .lang-switch {
        display: inline-flex;
        padding: 2px;
        border: 1px solid var(--line);
        border-radius: 999px;
        background: rgba(8, 14, 22, 0.72);
      }
      .lang-pill {
        border: 0;
        background: transparent;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.72rem;
        line-height: 1;
        padding: 6px 10px;
        border-radius: 999px;
        cursor: pointer;
      }
      .lang-pill.active {
        color: var(--ink);
        background: rgba(98, 230, 255, 0.12);
        box-shadow: inset 0 0 0 1px rgba(98, 230, 255, 0.42);
      }
      .beacon {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.75rem;
        white-space: nowrap;
      }
      .beacon::before {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: var(--mint);
        content: "";
      }
      .repo-form {
        display: grid;
        gap: var(--space-2);
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
      input {
        width: 100%;
        min-width: 0;
        min-height: 48px;
        border: 1px solid var(--line-strong);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        outline: none;
        background: rgba(2, 8, 14, 0.6);
        color: var(--text);
        font-family: var(--mono);
        font-size: 0.95rem;
      }
      input:focus {
        border-color: var(--cyan);
        box-shadow: 0 0 0 3px rgba(98, 230, 255, 0.1);
      }
      .primary-button, .download {
        min-height: 48px;
        border-radius: var(--radius-sm);
        padding: 0 20px;
        background: var(--cyan);
        color: #031018;
        cursor: pointer;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: var(--sans);
        font-weight: 600;
        font-size: 0.9rem;
      }
      .primary-button:hover, .download:hover:not([aria-disabled="true"]) {
        filter: brightness(1.05);
      }
      .primary-button:disabled, .download[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: 0.45;
      }
      .hint {
        margin: 0;
        color: var(--muted);
        font-size: 0.875rem;
      }
      .ai-option {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        padding: 12px 14px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(98, 230, 255, 0.04);
        color: var(--muted);
        font-size: 0.85rem;
      }
      .ai-option input {
        width: 16px;
        min-height: 16px;
        margin: 2px 0 0;
        padding: 0;
        accent-color: var(--mint);
      }
      .ai-option strong {
        display: block;
        margin-bottom: 4px;
        color: var(--text);
      }
      .advanced-options {
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(3, 10, 18, 0.35);
      }
      .output-settings {
        border: 1px solid var(--line-strong);
        border-left: 3px solid var(--cyan);
        border-radius: var(--radius-md);
        background:
          linear-gradient(135deg, rgba(98, 230, 255, 0.08), rgba(110, 247, 177, 0.03)),
          rgba(3, 10, 18, 0.72);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
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
        padding-right: 28px;
      }
      .output-settings-summary::after {
        position: absolute;
        top: 18px;
        right: 16px;
        color: var(--cyan);
        font-family: var(--mono);
        font-size: 0.75rem;
        content: "+";
      }
      .output-settings[open] > .output-settings-summary::after {
        content: "−";
      }
      .output-settings-header {
        padding: 14px 16px 14px;
      }
      .output-settings[open] .output-settings-header {
        padding-bottom: 0;
      }
      .output-settings .generation-options {
        padding: 0 16px 16px;
      }
      .output-settings-copy {
        display: grid;
        gap: 6px;
      }
      .output-settings-badge {
        display: inline-flex;
        width: fit-content;
        padding: 4px 8px;
        border: 1px solid rgba(98, 230, 255, 0.28);
        border-radius: 999px;
        background: rgba(98, 230, 255, 0.1);
        color: var(--cyan);
        font-family: var(--mono);
        font-size: 0.7rem;
        letter-spacing: 0.04em;
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
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .output-settings-lead {
        margin: 0;
        max-width: 52rem;
        color: var(--muted);
        font-size: 0.84rem;
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
        border: 1px solid var(--line-strong);
        border-radius: 999px;
        background: rgba(98, 230, 255, 0.08);
        color: var(--cyan);
        cursor: help;
        font-family: var(--mono);
        font-size: 0.68rem;
        font-weight: 700;
        line-height: 1;
        padding: 0;
      }
      .info-button:hover,
      .info-button:focus-visible {
        border-color: var(--cyan);
        background: rgba(98, 230, 255, 0.16);
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
        border-radius: var(--radius-sm);
        background: rgba(8, 14, 22, 0.98);
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
        font-size: 0.8rem;
        font-weight: 600;
      }
      .chapter-options-header {
        margin-top: 2px;
      }
      .advanced-options summary {
        cursor: pointer;
        padding: 12px 14px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.8rem;
        list-style: none;
      }
      .advanced-options summary::-webkit-details-marker { display: none; }
      .advanced-options[open] summary { border-bottom: 1px solid var(--line); color: var(--text); }
      .generation-options {
        display: grid;
        gap: 12px;
        padding: 14px;
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
        font-size: 0.8rem;
      }
      select {
        min-height: 40px;
        border: 1px solid var(--line-strong);
        border-radius: var(--radius-sm);
        padding: 0 12px;
        outline: none;
        background: rgba(2, 8, 14, 0.86);
        color: var(--text);
        font-family: var(--mono);
        font-size: 0.85rem;
      }
      select:focus {
        border-color: var(--cyan);
        box-shadow: 0 0 0 3px rgba(98, 230, 255, 0.1);
      }
      .chapter-options {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
      }
      .chapter-options label {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        padding: 8px 10px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: rgba(126, 232, 255, 0.04);
        color: var(--muted);
        font-size: 0.8rem;
      }
      .chapter-options input {
        width: 14px;
        min-height: 14px;
        margin: 0;
        padding: 0;
        accent-color: var(--mint);
      }
      .history {
        margin-top: var(--space-3);
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
        font-size: 0.75rem;
      }
      .history-list {
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .history-chip {
        max-width: 100%;
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 8px 12px;
        background: rgba(126, 232, 255, 0.06);
        color: var(--text);
        cursor: pointer;
        font-family: var(--mono);
        font-size: 0.8rem;
        overflow-wrap: anywhere;
      }
      .history-chip:hover {
        border-color: var(--cyan);
        color: var(--cyan);
      }
      .workbench {
        display: none;
        width: min(1400px, 100%);
        margin: 0 auto;
      }
      .shell[data-mode="active"] .hero {
        display: block;
        min-height: auto;
      }
      .shell[data-mode="active"] .search-console {
        width: min(1400px, 100%);
        margin: 0 auto var(--space-2);
        padding: var(--space-2);
      }
      .shell[data-mode="active"] h1 {
        font-size: clamp(22px, 3vw, 32px);
      }
      .shell[data-mode="active"] .brand-row {
        margin-bottom: var(--space-2);
      }
      .shell[data-mode="active"] .history,
      .shell[data-mode="active"] .output-settings {
        display: none;
      }
      .shell[data-mode="active"] .workbench {
        display: grid;
        grid-template-columns: 320px minmax(0, 1fr);
        gap: var(--space-2);
      }
      .panel {
        min-width: 0;
        border: 1px solid var(--line);
        border-radius: var(--radius-md);
        background: var(--panel);
        box-shadow: 0 12px 40px var(--shadow);
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
        font-size: 0.85rem;
        font-weight: 600;
      }
      .status-pill {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px 10px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.75rem;
      }
      .status-pill.complete {
        border-color: rgba(110, 247, 177, 0.4);
        color: var(--mint);
      }
      .status-pill.error {
        border-color: rgba(255, 109, 122, 0.45);
        color: var(--red);
      }
      .panel-body {
        padding: var(--space-2);
      }
      .status-copy {
        margin: 0 0 14px;
        color: var(--muted);
        line-height: 1.55;
        font-size: 0.9rem;
      }
      .timeline {
        display: grid;
        gap: 10px;
      }
      .event {
        display: grid;
        grid-template-columns: 14px minmax(0, 1fr);
        gap: 10px;
        align-items: start;
      }
      .dot {
        width: 8px;
        height: 8px;
        margin-top: 6px;
        border-radius: 999px;
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
        font-size: 0.75rem;
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
        border: 1px solid var(--line-strong);
        border-radius: var(--radius-sm);
        background: rgba(98, 230, 255, 0.06);
        color: var(--text);
        cursor: pointer;
        font-family: var(--mono);
        font-size: 0.78rem;
        text-decoration: none;
      }
      .secondary-button:hover {
        border-color: var(--cyan);
        background: rgba(98, 230, 255, 0.12);
      }
      .download {
        min-height: 44px;
        width: 100%;
      }
      .tabs {
        display: flex;
        gap: 6px;
        padding: 8px;
        border-bottom: 1px solid var(--line);
        overflow-x: auto;
      }
      .tab {
        min-height: 36px;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 0 14px;
        background: transparent;
        color: var(--muted);
        cursor: pointer;
        font-size: 0.85rem;
        white-space: nowrap;
      }
      .tab.active {
        border-color: var(--line-strong);
        background: rgba(98, 230, 255, 0.08);
        color: var(--cyan);
      }
      .content {
        min-height: 620px;
      }
      h2 {
        margin: var(--space-3) 0 10px;
        font-size: 1rem;
        font-weight: 600;
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
        border-radius: var(--radius-sm);
        background: rgba(3, 10, 18, 0.45);
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
        height: 8px;
        margin: 0 0 var(--space-2);
        border-radius: 999px;
        background: var(--line);
        overflow: hidden;
      }
      .readiness-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--cyan), var(--mint));
        border-radius: 999px;
      }
      .readiness-progress-label {
        position: absolute;
        right: 0;
        top: -22px;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.75rem;
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
        font-size: 0.85rem;
      }
      .dimension-card-header span {
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.75rem;
      }
      .dimension-progress {
        height: 4px;
        border-radius: 999px;
        background: var(--line);
        overflow: hidden;
      }
      .dimension-progress span {
        display: block;
        height: 100%;
        background: var(--cyan);
        border-radius: 999px;
      }
      .dimension-gap, .dimension-strength {
        margin: 8px 0 0;
        color: var(--muted);
        font-size: 0.8rem;
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
        font-size: 0.9rem;
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
        font-size: 0.9rem;
      }
      .resource p, .signal p, .empty-card p {
        margin: 6px 0 0;
        color: var(--muted);
        line-height: 1.5;
        font-size: 0.85rem;
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
        font-size: 0.85rem;
      }
      .tag-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .tag {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 6px 10px;
        background: rgba(169, 162, 255, 0.06);
        color: var(--text);
        font-family: var(--mono);
        font-size: 0.75rem;
      }
      .confidence {
        color: var(--mint);
        font-family: var(--mono);
        font-size: 0.75rem;
      }
      pre {
        margin: 0;
        overflow: auto;
        max-height: 360px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: #030810;
        color: #dff6ff;
        font-size: 0.8rem;
      }
      .mermaid-block summary {
        cursor: pointer;
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.8rem;
        margin-bottom: 8px;
      }
      .preview-frame {
        position: relative;
        min-height: 640px;
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: #0a0e14;
        overflow: hidden;
      }
      .preview-frame iframe {
        width: 100%;
        height: 640px;
        border: 0;
        background: #0a0e14;
      }
      .preview-frame::before {
        content: "Loading preview…";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: var(--muted);
        font-size: 0.9rem;
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
        font-size: 0.9rem;
      }
      .preview-placeholder {
        min-height: 480px;
        display: grid;
        place-items: center;
        border: 1px dashed var(--line);
        border-radius: var(--radius-sm);
        background: rgba(3, 10, 18, 0.35);
        text-align: center;
        padding: var(--space-3);
      }
      .preview-placeholder strong {
        display: block;
        margin-bottom: 8px;
        color: var(--text);
        font-size: 1.1rem;
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
