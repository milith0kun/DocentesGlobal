import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import { getSheetsClient } from '../src/lib/google-auth.js';
import { SHEET_COLUMNS } from '../src/lib/google-sheets.js';

async function init() {
  const sheets = getSheetsClient();
  const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
  const headers = SHEET_COLUMNS.map(([, header]) => header);
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A1:AE1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [headers] }
  });
  console.log('Sheet initialized with headers!');
}

init().catch(console.error);
