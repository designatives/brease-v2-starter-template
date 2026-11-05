import { customTags, jsonLd } from 'brease-client'
import { toMetadata } from 'brease-client/next'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { templates } from '@/brease/templates'
import { brease, getPage, ogLocale } from '@/lib/brease'

// Every page in every locale: Brease resolves which locale and page a path is, the page's content picks
// its template (src/brease/templates.tsx).
export const revalidate = 60

type Props = { params: Promise<{ path?: string[] }> }

async function load(params: Props['params']) {
  const route = await brease.route((await params).path)
  const page = route && (await getPage(route.slug, route.locale))
  const template = page && templates[page.content.template]
  return page && route && template ? { page, locale: route.locale, template } : null
}

export async function generateStaticParams() {
  // Build goes on without pre-rendered pages if the content API has a transient hiccup;
  // pages are then rendered on first request and cached (revalidate = 60).
  try {
    return await brease.routes()
  } catch (err) {
    console.warn(`Brease pages unavailable at build time: ${(err as Error).message}`)
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loaded = await load(params)
  if (!loaded) return {}
  const meta = toMetadata(loaded.page.resolvedSeo)
  return { ...meta, openGraph: { ...meta.openGraph, locale: ogLocale(loaded.locale) } }
}

export default async function Page({ params }: Props) {
  const loaded = await load(params)
  if (!loaded) notFound()
  const seo = loaded.page.resolvedSeo
  return (
    <>
      {jsonLd(seo).map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: item.json }}
        />
      ))}
      {customTags(seo).map(({ tag: Tag, attrs, content }, i) => {
        const props = Object.fromEntries(
          Object.entries(attrs).map(([k, v]) => [k, v === '' ? true : v]),
        )
        return content ? (
          <Tag key={i} {...props} dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <Tag key={i} {...props} />
        )
      })}
      {await loaded.template.render({ page: loaded.page, locale: loaded.locale })}
    </>
  )
}
