import { NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth.js';

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifyAdminToken(token);

  // Usuario ya autenticado visita /admin → va directo al dashboard
  if (pathname === '/admin') {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Dashboard requiere sesión válida
  if (!session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
