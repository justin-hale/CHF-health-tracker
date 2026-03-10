# Bill's Health Tracker
# Version 2

A private, family health tracking SPA for monitoring CHF (Congestive Heart Failure). Built as a static single-page application deployable via GitHub Pages, with GitHub Gist as the data backend.

---

## Features

- **Daily Log** — Blood pressure, heart rate, O₂, weight, symptoms, medications
- **Weekly Check-In** — Activity, diet adherence, sodium/fluid tracking, tobacco
- **Journal** — Mood tracking, emotional well-being, family notes
- **Doctor Visits** — Structured notes from appointments with tags and action items
- **Reference Guide** — CHF-specific targets, red flags, diet guide
- **Access control** — View-only password + separate editor token
- **Sync** — GitHub Gist as a private data store (no server needed)
- **Offline-first** — All data saved to localStorage, Gist sync is optional

---

## Setup

### 1. Configure Passwords

The passwords are now obfuscated using SHA-256 hashes. To change them:

1. **Using GitHub Secrets (Recommended for Security):**
   - In your GitHub repository, go to **Settings → Secrets and variables → Actions**
   - Add two secrets:
     - `VIEW_PASSWORD`: The plain text view password (e.g., `kendrick2024`)
     - `EDITOR_TOKEN`: The plain text editor token (e.g., `billscare-editor-2024`)
   - The GitHub Action will automatically compute the hashes and inject them into the HTML during deployment.

2. **Manual Hashing (Alternative):**
   - Compute SHA-256 hashes of your passwords (you can use an online tool or Node.js)
   - Open `index.html` and update the `CONFIG` block:
     ```javascript
     const CONFIG = {
       VIEW_PASSWORD_HASH: 'your_computed_hash_here',
       EDITOR_TOKEN_HASH: 'your_computed_hash_here',
     };
     ```

The `VIEW_PASSWORD` is for read-only family members. The `EDITOR_TOKEN` is given only to the person entering data (your mother-in-law, ideally).

### 2. Deploy to GitHub Pages

1. Create a new **private** GitHub repository (e.g., `bills-health-tracker`)
2. Upload all files (including `.github/workflows/`) to the repo
3. In your repository, go to **Settings → Secrets and variables → Actions**
4. Add the secrets:
   - `VIEW_PASSWORD`: The plain text view password
   - `EDITOR_TOKEN`: The plain text editor token
5. Go to **Settings → Pages**
6. Set Source to **Deploy from a branch**, branch = `gh-pages`, folder = `/(root)`
7. Push to `main` — the Action will build and deploy automatically

> **Security Note:** The real passwords are stored securely in GitHub Secrets and never appear in the deployed HTML. Only the SHA-256 hashes are injected during the build process.

### 3. Set Up Gist Sync (optional but recommended)

This allows data to persist across devices — so your mother-in-law can enter on her iPad, and you can view on your laptop.

1. Go to [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
2. Create a **Personal Access Token** with only the `gist` scope checked
3. Copy the token (starts with `ghp_`)
4. Open the app, unlock with the editor token
5. Click **⚙️ Setup Sync** in the top right
6. Paste your token, leave Gist ID blank (it will create one automatically)
7. Click **Save Configuration**
8. The app will create a private Gist and save the ID to your browser
9. Share that Gist ID with other family members so they can view (read-only mode doesn't need to sync)

---

## Usage Guide

### For the Editor (Mom)
1. Go to the app URL
2. Enter the **Editor Token** (not the password — click "Use your editor token instead")
3. Fill in Daily Log each morning after Bill's vitals
4. Do a Weekly Check-In each Sunday
5. Add journal entries anytime
6. Log doctor visits right after appointments
7. Click **☁️ Sync** occasionally to save to Gist

### For Family (Read-Only)
1. Go to the app URL
2. Enter the **View Password**
3. Browse all entries — no editing possible

---

## Moving to VS Code / Claude Code

When you're ready to expand this into a more full-featured app, the natural evolution is:

- **React + Vite** for component-based architecture
- **Supabase** or **PocketBase** for a real database with auth
- **Vercel** for hosting (free tier, private repos supported)
- Add charts/graphs for BP and weight trends over time
- Mobile push notifications for missed readings

The data structure in `appState.data` is already cleanly separated into `daily`, `weekly`, `journal`, and `visits` arrays — easy to migrate to a real database.

---

## Emergency Reference (always visible in app)

**Call 911:**
- Sudden severe shortness of breath
- Chest pain or pressure
- Fainting, confusion, blue lips/fingers

**Call doctor same day:**
- Weight gain of 2+ lbs in one day
- BP above 180/120 or below 90/60
- Heart rate above 120 bpm at rest