export const DELIVERY_DEADLINES = [
  {
    key: 'aceptaSabado',
    day: 'Sábado',
    time: 'Hasta 1:00 PM',
    label: 'Material Sesión 1',
    description: 'Diapositivas (PPTs), guías (PDFs), datasets y recursos para la clase del sábado.',
    color: '#0ea5e9',
  },
  {
    key: 'aceptaDomingo',
    day: 'Domingo',
    time: 'Hasta 1:00 PM',
    label: 'Material Sesión 2',
    description: 'Diapositivas, casos prácticos y guías de la clase dominical.',
    color: '#0284c7',
  },
  {
    key: 'aceptaLunes',
    day: 'Lunes',
    time: 'Hasta 9:00 AM',
    label: 'Examen Final',
    description: 'Tres archivos: 10 preguntas de opción aleatoria, caso práctico sin resolver y caso práctico resuelto.',
    color: '#7c3aed',
  },
];

export const DELIVERY_DEADLINES_CONTRACT = [
  'El docente se compromete a cumplir estrictamente con los siguientes límites máximos de entrega:',
  ...DELIVERY_DEADLINES.map(
    (item, index) => `(${index + 1}) ${item.day}, ${item.time}: ${item.label}. ${item.description}`
  ),
  'Si la Dirección Académica debe solicitar un material por falta de entrega dentro de estos horarios, se registrará una penalidad de desempeño en el perfil docente.',
].join(' ');
