import { renderToStream, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────
//  Tokens de diseño
// ─────────────────────────────────────────────
const T = {
  navy:       '#0b1f38',
  navyLight:  '#1a3352',
  sky:        '#38bdf8',
  nearBlack:  '#0f172a',
  slate:      '#334155',
  slateLight: '#64748b',
  border:     '#cbd5e1',
  borderFaint:'#e2e8f0',
  bgSection:  '#f1f5f9',
  bgLight:    '#f8fafc',
  white:      '#ffffff',
  emerald:    '#059669',
  emeraldDark:'#047857',
  emeraldBg:  '#ecfdf5',
  amber:      '#d97706',
  red:        '#b91c1c',
};

// ─────────────────────────────────────────────
//  Estilos
// ─────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily:      'Times-Roman',
    backgroundColor: T.white,
    fontSize:        10,
  },

  // ── Header ───────────────────────────────
  header: {
    backgroundColor: T.navy,
    paddingVertical:   13,
    paddingHorizontal: 42,
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  headerDivider: {
    width:           1,
    height:          34,
    backgroundColor: T.navyLight,
    marginHorizontal: 12,
  },
  headerTitles: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize:     12.5,
    fontFamily:   'Helvetica-Bold',
    color:        T.white,
    letterSpacing: 0.3,
    marginBottom:  2,
  },
  headerSub: {
    fontSize:     6.5,
    fontFamily:   'Helvetica',
    color:        T.sky,
    textTransform:'uppercase',
    letterSpacing: 1.8,
  },
  cgbLogo:     { width: 68, height: 28, objectFit: 'contain' },
  partnerLogo: { width: 68, height: 28, objectFit: 'contain' },

  // ── Franja de acento ─────────────────────
  accentBar: {
    height: 3,
  },

  // ── Barra de metadatos ───────────────────
  metaBar: {
    backgroundColor: T.bgSection,
    borderBottomWidth:  1,
    borderBottomColor:  T.border,
    borderBottomStyle: 'solid',
    paddingVertical:    4,
    paddingHorizontal: 42,
    flexDirection:     'row',
    justifyContent:    'space-between',
    alignItems:        'center',
  },
  metaGroup: {
    flexDirection: 'row',
  },
  metaItem: {
    marginRight: 18,
  },
  metaLabel: {
    fontSize:     6,
    fontFamily:   'Helvetica',
    color:        T.slateLight,
    textTransform:'uppercase',
    letterSpacing: 0.5,
    marginBottom:  0.5,
  },
  metaValue: {
    fontSize:   7,
    fontFamily: 'Helvetica-Bold',
    color:      T.slate,
  },
  metaNote: {
    fontSize:   6,
    fontFamily: 'Helvetica',
    color:      T.slateLight,
    fontStyle:  'italic',
  },

  // ── Cuerpo de contenido ──────────────────
  content: {
    paddingHorizontal: 42,
    paddingTop:        18,
    paddingBottom:     28,
    flex:              1,
  },

  // Párrafo introductorio
  introBox: {
    borderLeftWidth: 2.5,
    borderLeftColor: T.borderFaint,
    borderLeftStyle:'solid',
    paddingLeft:     8,
    paddingVertical:  5,
    marginBottom:    14,
  },
  introText: {
    fontSize:   8,
    fontFamily: 'Times-Roman',
    color:      T.slateLight,
    lineHeight:  1.55,
    textAlign:  'justify',
    fontStyle:  'italic',
  },

  // ── Encabezados de sección ───────────────
  sectionWrap: {
    marginBottom: 12,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:   7,
  },
  sectionBadge: {
    width:          18,
    height:         18,
    borderRadius:    9,
    alignItems:    'center',
    justifyContent: 'center',
    marginRight:     8,
    flexShrink:      0,
  },
  sectionBadgeText: {
    fontSize:   8.5,
    fontFamily: 'Helvetica-Bold',
    color:      T.white,
  },
  sectionTitle: {
    fontSize:     9,
    fontFamily:   'Helvetica-Bold',
    color:        T.nearBlack,
    textTransform:'uppercase',
    letterSpacing: 0.6,
    flex:          1,
  },
  sectionRule: {
    height:          1,
    flex:            1,
    backgroundColor: T.borderFaint,
    marginLeft:      8,
  },

  // ── Tabla de datos ───────────────────────
  dataTable: {
    borderWidth:  1,
    borderColor:  T.border,
    borderStyle: 'solid',
    borderRadius:  3,
  },
  dataRow: {
    flexDirection:     'row',
    borderBottomWidth:  1,
    borderBottomColor:  T.borderFaint,
    borderBottomStyle: 'solid',
    minHeight:          19,
  },
  dataRowLast: {
    borderBottomWidth: 0,
  },
  dataRowAlt: {
    backgroundColor: T.bgLight,
  },
  dataLabel: {
    width:            148,
    paddingVertical:    5,
    paddingHorizontal: 10,
    justifyContent:   'center',
    backgroundColor:  T.bgSection,
    borderRightWidth:  1,
    borderRightColor:  T.border,
    borderRightStyle: 'solid',
    flexShrink:        0,
  },
  dataLabelText: {
    fontSize:     7,
    fontFamily:   'Helvetica-Bold',
    color:        T.slateLight,
    textTransform:'uppercase',
    letterSpacing: 0.4,
  },
  dataValue: {
    flex:             1,
    paddingVertical:   5,
    paddingHorizontal: 10,
    justifyContent:   'center',
  },
  dataValueText: {
    fontSize:   9.5,
    fontFamily: 'Times-Roman',
    color:      T.nearBlack,
    lineHeight:  1.35,
  },

  // ── Cuadro de compromisos ────────────────
  commitBox: {
    borderWidth:  1,
    borderColor:  T.border,
    borderStyle: 'solid',
    borderRadius:  3,
  },
  commitIntro: {
    backgroundColor: T.bgLight,
    padding:          9,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    borderBottomStyle:'solid',
  },
  commitIntroText: {
    fontSize:   8.5,
    fontFamily: 'Times-Roman',
    color:      T.slate,
    lineHeight:  1.55,
    textAlign:  'justify',
  },
  commitIntroTextBold: {
    fontFamily: 'Times-Bold',
    color:      T.nearBlack,
  },
  commitList: {
    padding: 9,
  },
  commitItem: {
    flexDirection: 'row',
    marginBottom:   5.5,
    alignItems:    'flex-start',
  },
  commitBullet: {
    width:          15,
    height:         15,
    borderRadius:   7.5,
    alignItems:    'center',
    justifyContent: 'center',
    marginRight:    6,
    marginTop:      0.5,
    flexShrink:     0,
  },
  commitBulletText: {
    fontSize:   7,
    fontFamily: 'Helvetica-Bold',
    color:      T.white,
  },
  commitText: {
    flex:        1,
    fontSize:    8.5,
    fontFamily:  'Times-Roman',
    color:       T.nearBlack,
    lineHeight:  1.42,
  },
  commitTextBold: {
    fontFamily: 'Times-Bold',
  },

  // ── Sección de firmas ─────────────────────
  signatureSection: {
    marginTop:       18,
    paddingTop:      14,
    borderTopWidth:  1,
    borderTopColor:  T.nearBlack,
    borderTopStyle: 'solid',
  },
  signatureLabel: {
    fontSize:     6,
    fontFamily:   'Helvetica',
    color:        T.slateLight,
    textTransform:'uppercase',
    letterSpacing: 1.8,
    textAlign:    'center',
    marginBottom:  11,
  },
  signatureRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-end',
  },

  // Bloque de firma del docente
  signatureBlockLeft: {
    width:      '44%',
    alignItems: 'center',
  },
  signatureNameArea: {
    minHeight:     38,
    justifyContent:'center',
    alignItems:    'center',
    width:         '100%',
    paddingVertical: 3,
  },
  signatureCursive: {
    fontFamily: 'Times-Italic',
    fontSize:   11,
    color:      T.nearBlack,
    textAlign:  'center',
    lineHeight: 1.4,
  },
  signatureLine: {
    width:           '85%',
    height:          0.8,
    backgroundColor: T.nearBlack,
    marginTop:       4,
    marginBottom:    4,
  },
  signatureName: {
    fontSize:     7.5,
    fontFamily:   'Helvetica-Bold',
    color:        T.nearBlack,
    textAlign:    'center',
    textTransform:'uppercase',
    letterSpacing: 0.3,
  },
  signatureDoc: {
    fontSize:   6.5,
    fontFamily: 'Helvetica',
    color:      T.slateLight,
    marginTop:   1.5,
    textAlign:  'center',
    letterSpacing: 0.2,
  },
  signatureRole: {
    fontSize:     6.5,
    fontFamily:   'Helvetica',
    color:        T.slateLight,
    marginTop:    1.5,
    textAlign:    'center',
    textTransform:'uppercase',
    letterSpacing: 0.4,
    fontStyle:    'italic',
  },

  // Sello digital
  stampBlock: {
    width:           '44%',
    borderWidth:      1.2,
    borderColor:      T.emerald,
    borderStyle:     'solid',
    borderRadius:     3,
    padding:          9,
    alignItems:      'center',
    backgroundColor: T.emeraldBg,
  },
  stampHeadRow: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:   4,
  },
  stampDot: {
    width:          6,
    height:         6,
    borderRadius:   3,
    backgroundColor:T.emerald,
    marginRight:    4,
  },
  stampHeadText: {
    fontSize:     7.5,
    fontFamily:   'Helvetica-Bold',
    color:        T.emeraldDark,
    textTransform:'uppercase',
    letterSpacing: 0.7,
  },
  stampDivider: {
    width:           '75%',
    height:          0.8,
    backgroundColor: T.emerald,
    marginBottom:     4,
  },
  stampLine: {
    fontSize:   6.5,
    fontFamily: 'Helvetica',
    color:      '#065f46',
    marginBottom: 1.5,
    textAlign:  'center',
    lineHeight: 1.3,
  },
  stampDate: {
    fontSize:   7,
    fontFamily: 'Helvetica-Bold',
    color:      T.emeraldDark,
    marginTop:   3.5,
    textAlign:  'center',
  },
  stampPill: {
    marginTop:        3.5,
    backgroundColor:  T.emerald,
    paddingVertical:  1.5,
    paddingHorizontal:7,
    borderRadius:     2,
  },
  stampPillText: {
    fontSize:     6,
    fontFamily:   'Helvetica-Bold',
    color:        T.white,
    textTransform:'uppercase',
    letterSpacing: 0.8,
  },

  // ── Nota legal debajo de firmas ───────────
  legalNote: {
    marginTop:   11,
    paddingTop:   6,
    borderTopWidth:  0.5,
    borderTopColor:  T.borderFaint,
    borderTopStyle: 'solid',
  },
  legalNoteText: {
    fontSize:   6,
    fontFamily: 'Helvetica',
    color:      T.slateLight,
    textAlign:  'center',
    lineHeight: 1.4,
  },

  // ── Watermark ────────────────────────────
  watermark: {
    position:   'absolute',
    top:        '37%',
    left:        0,
    right:       0,
    textAlign:  'center',
    fontSize:   50,
    fontFamily: 'Helvetica-Bold',
    color:      'rgba(0,0,0,0.035)',
    letterSpacing: 8,
    transform:  'rotate(-38deg)',
  },

  // ── Pie de página ─────────────────────────
  pageFooter: {
    paddingHorizontal: 42,
    paddingVertical:    7,
    flexDirection:     'row',
    justifyContent:   'space-between',
    alignItems:        'center',
    borderTopWidth:     0.5,
    borderTopColor:     T.borderFaint,
    borderTopStyle:    'solid',
    backgroundColor:   T.bgLight,
  },
  footerText: {
    fontSize:   6.5,
    fontFamily: 'Helvetica',
    color:      T.slateLight,
  },
  footerBold: {
    fontFamily: 'Helvetica-Bold',
    color:      T.slate,
  },
});

