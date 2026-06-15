// middleware.js
import { NextResponse } from 'next/server';
import { decodeJwt, jwtVerify } from 'jose';

// Usa tu misma variable de entorno:
const SECRET_VALUE = process.env.SIMPLE_JWT_SIGNING_KEY;
const SECRET = SECRET_VALUE ? new TextEncoder().encode(SECRET_VALUE) : null;

function isExpired(payload) {
  return payload?.exp && Math.floor(Date.now() / 1000) >= payload.exp;
}

async function verifyToken(token) {
  try {
    if (!SECRET) {
      const payload = decodeJwt(token);
      return isExpired(payload) ? null : payload;
    }

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
  matcher: ['/dashboard/:path*', '/seguimiento-actividades/:path*'],
};
