import type { MetadataRoute } from 'next'

import { brease, isInternalSlug } from '@/lib/brease'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

// Every published page in every locale, with hreflang alternates; shared-content ("_") pages and pages set
// to noindex are left out. Tolerates a content API outage at build time.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let entries: Awaited<ReturnType<typeof brease.sitemap>>
  let refs: Awaited<ReturnType<typeof brease.getPages>>
  try {
    ;[entries, refs] = await Promise.all([brease.sitemap(SITE_URL), brease.getPages()])
  } catch (err) {
    console.warn(`Brease sitemap unavailable at build time: ${(err as Error).message}`)
    return []
  }
  const pages = await Promise.all(
    entries.map(async (e) => {
      const ref = refs.find((r) => `${SITE_URL}${r.url}` === e.url)
      if (!ref || isInternalSlug(ref.slug)) return null
      const page = await brease.getPage(ref.slug, { locale: ref.locale })
      return page?.resolvedSeo.robots.index ? { ...e, slug: ref.slug } : null
    }),
  )
  return pages
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .map((p) => ({
      url: p.slug === '' && p.url === SITE_URL ? `${SITE_URL}/` : p.url,
      changeFrequency: 'monthly' as const,
      priority: p.slug === '' ? 1 : 0.5,
      ...(Object.keys(p.alternates).length > 1 ? { alternates: { languages: p.alternates } } : {}),
    }))
}
