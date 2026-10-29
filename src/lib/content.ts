// Page content shapes stored in Brease (one type per template). Keep in sync with content.schema.json
// and the section.json files in src/brease/sections/.

/** HTML: <p>, <h2>, <h3>, <ul>/<ol>, <blockquote>, with <strong>, <em> and <a href> inline. */
export type Html = string

export type Link = { label: string; href: string }

type SectionBase<T extends string> = { id: string; type: T }

export type HeroSection = SectionBase<'hero'> & {
  eyebrow: string
  title: string
  text: string
  cta: Link
}
export type FeaturesSection = SectionBase<'features'> & {
  title: string
  items: { title: string; text: string }[]
}
export type ClosingSection = SectionBase<'closing'> & { title: string; text: string; cta: Link }
export type TextSection = SectionBase<'text'> & { heading?: string; intro: string; body: Html }

/** One entry of `content.sections`; `type` is its folder in src/brease/sections/. */
export type Section = HeroSection | FeaturesSection | ClosingSection | TextSection

export type HomeContent = {
  template: 'home'
  sections: Section[]
}

/** A plain page: a fixed title (the page's <h1>) over its sections (About, Contact, anything new). */
export type BasicContent = {
  template: 'page'
  title: string
  sections: Section[]
}

/** Shared chrome, on the `_global` page. */
export type GlobalContent = {
  template: 'global'
  siteName: string
  footer: { text: string; copyright: string }
}

export type PageContent = HomeContent | BasicContent
