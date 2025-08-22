# Troubleshooting: MkDocs styles not appearing on GitHub Pages

This guide walks you step‑by‑step through diagnosing and fixing missing CSS/JS styling when a MkDocs site is published to GitHub Pages.

---

## Who this is for
Anyone who:
- Can see the site live on GitHub Pages, **but styling is missing** (unstyled HTML).
- Sees 404s for CSS/JS in the browser Network panel.
- Sees styles locally with `mkdocs serve`, but **not** on GitHub Pages.

---

## Quick summary (10‑minute path)
1. **Confirm how you’re publishing** (repo → *Settings* → *Pages* → Source):
   - **Option A:** `gh-pages` branch (recommended simplest)
   - **Option B:** `main` branch, `/docs` folder
2. **Build correctly for that option** (details below).
3. Ensure your **CSS/JS paths are relative** (no leading `/`) and **registered in `mkdocs.yml`**.
4. Check that the published branch/folder **contains `.nojekyll`** (MkDocs adds it automatically when you deploy correctly).
5. In your browser DevTools → **Network**:
   - Refresh the published site, look for 404s on `*.css`/`*.js`.
   - If 404s: fix the path or the publish target (steps below).

---

## Symptoms you might see
- The site loads but **looks unstyled** (Times New Roman everywhere).
- **Material theme** features missing, icons gone, or search broken.
- Browser DevTools → Network shows **404** for paths like `/assets/stylesheets/...` or `/stylesheets/extra.css`.
- Locally (`mkdocs serve`) looks fine; **only GitHub Pages is broken**.

---

## Step 1 — Identify your GitHub Pages publishing mode

Go to **GitHub → Repo → Settings → Pages** and check the source:

### A) `gh-pages` branch
- This means GitHub Pages will serve whatever is in the **`gh-pages`** branch, at the repo root.
- **How to deploy correctly:**
  ```bash
  # from your repo root
  mkdocs gh-deploy --force
  ```
  MkDocs will build the site and push it to `gh-pages` for you, including a `.nojekyll` file and correct paths.

### B) `main` branch / `docs` folder
- This means GitHub Pages serves the **built site** from **`main` → `/docs`**.
- **How to deploy correctly:**
  1. Set `site_dir: docs` in `mkdocs.yml` (and optionally move your markdown to `src` via `docs_dir: src`).  
     Example:
     ```yaml
     site_name: My KB
     docs_dir: src        # your source markdown lives here (optional but recommended)
     site_dir: docs       # GitHub Pages serves from this folder
     theme:
       name: material
     extra_css:
       - stylesheets/extra.css
     extra_javascript:
       - javascripts/extra.js
     ```
  2. Build and commit the output:
     ```bash
     mkdocs build
     git add .
     git commit -m "Build site to docs/ for GitHub Pages"
     git push
     ```

> **Important:** Do **not** hand‑copy random files into `gh-pages` or `docs/`. Use the commands above so MkDocs writes correct paths and `.nojekyll`.

---

## Step 2 — Verify your custom CSS/JS is actually included

In `mkdocs.yml`, register your custom files using **paths relative to your `docs_dir`** (default is `docs/` unless you set it). No leading slash:

```yaml
extra_css:
  - stylesheets/extra.css
extra_javascript:
  - javascripts/extra.js
```

Place the physical files here (if `docs_dir` is default `docs/`):
```
docs/
  stylesheets/
    extra.css
  javascripts/
    extra.js
```

If you’re using **theme overrides** (e.g., Material):
```
overrides/
  assets/
    stylesheets/
      extra.css
```
Config:
```yaml
theme:
  name: material
  custom_dir: overrides
extra_css:
  - stylesheets/extra.css   # MkDocs resolves from overrides/assets/
```

---

## Step 3 — Eliminate broken (absolute) URLs

**Do not** use leading slashes (`/`) in links to assets. On project pages (`https://USER.github.io/REPO/`), `/assets/...` points to the domain root—not your repo path—and returns 404.

- **Bad:** `/stylesheets/extra.css`
- **Good:** `stylesheets/extra.css` (relative path)

Check this in the compiled HTML (next step).

---

## Step 4 — Inspect the compiled HTML locally

Run:
```bash
mkdocs build
```
Open `site/index.html` (or `docs/index.html` if using `site_dir: docs`) in a browser, **View Source**, and look for lines like:
```html
<link rel="stylesheet" href="assets/stylesheets/main.xxxxx.min.css">
<link rel="stylesheet" href="stylesheets/extra.css">
```
These **must be relative** (no leading `/`).

---

## Step 5 — Compare with what’s on GitHub

Open your deployed site in the browser → DevTools → **Network** tab → hard refresh.
- If `stylesheets/extra.css` or theme CSS files are **404**, the publish target or paths are wrong.
- If they return **200**, but styles still aren’t applied, open the file preview:
  - Confirm the file contents are what you expect.
  - If the file is empty or old, your build may not have run, or the wrong branch/folder is being served.

