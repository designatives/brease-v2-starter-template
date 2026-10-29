# BREASE.md

Rules for editing this site with Brease. Keep them when you change templates.

## Stack
- Next.js 16 App Router, React 19, TypeScript, pnpm. No CMS or database in the repo: all editable content comes from Brease through `brease-client`.
- Styling: one global stylesheet, `src/app/styles.css` (design tokens in `:root`). Font: Inter via `next/font/google` in `src/app/[[...path]]/layout.tsx`, used through `--sans`.

## Where content is read
The site follows brease-client's "Recommended structure": one optional catch-all route serves every page in every locale, and locales are a Brease setting, not code. Don't add `[locale]` or `[slug]` folders, middleware or a proxy.

- `src/lib/brease.ts`: the client and the cached loaders `getPage(slug, locale)`, `getGlobal(locale)`, `getLinks(navigationKey, locale)`. Server-side only.
- `src/app/[[...path]]/page.tsx`: every page in every locale. `brease.route()` gives the locale and slug, the page's `content.template` picks the template from `src/brease/templates.tsx`. Slugs starting with `_` are never routed.
- `src/app/[[...path]]/layout.tsx`: `<html lang>`, `LocaleProvider` (client components read the locale, its links and `href()` with `useLocale()` from `src/components/locale.tsx`), site SEO defaults, the font, the Brease toolbar loader.
- `src/brease/templates.tsx`: one entry per page template: what it renders and, optionally, its metadata. Add a template here, in `src/lib/content.ts` and in `content.schema.json` together.
- `src/components/LocaleMenu.tsx`: the locale selector in the header; it shows only when more than one locale has content.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `next.config.ts` (redirects from Brease), `src/app/api/brease/revalidate/route.ts` (called by Brease after content-only releases).

## Content model
| Page (id) | Slug | Template | Holds |
|---|---|---|---|
| `pg_home` | `""` | `home` | `hero` (eyebrow, title, text, `cta`), `features` (title, `items[]`), `closing` (title, text, `cta`) |
| `pg_about` | `about` | `page` | `title`, `intro`, `body` (HTML) |
| `pg_contact` | `contact` | `page` | same as About |
| `pg_global` | `_global` | `global` | `siteName`, `footer` (text, copyright) |

- New simple pages use the `page` template. A page that needs its own layout gets a new template.
- `body` is HTML: `<p>`, `<h2>`, `<h3>`, lists, `<blockquote>`, with `<strong>`, `<em>` and `<a href>` inline.
- `_global` is not `hidden` on purpose (the delivery API answers 404 for hidden pages); it carries `robots: noindex` and is never routed. `getGlobal()` returns empty defaults, so the site renders before it exists.
- Navigation `main` (header) and `footer` link to pages by `pageId`, so their URLs follow each locale.

## Picker attributes
- `data-brease="<path>"` on every element that renders a content value: the JSON path inside the page's `content`, array indices as numbers: `hero.title`, `features.items.1.text`.
- Content read from another page is prefixed with that page's ID: `pg_global:siteName`.
- Navigations: `data-brease="nav:main"` and `data-brease="nav:footer"` on the elements wrapping their links.
- `data-brease-block="<ComponentName>"` on the root element of every section: `Header`, `Hero`, `Features`, `Closing`, `Article`, `Footer`.

## Caching
Pages are static with ISR (`revalidate = 60`). Every Brease fetch is tagged `brease`; the revalidate route purges that tag and the released paths.

## Commands
```sh
pnpm install
cp .env.example .env.local        # BREASE_TOKEN (and BREASE_API_URL for a local Brease)
pnpm dev
pnpm typecheck && pnpm lint
```
`brease-seed/` is the site's first content. Brease imports it once when the site is set up; after that the content lives in Brease. Inside a Brease sandbox the working copy is `.brease/` (git-ignored, managed by Brease).
