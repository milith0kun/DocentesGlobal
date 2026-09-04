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
  const available = typeof href === 'string' && href.startsWith('https://');
  if (!available) {
    return (
      <span className="adm-doc-link adm-doc-link-missing">
        <span>{label}</span>
        <small>No disponible</small>
      </span>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="adm-doc-link">
      <span>{label}</span>
      <small>Abrir</small>
    </a>
  );
}

export default function DocenteModal({ docente, onClose, onUpdated }) {
  const [honorariosHora, setHonorariosHora] = useState(docente.honorariosHora ?? '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  // Estado de edición de datos de pago
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    moneda: docente.monedaPago || 'USD',
    metodoPago: docente.metodoPago || '',
    banco: docente.bancoNombre || '',
    cuentaAbono: docente.numeroCuenta || '',
    titularCuenta: docente.titularCuenta || '',
    pais: docente.paisPago || '',
  });
  const [savingPayment, setSavingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSaved, setPaymentSaved] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function savePayment(event) {
    event.preventDefault();
    setSavingPayment(true);
    setPaymentError('');
    setPaymentSaved(false);

    try {
      const response = await fetch('/api/admin/docentes', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: docente.id,
          action: 'update_payment',
          paymentData: {
            moneda: paymentForm.moneda,
            metodoPago: paymentForm.metodoPago,
            metodoPagoDetalle: paymentForm.metodoPago,
            banco: paymentForm.banco,
            cuentaAbono: paymentForm.cuentaAbono,
            titularCuenta: paymentForm.titularCuenta,
            pais: paymentForm.pais,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo actualizar los datos de pago.');
      onUpdated(data.docente);
      setPaymentSaved(true);
      setIsEditingPayment(false);
    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setSavingPayment(false);
    }
  }

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
          <button className="adm-modal-close" onClick={onClose} aria-label="Cerrar">Cerrar</button>
        </div>

        <div className="adm-modal-body">
          <section>
            <h3 className="adm-modal-section-title">Datos Personales</h3>
            <div className="adm-modal-grid">
              <Field label="Email" value={docente.email} link={docente.email ? `mailto:${docente.email}` : null} />
              <Field label="Teléfono" value={docente.telefono} />
              <Field label="F. Nacimiento" value={docente.fechaNacimiento} />
              <Field label="Dirección de vivienda" value={docente.direccion} />
              <Field label="DNI / Doc." value={docente.documento} />
              <Field label="Profesión" value={docente.profesion} />
              <Field label="Marcas" value={brandTag(docente.marcas)} />
            </div>
          </section>

          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <h3 className="adm-modal-section-title" style={{ margin: 0 }}>Datos de Pago & Honorarios</h3>
              {!isEditingPayment && (
                <button
                  type="button"
                  className="adm-pay-edit-btn"
                  onClick={() => setIsEditingPayment(true)}
                >
                  Modificar información de pago
                </button>
              )}
            </div>

            {/* Formulario de Edición de Datos de Pago */}
            {isEditingPayment ? (
              <form onSubmit={savePayment} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#0f172a' }}>Modificar Información Bancaria / Abono</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Moneda</label>
                    <input
                      type="text"
                      placeholder="USD, PEN, BOB, COP..."
                      value={paymentForm.moneda}
                      onChange={(e) => setPaymentForm({ ...paymentForm, moneda: e.target.value.toUpperCase() })}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Método / Entidad</label>
                    <input
                      type="text"
                      placeholder="BCP, Zelle, PayPal, BNB..."
                      value={paymentForm.metodoPago}
                      onChange={(e) => setPaymentForm({ ...paymentForm, metodoPago: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>N.° Cuenta / Celular / Email</label>
                    <input
                      type="text"
                      placeholder="Número o identificador"
                      value={paymentForm.cuentaAbono}
                      onChange={(e) => setPaymentForm({ ...paymentForm, cuentaAbono: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.2rem' }}>Titular de la cuenta</label>
                    <input
                      type="text"
                      placeholder="Nombre del titular"
                      value={paymentForm.titularCuenta}
                      onChange={(e) => setPaymentForm({ ...paymentForm, titularCuenta: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                {paymentError && <p style={{ color: '#dc2626', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>{paymentError}</p>}

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingPayment(false)}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: '1px solid #94a3b8', background: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={savingPayment}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                  >
                    {savingPayment ? 'Guardando…' : 'Guardar Datos'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="adm-modal-grid">
                <Field label="Moneda de Abono" value={docente.monedaPago || 'USD'} />
                <Field label="Método / Entidad" value={docente.metodoPago} />
                <Field label="N.° Cuenta / Identificador" value={docente.numeroCuenta} />
                <Field label="Titular de la Cuenta" value={docente.titularCuenta || '—'} />
                <Field label="País / Región" value={docente.paisPago ? docente.paisPago.toUpperCase() : '—'} />
                {docente.detallesPagoExtra?.swift && (
                  <Field label="Código SWIFT / BIC" value={docente.detallesPagoExtra.swift} />
                )}
                {docente.detallesPagoExtra?.cci && (
                  <Field label="CCI Interbancario" value={docente.detallesPagoExtra.cci} />
                )}
              </div>
            )}

            {paymentSaved && <p className="adm-rate-message adm-rate-success" style={{ margin: '0.5rem 0' }}>Datos de pago actualizados correctamente.</p>}

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
              <DocLink href={docente.cvUrl} label="Curriculum vitae" />
              <DocLink href={docente.fotoUrl} label="Fotografía" />
              <DocLink href={docente.pdfUrl} label="Contrato PDF" />
            </div>
          </section>

          <section>
            <h3 className="adm-modal-section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Contrato <ConformidadBadge ok={docente.conformidadCompleta} />
            </h3>
            <p className="adm-contract-note">El detalle de las condiciones aceptadas se conserva en el PDF de conformidad.</p>
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
