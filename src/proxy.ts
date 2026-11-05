import { canonicalPath, matchRedirect } from 'brease-client'
import { type NextRequest, NextResponse } from 'next/server'

import { brease } from '@/lib/brease'

// Redirects managed in Brease apply per request, then other forms of a page's URL go to its canonical one.
export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const hit = matchRedirect(await brease.getRedirects().catch(() => []), pathname)
  if (hit) return NextResponse.redirect(new URL(hit.destination, req.url), hit.status)

  const site = await brease.getSite().catch(() => null)
  const canonical = site && canonicalPath(site, pathname)
  if (canonical && (await brease.getPages().catch(() => [])).some((p) => p.url === canonical))
    return NextResponse.redirect(new URL(canonical + search, req.url), 308)
  return NextResponse.next()
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] }
