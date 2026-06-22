import { NextResponse } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth.js';

export async function GET(request) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
  if (!spreadsheetId) {
    return NextResponse.json({ error: 'Google Sheets no está configurado.' }, { status: 503 });
  }

  const gid = process.env.GOOGLE_SHEET_GID || '0';
  return NextResponse.redirect(
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(spreadsheetId)}/edit#gid=${encodeURIComponent(gid)}`
  );
}
