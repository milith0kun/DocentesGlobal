import nextEnv from '@next/env';
import { exchangeGoogleOAuthCode } from '../src/lib/google-auth.js';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const code = process.argv[2];

if (!code) {
  console.error('Uso: node scripts/google-oauth-token.mjs "CODIGO_DE_GOOGLE"');
  process.exit(1);
}

const tokens = await exchangeGoogleOAuthCode(code);

console.log(JSON.stringify({
  refresh_token: tokens.refresh_token || null,
  scope: tokens.scope || null,
  token_type: tokens.token_type || null,
  expiry_date: tokens.expiry_date || null,
}, null, 2));
