import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // In production, these would redirect to separate deployments
  // For now, we'll just pass through
  if (url.pathname.startsWith('/apps/instructor')) {
    // In production, redirect to instructor app deployment
    return NextResponse.next()
  }
  
  if (url.pathname.startsWith('/apps/student')) {
    // In production, redirect to student app deployment
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/apps/:path*'
}