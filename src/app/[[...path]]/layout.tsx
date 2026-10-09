import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { LocaleProvider } from '@/components/locale'
import { brease, getGlobal, getSite, ogLocale } from '@/lib/brease'
import { SITE_URL } from '@/lib/site'

import '../styles.css'

const sans = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans', display: 'swap' })

type Props = { children: React.ReactNode; params: Promise<{ path?: string[] }> }

// The locale of the page being shown (the default one where no page can live, e.g. a 404).
async function localeOf(params: Props['params']) {
  const { path } = await params
  const [context, site] = await Promise.all([brease.localeContext(path), getSite()])
  return (
    context ?? {
      locale: site.defaultLocale,
      settings: {
        locales: site.locales,
        defaultLocale: site.defaultLocale,
        localeStrategy: site.localeStrategy,
        urlTemplate: site.urlTemplate,
      },
      alternates: {},
      homes: {},
    }
  )
}

// Site-wide defaults; every page's own metadata comes from its Brease resolvedSeo (toMetadata).
export async function generateMetadata({ params }: Pick<Props, 'params'>): Promise<Metadata> {
  const { locale } = await localeOf(params)
  const [site, global] = await Promise.all([getSite(), getGlobal(locale)])
  const seo = site.seo[locale] ?? {}
  const siteName = seo.siteName || global.siteName
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: siteName,
    description: seo.description || undefined,
    openGraph: { siteName, locale: ogLocale(locale), type: 'website' },
    twitter: { card: 'summary_large_image' },
  }
}

const overlay = {
  src: process.env.NEXT_PUBLIC_BREASE_OVERLAY_URL,
  site: process.env.NEXT_PUBLIC_BREASE_SITE_ID,
  appOrigin: process.env.NEXT_PUBLIC_BREASE_APP_ORIGIN,
}

export default async function RootLayout({ children, params }: Props) {
  const context = await localeOf(params)
  return (
    <html lang={context.locale} className={sans.variable}>
      <body>
        <LocaleProvider value={context}>{children}</LocaleProvider>
        {/* Brease on-site toolbar (comments); only when the loader is configured */}
        {overlay.src && overlay.site && overlay.appOrigin && (
          <script
            src={overlay.src}
            data-site={overlay.site}
            data-app-origin={overlay.appOrigin}
            async
          />
        )}
      </body>
    </html>
  )
}
