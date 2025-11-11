import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ROLE_ROUTES: Record<string, string[]> = {
  superadmin: ["/dashboard", "/associations", "/members", "/payments", "/events", "/reports", "/settings"],
  admin: ["/dashboard", "/associations", "/members", "/payments", "/events", "/reports", "/settings"],
  treasurer: ["/dashboard", "/payments", "/reports"],
  member: ["/dashboard"],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")
  const isOnboardingPage = pathname.startsWith("/onboarding")
  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/associations") ||
    pathname.startsWith("/members") ||
    pathname.startsWith("/payments") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings")

  if ((isProtectedPage || isOnboardingPage) && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
