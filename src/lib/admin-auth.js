export const ADMIN_COOKIE = 'cgb_admin_session';
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

function arrayBufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlToBytes(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function encodePayload(data) {
  const json = JSON.stringify(data);
  return arrayBufferToBase64url(new TextEncoder().encode(json).buffer);
}

function decodePayload(base64url) {
  const bytes = base64urlToBytes(base64url);
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function getHmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

export async function signAdminToken(username) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error('ADMIN_SECRET no configurado');

  const now = Math.floor(Date.now() / 1000);
  const payload = encodePayload({ sub: username, iat: now, exp: now + TOKEN_TTL_SECONDS });
  const key = await getHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  const sig = arrayBufferToBase64url(sigBuffer);
  return `${payload}.${sig}`;
}

export async function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return null;
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return null;

  const dotIdx = token.lastIndexOf('.');
  if (dotIdx < 1) return null;

  const payload = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);

  try {
    const key = await getHmacKey(secret);
    const sigBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const expectedSig = arrayBufferToBase64url(sigBuffer);
    if (expectedSig !== sig) return null;

    const data = decodePayload(payload);
    if (typeof data.exp !== 'number' || data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}
