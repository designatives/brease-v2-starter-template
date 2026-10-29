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
- `src/brease/sections/`: the section types a page can hold (see Sections).
- `src/components/LocaleMenu.tsx`: the locale selector in the header; it shows only when more than one locale has content.
- `src/app/sitemap.ts`, `src/app/robots.ts`, `next.config.ts` (redirects from Brease), `src/app/api/brease/revalidate/route.ts` (called by Brease after content-only releases).

## Content model
| Page (id) | Slug | Template | Holds |
|---|---|---|---|
| `pg_home` | `""` | `home` | `sections`: `hero`, `features`, `closing` |
| `pg_about` | `about` | `page` | `title`, `sections`: `text` |
| `pg_contact` | `contact` | `page` | same as About |
| `pg_global` | `_global` | `global` | `siteName`, `footer` (text, copyright) |

- New simple pages use the `page` template. A page that needs its own layout gets a new template.
- The `page` template's `title` is a fixed field outside the list and renders as the page's `<h1>`.
- `_global` is not `hidden` on purpose (the delivery API answers 404 for hidden pages); it carries `robots: noindex` and is never routed. `getGlobal()` returns empty defaults, so the site renders before it exists. It has no sections.
- Navigation `main` (header) and `footer` link to pages by `pageId`, so their URLs follow each locale.

## Sections
`home` and `page` render `content.sections`: one list `[{ "id": "sec_…", "type": "<folder>", ...fields }]`, with the same ids, order and types in every locale of a page. `id` and `type` are reserved keys.

- `src/brease/sections/<type>/` per section type: its component and `section.json` (`name`, `description`, optional `addable`, and `fields`, the JSON Schema of the section's own fields). Add a type by adding a folder, its type in `src/lib/content.ts` and its entry in the map.
- `src/brease/sections/index.tsx`: the type-to-component map and `Sections`, which renders the list in order. A type that isn't in the map renders nothing.
- `content.schema.json` only declares `sections` as a list of `{ id, type }`; Brease adds the per-type schemas from `section.json`.
- Header and footer (from `_global` and the navigations) are site-wide, not sections.

| Type | Name | What it is |
|---|---|---|
| `hero` | Hero | Eyebrow, title, text and a button. Holds the page's `<h1>`: at most one per page, at the top. |
| `features` | Features | A heading over cards, each with a title and a text. |
| `closing` | Call to action | A centered heading, a sentence and a button. |
| `text` | Text | Optional `<h2>` heading, an intro line and an HTML body (`<p>`, `<h2>`, `<h3>`, lists, `<blockquote>`, with `<strong>`, `<em>` and `<a href>` inline). |

`scripts/migrate-sections.mjs <in-dir> <out-dir>` moved the old fixed keys into `sections` (ids are hashes of `<pageId>:<old key>`, `<pageId>:body` for the page text). It is idempotent and validates its output.

## Picker attributes
- `data-brease="<path>"` on every element that renders a content value: the JSON path inside the page's `content`, array indices as numbers: `title`, `sections.0.title`, `sections.1.items.2.text`.
- Content read from another page is prefixed with that page's ID: `pg_global:siteName`.
- Navigations: `data-brease="nav:main"` and `data-brease="nav:footer"` on the elements wrapping their links.
- The element holding the list carries `data-brease-sections="sections"`. Each section's root carries `data-brease-section="<id>"` and `data-brease-block="<type>"`.
- `data-brease-block="Header"` and `data-brease-block="Footer"` on the site-wide parts.

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
