'use client'

import { type LocaleContext, localeHref, localeLinks } from 'brease-client'
import React, { createContext, useContext } from 'react'

// The page's locale for client components: the root layout puts brease.localeContext() here.
const Context = createContext<LocaleContext | null>(null)

export function LocaleProvider({
  value,
  children,
}: {
  value: LocaleContext
  children: React.ReactNode
}) {
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useLocale() {
  const value = useContext(Context)
  if (!value) throw new Error('useLocale() needs <LocaleProvider> above it')
  return {
    ...value,
    /** A page's path from its slug, in this locale or another: href('') is this locale's home. */
    href: (slug: string, locale = value.locale) => localeHref(value.settings, slug, locale),
    links: localeLinks(value),
  }
}
