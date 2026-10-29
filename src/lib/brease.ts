import 'server-only'

import { createBrease, type Page } from 'brease-client'
import { breaseFetch } from 'brease-client/next'
import { cache } from 'react'

import type { GlobalContent, PageContent } from './content'

// BREASE_TOKEN / BREASE_API_URL come from the environment. Every request is tagged 'brease' so the
// revalidate route can purge it; pages themselves use ISR (revalidate = 60).
export const brease = createBrease({ fetch: breaseFetch() })

/** Locales come from Brease at runtime: the route decides a page's locale, nothing here names one. */
export const getSite = cache(() => brease.getSite())

/** og:locale form of a locale code: en → en_US, hu → hu_HU. */
export const ogLocale = (locale: string) =>
  new Intl.Locale(locale)
    .maximize()
    .toString()
    .split('-')
    .filter((p, i) => i === 0 || /^[A-Z]{2}$/.test(p))
    .join('_')

/** Page IDs of the shared-content pages, used as prefixes in data-brease paths read from another page. */
export const PAGE_IDS = { global: 'pg_global' } as const

/** Slugs starting with "_" hold shared content and are never routed. */
export const isInternalSlug = (slug: string) => slug.startsWith('_')

export const getPage = cache(
  async (slug: string, locale: string): Promise<Page<PageContent> | null> => {
    if (isInternalSlug(slug)) return null
    return brease.getPage<PageContent>(slug, { locale })
  },
)

/** Site-wide content, with empty defaults so the site renders before the `_global` page exists. */
export const getGlobal = cache(async (locale: string): Promise<GlobalContent> => {
  const content = (await brease.getPage<Partial<GlobalContent>>('_global', { locale }))?.content
  return {
    template: 'global',
    siteName: content?.siteName ?? '',
    footer: { text: '', copyright: '', ...content?.footer },
  }
})

/** A navigation's links in a locale (`main`: the header, `footer`: the footer). */
export const getLinks = cache(async (key: string, locale: string) => {
  const nav = await brease.getNavigation(key, { locale })
  return (nav?.items ?? []).map((i) => ({ label: i.label, href: i.url, target: i.target }))
})
export type NavLink = Awaited<ReturnType<typeof getLinks>>[number]
