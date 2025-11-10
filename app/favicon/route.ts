import { NextResponse } from 'next/server'

/**
 * Route handler untuk /favicon
 * Redirect ke /favicon.ico untuk menghindari 404 error
 */
export async function GET() {
  return NextResponse.redirect(new URL('/favicon.ico', process.env.NEXT_PUBLIC_SITE_URL || 'https://tekna.id'), {
    status: 301, // Permanent redirect
  })
}

