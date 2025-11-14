import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('uright_token')?.value

  // Public routes
  if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register')) {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || 
      request.nextUrl.pathname.startsWith('/users') ||
      request.nextUrl.pathname.startsWith('/associations') ||
      request.nextUrl.pathname.startsWith('/members') ||
      request.nextUrl.pathname.startsWith('/contributions') ||
      request.nextUrl.pathname.startsWith('/events') ||
      request.nextUrl.pathname.startsWith('/finance') ||
      request.nextUrl.pathname.startsWith('/reports') ||
      request.nextUrl.pathname.startsWith('/notifications') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
