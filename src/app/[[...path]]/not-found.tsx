'use client'

import React from 'react'

import { useLocale } from '@/components/locale'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>This page doesn’t exist.</p>
      <a className="button" href={useLocale().href('')}>
        Back to the home page
      </a>
    </main>
  )
}
