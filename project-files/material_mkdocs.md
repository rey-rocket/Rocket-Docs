# Material for MkDocs: Setup, Best Practice, Customization & Troubleshooting

> A compact, practical guide for creating and maintaining high‑quality docs with **Material for MkDocs**.

---

## 1) Quick Start

### Install
- **Recommended (venv):**
  ```bash
  python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
  pip install mkdocs-material
  ```
- **Docker (no local Python needed):**
  ```bash
  docker run --rm -it -v ${PWD}:/docs -p 8000:8000 squidfunk/mkdocs-material
  ```

### Create & Serve
```bash
mkdocs new .           # scaffolds docs/ and mkdocs.yml
mkdocs serve           # live preview (watch)
# Faster incremental rebuild of the current page:
mkdocs serve --dirtyreload
```

### Build & Publish
```bash
mkdocs build           # outputs static site to /site
mkdocs gh-deploy --force  # deploys to gh-pages (GitHub Pages)
```

---

## 2) Project Structure (baseline)

```
.
├─ docs/
│  └─ index.md
└─ mkdocs.yml
```

Optional additions:
```
docs/
  images/            # images, SVGs
  stylesheets/extra.css
  javascripts/extra.js
overrides/           # Jinja2 template overrides (advanced)
```

---

## 3) Minimal `mkdocs.yml`

```yaml
site_name: My Project Docs
site_url: https://<user>.github.io/<repo>/
theme:
  name: material
```

> **Tip:** set `site_url` early (especially for GitHub Pages under a subpath) to ensure correct URLs and for plugins that depend on it.

---

## 4) Recommended Starter `mkdocs.yml` (batteries included)

```yaml
site_name: My Project
site_url: https://example.com/docs/
repo_url: https://github.com/your/repo
repo_name: your/repo

theme:
  name: material
  language: en
  icon:
    logo: material/book-open-page-variant
  features:
    - navigation.instant
    - navigation.tabs
    - navigation.sections
    - navigation.footer
    - toc.integrate
    - search.suggest
    - search.highlight
    - content.code.copy

# Add brand colors, dark mode toggle, etc.
# palette:
#   - scheme: default
#     primary: indigo
#     accent: indigo
#   - scheme: slate
#     primary: indigo
#     accent: indigo
#     toggle:
#       icon: material/brightness-4
#       name: Switch to dark mode

plugins:
  - search
  # Optional extras (see Enhancements below)
  # - awesome-pages
  # - redirects
  # - git-revision-date-localized

markdown_extensions:
  - admonition
  - attr_list
  - md_in_html
  - tables
  - footnotes
  - pymdownx.details
  - pymdownx.superfences
  - pymdownx.highlight:
      anchor_linenums: true
      line_spans: __span
      pygments_lang_class: true
  - pymdownx.inlinehilite
  - pymdownx.tabbed:
      alternate_style: true

extra_css:
  - stylesheets/extra.css
extra_javascript:
  - javascripts/extra.js

nav:
  - Home: index.md
  - Guide:
      - Getting Started: guide/getting-started.md
      - FAQ: guide/faq.md
```

---

## 5) Authoring Best Practice

- **One H1 per page** (the page title); use `##` and below for sections.
- **Keep slugs predictable**: lowercase filenames with hyphens (`getting-started.md`).
- **Cross‑link relatively** (`../other-page/` or `other-page.md`), avoid absolute site‑root links.
- **Break up dense content** with:
  - **Admonitions** (tips, warnings):
    ```md
    !!! tip "Pro tip"
        Use `!!!` blocks to highlight important info.
    ```
  - **Content tabs** (compare variants):
    ```md
    === "Python"
        ```py
        print("hello")
        ```
    === "Bash"
        ```bash
        echo hello
        ```
    ```
  - **Code fences** with highlighting & line anchors (see extensions config above).
- **Images**: prefer SVG for icons/diagrams; use `attr_list` for sizing:
  ```md
  ![Diagram](images/flow.svg){ width="720" }
  ```
- **Navigation**: use **section index pages** (`section/index.md`) so clicking a folder opens a landing page.
- **Search hygiene**: meaningful headings; avoid giant pages when possible.

