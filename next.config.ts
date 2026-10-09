import { breaseRedirects } from 'brease-client/next'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  agentRules: false,
  // Redirects are release content in Brease; the build goes on without them if the API is down.
  redirects: breaseRedirects(),
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  turbopack: { root: path.resolve(dirname) },
}

export default nextConfig
