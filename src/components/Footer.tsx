import React from 'react'

import type { NavLink } from '@/lib/brease'
import type { GlobalContent } from '@/lib/content'
import { bp } from '@/lib/site'

/** Shared texts from `_global`, links from the `footer` navigation. */
export function Footer({
  global,
  links,
  prefix,
}: {
  global: GlobalContent
  links: NavLink[]
  prefix: string
}) {
  const g = (path: string) => bp(prefix, path)
  return (
    <footer className="site-footer" data-brease-block="Footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name" data-brease={g('siteName')}>
            {global.siteName}
          </p>
          <p className="muted" data-brease={g('footer.text')}>
            {global.footer.text}
          </p>
        </div>
        <nav aria-label="Footer" data-brease="nav:footer">
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
          {global.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
