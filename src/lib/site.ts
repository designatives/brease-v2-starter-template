export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
)

/** data-brease path: plain inside the page's own content, `<pageId>:<path>` when read from another page. */
export const bp = (prefix: string, path: string) => (prefix ? `${prefix}:${path}` : path)
