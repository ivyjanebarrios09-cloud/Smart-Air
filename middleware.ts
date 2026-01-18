import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/firebase-admin";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session")?.value;

  if (!session) {
    // If there's no session, allow access to public pages, but redirect from protected ones.
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the session cookie.
  try {
    const decodedIdToken = await auth.verifySessionCookie(session, true);
    
    // If trying to access login/signup while logged in, redirect to home.
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('X-User-ID', decodedIdToken.uid);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // Session cookie is invalid. Clear it and redirect to login.
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
