import React from 'react'

import type { ClosingSection } from '@/lib/content'

export function Closing({ section, index }: { section: ClosingSection; index: number }) {
  const p = `sections.${index}`
  return (
    <section className="closing" data-brease-section={section.id} data-brease-block={section.type}>
      <div className="container">
        <h2 data-brease={`${p}.title`}>{section.title}</h2>
        <p data-brease={`${p}.text`}>{section.text}</p>
        <a className="button" href={section.cta.href} data-brease={`${p}.cta.label`}>
          {section.cta.label}
        </a>
      </div>
    </section>
  )
}
