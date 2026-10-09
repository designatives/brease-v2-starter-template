import React from 'react'

import type { BasicContent, HomeContent } from '@/lib/content'

export function Hero({ c }: { c: HomeContent['hero'] }) {
  return (
    <section className="hero" data-brease-block="Hero">
      <div className="container">
        <p className="eyebrow" data-brease="hero.eyebrow">
          {c.eyebrow}
        </p>
        <h1 data-brease="hero.title">{c.title}</h1>
        <p className="lead" data-brease="hero.text">
          {c.text}
        </p>
        <a className="button" href={c.cta.href} data-brease="hero.cta.label">
          {c.cta.label}
        </a>
      </div>
    </section>
  )
}

export function Features({ c }: { c: HomeContent['features'] }) {
  return (
    <section className="features" data-brease-block="Features">
      <div className="container">
        <h2 data-brease="features.title">{c.title}</h2>
        <div className="grid">
          {c.items.map((item, i) => (
            <article key={i} className="card">
              <h3 data-brease={`features.items.${i}.title`}>{item.title}</h3>
              <p data-brease={`features.items.${i}.text`}>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Closing({ c }: { c: HomeContent['closing'] }) {
  return (
    <section className="closing" data-brease-block="Closing">
      <div className="container">
        <h2 data-brease="closing.title">{c.title}</h2>
        <p data-brease="closing.text">{c.text}</p>
        <a className="button" href={c.cta.href} data-brease="closing.cta.label">
          {c.cta.label}
        </a>
      </div>
    </section>
  )
}

export function Article({ c }: { c: BasicContent }) {
  return (
    <article className="article" data-brease-block="Article">
      <div className="container narrow">
        <h1 data-brease="title">{c.title}</h1>
        <p className="lead" data-brease="intro">
          {c.intro}
        </p>
        <div className="prose" data-brease="body" dangerouslySetInnerHTML={{ __html: c.body }} />
      </div>
    </article>
  )
}
