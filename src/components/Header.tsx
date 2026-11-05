import { fieldPath, navPath } from 'brease-client'
import React from 'react'

import type { Global, NavLink } from '@/lib/brease'

import { HomeLink } from './HomeLink'
import { LocaleMenu } from './LocaleMenu'

/** The site name, the main navigation and the locale menu. */
export function Header({ global, links }: { global: Global; links: NavLink[] }) {
  return (
    <header className="site-header" data-brease-block="Header">
      <div className="container header-inner">
        <HomeLink className="site-name">
          <span data-brease={global.pageId ? fieldPath('siteName', global.pageId) : undefined}>
            {global.content.siteName}
          </span>
        </HomeLink>
        <div className="header-end">
          <nav aria-label="Main" data-brease={navPath('main')}>
            {links.map((l) => (
              <a
                key={`${l.href}-${l.label}`}
                href={l.href}
                target={l.target === '_blank' ? '_blank' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <LocaleMenu />
        </div>
      </div>
    </header>
  )
}
