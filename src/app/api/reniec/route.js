import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/request-security.js';

export async function POST(request) {
  try {
    const limit = rateLimit(request, { keyPrefix: 'reniec', limit: 20, windowMs: 60_000 });
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: 'Demasiadas consultas. Intenta nuevamente en unos segundos.' },
        {
          status: 429,
          headers: { 'Retry-After': String(limit.retryAfter) },
        }
      );
    }

    const { dni } = await request.json();

    if (!dni || !/^\d{8}$/.test(dni)) {
      return NextResponse.json(
        { success: false, error: 'DNI invalido. Debe tener 8 digitos.' },
        { status: 400 }
      );
    }

    if (!process.env.RENIEC_API_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Consulta DNI no configurada' },
        { status: 200 }
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

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'No se pudo consultar RENIEC' },
        { status: response.status }
      );
    }

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
