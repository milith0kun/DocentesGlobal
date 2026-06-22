export const MARCA_OPTIONS = [
  { value: '', label: 'Todas las marcas' },
  { value: 'CIIP Latam', label: 'CIIP Latam' },
  { value: 'Geomina', label: 'Geomina' },
  { value: 'Biomedic', label: 'Biomedic' },
];

const BRAND_LABELS = {
  'CIIP Latam': 'CIIP', 'Geomina': 'Geomina', 'Biomedic': 'Biomedic',
  ciip: 'CIIP', geomina: 'Geomina', biomedic: 'Biomedic',
};

export function brandTag(marcas = []) {
  if (!marcas.length) return null;
  return marcas.map((m) => BRAND_LABELS[m] || m).join(' & ');
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}
