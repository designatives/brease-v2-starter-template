import React from 'react'

import type { HeroSection } from '@/lib/content'

export function Hero({ section, index }: { section: HeroSection; index: number }) {
  const p = `sections.${index}`
  return (
    <section className="hero" data-brease-section={section.id} data-brease-block={section.type}>
      <div className="container">
        <p className="eyebrow" data-brease={`${p}.eyebrow`}>
          {section.eyebrow}
        </p>
        <h1 data-brease={`${p}.title`}>{section.title}</h1>
        <p className="lead" data-brease={`${p}.text`}>
          {section.text}
        </p>
        <a className="button" href={section.cta.href} data-brease={`${p}.cta.label`}>
          {section.cta.label}
        </a>
      </div>
    </section>
  )
}
