# Abhishek Gautam — Portfolio (Next.js)

This is the **Next.js conversion** of your original single-file HTML portfolio.

It uses:
- **Next.js 14** (App Router)
- **Static Export** (`output: 'export'`) so it works on **GitHub Pages**
- Client components for interactive parts (theme, blogs modal, contact form, etc.)
- Same design, fonts, and content as your original HTML

---

## Project Structure

```
abhishek-portfolio/
├── app/
│   ├── layout.tsx          # Root layout + fonts
│   ├── page.tsx            # Home / Hero
│   ├── globals.css         # All styles (from original)
│   ├── introduction/
│   ├── my-journey/
│   ├── achievements/
│   ├── blogs/
│   ├── games/
│   │   ├── page.tsx        # Arcade hub
│   │   └── game-theory/
│   ├── join-journey/
│   └── ...
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Providers.tsx
├── lib/
│   └── articles.ts         # Blog articles data
├── next.config.js          # Static export enabled
├── package.json
└── README.md
```

> **Games note:** The original Hill Climb, Chess, Pac-Man and Drum Kit are large canvas/WebAudio scripts.  
> They are **not yet fully ported** into React components (to keep the first version clean).  
> The Game Arcade page and Game Theory page are ready. You can later move the original `<script>` blocks into `'use client'` components under `app/games/...`.

---

## 1. Run locally

```bash
cd abhishek-portfolio
npm install
npm run dev
```

Open http://localhost:3000

---

## 2. Build for production (static files)

```bash
npm run build
```

This creates an `out/` folder with pure static HTML/CSS/JS — perfect for GitHub Pages.

---

## 3. Put it on GitHub & serve with GitHub Pages

### Option A — New repository (recommended)

1. Create a new repo on GitHub, e.g. `abhishek-portfolio`  
   (or use your existing `username.github.io` repo if you want the root domain).

2. Push the project:

```bash
cd abhishek-portfolio
git init
git add .
git commit -m "Next.js portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/abhishek-portfolio.git
git push -u origin main
```

3. **Enable GitHub Pages with GitHub Actions** (best for Next.js static export):

   - Go to repo → **Settings → Pages**
   - Under **Source** choose **GitHub Actions**

4. Create the workflow file:

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml` with:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Push the workflow:

```bash
git add .github
git commit -m "Add GitHub Pages deploy workflow"
git push
```

After a few minutes your site will be live at:

```
https://YOUR_USERNAME.github.io/abhishek-portfolio/
```

### Important if the site is **not** at the root domain

If the repo is **not** `username.github.io`, you must set `basePath` in `next.config.js`:

```js
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: '/abhishek-portfolio',   // ← change to your repo name
};
```

Then rebuild and push again.

---

### Option B — Replace your existing HTML GitHub Pages site

If you already have a repo that serves the old `index.html`:

1. Clone that repo.
2. Delete (or move) the old HTML files.
3. Copy **all** contents of `abhishek-portfolio/` into the repo root.
4. Commit & push.
5. Make sure **Settings → Pages → Source** is set to the branch that contains the built files (or use the Actions workflow above).

---

## 4. Custom domain (optional)

In the GitHub repo → Settings → Pages → Custom domain, add your domain and create the required DNS records.

---

## 5. Future: full games port

To bring the original games over:

1. Create `app/games/hill-climb/page.tsx` as a `'use client'` component.
2. Move the original Hill Climb `<script>` logic into `useEffect` + `useRef` for the canvas.
3. Do the same for Chess, Pac-Man and Drum Kit.

The original game code is still in the pasted HTML file if you need to copy it.

---

## 6. Useful commands

| Command            | What it does                  |
|--------------------|-------------------------------|
| `npm run dev`      | Local development server      |
| `npm run build`    | Static export → `out/` folder |
| `npm start`        | Serve the production build    |

---

Made with the same design system as your original portfolio.  
Feel free to extend the games and add more routes!
