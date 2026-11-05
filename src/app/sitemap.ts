import type { MetadataRoute } from 'next'

import { brease } from '@/lib/brease'

export const revalidate = 3600

// Pages search may show, in every locale, with hreflang alternates, at the site's public address (site.url).
// Empty before the site has a domain; tolerates a content API outage at build time.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const site = await brease.getSite()
    if (!site.url) return []
    return (await brease.sitemap(site.url)).map((e) => ({
      url: e.url,
      ...(Object.keys(e.alternates).length > 1 ? { alternates: { languages: e.alternates } } : {}),
    }))
  } catch (err) {
    console.warn(`Brease sitemap unavailable at build time: ${(err as Error).message}`)
    return []
  }
}
