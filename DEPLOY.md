# NewRoof.io — Deployment Notes

## Required Environment Variables (set in Vercel dashboard)

| Variable | Description |
|----------|-------------|
| `VITE_RAILWAY_URL` | Railway Express proxy base URL including `/api` suffix (e.g. `https://revamprio-production.up.railway.app/api`) |

## Deploy Steps

### Step 1 — Push to GitHub
- Create new private repo: `FunChill/NewRoof.io`
- Push the NewRoof project folder to it

### Step 2 — Vercel Import
- Go to [vercel.com](https://vercel.com) → New Project
- Import `FunChill/NewRoof.io` from GitHub
- Framework preset: **Vite**
- Root directory: leave as-is (project root is `newroof/`)
- Build command: `npm run build` (auto-detected)
- Output directory: `dist` (auto-detected)
- Add environment variable:
  - Key: `VITE_RAILWAY_URL`
  - Value: `https://revamprio-production.up.railway.app/api`
- Click **Deploy**

### Step 3 — Custom Domain in Vercel
- Vercel dashboard → NewRoof project → Settings → Domains
- Add: `newroof.io`
- Add: `www.newroof.io`
- Vercel will display the DNS values to configure

### Step 4 — DNS in Hostinger
Log into Hostinger → Domains → newroof.io → DNS Zone

Add these records:

| Type  | Name | Value                  | TTL  |
|-------|------|------------------------|------|
| A     | @    | 76.76.21.21            | 3600 |
| CNAME | www  | cname.vercel-dns.com   | 3600 |

Save. Wait 5–30 minutes for propagation. Vercel auto-provisions SSL once DNS resolves.

---

## Post-Deploy Checklist

- [ ] `https://newroof.io` loads correctly
- [ ] `https://www.newroof.io` redirects to `https://newroof.io`
- [ ] `/visualize` loads without 404 (validates `vercel.json` rewrite)
- [ ] `/architectural-shingles` loads without 404 (validates SPA rewrite for SEO pages)
- [ ] Render test: upload photo → pick color → confirm render returns
- [ ] Render wall: use 3 renders, confirm wall appears
- [ ] Download button works on live domain
- [ ] Mobile: test photo upload on phone (label-wrapped input)
- [ ] `https://newroof.io/sitemap.xml` — accessible, 8 URLs listed
- [ ] `https://newroof.io/robots.txt` — accessible, references sitemap
- [ ] `https://newroof.io/favicon.svg` — visible in browser tab
- [ ] OG tags: validate with [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Submit `https://newroof.io/sitemap.xml` to [Google Search Console](https://search.google.com/search-console)

---

## Architecture Notes

- Frontend: Vite + React + TypeScript + Tailwind v4
- Routing: React Router v6 (SPA — all paths rewrite to index.html via vercel.json)
- Renders: Railway Express proxy → Gemini API (same backend as Revampr.io)
- Render counter: localStorage key `nr_renders_used` (3 free, then render wall)
- Config: `src/config/sites/newroof.ts` — all content/copy driven from config
- SEO pages: dynamic routes from `siteConfig.seoPages` array
