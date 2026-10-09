'use client'

import React from 'react'

import { useLocale } from './locale'

/** The locale selector in the header; shows only when more than one locale has content. */
export function LocaleMenu() {
  const { links } = useLocale()
  if (links.length < 2) return null
  return (
    <div className="locales" role="group" aria-label="Language">
      {links.map((l) => (
        <a
          key={l.locale}
          href={l.href}
          hrefLang={l.locale}
          lang={l.locale}
          aria-current={l.current ? 'page' : undefined}
        >
          {l.label}
        </a>
      ))}
    </div>
  )
}
