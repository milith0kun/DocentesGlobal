import { NextResponse } from 'next/server';
import { generateDocentePdfBuffer } from '@/lib/pdf-generator.jsx';

const MARCA_NAMES = {
  ciip:     'CIIP Latam',
  geomina:  'Geomina',
  biomedic: 'Biomedic',
  ambos:    'CIIP Latam & Geomina',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const marca = (searchParams.get('marca') || 'ciip').toLowerCase();

  const mockData = {
    nombre:       'María Fernanda Quispe Bustamante',
    documento:    '47382910',
    correo:       'maria.quispe@ejemplo.com',
    telefono:     '+51 987654321',
    direccion:    'Av. El Sol 1245, Cusco, Perú',
    profesion:    'Ingeniera de Sistemas / Magíster en Ciencias de Datos',
    softwares:    'Python, R, Power BI, Tableau, Excel Avanzado',
    metodoPago:   'bcp',
    numeroCuenta: '191-48291034-0-18',
    marca:        marca,
    aceptaSabado: 'si',
  };

  const institucion = MARCA_NAMES[marca] || marca.toUpperCase();
  const fecha = new Date().toLocaleDateString('es-PE', {
    day:   '2-digit',
    month: 'long',
    year:  'numeric',
  });

  try {
    const pdfBuffer = await generateDocentePdfBuffer(mockData, institucion, fecha);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': 'inline; filename="preview.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generando PDF de previsualización:', error);
    return NextResponse.json({ error: 'Error generando PDF', detail: error.message }, { status: 500 });
  }
}
