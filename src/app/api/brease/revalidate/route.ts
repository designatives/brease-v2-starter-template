import { revalidateHandler } from 'brease-client/next'

// Brease calls this after a content-only release goes live (signed with BREASE_REVALIDATE_SECRET).
export const POST = revalidateHandler()
