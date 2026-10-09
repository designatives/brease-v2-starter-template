import React from 'react'

import type { NavLink } from '@/lib/brease'
import { bp } from '@/lib/site'

import { HomeLink } from './HomeLink'
import { LocaleMenu } from './LocaleMenu'

/** The site name, the main navigation and the locale menu. */
export function Header({
  siteName,
  links,
  prefix,
}: {
  siteName: string
  links: NavLink[]
  prefix: string
}) {
  return (
    <header className="site-header" data-brease-block="Header">
      <div className="container header-inner">
        <HomeLink className="site-name">
          <span data-brease={bp(prefix, 'siteName')}>{siteName}</span>
        </HomeLink>
        <div className="header-end">
          <nav aria-label="Main" data-brease="nav:main">
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
