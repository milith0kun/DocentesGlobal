import { NextResponse } from 'next/server';
import { timingSafeEqual, createHash } from 'node:crypto';
import { signAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth.js';
import { rateLimit } from '@/lib/request-security.js';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'cgbacademy';
const TOKEN_COOKIE_MAX_AGE = 8 * 60 * 60;

function hashCompare(a, b) {
  const aHash = createHash('sha256').update(String(a)).digest();
  const bHash = createHash('sha256').update(String(b)).digest();
  return timingSafeEqual(aHash, bHash);
}

export async function POST(request) {
  const limit = rateLimit(request, { keyPrefix: 'admin_login', limit: 10, windowMs: 15 * 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Intenta nuevamente más tarde.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return NextResponse.json({ error: 'Servidor no configurado correctamente.' }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 });
  }

  const { username, password } = body || {};

  if (
    !username || !password ||
    !hashCompare(username, ADMIN_USERNAME) ||
    !hashCompare(password, adminPassword)
  ) {
    return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 });
  }

  const token = await signAdminToken(username);
  const response = NextResponse.json({ ok: true });

  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}
