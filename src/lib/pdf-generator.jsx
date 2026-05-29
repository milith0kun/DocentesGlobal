import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image, renderToBuffer } from '@react-pdf/renderer';
import path from 'path';

// Registrar fuente (usa la fuente del sistema como fallback)
Font.register({
  family: 'Helvetica',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#0284c7',
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  headerText: {
    textAlign: 'right',
  },
  institutionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codeBox: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#0284c7',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  codeValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingVertical: 2,
  },
  label: {
    width: 140,
    fontSize: 10,
    color: '#64748b',
  },
  value: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkItem: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center',
  },
  checkMark: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  checkLabel: {
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

const compromisos = [
  'Metodología Doing by Learning',
  'Fechas de corte innegociables',
  'Protocolo de imagen y comunicación',
  'Política de asistencia',
  'Programa Docente TOP',
];

function ConformidadDocument({ data }) {
  const metodo = data.metodoPago === 'otro' ? data.metodoPagoOtro : data.metodoPago;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a' }}>DOCENTES</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>Sistema de Gestión Académica</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.institutionName}>{data.institucion}</Text>
            <Text style={styles.subtitle}>Ecosistema Digital de Capacitación</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>Declaración de Conformidad Docente</Text>

        {/* Código y Fecha */}
        <View style={styles.codeBox}>
          <View>
            <Text style={styles.codeLabel}>Código de Registro</Text>
            <Text style={styles.codeValue}>{data.code}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.codeLabel}>Fecha de Registro</Text>
            <Text style={styles.codeValue}>{data.fecha}</Text>
          </View>
        </View>

        {/* Datos Personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Docente</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre Completo:</Text>
            <Text style={styles.value}>{data.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Documento:</Text>
            <Text style={styles.value}>{data.documento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Correo Electrónico:</Text>
            <Text style={styles.value}>{data.correo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{data.telefono}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Nacimiento:</Text>
            <Text style={styles.value}>{data.fechaNacimiento}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Institución:</Text>
            <Text style={[styles.value, { color: '#0284c7' }]}>{data.institucion}</Text>
          </View>
        </View>

        {/* Compromisos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compromisos Aceptados</Text>
          {compromisos.map((c, i) => (
            <View key={i} style={styles.checkItem}>
              <View style={styles.checkMark}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.checkLabel}>{c}</Text>
            </View>
          ))}
        </View>

        {/* Datos de Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de Pago</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Método de Pago:</Text>
            <Text style={styles.value}>{metodo?.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Número de Cuenta:</Text>
            <Text style={styles.value}>{data.numeroCuenta}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>{data.direccion}</Text>
          </View>
        </View>

        {/* Declaración */}
        <View style={[styles.section, { backgroundColor: '#f8fafc', padding: 12, borderRadius: 6, borderWidth: 1, borderColor: '#e2e8f0' }]}>
          <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#475569', lineHeight: 1.5 }}>
            "Confirmo que acepto el Manual Operativo del Docente. Comprendo la metodología práctica y los horarios de entrega innegociables. Acepto el sistema de penalidades y autorizo el uso de mi firma digital para certificados."
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>CIIP LATAM • GEOMINA • BIOMEDIC | © {new Date().getFullYear()}</Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>Documento generado automáticamente — Sistema de Gestión Docente</Text>
        </View>
      </Page>
    </Document>
  );
}

/**
 * Genera un PDF de conformidad como Buffer.
 * @param {object} data - Datos del docente
 * @returns {Promise<Buffer>}
 */
export async function generateConformidadPDF(data) {
  const buffer = await renderToBuffer(<ConformidadDocument data={data} />);
  return buffer;
}
