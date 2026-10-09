'use client'

import React from 'react'

import { useLocale } from './locale'

/** A link to the home page in the current locale. */
export function HomeLink({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <a className={className} href={useLocale().href('')}>
      {children}
    </a>
  )
}
