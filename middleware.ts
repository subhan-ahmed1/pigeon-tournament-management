import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/about" ||
    path === "/tournaments" ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/migrate") ||
    path.startsWith("/_next") ||
    path.startsWith("/favicon")

  // Admin routes should be accessible without session check
  const isAdminPath = path.startsWith("/admin")

  // Allow admin routes to pass through without session check
  if (isAdminPath) {
    return NextResponse.next()
  }

  // Check if user is authenticated for other protected routes
  const isAuthenticated = request.cookies.has("session_id")

  // Redirect logic for protected routes (excluding admin)
  if (!isPublicPath && !isAuthenticated) {
    // Redirect to home page if trying to access protected route without authentication
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
