import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import { getSheetsClient } from '../src/lib/google-auth.js';
import { SHEET_COLUMNS } from '../src/lib/google-sheets.js';

const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
const sheetGid = String(process.env.GOOGLE_SHEET_GID || '0');
const sheets = getSheetsClient();

const metadata = await sheets.spreadsheets.get({
  spreadsheetId,
  fields: 'sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)),tables(tableId))',
});
const target = metadata.data.sheets.find(
  (sheet) => String(sheet.properties.sheetId) === sheetGid
);

if (!target) throw new Error(`No se encontró la pestaña con gid ${sheetGid}`);

const title = target.properties.title;
const quotedTitle = `'${title.replaceAll("'", "''")}'`;
const currentRows = (await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: `${quotedTitle}!A2:ZZ`,
})).data.values || [];

if (currentRows.some((row) => row.some((cell) => String(cell || '').trim()))) {
  throw new Error('La hoja contiene registros. Migra los datos antes de sincronizar el esquema.');
}

const headers = SHEET_COLUMNS.map(([, header]) => header);
const currentColumnCount = target.properties.gridProperties.columnCount;
const currentRowCount = target.properties.gridProperties.rowCount;
const requests = [];

for (const table of target.tables || []) {
  requests.push({ deleteTable: { tableId: table.tableId } });
}

requests.push(
  {
    updateSheetProperties: {
      properties: { sheetId: target.properties.sheetId, gridProperties: { frozenRowCount: 1 } },
      fields: 'gridProperties.frozenRowCount',
    },
  },
  {
    repeatCell: {
      range: { sheetId: target.properties.sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: headers.length },
      cell: {
        userEnteredFormat: {
          backgroundColor: { red: 0.047, green: 0.082, blue: 0.133 },
          textFormat: { foregroundColor: { red: 1, green: 1, blue: 1 }, bold: true, fontFamily: 'Arial', fontSize: 10 },
          horizontalAlignment: 'CENTER',
          verticalAlignment: 'MIDDLE',
          wrapStrategy: 'WRAP',
        },
      },
      fields: 'userEnteredFormat',
    },
  },
  {
    updateDimensionProperties: {
      range: { sheetId: target.properties.sheetId, dimension: 'ROWS', startIndex: 0, endIndex: 1 },
      properties: { pixelSize: 52 },
      fields: 'pixelSize',
    },
  },
  {
    autoResizeDimensions: {
      dimensions: { sheetId: target.properties.sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: headers.length },
    },
  },
  {
    setBasicFilter: {
      filter: {
        range: {
          sheetId: target.properties.sheetId,
          startRowIndex: 0,
          endRowIndex: currentRowCount,
          startColumnIndex: 0,
          endColumnIndex: headers.length,
        },
      },
    },
  },
  {
    setDataValidation: {
      range: {
        sheetId: target.properties.sheetId,
        startRowIndex: 1,
        endRowIndex: currentRowCount,
        startColumnIndex: 19,
        endColumnIndex: 20,
      },
      rule: {
        condition: { type: 'ONE_OF_LIST', values: [{ userEnteredValue: 'Si' }, { userEnteredValue: 'No' }] },
        strict: true,
        showCustomUi: true,
      },
    },
  },
);

if (currentColumnCount > headers.length) {
  requests.push({
    deleteDimension: {
      range: { sheetId: target.properties.sheetId, dimension: 'COLUMNS', startIndex: headers.length, endIndex: currentColumnCount },
    },
  });
}

await sheets.spreadsheets.batchUpdate({ spreadsheetId, requestBody: { requests } });
await sheets.spreadsheets.values.clear({ spreadsheetId, range: `${quotedTitle}!A:ZZ` });
await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: `${quotedTitle}!A1:V1`,
  valueInputOption: 'RAW',
  requestBody: { values: [headers] },
});
console.log(`Esquema sincronizado: ${headers.length} columnas en "${title}".`);
