import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value
  const { pathname } = request.nextUrl
  console.log(token)
  // R O T A S   P Ú B L I C A S
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
  ]

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Se tem token e tenta ir para login ou register → manda para dashboard
  if (token && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // R O T A S   P R O T E G I D A S
  const protectedRoutes = [
    '/dashboard',
    '/users',
    '/associations',
    '/members',
    '/contributions',
    '/events',
    '/finance',
    '/reports',
    '/notifications',
    '/settings',
    '/onboarding',
  ]

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Se a rota é protegida e NÃO tem token → volta para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
