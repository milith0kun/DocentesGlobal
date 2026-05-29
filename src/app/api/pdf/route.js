import { NextResponse } from 'next/server';
import { generateConformidadPDF } from '@/lib/pdf-generator.jsx';

export async function POST(request) {
  try {
    const data = await request.json();

    const pdfBuffer = await generateConformidadPDF(data);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Conformidad_${data.code || 'docente'}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generando PDF:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar PDF' },
      { status: 500 }
    );
  }
}
