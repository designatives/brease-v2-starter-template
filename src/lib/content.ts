// Page content shapes stored in Brease (one type per template). Keep in sync with content.schema.json.

/** HTML: <p>, <h2>, <h3>, <ul>/<ol>, <blockquote>, with <strong>, <em> and <a href> inline. */
export type Html = string

export type Link = { label: string; href: string }

export type HomeContent = {
  template: 'home'
  hero: { eyebrow: string; title: string; text: string; cta: Link }
  features: { title: string; items: { title: string; text: string }[] }
  closing: { title: string; text: string; cta: Link }
}

/** A plain page: a heading, an intro line and HTML body (About, Contact, anything new). */
export type BasicContent = {
  template: 'page'
  title: string
  intro: string
  body: Html
}

/** Shared chrome, on the `_global` page. */
export type GlobalContent = {
  template: 'global'
  siteName: string
  footer: { text: string; copyright: string }
}

export type PageContent = HomeContent | BasicContent
