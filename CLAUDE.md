# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Deploy

There is no local build process. The entire application is a single file: `index.html`.

**Deployment** is handled by `.github/workflows/deploy.yml`:
1. Reads `VIEW_PASSWORD` and `EDITOR_TOKEN` GitHub Actions secrets
2. Computes SHA-256 hashes of each with `sha256sum`
3. Uses `sed` to inject those hashes into `index.html` (replacing placeholder values)
4. Deploys the modified file to the `gh-pages` branch via `peaceiris/actions-gh-pages`

To test locally, open `index.html` directly in a browser. The lock screen will need a password — during local dev you can temporarily hardcode a hash or bypass auth logic.

## Architecture

The entire application lives in `index.html` (~2100 lines). There are no external JS/CSS files, no framework, no package.json.

### State

A single global `appState` object holds all runtime state:

```js
appState = {
  isEditor: boolean,
  isUnlocked: boolean,
  selectedMood: null,
  gistToken: string | null,
  gistId: string | null,
  data: {
    daily: [],   // BP, HR, O₂, weight, symptoms
    weekly: [],  // Activity, diet, sodium/fluid, medications
    journal: [], // Mood + emotional notes
    visits: []   // Doctor appointments
  }
}
```

### Data flow

```
Form submit → saveXxx() → mutate appState.data → saveToLocalStorage()
                                                        ↓
                                               [if token set] pushToGist()
                                                        ↓
                                                 renderAll() → DOM
```

On unlock: `loadFromGist()` merges remote Gist data with localStorage (deduplicates by date for daily/weekly, by ID for journal/visits), then renders.

### Persistence

- **Primary:** `localStorage` — offline-first, instant
- **Secondary:** GitHub Gist API — optional multi-device sync, configured by the editor with a Personal Access Token (gist scope)

### Security

- Two roles: **Editor** (full access) and **Viewer** (read-only, History tabs only)
- Passwords are SHA-256 hashed. Plain-text secrets come only from GitHub Actions secrets and never appear in the repository.
- Hashes are injected via `sed` at deploy time; the in-repo `index.html` has placeholder values.

### UI structure

Tab-based navigation (no router library):
- **Daily Log** — BP, HR, O₂, weight, symptoms
- **Weekly Check-In** — Activity, diet, sodium/fluid, tobacco
- **Journal** — Mood picker, emotional notes
- **Doctor Visits** — Appointment notes, action items
- **Reference Guide** — Static CHF emergency flags and daily targets

Each data tab has **Log** (editor only) and **History** sub-tabs. Visibility is controlled by toggling CSS `display`.

### Code organization within index.html

The file is sectioned by comment headers in this order: styles (`<style>`), lock screen HTML, main app HTML, then `<script>` containing: Lock Screen → Navigation → Dates → Form Handling → Rendering → Local Storage → Gist Sync → Init.

Alert logic (`checkDailyAlerts`, `getBPFlag`, `checkStepsHint`) runs in real-time as users type and flags clinically significant readings (e.g., HR > 120, O₂ < 92%, weight gain ≥ 2 lbs/day).
