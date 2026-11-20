import { NextRequest } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oixlnegxnfrixhsiekej.supabase.co'
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path')
  if (!path) return new Response('missing path', { status: 400 })

  const url = `${SUPABASE_URL}/storage/v1/object/${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${SERVICE_KEY}` },
  })

  if (!res.ok) return new Response('not found', { status: 404 })

  return new Response(res.body, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'video/mp4',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