---

## 6) Customization (CSS/JS & Theme Overrides)

### Extra CSS & JS
- Place files under `docs/stylesheets/extra.css` and `docs/javascripts/extra.js`, then reference in `mkdocs.yml` as above.
- If you add JS and use **instant navigation**, initialize on each page load:
  ```js
  document$.subscribe(() => {
    // your JS init here
  })
  ```

### Theme Extension (advanced)
- Create an `overrides/` folder and enable:
  ```yaml
  theme:
    name: material
    custom_dir: overrides
  ```
- Override partials, e.g. `overrides/partials/footer.html`, or extend blocks in `overrides/main.html`:
  ```jinja
  {% extends "base.html" %}
  {% block extrahead %}{{ super() }}
  <meta name="robots" content="index,follow">
  {% endblock %}
  ```

---

## 7) Enhancements (Popular Plugins & Features)

> Install plugins with `pip`, then add under `plugins:` in `mkdocs.yml`.

- **Awesome Pages / Awesome Nav** – define navigation with lightweight `.pages`/YAML files in folders.
  ```yaml
  plugins:
    - search
    - awesome-pages
  ```
- **Redirects** – keep old URLs working after file moves/renames.
  ```yaml
  plugins:
    - redirects:
        redirect_maps:
          old/path.md: new/path.md
  ```
- **Git revision date (localized)** – show “Last updated” per page (needs `.git` during build).
  ```yaml
  plugins:
    - git-revision-date-localized:
        fallback_to_build_date: false
  ```
- **Versioning with `mike`** – multi‑version docs with a version switcher.
  ```bash
  pip install mike
  ```
  ```yaml
  extra:
    version:
      provider: mike
  ```
  ```bash
  mike deploy --push --update-aliases 1.0 latest
  mike set-default --push latest
  ```

---

## 8) Deployment

### GitHub Pages (two options)

**A) GitHub Actions (auto‑deploy on push)** – minimal workflow:
```yaml
# .github/workflows/ci.yml
name: ci
on:
  push:
    branches: [ main ]
permissions:
  contents: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.x' }
      - run: pip install mkdocs-material
      - run: mkdocs gh-deploy --force
```

**B) Local deploy**
```bash
mkdocs gh-deploy --force
```

**Custom domain**: add `CNAME` via repo settings; keep `site_url` accurate.

---

## 9) Common Troubleshooting

- **Theme or plugin “not found”**  
  Ensure everything is installed **in the same environment** you run `mkdocs` from (avoid mixing `brew/apt` MkDocs with `pip` plugins). Prefer a virtual environment.
- **`mkdocs.yml` not found in CI**  
  Run from the repo root, or set `-f path/to/mkdocs.yml`.
- **Broken links after deploy / assets 404**  
  Set an accurate `site_url` (especially for GitHub Pages subpaths). Use relative links inside docs.
- **YAML parsing errors** (`while scanning a simple key…`)  
  Usually indentation or a missing `:`. Compare against a minimal working `mkdocs.yml`.
- **Git-based plugins fail in Docker/CI**  
  Ensure the `.git` folder is available in the build context (required by `git-revision-date-localized`).

Quick checks:
```bash
mkdocs --version
pip show mkdocs-material
pip list | grep mkdocs
mkdocs build -v
```

---

## 10) Useful Commands (cheat sheet)

```bash
mkdocs new .                          # scaffold
mkdocs serve --dirtyreload            # live preview (fast current-page reload)
mkdocs build                          # build static site
mkdocs gh-deploy --force              # publish to GitHub Pages
mike deploy --push 1.2 latest         # publish version (with mike)
mike set-default --push latest        # set default version
```

---

## 11) Editor Quality‑of‑Life

- Enable YAML schema hints/completion for `mkdocs.yml` (VS Code + `vscode-yaml`).
- Keep Markdown tidy: limit long lines, use consistent heading levels, prefer relative links, and keep images/SVGs optimized.
- Consider pre‑commit hooks for `markdownlint`, link checking, and image optimization.

---

*Happy writing!* 🧪📘
