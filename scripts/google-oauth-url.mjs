import nextEnv from '@next/env';
import { getGoogleOAuthConsentUrl } from '../src/lib/google-auth.js';

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

console.log(getGoogleOAuthConsentUrl());
