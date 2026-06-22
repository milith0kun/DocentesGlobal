'use client';

import { MARCA_OPTIONS } from '@/lib/admin-utils';

export default function AdminControls({
  searchInput, onSearchChange,
  marca, onMarcaChange,
  source, onSourceChange,
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
        <div className="adm-source-toggle">
          <button
            className={source === 'mongodb' ? 'adm-toggle-active' : 'adm-toggle-btn'}
            onClick={() => onSourceChange('mongodb')}
          >
            MongoDB
          </button>
          <button
            className={source === 'sheets' ? 'adm-toggle-active' : 'adm-toggle-btn'}
            onClick={() => onSourceChange('sheets')}
          >
            Google Sheets
          </button>
        </div>
        <button className="adm-export-btn" onClick={onExportCsv} disabled={!canExport}>
          Exportar CSV
        </button>
      </div>
    </div>
  );
}
