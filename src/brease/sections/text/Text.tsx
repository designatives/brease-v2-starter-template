import React from 'react'

import type { TextSection } from '@/lib/content'

export function Text({ section, index }: { section: TextSection; index: number }) {
  const p = `sections.${index}`
  return (
    <section
      className="text-section"
      data-brease-section={section.id}
      data-brease-block={section.type}
    >
      <div className="container narrow">
        {section.heading && <h2 data-brease={`${p}.heading`}>{section.heading}</h2>}
        <p className="lead" data-brease={`${p}.intro`}>
          {section.intro}
        </p>
        <div
          className="prose"
          data-brease={`${p}.body`}
          dangerouslySetInnerHTML={{ __html: section.body }}
        />
      </div>
    </section>
  )
}
