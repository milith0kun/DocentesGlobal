'use client';

import { brandTag, formatAmount, formatDate } from '@/lib/admin-utils';

function ConformidadBadge({ ok }) {
  return (
    <span className={ok ? 'adm-badge-ok' : 'adm-badge-pend'}>
      {ok ? 'Completa' : 'Pendiente'}
    </span>
  );
}

export default function DocentesTable({
  docentes, loading, total, totalPages, page,
  onRowClick, onPageChange,
}) {
  return (
    <>
      <div className="adm-table-wrapper">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>DNI / Doc.</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Institución</th>
              <th>Monto / hora</th>
              <th>Pago</th>
              <th>Fecha</th>
              <th>Conformidad</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} className="adm-empty-row">Cargando…</td></tr>
            ) : docentes.length === 0 ? (
              <tr><td colSpan={10} className="adm-empty-row">Sin registros encontrados.</td></tr>
            ) : (
              docentes.map((d) => (
                <tr key={d.id} className="adm-row" onClick={() => onRowClick(d)}>
                  <td className="adm-code-cell">{d.codigo || '—'}</td>
                  <td className="adm-name-cell">{d.nombre || '—'}</td>
                  <td>{d.documento || '—'}</td>
                  <td className="adm-email-cell">{d.email || '—'}</td>
                  <td>{d.telefono || '—'}</td>
                  <td>
                    {brandTag(d.marcas)
                      ? <span className="adm-brand-chip">{brandTag(d.marcas)}</span>
                      : '—'}
                  </td>
                  <td className="adm-rate-cell">{formatAmount(d.honorariosHora)}</td>
                  <td>{d.metodoPago || '—'}</td>
                  <td>{formatDate(d.createdAt || d.timestamp)}</td>
                  <td><ConformidadBadge ok={d.conformidadCompleta} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {(totalPages > 1 || (!loading && total > 0)) && (
        <div className="adm-pagination">
          {totalPages > 1 && (
            <button
              className="adm-page-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || loading}
            >
              ← Anterior
            </button>
          )}
          <span className="adm-page-info">
            {totalPages > 1 ? `Página ${page} de ${totalPages} · ` : ''}
            {total} registro{total !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <button
              className="adm-page-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || loading}
            >
              Siguiente →
            </button>
          )}
        </div>
      )}
    </>
  );
}
