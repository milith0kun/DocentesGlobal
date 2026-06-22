'use client';

import PhoneInput from '../ui/PhoneInput.jsx';
import { phoneCountries } from '../config/wizard-config.js';

export default function Step09Contacto({
  formData,
  setFormData,
  onNext,
  onBack,
  phoneCountryCode,
  setPhoneCountryCode,
  phoneNational,
  setPhoneNational,
}) {
  const phoneCountry = phoneCountries.find((c) => c.code === phoneCountryCode) || phoneCountries[0];
  const phoneDigitsValid =
    phoneNational.length >= phoneCountry.min && phoneNational.length <= phoneCountry.max;
  const telefonoValido = phoneDigitsValid && /^\+[1-9]\d{7,14}$/.test(formData.telefono);

  const metodoPagoOk =
    formData.metodoPago && formData.metodoPago !== 'otro'
      ? true
      : formData.metodoPago === 'otro' && formData.metodoPagoOtro.trim();

  const canContinue =
    telefonoValido &&
    formData.metodoPago &&
    formData.numeroCuenta.trim() &&
    formData.direccion.trim() &&
    metodoPagoOk;

  const payMethods = [
    { key: 'yape', label: 'YAPE' },
    { key: 'bcp', label: 'BCP' },
    { key: 'bolivia', label: 'Banco de Bolivia' },
    { key: 'paypal', label: 'PayPal' },
    { key: 'falabella', label: 'Banco Falabella' },
    { key: 'otro', label: 'Otro' },
  ];

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Contacto y Datos de Pago</h2>
      <p className="wz-sub">Datos necesarios para la gestión de honorarios y comunicación directa.</p>

      <PhoneInput
        phoneCountryCode={phoneCountryCode}
        setPhoneCountryCode={setPhoneCountryCode}
        phoneNational={phoneNational}
        setPhoneNational={setPhoneNational}
        telefono={formData.telefono}
        setTelefono={(val) => setFormData((prev) => ({ ...prev, telefono: val }))}
      />

      <span className="wz-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
        Cuenta de abono preferente
      </span>
      <div className="wz-payment-grid">
        {payMethods.map((m) => {
          const on = formData.metodoPago === m.key;
          return (
            <div
              key={m.key}
              className={`wz-pay-card ${on ? 'on' : ''}`}
              onClick={() => setFormData({ ...formData, metodoPago: m.key })}
            >
              <div className={`wz-radio ${on ? 'on' : ''}`} />
              <span>{m.label}</span>
            </div>
          );
        })}
      </div>

      {formData.metodoPago === 'otro' && (
        <div className="wz-field" style={{ marginTop: '0.75rem' }}>
          <input
            type="text"
            placeholder="Especifique su método de pago"
            value={formData.metodoPagoOtro}
            onChange={(e) =>
              setFormData({ ...formData, metodoPagoOtro: e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '') })
            }
            className="wz-input"
          />
        </div>
      )}

      <div className="wz-grid-2" style={{ marginTop: '1.25rem' }}>
        <div className="wz-field">
          <span className="wz-label">Número de cuenta o celular de abono</span>
          <input
            type="text"
            placeholder="Ej. 191-XXX-XXXXXXX"
            value={formData.numeroCuenta}
            onChange={(e) => {
              let val = e.target.value;
              if (formData.metodoPago === 'paypal') {
                val = val.replace(/[^a-zA-Z0-9@._-]/g, '');
              } else if (['yape', 'bcp', 'bolivia', 'falabella'].includes(formData.metodoPago)) {
                val = val.replace(/[^\d\s-]/g, '');
              } else {
                val = val.replace(/[^a-zA-Z0-9\s-]/g, '');
              }
              setFormData({ ...formData, numeroCuenta: val });
            }}
            className="wz-input"
          />
        </div>
        <div className="wz-field">
          <span className="wz-label">Dirección de vivienda</span>
          <input
            type="text"
            placeholder="Av. Principal 123, Lima"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
            className="wz-input"
          />
        </div>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!canContinue} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