// ─────────────────────────────────────────────
//  Utilidades
// ─────────────────────────────────────────────
function toTitleCase(str) {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

const COMPROMISOS = [
  {
    letra: 'A',
    titulo: 'Metodología Doing by Learning',
    cuerpo: 'Se estipula la ejecución rigurosa de la metodología de aprendizaje práctico como pilar académico fundamental. El docente se compromete a diseñar y ejecutar cada sesión enfocada en experiencias prácticas directas, proyectos aplicados, y ejercicios que generen resultados medibles y demostrables. Se requiere que el 70% del tiempo de clase esté dedicado a actividades prácticas hands-on, no meramente teóricas. El docente debe documentar avances mediante entregas de trabajos y proyectos que demuestren dominio de competencias.',
  },
  {
    letra: 'B',
    titulo: 'Fechas de corte innegociables',
    cuerpo: 'El docente se compromete a cumplir estrictamente con los plazos institucionales establecidos para: (1) Entrega de material académico (syllabus, guías, recursos) 5 días antes de cada módulo. (2) Actas de calificaciones completas dentro de 48 horas de finalizada cada evaluación. (3) Grabaciones y retroalimentaciones de sesiones dentro de 24 horas. (4) Disponibilidad para reporte de asistencia semanal. El incumplimiento de estas fechas afecta directamente la operatividad institucional y conlleva sanciones progresivas.',
  },
  {
    letra: 'C',
    titulo: 'Protocolo de Imagen y Comunicación',
    cuerpo: 'El docente se adhiere incondicionalmente a los estándares de identidad institucional. Esto incluye: uso obligatorio de logos y tipografía aprobada en materiales, mantener un tono profesional y coherente en toda comunicación escrita, utilizar únicamente canales oficiales de la institución para contactar estudiantes (no redes sociales personales), mantener lenguaje formal y académico en interacciones, respetar protocolos de confidencialidad en datos de estudiantes, y alinearse con la filosofía institucional en todos los mensajes públicos.',
  },
  {
    letra: 'D',
    titulo: 'Política de Asistencia y Puntualidad',
    cuerpo: 'El docente se compromete a: (1) Conectarse 10 minutos antes de cada sesión para verificar equipos y conexión. (2) Iniciar la clase exactamente a la hora programada, sin retrasos. (3) Mantener cámara activa y visible durante toda la sesión (excepto emergencias justificadas). (4) Usar fondo institucional (virtual o físico) aprobado, sin ambientes privados. (5) Contar con micrófono de calidad profesional y conectividad de mínimo 10 Mbps. (6) Asistencia mínima del 95% en todas las sesiones programadas.',
  },
  {
    letra: 'E',
    titulo: 'Programa Docente TOP',
    cuerpo: 'Al aceptar este programa, el docente se compromete a estándares de excelencia superior incluyendo: (1) Participación en capacitaciones mensuales de actualización pedagógica. (2) Mentoría a docentes nuevos. (3) Innovación permanente en diseño de contenidos y metodología. (4) Evaluaciones de desempeño trimestral con retroalimentación institucional. (5) Compromiso de mantener una puntuación de satisfacción de estudiantes mayor a 4.5/5. (6) Disponibilidad para proyectos estratégicos institucionales. Los beneficios incluyen compensación adicional, reconocimiento público, y prioridad en nuevas oportunidades.',
  },
];

// ─────────────────────────────────────────────
//  Subcomponentes
// ─────────────────────────────────────────────
const SectionHead = ({ num, title, color }) => (
  <View style={S.sectionRow}>
    <View style={[S.sectionBadge, { backgroundColor: color }]}>
      <Text style={S.sectionBadgeText}>{num}</Text>
    </View>
    <Text style={S.sectionTitle}>{title}</Text>
    <View style={S.sectionRule} />
  </View>
);

const DataRow = ({ label, value, alt, last }) => (
  <View style={[S.dataRow, alt && S.dataRowAlt, last && S.dataRowLast]}>
    <View style={S.dataLabel}>
      <Text style={S.dataLabelText}>{label}</Text>
    </View>
    <View style={S.dataValue}>
      <Text style={S.dataValueText}>{value || '—'}</Text>
    </View>
  </View>
);

// ─────────────────────────────────────────────
//  Documento PDF principal
// ─────────────────────────────────────────────
const DocentePDF = ({ data, institucion, dateStr, logoBase64, cgbLogoBase64, brandColor }) => {
  const paymentMethod = data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;
  const signatureName = toTitleCase(data.nombre);
  const accent = brandColor || T.nearBlack;

  return (
    <Document>
      <Page size="A4" style={S.page}>

        {/* Marca de agua */}
        <Text style={S.watermark} fixed>DOCUMENTO OFICIAL</Text>

        {/* ── Cabecera (repetida en cada página) ── */}
        <View style={S.header} fixed>
          <View style={S.headerLeft}>
            {cgbLogoBase64 ? <Image src={cgbLogoBase64} style={S.cgbLogo} /> : null}
            <View style={S.headerDivider} />
            <View style={S.headerTitles}>
              <Text style={S.headerTitle}>Declaración de Conformidad de Compromisos</Text>
              <Text style={S.headerSub}>{institucion} · Registro Docente Oficial</Text>
            </View>
          </View>
          {logoBase64 ? <Image src={logoBase64} style={S.partnerLogo} /> : null}
        </View>

        {/* Franja de color de marca */}
        <View style={[S.accentBar, { backgroundColor: accent }]} fixed />

        {/* Barra de metadatos */}
        <View style={S.metaBar} fixed>
          <View style={S.metaGroup}>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Fecha de emisión</Text>
              <Text style={S.metaValue}>{dateStr}</Text>
            </View>
            <View style={S.metaItem}>
              <Text style={S.metaLabel}>Institución</Text>
              <Text style={S.metaValue}>{institucion}</Text>
            </View>
            <View>
              <Text style={S.metaLabel}>Docente</Text>
              <Text style={S.metaValue}>{data.nombre}</Text>
            </View>
          </View>
          <Text style={S.metaNote}>Documento generado electrónicamente · No requiere firma manuscrita</Text>
        </View>

        {/* ── Cuerpo ── */}
        <View style={S.content}>

          {/* Texto de apertura */}
          <View style={S.introBox}>
            <Text style={S.introText}>
              El presente documento constituye una DECLARACIÓN JURADA DE CONFORMIDAD, suscrita de forma voluntaria y electrónica por el docente identificado a continuación. Esta declaración formaliza la aceptación incondicional e irrevocable de los TÉRMINOS INNEGOCIABLES DE COLABORACIÓN establecidos por {institucion}. El docente declara bajo juramento que ha leído, comprendido y acepta en su totalidad cada uno de estos compromisos, con pleno conocimiento de sus alcances legales y consecuencias institucionales.
            </Text>
          </View>

          {/* Sección 1: Información personal */}
          <View style={S.sectionWrap} wrap={false}>
            <SectionHead num="1" title="Información Personal y de Contacto" color={accent} />
            <View style={S.dataTable}>
              <DataRow label="Nombre completo"        value={data.nombre}    />
              <DataRow label="Documento de identidad" value={data.documento}  alt />
              <DataRow label="Correo electrónico"     value={data.correo}    />
              <DataRow label="Teléfono (WhatsApp)"    value={data.telefono}   alt />
              <DataRow label="Dirección de residencia"value={data.direccion}  last />
            </View>
          </View>

          {/* Sección 2: Perfil profesional */}
          <View style={S.sectionWrap} wrap={false}>
            <SectionHead num="2" title="Perfil Profesional y Datos Bancarios" color={accent} />
            <View style={S.dataTable}>
              <DataRow label="Profesión / Grado académico"  value={data.profesion}                         />
              <DataRow label="Softwares especializados"      value={data.softwares || 'Ninguno especificado'} alt />
              <DataRow label="Entidad financiera / Método"   value={paymentMethod}                          />
              <DataRow label="Número de cuenta"              value={data.numeroCuenta}                       alt last />
            </View>
          </View>

          {/* Sección 3: Compromisos */}
          <View style={S.sectionWrap} wrap={false}>
            <SectionHead num="3" title="Términos Innegociables de Colaboración" color={accent} />
            <View style={S.commitBox}>
              <View style={S.commitIntro}>
                <Text style={S.commitIntroText}>
                  Yo, <Text style={S.commitIntroTextBold}>{data.nombre}</Text>, identificado(a) con documento <Text style={S.commitIntroTextBold}>{data.documento}</Text>, declaro bajo juramento y con pleno conocimiento de mis responsabilidades legales que: (1) la información personal y profesional consignada es veraz, exacta y completa; (2) he leído y comprendido íntegramente los cinco términos innegociables de colaboración que se detallan; (3) acepto de manera incondicional e irrevocable cada compromiso y sus implicaciones; (4) autorizo a <Text style={S.commitIntroTextBold}>{institucion}</Text> a aplicar políticas institucionales en caso de incumplimiento. Los siguientes términos son requisitos obligatorios:
                </Text>
              </View>
              <View style={S.commitList}>
                {COMPROMISOS.map(({ letra, titulo, cuerpo }) => (
                  <View key={letra} style={S.commitItem}>
                    <View style={[S.commitBullet, { backgroundColor: accent }]}>
                      <Text style={S.commitBulletText}>{letra}</Text>
                    </View>
                    <Text style={S.commitText}>
                      <Text style={S.commitTextBold}>{titulo}: </Text>
                      {cuerpo}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ── Firmas ── */}
          <View style={S.signatureSection} wrap={false}>
            <Text style={S.signatureLabel}>— Declaración y Validación —</Text>

            <View style={S.signatureRow}>

              {/* Firma del docente */}
              <View style={S.signatureBlockLeft}>
                <View style={S.signatureNameArea}>
                  <Text style={S.signatureCursive}>{signatureName}</Text>
                </View>
                <View style={S.signatureLine} />
                <Text style={S.signatureName}>{data.nombre}</Text>
                <Text style={S.signatureDoc}>DNI / C.E.: {data.documento}</Text>
                <Text style={S.signatureRole}>Docente · {institucion}</Text>
              </View>

              {/* Sello de validación digital */}
              <View style={S.stampBlock}>
                <View style={S.stampHeadRow}>
                  <View style={S.stampDot} />
                  <Text style={S.stampHeadText}>Validación Digital</Text>
                </View>
                <View style={S.stampDivider} />
                <Text style={S.stampLine}>Aceptación registrada vía plataforma</Text>
                <Text style={S.stampLine}>Datos biométricos e IP registrados</Text>
                <Text style={S.stampLine}>Consentimiento informado y voluntario</Text>
                <Text style={S.stampDate}>Fecha: {dateStr}</Text>
                <View style={S.stampPill}>
                  <Text style={S.stampPillText}>Conforme · Válido</Text>
                </View>
              </View>

            </View>

            {/* Nota legal al pie */}
            <View style={S.legalNote}>
              <Text style={S.legalNoteText}>
                Este documento fue generado electrónicamente y tiene plena validez según la política de firma digital institucional de {institucion}.{'\n'}
                La firma cursiva reproducida constituye una representación digital del consentimiento otorgado por el docente al completar el proceso de registro en la plataforma.
              </Text>
            </View>
          </View>

        </View>

        {/* ── Pie de página (repetido en cada página) ── */}
        <View style={S.pageFooter} fixed>
          <Text style={S.footerText}>
            Documento oficial de <Text style={S.footerBold}>{institucion}</Text>
            {' '}· Generado electrónicamente · Política de firma digital institucional
          </Text>
          <Text
            style={S.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>

      </Page>
    </Document>
  );
};

// ─────────────────────────────────────────────
//  Exportación principal
// ─────────────────────────────────────────────
export async function generateDocentePdfBuffer(data, institucion, dateStr) {
  // Determinar logo e identidad visual por marca
  const MARCA_CONFIG = {
    ciip:    { logo: 'ciip-white.png',           color: '#0082c3', mime: 'image/png'  },
    geomina: { logo: 'geomina-new.png',          color: '#d97706', mime: 'image/png'  },
    biomedic:{ logo: 'biomedic-logo-white.png',  color: '#10b981', mime: 'image/png'  },
  };

  const marcaKey = (data.marca || '').split(',')[0].trim().toLowerCase();
  const marcaCfg = MARCA_CONFIG[marcaKey] || { logo: null, color: '#0f172a', mime: 'image/png' };

  const loadAsset = (filename, mimeOverride) => {
    try {
      const full = path.join(process.cwd(), 'public', 'assets', filename);
      if (!fs.existsSync(full)) return null;
      const buf  = fs.readFileSync(full);
      const mime = mimeOverride || (filename.endsWith('.jpeg') || filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png');
      return `data:${mime};base64,${buf.toString('base64')}`;
    } catch {
      return null;
    }
  };

  const cgbLogoBase64 = loadAsset('cgb-logo-clean.png', 'image/png');
  const logoBase64    = marcaCfg.logo ? loadAsset(marcaCfg.logo, marcaCfg.mime) : null;

  const stream = await renderToStream(
    <DocentePDF
      data={data}
      institucion={institucion}
      dateStr={dateStr}
      logoBase64={logoBase64}
      cgbLogoBase64={cgbLogoBase64}
      brandColor={marcaCfg.color}
    />
  );

  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data',  chunk => chunks.push(chunk));
    stream.on('end',   ()    => resolve(Buffer.concat(chunks)));
    stream.on('error', err   => reject(err));
  });
}
