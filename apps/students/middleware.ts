import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle checkout routes specifically
  if (request.nextUrl.pathname.startsWith('/checkout/')) {
    const segments = request.nextUrl.pathname.split('/');
    const courseId = segments[2];
    
    // Validate course ID format (basic validation)
    if (courseId && courseId.length > 0 && courseId !== 'undefined') {
      // Let Next.js handle the dynamic route
      return NextResponse.next();
    }
    
    // If invalid course ID, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}