import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export {default} from "next-auth/middleware"
export async function middleware(request: NextRequest) {
  // Get the token to check if the user is authenticated
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;

  // Redirect authenticated users trying to access sign-in, sign-up, or home page to dashboard
  if (
    token &&
    (url.pathname === '/' ||
      url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify'))
  ) {
      
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users trying to access protected routes (e.g., /dashboard) to sign-in
  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Allow request to proceed if none of the above conditions match
  return NextResponse.next();
}
