# ajibolaak.dev

Personal portfolio + blog. Built with Next.js 16, Tailwind CSS v4, TypeScript and lucide-react, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Make it yours

All content lives in **`src/data/profile.ts`**. Replace every `[bracketed]` placeholder and `TODO`:

- `name`: your full name. The logo initials are generated from it.
- `email`, `github`, `linkedin`
- `about`: your background and engineering philosophy
- `projects`: title, problem statement, tech tags, highlights, and `repo`/`live` links (leave a link empty to hide it)
- `experience`: role, company, dates, summary

Only add real projects, companies and numbers. Add or remove entries in the arrays as needed.

**Résumé:** put your PDF at `public/resume.pdf` and set `resumeUrl: "/resume.pdf"`. The Résumé button stays hidden while `resumeUrl` is empty.

**Theme:** monochrome black and white, dark by default. Visitors can switch to light mode with the sun/moon toggle. Colors are defined as CSS variables in `src/app/globals.css`.

## Blog (Medium)

The blog pulls your latest posts from Medium's RSS feed (`https://medium.com/feed/@ajibolaak`).

- Publish on Medium as usual. The new post shows up on the site within about an hour, with no redeploy needed.
- Medium's feed only includes your **10 most recent** posts. The blog page links to your Medium profile for older ones.
- Until you publish your first post, the site shows a "Follow me on Medium" card.
- To change the account, edit `mediumHandle` in `src/data/profile.ts`.

Code: `src/lib/medium.ts` (fetch + parse, cached for 1 hour), `src/app/blog/page.tsx`, `src/components/BlogCard.tsx`.

## Deploy to Vercel

1. Create an empty GitHub repo (e.g. `ajibolaak-portfolio`) and push:
   ```bash
   git remote add origin https://github.com/<you>/ajibolaak-portfolio.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com): **Add New → Project**, import the repo, keep the defaults, and click **Deploy**.
3. Every push to `main` redeploys automatically, and pull requests get preview URLs.

## Connect ajibolaak.dev

1. Vercel project → **Settings → Domains** → add `ajibolaak.dev`, then add `www.ajibolaak.dev` and set it to redirect to `ajibolaak.dev`.
2. At your domain registrar, choose **one** of these:
   - **Nameservers (simplest):** set them to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.
   - **DNS records:** add the A record for `@` and the CNAME for `www` exactly as Vercel shows them.
3. Wait for DNS to propagate. This usually takes minutes but can take up to 48 hours. Vercel issues the HTTPS certificate automatically.
   `.dev` domains work over HTTPS only, so the site won't load until that certificate exists. This is expected.
