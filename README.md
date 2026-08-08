# sangam.dev

Personal site and portfolio. Static, built with [Astro](https://astro.build).

Live at **https://sangam.dev**.

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built output
```

`npm run build` runs `npm run pdfs` first, which copies the two résumé PDFs out of
`latex/` into `public/latex/`. `latex/` stays the source of truth; `public/latex/` is
generated and gitignored.

## Layout

```
src/data/profile.ts     every fact on the site, in one place
src/pages/index.astro   the page
src/pages/resume.json   JSON Resume endpoint
src/pages/llms.txt      markdown summary for language models
src/diagrams/           hand-authored inline SVG architecture diagrams
src/styles/global.css   all the styling
latex/                  résumé sources (see latex/Makefile)
```

**`src/data/profile.ts` is the single source of truth.** The page, `resume.json` and
`llms.txt` all render from it, so the human-readable and machine-readable versions cannot
drift apart. Change a fact once.

## Machine-readable endpoints

A meaningful share of visitors are agents rather than people — AI recruiter screeners, LLM
search, assistants asked to summarise a candidate. They are served deliberately:

| Endpoint | What it is |
|---|---|
| `/llms.txt` | Markdown summary following the [llmstxt.org](https://llmstxt.org) convention |
| `/resume.json` | [JSON Resume](https://jsonresume.org/schema/) schema |
| JSON-LD in the page | `schema.org/Person`, plus a `CreativeWork` per case study |
| `/robots.txt` | Explicitly **allows** GPTBot, ClaudeBot, PerplexityBot and friends |

The `robots.txt` posture is intentional. A portfolio exists to be found.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages.

Pages must be in **Actions** mode, not legacy branch mode. In legacy mode GitHub runs its
own Jekyll build instead — which fails on this repo, and ignores the artifact this workflow
uploads:

```bash
gh api --method PUT repos/sangamcse/resume/pages -f build_type=workflow
```

Currently served at **https://sangamcse.github.io/resume/**.

### Moving to the apex domain

All URLs derive from `astro.config.mjs`, so there are no path edits anywhere:

1. In `astro.config.mjs`, set `site: 'https://sangam.dev'` and `base: '/'`.
2. Recreate `public/CNAME` containing `sangam.dev` (see `public/` notes below for why it is
   absent while on the subpath).
3. At the DNS provider, point the apex at GitHub Pages:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
   and `www` as a `CNAME` to `sangamcse.github.io`.
4. Set the domain on the repo:
   `gh api --method PUT repos/sangamcse/resume/pages -f cname=sangam.dev`
5. Enable **Enforce HTTPS** once GitHub has issued the certificate.

Note that whatever currently serves `www.sangam.dev` stops being served at that point.

**No `CNAME` in `public/`, deliberately.** GitHub Pages reads `CNAME` out of the deployed
artifact and sets the custom domain from it. While the site is on the project subpath that
would point the domain at a site whose DNS is not ready and take it offline. It comes back
in step 2 above.

## Design notes

- No runtime dependencies beyond Astro itself. No CSS framework, no webfonts, no analytics,
  no external requests of any kind.
- Theming uses CSS `light-dark()`, so both schemes are defined once per token. An explicit
  toggle is stored in `localStorage` and applied before first paint; absent a choice, the OS
  preference wins.
- Layout uses container queries. `.shell` carries `container-type: inline-size` — remove it
  and every `@container` rule silently stops matching, collapsing the page to one column.
- Diagrams hold a `min-width` and pan on narrow screens rather than scaling down. Shrunk to
  fit a 375px viewport their type rendered at 6.5px, which was unreadable.
- The only client-side JavaScript is the theme toggle.

## Numbers

The review and PR counts come from the GitHub search API, measured per year because a
single query caps at 1000 results and silently undercounts. Review totals include
open-source work; roughly 273 of them predate HackerRank.
