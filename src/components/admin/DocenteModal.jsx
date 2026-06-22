'use client';

import { useEffect, useState } from 'react';
import { brandTag, formatDate } from '@/lib/admin-utils';

function ConformidadBadge({ ok }) {
  return (
    <span className={ok ? 'adm-badge-ok' : 'adm-badge-pend'}>
      {ok ? 'Completa' : 'Pendiente'}
    </span>
  );
}

function Field({ label, value, link, full }) {
  const content = value || <span style={{ color: 'rgba(148,163,184,0.5)' }}>—</span>;
  return (
    <div className={full ? 'adm-field-full' : 'adm-field-item'}>
      <dt className="adm-field-label">{label}</dt>
      <dd className="adm-field-value">
        {link
          ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8' }}>{content}</a>
          : content}
      </dd>
    </div>
  );
}

function DocLink({ href, label }) {
  if (!href || href.startsWith('PENDIENTE')) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="adm-doc-link">
      {label} ↗
    </a>
  );
}

const CONFORM_FIELDS = [
  { key: 'aceptaMetodologia', label: 'Metodología' },
  { key: 'aceptaSabado', label: 'Sábado' },
  { key: 'aceptaDomingo', label: 'Domingo' },
  { key: 'aceptaLunes', label: 'Lunes' },
  { key: 'aceptaProtocolo', label: 'Protocolo' },
  { key: 'aceptaAsistencia', label: 'Asistencia' },
  { key: 'aceptaTop', label: 'Docente TOP' },
];

export default function DocenteModal({ docente, onClose, onUpdated }) {
  const conf = docente.conformidad || {};
  const [honorariosHora, setHonorariosHora] = useState(docente.honorariosHora ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function saveHonorarios(event) {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);

    try {
      const response = await fetch('/api/admin/docentes', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: docente.id, honorariosHora }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo guardar el monto.');
      setHonorariosHora(data.docente.honorariosHora);
      onUpdated(data.docente);
      setSaved(true);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-header">
          <div>
            <h2 className="adm-modal-name">{docente.nombre || '—'}</h2>
            {docente.codigo && <p className="adm-modal-code">{docente.codigo}</p>}
          </div>
          <button className="adm-modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="adm-modal-body">
          <section>
            <h3 className="adm-modal-section-title">Datos Personales</h3>
            <div className="adm-modal-grid">
              <Field label="DNI / Doc." value={docente.documento} />
              <Field label="Email" value={docente.email} link={docente.email ? `mailto:${docente.email}` : null} />
              <Field label="Teléfono" value={docente.telefono} />
              <Field label="F. Nacimiento" value={docente.fechaNacimiento} />
              <Field label="Profesión" value={docente.profesion} />
              <Field label="Institución" value={docente.institucion} />
              <Field label="Marcas" value={brandTag(docente.marcas)} />
            </div>
          </section>

          <section>
            <h3 className="adm-modal-section-title">Datos de Pago</h3>
            <div className="adm-modal-grid">
              <Field label="Método de Pago" value={docente.metodoPago} />
              <Field label="N.° Cuenta / Celular" value={docente.numeroCuenta} />
            </div>
            <form className="adm-rate-editor" onSubmit={saveHonorarios}>
              <div>
                <label className="adm-rate-label" htmlFor="honorarios-hora">Monto por hora</label>
                <p>Dato interno. No se solicita en el formulario del docente.</p>
              </div>
              <div className="adm-rate-control">
                <input
                  id="honorarios-hora"
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  max="1000000"
                  step="0.01"
                  placeholder="0.00"
                  value={honorariosHora}
                  onChange={(event) => { setHonorariosHora(event.target.value); setSaved(false); }}
                  disabled={saving}
                  required
                />
                <button type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar monto'}</button>
              </div>
              {saveError && <p className="adm-rate-message adm-rate-error">{saveError}</p>}
              {saved && <p className="adm-rate-message adm-rate-success">Guardado en el panel, MongoDB y Google Sheets.</p>}
            </form>
          </section>

          <section>
            <h3 className="adm-modal-section-title">Información Profesional</h3>
            <Field label="Softwares" value={docente.softwares} full />
            <Field label="Curso soñado" value={docente.cursoInteres} full />
            <Field label="Mejora administrativa" value={docente.mejoraAdministrativa} full />
            <Field label="Comentarios" value={docente.comentarios} full />
          </section>

          <section>
            <h3 className="adm-modal-section-title">Documentos</h3>
            <div className="adm-modal-links">
              <DocLink href={docente.cvUrl} label="CV" />
              <DocLink href={docente.fotoUrl} label="Foto" />
              <DocLink href={docente.pdfUrl} label="Declaración PDF" />
              <DocLink href={docente.folderUrl} label="Carpeta Drive" />
              {!docente.cvUrl && !docente.fotoUrl && !docente.pdfUrl && !docente.folderUrl && (
                <span style={{ color: 'rgba(148,163,184,0.5)', fontSize: '0.875rem', fontStyle: 'italic' }}>
                  Sin documentos registrados
                </span>
              )}
            </div>
          </section>

          <section>
            <h3 className="adm-modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Conformidad <ConformidadBadge ok={docente.conformidadCompleta} />
            </h3>
            <div className="adm-conform-grid">
              {CONFORM_FIELDS.map(({ key, label }) => (
                <div key={key} className="adm-conform-item">
                  <span className={conf[key] === true ? 'adm-check' : 'adm-cross'}>
                    {conf[key] === true ? '✓' : '✗'}
                  </span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>

          {docente.source === 'mongodb' && (
            <section>
              <h3 className="adm-modal-section-title">Metadatos</h3>
              <div className="adm-modal-grid">
                <Field label="Registrado" value={formatDate(docente.createdAt)} />
                <Field label="Actualizado" value={formatDate(docente.updatedAt)} />
                <Field label="Estado" value={docente.estado} />
                <Field label="Fuente" value={docente.lastSource} />
              </div>
            </section>
          )}

          {docente.source === 'sheets' && docente.timestamp && (
            <section>
              <h3 className="adm-modal-section-title">Metadatos</h3>
              <Field label="Timestamp" value={docente.timestamp} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
