import React from 'react'

import type { FeaturesSection } from '@/lib/content'

export function Features({ section, index }: { section: FeaturesSection; index: number }) {
  const p = `sections.${index}`
  return (
    <section className="features" data-brease-section={section.id} data-brease-block={section.type}>
      <div className="container">
        <h2 data-brease={`${p}.title`}>{section.title}</h2>
        <div className="grid">
          {section.items.map((item, i) => (
            <article key={i} className="card">
              <h3 data-brease={`${p}.items.${i}.title`}>{item.title}</h3>
              <p data-brease={`${p}.items.${i}.text`}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
