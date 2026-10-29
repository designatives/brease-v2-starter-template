import type { Page } from 'brease-client'
import { toMetadata } from 'brease-client/next'
import type { Metadata } from 'next'
import React from 'react'

import { Sections } from '@/brease/sections'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getGlobal, getLinks, PAGE_IDS } from '@/lib/brease'
import type { BasicContent, HomeContent, PageContent } from '@/lib/content'

/** How each page template renders: the `template` field of a page's content picks one. */
type Template = {
  render: (props: { page: Page<PageContent>; locale: string }) => Promise<React.ReactNode>
  metadata?: (page: Page<PageContent>) => Metadata
}

// Header and footer around every page.
async function Shell({ locale, children }: { locale: string; children: React.ReactNode }) {
  const [global, nav, footer] = await Promise.all([
    getGlobal(locale),
    getLinks('main', locale),
    getLinks('footer', locale),
  ])
  return (
    <>
      <Header siteName={global.siteName} links={nav} prefix={PAGE_IDS.global} />
      <main>{children}</main>
      <Footer global={global} links={footer} prefix={PAGE_IDS.global} />
    </>
  )
}

const home: Template = {
  // the home page title is used as is, without the site's title template
  metadata: (page) => {
    const meta = toMetadata(page.resolvedSeo)
    return { ...meta, title: { absolute: page.seo.title || meta.title.absolute } }
  },
  render: async ({ page, locale }) => {
    const c = page.content as HomeContent
    return (
      <Shell locale={locale}>
        <Sections sections={c.sections} />
      </Shell>
    )
  },
}

const page: Template = {
  render: async ({ page, locale }) => {
    const c = page.content as BasicContent
    return (
      <Shell locale={locale}>
        <article className="article">
          <div className="container narrow">
            <h1 data-brease="title">{c.title}</h1>
          </div>
          <Sections sections={c.sections} />
        </article>
      </Shell>
    )
  },
}

export const templates: Record<string, Template> = { home, page }