Also check the GitHub UI for your publishing target:
- **`gh-pages` branch:** it should contain `index.html`, `assets/`, `.nojekyll`, etc.
- **`main`/`docs` folder:** it should contain built files (HTML/CSS), plus `.nojekyll`.

---

## Step 6 — Ensure `.nojekyll` exists in the published output

MkDocs writes `.nojekyll` in the output so GitHub Pages doesn’t try to process your site as Jekyll (which can hide files/folders starting with underscores).

- If you use `mkdocs gh-deploy`: it will be present automatically.
- If you use `site_dir: docs` and commit the build: ensure `.nojekyll` is present in `docs/` and committed.

---

## Step 7 — Double‑check theme/override structure (Material example)

**Overrides directory layout:**
```
overrides/
  main.html               # (optional template override)
  assets/
    stylesheets/
      extra.css
    javascripts/
      extra.js
```

**Config:**
```yaml
theme:
  name: material
  custom_dir: overrides
extra_css:
  - stylesheets/extra.css
extra_javascript:
  - javascripts/extra.js
```

Do **not** reference `overrides/...` in `extra_css`; always reference the path **under `assets/`** (MkDocs will map it correctly).

---

## Step 8 — Common pitfalls checklist

- [ ] GitHub Pages set to **the branch/folder you actually publish to**.
- [ ] Using **`mkdocs gh-deploy --force`** (for `gh-pages`) **or** `mkdocs build` + commit (for `main/docs`).  
- [ ] `.nojekyll` present in the published output branch/folder.
- [ ] `extra_css`/`extra_javascript` paths are **relative** (no leading `/`).
- [ ] Files registered in `mkdocs.yml` **exist** under `docs_dir` (or `overrides/assets/` when using overrides).
- [ ] No `.gitignore` rule accidentally excludes your built `docs/` (if using `site_dir: docs`).
- [ ] No CDN or proxy rewriting paths.
- [ ] Hard refresh with DevTools “Disable cache” checked; test in a private window.

---

## Step 9 — Minimal working examples

### A) Deploy to `gh-pages` (recommended simplest)

**File tree (source):**
```
repo/
  docs/                 # default source markdown
  mkdocs.yml
```

**mkdocs.yml:**
```yaml
site_name: My KB
theme:
  name: material
extra_css:
  - stylesheets/extra.css
```

**Command to publish:**
```bash
mkdocs gh-deploy --force
```

**GitHub Pages settings:**
- Source: `Deploy from a branch`
- Branch: `gh-pages` / `(root)`

MkDocs creates the `gh-pages` branch with the built site, correct asset paths, and `.nojekyll`.

---

### B) Serve from `main` / `docs` folder

**File tree (source + built):**
```
repo/
  src/                  # your markdown (source) — optional but clean
  docs/                 # built site — what GitHub Pages serves
  mkdocs.yml
```

**mkdocs.yml:**
```yaml
site_name: My KB
docs_dir: src
site_dir: docs
theme:
  name: material
extra_css:
  - stylesheets/extra.css
extra_javascript:
  - javascripts/extra.js
```

**Build and publish:**
```bash
mkdocs build
git add .
git commit -m "Build site to docs/"
git push
```

**GitHub Pages settings:**
- Source: `Deploy from a branch`
- Branch: `main` / `docs`

---

## Step 10 — If you still see no styling

1. Open your published site → **View Source** and copy the `<link rel="stylesheet">` lines into an issue/note.
2. Verify each `href` returns **200** in a new tab.
3. If your site is at `https://USER.github.io/REPO/`, manually test a CSS URL like  
   `https://USER.github.io/REPO/stylesheets/extra.css` (adjust to your path).
4. If it 404s, re‑check deployment target and pathing. If it 200s but empty/old, rebuild and republish.
5. As a last resort, remove `site_dir`, run `mkdocs gh-deploy --force`, and switch GitHub Pages to `gh-pages`.

---

## Appendix — Symptom → Likely cause → Fix

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| CSS 404 at `/stylesheets/extra.css` | Absolute path points to domain root | Use `stylesheets/extra.css` (no leading `/`) |
| CSS 404 at `stylesheets/extra.css` | Not in published branch/folder | Rebuild and publish to the correct target |
| Theme CSS 404 under `assets/` | Publishing source instead of build output | Use `gh-deploy` or build to `site_dir: docs` |
| Overrides not applied | Wrong override path or not registered | Use `overrides/assets/stylesheets/extra.css` + `extra_css` |
| Works locally, not on Pages | Wrong Pages source | Switch Pages source to your build output |
| Some assets missing with underscores | Jekyll processing | Ensure `.nojekyll` is present in output |

---

## Commands cheat sheet

```bash
# Publish to gh-pages
mkdocs gh-deploy --force

# Build locally (default output to ./site)
mkdocs build

# Serve locally for testing
mkdocs serve

# Example: explicit build to docs/ for Pages main/docs mode
# (in mkdocs.yml: site_dir: docs)
mkdocs build
git add .
git commit -m "Build site to docs/"
git push
```

---

**Need a hand?** Share your `mkdocs.yml`, a screenshot of your GitHub Pages source settings, and the 404 lines from your Network tab.
