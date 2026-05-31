const buckets = new Map();

export function clientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();

  return request.headers.get('x-real-ip') || 'unknown';
}

export function rateLimit(request, { keyPrefix, limit, windowMs }) {
  const now = Date.now();
  const key = `${keyPrefix}:${clientIp(request)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  current.count += 1;

  if (current.count > limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  return { ok: true };
}
