import { fieldPath, navPath } from 'brease-client'
import React from 'react'

import type { Global, NavLink } from '@/lib/brease'

/** Shared texts from `_global`, links from the `footer` navigation. */
export function Footer({ global, links }: { global: Global; links: NavLink[] }) {
  const g = (path: string) => (global.pageId ? fieldPath(path, global.pageId) : undefined)
  return (
    <footer className="site-footer" data-brease-block="Footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name" data-brease={g('siteName')}>
            {global.content.siteName}
          </p>
          <p className="muted" data-brease={g('footer.text')}>
            {global.content.footer.text}
          </p>
        </div>
        <nav aria-label="Footer" data-brease={navPath('footer')}>
          {links.map((l) => (
            <a
              key={`${l.href}-${l.label}`}
              href={l.href}
              target={l.target === '_blank' ? '_blank' : undefined}
              rel={l.target === '_blank' ? 'noopener' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container">
        <p className="muted small" data-brease={g('footer.copyright')}>
          {global.content.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
