export function isValidEmail(value) {
  const email = value.trim();

  if (!email) return false;
  if (/\s/.test(email)) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
