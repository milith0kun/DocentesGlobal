'use client';

import { useState } from 'react';
import { isValidEmail } from '../../../utils/emailValidation.js';
import DatePicker from '../ui/DatePicker.jsx';

export default function Step02DatosPersonales({
  formData,
  setFormData,
  onNext,
  onBack,
  loadingDni,
  dniLookupMessage,
  onDocumentoChange,
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [calendarView, setCalendarView] = useState('year');

  const correoValido = isValidEmail(formData.correo);
  const mostrarErrorCorreo = formData.correo.trim().length > 0 && !correoValido;

  const handleFechaNacimientoChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.substring(0, 8);
    let formatted = '';
    if (val.length > 0) {
      formatted = val.substring(0, 2);
      if (val.length > 2) {
        formatted += '/' + val.substring(2, 4);
        if (val.length > 4) {
          formatted += '/' + val.substring(4, 8);
        }
      }
    }
    setFormData((prev) => ({ ...prev, fechaNacimiento: formatted }));
  };

  const openCalendar = () => {
    if (formData.fechaNacimiento) {
      const partes = formData.fechaNacimiento.split('/');
      if (partes.length === 3) {
        const d = Number(partes[0]);
        const m = Number(partes[1]) - 1;
        const y = Number(partes[2]);
        if (!isNaN(d) && !isNaN(m) && !isNaN(y) && y >= 1930 && y <= new Date().getFullYear()) {
          setViewYear(y);
          setViewMonth(m);
          setCalendarView('day');
          setShowDatePicker(true);
          return;
        }
      }
    }
    setViewYear(new Date().getFullYear() - 25);
    setViewMonth(new Date().getMonth());
    setCalendarView('year');
    setShowDatePicker(true);
  };

  const canContinue =
    formData.nombre.trim() &&
    correoValido &&
    formData.documento.trim() &&
    formData.fechaNacimiento.length === 10;

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Datos Personales</h2>
      <p className="wz-sub">Ingresa tus datos personales.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="wz-field">
          <span className="wz-label">Documento de Identidad</span>
          <input
            type="text"
            placeholder="DNI / Pasaporte / CE"
            value={formData.documento}
            onChange={(e) => {
              const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
              onDocumentoChange(val);
            }}
            className="wz-input"
            autoComplete="off"
          />
        </div>

        <div className="wz-field">
          <span className="wz-label">Nombre completo</span>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder={
                loadingDni
                  ? 'Buscando nombre en RENIEC...'
                  : formData.documento.trim()
                  ? 'Ej. Juan Pérez'
                  : 'Escribe tu Documento primero...'
              }
              value={formData.nombre}
              disabled={!formData.documento.trim() || loadingDni}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  nombre: e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''),
                })
              }
              className="wz-input"
              autoComplete="off"
              style={{ paddingRight: loadingDni ? '2.5rem' : '1rem' }}
            />
            {loadingDni && <span className="wz-input-spinner" />}
          </div>
          {dniLookupMessage && <span className="wz-field-note">{dniLookupMessage}</span>}
        </div>

        <div className="wz-field">
          <span className="wz-label">Correo Electrónico</span>
          <input
            type="email"
            placeholder={
              formData.documento.trim() ? 'juan.perez@ejemplo.com' : 'Escribe tu Documento primero...'
            }
            value={formData.correo}
            disabled={!formData.documento.trim()}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
            className={`wz-input ${mostrarErrorCorreo ? 'invalid' : ''}`}
            aria-invalid={mostrarErrorCorreo}
            aria-describedby={mostrarErrorCorreo ? 'correo-error' : undefined}
            autoComplete="off"
          />
          {mostrarErrorCorreo && (
            <span id="correo-error" className="wz-field-error">
              Ingresa un correo valido, por ejemplo nombre@dominio.com.
            </span>
          )}
        </div>

        <div className="wz-field">
          <span className="wz-label">Fecha de Nacimiento</span>
          <DatePicker
            fechaNacimiento={formData.fechaNacimiento}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            viewYear={viewYear}
            setViewYear={setViewYear}
            viewMonth={viewMonth}
            setViewMonth={setViewMonth}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
            onSelectDate={(date) => setFormData((prev) => ({ ...prev, fechaNacimiento: date }))}
            onOpen={openCalendar}
          />
        </div>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!canContinue} className="wz-btn-main">Continuar</button>
      </div>
    </div>
  );
}
