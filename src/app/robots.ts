import type { MetadataRoute } from 'next'

import { getSite } from '@/lib/brease'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const url = (await getSite().catch(() => null))?.url?.replace(/\/+$/, '')
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    ...(url ? { sitemap: `${url}/sitemap.xml` } : {}),
  }
}
