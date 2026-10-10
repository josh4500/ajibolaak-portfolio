# ajibolaak.dev

Personal portfolio + blog. Built with Next.js 16, Tailwind CSS v4, TypeScript and lucide-react, deployed on Vercel.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Updating content

All site content lives in **`src/data/profile.ts`**: name, intro, links, About text, skills, featured projects and experience. It mirrors the résumé, so update both together.

- `calendlyUrl`: your Calendly booking link. When set, the "Let's talk" button opens a menu with **Book a call** and **Send an email**, and the Contact section and mobile menu show both options. Leave it empty to offer email only.
- `projects`: add personal or open-source work with `repo`/`live` links (empty links are hidden).

**Theme:** monochrome black and white, dark by default. Visitors can switch to light mode with the sun/moon toggle. Colors are defined as CSS variables in `src/app/globals.css`.

## Notes

Short posts that live on the site at `ajibolaak.dev/notes/<name>`. Unlike the blog, which comes from Medium, notes are Markdown files in this repo.

1. Copy `content/notes/how-to-write-a-note.md` to a new file. The file name becomes the URL, e.g. `content/notes/flutter-state-management.md` → `/notes/flutter-state-management`. Use lowercase words joined by hyphens.
2. Edit the front matter at the top (`title`, `description`, `date`, `tags`) and write the note in Markdown. Code blocks are syntax-highlighted, and tables, images and links all work.
3. Remove `draft: true` to publish. Drafts show up locally (`npm run dev`) but never on the live site.
4. Commit and push. The note appears on the site within a minute.

Put images in `public/notes/` and reference them as `/notes/your-image.png`. Notes also have an RSS feed at `/notes/rss.xml`.

## Résumé

The downloadable résumé (`public/resume.pdf`) is generated from **`resume/resume.html`**:

1. Edit `resume/resume.html`.
2. Run `npm run resume` (uses Google Chrome to print the PDF).
3. Open `public/resume.pdf` to check it still fits on one page, then commit and push.

The public version lists hello@ajibolaak.dev and the website instead of a phone number.

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
