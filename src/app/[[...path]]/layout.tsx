import { ga4Tag } from 'brease-client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import React from 'react'

import { LocaleProvider } from '@/components/locale'
import { brease, getGlobal, getSite, ogLocale } from '@/lib/brease'

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
  const siteName = seo.siteName || global.content.siteName
  return {
    metadataBase: site.url ? new URL(site.url) : undefined,
    applicationName: siteName,
    description: seo.description || undefined,
    openGraph: { siteName, locale: ogLocale(locale), type: 'website' },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({ children, params }: Props) {
  const [context, site] = await Promise.all([localeOf(params), getSite()])
  // GA4 when it's on in Brease; consent starts denied until a cookie banner calls grantAnalytics()
  const ga = ga4Tag(site)
  return (
    <html lang={context.locale} className={sans.variable}>
      <body>
        <LocaleProvider value={context}>{children}</LocaleProvider>
        {ga && (
          <>
            <Script src={ga.src} strategy="afterInteractive" />
            <Script id="brease-ga4" strategy="afterInteractive">
              {ga.inline}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
