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
  onRowClick, onPageChange, onDeleteDocente,
}) {
  return (
    <>
      <div className="adm-table-wrapper">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección de vivienda</th>
              <th>DNI / Doc.</th>
              <th>Marca</th>
              <th>Monto / hora</th>
              <th>Pago</th>
              <th>Fecha</th>
              <th>Conformidad</th>
              <th style={{ width: '56px', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12} className="adm-empty-row">Cargando…</td></tr>
            ) : docentes.length === 0 ? (
              <tr><td colSpan={12} className="adm-empty-row">Sin registros encontrados.</td></tr>
            ) : (
              docentes.map((d) => (
                <tr key={d.id} className="adm-row" onClick={() => onRowClick(d)}>
                  <td className="adm-code-cell">{d.codigo || '—'}</td>
                  <td className="adm-name-cell">{d.nombre || '—'}</td>
                  <td className="adm-email-cell">{d.email || '—'}</td>
                  <td>{d.telefono || '—'}</td>
                  <td className="adm-address-cell" title={d.direccion || ''}>{d.direccion || '—'}</td>
                  <td>{d.documento || '—'}</td>
                  <td>
                    {brandTag(d.marcas)
                      ? <span className="adm-brand-chip">{brandTag(d.marcas)}</span>
                      : '—'}
                  </td>
                  <td className="adm-rate-cell">{formatAmount(d.honorariosHora)}</td>
                  <td>
                    <div className="adm-pay-tag">
                      {d.monedaPago && <span className="adm-pay-tag-currency">{d.monedaPago}</span>}
                      <span>{d.metodoPago || '—'}</span>
                    </div>
                  </td>
                  <td>{formatDate(d.createdAt || d.timestamp)}</td>
                  <td><ConformidadBadge ok={d.conformidadCompleta} /></td>
                  <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                    {onDeleteDocente && (
                      <button
                        type="button"
                        className="adm-row-del-btn"
                        title="Eliminar este docente"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDocente(d);
                        }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    )}
                  </td>
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
              Anterior
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
              Siguiente
            </button>
          )}
        </div>
      )}
    </>
  );
}
