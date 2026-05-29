import { getSheetsClient } from './google-auth.js';

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SHEET_NAME = 'Docentes';

function assertSheetsConfig() {
  if (!SPREADSHEET_ID) {
    throw new Error('Falta GOOGLE_SPREADSHEET_ID en variables de entorno');
  }
}

function sheetRange(startCell) {
  return `${SHEET_NAME}!${startCell}`;
}

export async function appendDocenteRow(data, links = {}) {
  assertSheetsConfig();
  const sheets = getSheetsClient();

  const metodo = data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;

  // The array length should be enough to cover the existing 22 columns plus our new fields
  const row = [];
  
  // 0: Observaciones
  row[0] = ''; 
  // 1: Marca temporal
  row[1] = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
  // 2: Dirección de correo electrónico
  row[2] = data.correo || '';
  // 3: 1. Nombre completo:
  row[3] = data.nombre || '';
  // 4: 3. Institución a la que pertenece:
  row[4] = data.institucion || '';
  // 5: 4. Fecha de nacimiento:
  row[5] = data.fechaNacimiento || '';
  // 6: 5. Número de contacto preferente/ WhatsApp:
  row[6] = data.telefono || '';
  // 7: 6. Cuenta de abono preferente:
  row[7] = metodo || '';
  // 8: 8. Número de cuenta o celular asociado al abono:
  row[8] = data.numeroCuenta || '';
  // 9: PROFESIÓN
  row[9] = ''; 
  // 10: Adjuntar Curriculum Vitae (CV) actualizado:
  row[10] = links.cvUrl || '';
  // 11: Adjuntar Fotografía profesional:
  row[11] = links.fotoUrl || '';
  // 12: ¿Tiene alguna observación...
  row[12] = data.comentarios || '';
  // 13: Reto Profesional y Personal: ...
  row[13] = data.cursoSonado || '';
  // 14: Desde su perspectiva como docente...
  row[14] = data.mejoraAdmin || '';
  // 15: Indique los softwares especializados...
  row[15] = data.softwares || '';
  // 16: 2. Documento identidad
  row[16] = data.documento || '';
  // 17: 7. Dirección de vivienda
  row[17] = data.direccion || '';
  // 18: Domicilio
  row[18] = ''; 
  // 19: Resumen DOCENTE
  row[19] = ''; 
  // 20: HONORARIOS
  row[20] = ''; 
  // 21: Columna 1
  row[21] = ''; 

  // --- NUEVAS COLUMNAS (A partir de la 22) ---
  // 22: Código Sistema
  row[22] = data.code || '';
  // 23: Acepta Metodología
  row[23] = data.aceptaMetodologia ? 'Sí' : 'No';
  // 24: Acepta Protocolo
  row[24] = data.aceptaProtocolo ? 'Sí' : 'No';
  // 25: Acepta Asistencia
  row[25] = data.aceptaAsistencia ? 'Sí' : 'No';
  // 26: Acepta TOP
  row[26] = data.aceptaTop ? 'Sí' : 'No';
  // 27: Disponibilidad Sábado
  row[27] = data.aceptaSabado ? 'Sí' : 'No';
  // 28: Disponibilidad Domingo
  row[28] = data.aceptaDomingo ? 'Sí' : 'No';
  // 29: Disponibilidad Lunes
  row[29] = data.aceptaLunes ? 'Sí' : 'No';
  // 30: Link Carpeta Docente
  row[30] = links.folderUrl || '';
  // 31: Marca (e.g. ciip, geomina)
  row[31] = data.marca || '';

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: sheetRange('A1'),
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] },
  });

  return {
    updatedRange: response.data.updates?.updatedRange,
    updatedRows: response.data.updates?.updatedRows,
  };
}
