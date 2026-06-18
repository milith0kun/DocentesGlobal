import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

import { getSheetsClient } from '../src/lib/google-auth.js';

async function init() {
  const sheets = getSheetsClient();
  const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
  const headers = [
    'Observaciones Admin', 'Marca temporal', 'Direccion de correo electronico', 'Nombre Completo',
    'Institucion a la que pertenece', 'Fecha de nacimiento', 'Numero de contacto preferente whatsapp',
    'Metodo de pago', 'Numero de cuenta', 'Profesion',
    'Adjuntar Curriculum Vitae', 'Adjuntar Fotografia Profesional', 'Comentarios', 'Curso Sonado',
    'Mejora Admin', 'Softwares', 'Documento Identidad',
    'Direccion de vivienda', 'Domicilio', 'Resumen Docente', 'Honorarios',
    'Columna 1', 'Codigo Sistema', 'Acepta Metodologia', 'Acepta Protocolo',
    'Acepta Asistencia', 'Acepta Top', 'Disponibilidad Sabado', 'Disponibilidad Domingo',
    'Disponibilidad Lunes', 'Link Carpeta Docente', 'Marca'
  ];
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: 'A1:AF1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [headers] }
  });
  console.log('Sheet initialized with headers!');
}

init().catch(console.error);
