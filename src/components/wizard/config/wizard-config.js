// Asset paths
export const logobiomedic = '/assets/logobiomedic.png';
export const geominaWhite = '/assets/geomina-new.png';
export const ciipWhite = '/assets/ciip-white.png';
export const biomedicLogoWhite = '/assets/biomedic-logo-white.png';
export const cgbLogo = '/assets/cgb-logo-clean.png';
export const camaraFondoVirtual = '/assets/camara_fondo_virtual.webp';
export const identidadVisualPpts = '/assets/identidad_visual_ppts.webp';
export const canalesExternosProhibidos = '/assets/canales_externos_prohibidos.webp';

// Phone country configurations
export const phoneCountries = [
  { code: 'PE', name: 'Perú', dial: '+51', min: 9, max: 9 },
  { code: 'BO', name: 'Bolivia', dial: '+591', min: 8, max: 8 },
  { code: 'CO', name: 'Colombia', dial: '+57', min: 10, max: 10 },
  { code: 'EC', name: 'Ecuador', dial: '+593', min: 9, max: 9 },
  { code: 'CL', name: 'Chile', dial: '+56', min: 9, max: 9 },
  { code: 'AR', name: 'Argentina', dial: '+54', min: 10, max: 11 },
  { code: 'MX', name: 'México', dial: '+52', min: 10, max: 10 },
  { code: 'ES', name: 'España', dial: '+34', min: 9, max: 9 },
  { code: 'US', name: 'Estados Unidos', dial: '+1', min: 10, max: 10 },
];

// Brand configuration
export const marcaConfig = {
  ciip: { nombre: 'CIIP Latam', color: '#0284c7', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(2,132,199,0.12)' },
  geomina: { nombre: 'Geomina', color: '#0ea5e9', telefono: '51925084564', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(14,165,233,0.12)' },
  biomedic: { nombre: 'Biomedic', color: '#06b6d4', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(6,182,212,0.1)' },
  ambos: { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
  'ciip,geomina': { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
  'geomina,ciip': { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
  'ciip,biomedic': { nombre: 'CIIP Latam & Biomedic', color: '#0ea5e9', telefono: '51956006498', coordinador: 'Coordinación Académica', bgGlow: 'rgba(14,165,233,0.12)' },
  'biomedic,ciip': { nombre: 'CIIP Latam & Biomedic', color: '#0ea5e9', telefono: '51956006498', coordinador: 'Coordinación Académica', bgGlow: 'rgba(14,165,233,0.12)' },
  'geomina,biomedic': { nombre: 'Geomina & Biomedic', color: '#06b6d4', telefono: '51925084564', coordinador: 'Coordinación Académica', bgGlow: 'rgba(6,182,212,0.1)' },
  'biomedic,geomina': { nombre: 'Geomina & Biomedic', color: '#06b6d4', telefono: '51925084564', coordinador: 'Coordinación Académica', bgGlow: 'rgba(6,182,212,0.1)' },
};

// Step labels
export const stepLabels = {
  1: 'Selección de Institución',
  2: 'Datos Personales',
  3: 'Metodología Doing by Learning',
  4: 'Fechas de Corte Innegociables',
  5: 'Acceso a Drive Institucional',
  6: 'Protocolo de Imagen & Comunicación',
  7: 'Política de Asistencia',
  8: 'Programa Docente TOP',
  9: 'Contacto y Datos de Pago',
  10: 'Subir Documentación',
  11: 'Perfil Profesional & Comentarios',
};

// Step content widths
export const stepWidths = {
  1: '380px',
  2: '460px',
  3: '980px',
  4: '620px',
  5: '520px',
  6: '760px',
  7: '860px',
  8: '980px',
  9: '680px',
  10: '600px',
  11: '640px',
  12: '640px',
};

// Utility: parse JSON from a fetch response safely
export const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};
