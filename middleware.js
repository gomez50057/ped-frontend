// middleware.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // Rutas públicas
  if (pathname === '/login' || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Comprueba token
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  try {
    jwt.verify(token, process.env.SIMPLE_JWT_SIGNING_KEY);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res;
  }
}

// El patrón con ":path*" coincide con "/dashboard", "/dashboard/" y subrutas:
//  - /dashboard            → path* = ""
//  - /dashboard/           → path* = ""
//  - /dashboard/foo        → path* = "foo"
//  - /dashboard/foo/bar    → path* = "foo/bar"
export const config = {
  matcher: ['/dashboard/:path*'],
};
