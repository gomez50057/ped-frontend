// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Usa tu misma variable de entorno:
const SECRET = new TextEncoder().encode(process.env.SIMPLE_JWT_SIGNING_KEY);

async function verifyToken(token) {
  try {
    // Ajusta el alg si firmas distinto; por defecto HS256
    const { payload } = await jwtVerify(token, SECRET, { algorithms: ['HS256'] });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get('access_token')?.value;

  // (el matcher limita a /dashboard, así que no hace falta filtrar aquí)
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname + (search || ''));
    const res = NextResponse.redirect(url);
    // Borra cookies (mismo path que usas al setearlas)
    res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
    res.cookies.set('refresh_token', '', { path: '/', maxAge: 0 });
    return res;
  }

  const valid = await verifyToken(token);
  if (!valid) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname + (search || ''));
    const res = NextResponse.redirect(url);
    res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
    res.cookies.set('refresh_token', '', { path: '/', maxAge: 0 });
    return res;
  }

  return NextResponse.next();
}

// Mantén tu patrón actual
export const config = {
  matcher: ['/dashboard/:path*'],
};
