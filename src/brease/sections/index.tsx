import { sectionsAttrs } from 'brease-client'
import React from 'react'

import type { Section } from '@/lib/content'

import { Closing } from './closing/Closing'
import { Features } from './features/Features'
import { Hero } from './hero/Hero'
import { Text } from './text/Text'

type Props<T extends Section['type']> = { section: Extract<Section, { type: T }>; index: number }
type AnyComponent = React.ComponentType<{ section: Section; index: number }>

/** Section type (its folder name) to component. */
export const sectionComponents: { [T in Section['type']]: React.ComponentType<Props<T>> } = {
  hero: Hero,
  features: Features,
  closing: Closing,
  text: Text,
}

/** Renders `content.sections` in order; a type that isn't in the map renders nothing. */
export function Sections({ sections }: { sections: Section[] | undefined }) {
  return (
    <div {...sectionsAttrs}>
      {(sections ?? []).map((section, index) => {
        const Component = (sectionComponents as Record<string, AnyComponent | undefined>)[
          section.type
        ]
        return Component ? <Component key={section.id} section={section} index={index} /> : null
      })}
    </div>
  )
}
