import { fieldPath, type Page } from 'brease-client'
import React from 'react'

import { Sections } from '@/brease/sections'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getGlobal, getLinks } from '@/lib/brease'
import type { BasicContent, HomeContent, PageContent } from '@/lib/content'

/** How each page template renders: the `template` field of a page's content picks one. */
type Template = {
  render: (props: { page: Page<PageContent>; locale: string }) => Promise<React.ReactNode>
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
      <Header global={global} links={nav} />
      <main>{children}</main>
      <Footer global={global} links={footer} />
    </>
  )
}

const home: Template = {
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
            <h1 data-brease={fieldPath('title')}>{c.title}</h1>
          </div>
          <Sections sections={c.sections} />
        </article>
      </Shell>
    )
  },
}

export const templates: Record<string, Template> = { home, page }
