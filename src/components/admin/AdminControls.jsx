'use client';

import { MARCA_OPTIONS } from '@/lib/admin-utils';

export default function AdminControls({
  searchInput, onSearchChange,
  marca, onMarcaChange,
  onExportCsv, canExport,
}) {
  return (
    <div className="adm-controls">
      <div className="adm-controls-left">
        <input
          type="search"
          placeholder="Buscar por nombre, DNI, email…"
          className="adm-search"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select
          className="adm-select"
          value={marca}
          onChange={(e) => onMarcaChange(e.target.value)}
        >
          {MARCA_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="adm-controls-right">
        <a className="adm-drive-btn" href="/api/admin/google-sheet" target="_blank" rel="noopener noreferrer">
          Abrir hoja en Drive
        </a>
        <button className="adm-export-btn" onClick={onExportCsv} disabled={!canExport}>
          Exportar CSV
        </button>
      </div>
    </div>
  );
}
