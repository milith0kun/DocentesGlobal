export const DELIVERY_DEADLINES = [
  {
    key: 'aceptaSabado',
    day: 'Sábado',
    time: 'Hasta 1:00 PM',
    label: 'Material Sesión 1',
    description: 'Diapositivas (PPTs), guías (PDFs), datasets y recursos para la clase.',
    color: '#146287',
  },
  {
    key: 'aceptaDomingo',
    day: 'Domingo',
    time: 'Hasta 1:00 PM',
    label: 'Material Sesión 2',
    description: 'Diapositivas, casos prácticos y guías complementarias.',
    color: '#146287',
  },
  {
    key: 'aceptaLunes',
    day: 'Lunes',
    time: 'Hasta 9:00 AM',
    label: 'Examen Final',
    description: 'Carga de los 3 archivos separados (10 preguntas de opción aleatoria, caso práctico sin resolver y caso práctico resuelto).',
    color: '#146287',
  },
];

export const DELIVERY_DEADLINES_CONTRACT = [
  'Como integrante de nuestro selecto equipo docente CGB, tu liderazgo y profesionalismo son el motor de nuestro estándar de excelencia. Asumimos juntos el compromiso de cumplir con los siguientes plazos:',
  ...DELIVERY_DEADLINES.map(
    (item, index) => `(${index + 1}) ${item.day}, ${item.time}: ${item.label}. ${item.description}`
  ),
].join(' ');
