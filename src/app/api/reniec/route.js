import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { dni } = await request.json();

    if (!dni || !/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        { success: false, error: 'DNI inválido. Debe tener 8 dígitos.' },
        { status: 400 }
      );
    }

    const response = await fetch('https://apiperu.dev/api/dni', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RENIEC_API_TOKEN}`,
      },
      body: JSON.stringify({ dni }),
    });

    const resData = await response.json();

    if (resData.success && resData.data) {
      let nombre = resData.data.nombre_completo;
      if (nombre && nombre.includes(',')) {
        const parts = nombre.split(',');
        nombre = `${parts[1].trim()} ${parts[0].trim()}`;
      }
      if (nombre) {
        nombre = nombre
          .toLowerCase()
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
      return NextResponse.json({ success: true, nombre: nombre || '' });
    }

    return NextResponse.json({ success: false, error: 'No se encontraron datos' });
  } catch (error) {
    console.error('Error API RENIEC:', error);
    return NextResponse.json(
      { success: false, error: 'Error al consultar RENIEC' },
      { status: 500 }
    );
  }
}
