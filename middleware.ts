import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'nayos_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    const session = request.cookies.get(SESSION_COOKIE);
    const expectedSecret = process.env.ADMIN_SESSION_SECRET;

    if (!session || !expectedSecret || session.value !== expectedSecret) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/dashboard/:path*',
};
