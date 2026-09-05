'use client';

import { useState, useEffect } from 'react';
import PhoneInput from '../ui/PhoneInput.jsx';
import { phoneCountries } from '../config/wizard-config.js';
import {
  PAYMENT_REGIONS,
  findMethodConfig,
} from '../config/payment-config.js';

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

  // Mapear código de teléfono a región de pago por defecto
  const countryToRegionMap = {
    PE: 'peru',
    BO: 'bolivia',
    CO: 'colombia',
    MX: 'mexico',
    CL: 'chile',
    AR: 'argentina',
    EC: 'ecuador',
    US: 'norteamerica',
  };

  const initialRegion =
    formData.paisPago ||
    countryToRegionMap[phoneCountryCode] ||
    'peru';

  const [selectedRegion, setSelectedRegion] = useState(initialRegion);

  const activeRegion =
    PAYMENT_REGIONS.find((r) => r.id === selectedRegion) || PAYMENT_REGIONS[0];

  const currentMethodConfig = findMethodConfig(formData.metodoPago);

  // Sincronizar moneda por defecto al cambiar región o método
  useEffect(() => {
    if (!formData.paisPago) {
      setFormData((prev) => ({
        ...prev,
        paisPago: activeRegion.id,
        monedaPago: prev.monedaPago || activeRegion.defaultCurrency,
      }));
    }
  }, [activeRegion.id]);

  function handleSelectRegion(regionId) {
    setSelectedRegion(regionId);
    const region = PAYMENT_REGIONS.find((r) => r.id === regionId);
    setFormData((prev) => ({
      ...prev,
      paisPago: regionId,
      monedaPago: region?.defaultCurrency || 'USD',
      // Si el método actual no pertenece a la nueva región, reiniciamos selección de método
      metodoPago: region?.methods.some((m) => m.key === prev.metodoPago) ? prev.metodoPago : '',
    }));
  }

  function handleSelectMethod(method) {
    setFormData((prev) => ({
      ...prev,
      metodoPago: method.key,
      monedaPago: prev.monedaPago || method.currency,
      bancoNombre: method.requiresBankName ? prev.bancoNombre : method.label,
      metodoPagoOtro: method.key === 'otro' ? prev.metodoPagoOtro : '',
    }));
  }

  // Validación de requerimientos según el método
  const isMethodSelected = Boolean(formData.metodoPago);
  const isAccountFilled = Boolean(formData.numeroCuenta && formData.numeroCuenta.trim().length >= 3);
  const isAddressFilled = Boolean(formData.direccion && formData.direccion.trim().length >= 5);

  let isContextValid = true;
  if (currentMethodConfig) {
    if (currentMethodConfig.requiresHolder && !formData.titularCuenta?.trim()) {
      isContextValid = false;
    }
    if (currentMethodConfig.requiresBankName && !formData.bancoNombre?.trim()) {
      isContextValid = false;
    }
    if (currentMethodConfig.requiresSwift && !formData.detallesPagoExtra?.swift?.trim()) {
      isContextValid = false;
    }
    if (formData.metodoPago === 'otro' && !formData.metodoPagoOtro?.trim()) {
      isContextValid = false;
    }
  }

  const canContinue =
    telefonoValido &&
    isMethodSelected &&
    isAccountFilled &&
    isAddressFilled &&
    isContextValid;

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Contacto y Datos de Pago</h2>
      <p className="wz-sub">
        Selecciona tu país, moneda preferente y los datos para la gestión y abono oportuno de tus honorarios.
      </p>

      {/* Teléfono de contacto */}
      <PhoneInput
        phoneCountryCode={phoneCountryCode}
        setPhoneCountryCode={setPhoneCountryCode}
        phoneNational={phoneNational}
        setPhoneNational={setPhoneNational}
        telefono={formData.telefono}
        setTelefono={(val) => setFormData((prev) => ({ ...prev, telefono: val }))}
      />

      {/* Pestañas de Países y Regiones */}
      <span className="wz-label" style={{ display: 'block', marginTop: '1.25rem', marginBottom: '0.5rem' }}>
        País o Región de Abono
      </span>
      <div className="wz-region-scroll" role="radiogroup" aria-label="País o Región de Abono">
        {PAYMENT_REGIONS.map((region) => {
          const isSelected = selectedRegion === region.id;
          return (
            <button
              key={region.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`wz-region-chip ${isSelected ? 'active' : ''}`}
              onClick={() => handleSelectRegion(region.id)}
            >
              {region.flag && <span className="wz-region-chip-flag">{region.flag}</span>}
              <span className="wz-region-chip-name">{region.name}</span>
            </button>
          );
        })}
      </div>

      {/* Selector de Moneda (si la región soporta más de una) */}
      {activeRegion.currencies && activeRegion.currencies.length > 1 && (
        <div className="wz-currency-bar">
          <span>Moneda de abono en {activeRegion.name}:</span>
          <div className="wz-currency-pills">
            {activeRegion.currencies.map((curr) => (
              <button
                key={curr}
                type="button"
                className={`wz-currency-pill ${formData.monedaPago === curr ? 'active' : ''}`}
                onClick={() => setFormData((prev) => ({ ...prev, monedaPago: curr }))}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grilla de Métodos de la Región */}
      <span className="wz-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
        Selecciona tu Entidad o Método de Pago
      </span>
      <div className="wz-payment-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {activeRegion.methods.map((m) => {
          const on = formData.metodoPago === m.key;
          return (
            <div
              key={m.key}
              className={`wz-pay-card ${on ? 'on' : ''}`}
              onClick={() => handleSelectMethod(m)}
            >
              <div className={`wz-radio ${on ? 'on' : ''}`} />
              <div className="wz-pay-card-meta">
                <span className="wz-pay-card-title">{m.label}</span>
                <span className="wz-pay-badge">{m.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campos Contextuales Inteligentes */}
      {currentMethodConfig && (
        <div className="wz-payment-context-box">
          <div className="wz-payment-context-header">
            <strong>
              {currentMethodConfig.label}
            </strong>
            <span>Moneda: {formData.monedaPago || currentMethodConfig.currency}</span>
          </div>

          {/* Si eligió "Otro método" */}
          {formData.metodoPago === 'otro' && (
            <div className="wz-field" style={{ marginBottom: '0.75rem' }}>
              <span className="wz-label">Nombre del Banco, Billetera o Plataforma *</span>
              <input
                type="text"
                placeholder="Ej. Western Union, Banco Pichincha, Payoneer..."
                value={formData.metodoPagoOtro || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metodoPagoOtro: e.target.value.replace(/[^a-zA-Z0-9\s-]/g, ''),
                  }))
                }
                className="wz-input"
                required
              />
            </div>
          )}

          {/* Nombre de Banco si es genérico */}
          {currentMethodConfig.requiresBankName && formData.metodoPago !== 'otro' && (
            <div className="wz-field" style={{ marginBottom: '0.75rem' }}>
              <span className="wz-label">Nombre de su Banco *</span>
              <input
                type="text"
                placeholder="Ej. Chase Bank, Santander, BBVA..."
                value={formData.bancoNombre || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bancoNombre: e.target.value }))
                }
                className="wz-input"
                required
              />
            </div>
          )}

          {/* Campo Principal: Número de cuenta / Email / Identificador */}
          <div className="wz-field" style={{ marginBottom: '0.75rem' }}>
            <span className="wz-label">{currentMethodConfig.accountLabel} *</span>
            <input
              type={currentMethodConfig.accountType === 'email' ? 'email' : 'text'}
              placeholder={currentMethodConfig.accountPlaceholder}
              value={formData.numeroCuenta || ''}
              onChange={(e) => {
                let val = e.target.value;
                if (currentMethodConfig.accountType === 'numeric') {
                  val = val.replace(/[^\d\s-]/g, '');
                } else if (currentMethodConfig.accountType === 'clabe') {
                  val = val.replace(/\D/g, '').slice(0, 18);
                }
                setFormData((prev) => ({ ...prev, numeroCuenta: val }));
              }}
              className="wz-input"
              required
            />
          </div>

          <div className="wz-grid-2">
            {/* Titular de la cuenta */}
            <div className="wz-field">
              <span className="wz-label">
                {currentMethodConfig.holderLabel || 'Nombre completo del titular de la cuenta'}
                {currentMethodConfig.requiresHolder ? ' *' : ' (opcional)'}
              </span>
              <input
                type="text"
                placeholder="Nombre del titular tal como figura en el banco"
                value={formData.titularCuenta || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titularCuenta: e.target.value }))
                }
                className="wz-input"
              />
            </div>

            {/* Código SWIFT para transferencias internacionales */}
            {currentMethodConfig.requiresSwift && (
              <div className="wz-field">
                <span className="wz-label">Código SWIFT / BIC *</span>
                <input
                  type="text"
                  placeholder="Ej. CHASUS33XXX"
                  value={formData.detallesPagoExtra?.swift || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      detallesPagoExtra: {
                        ...prev.detallesPagoExtra,
                        swift: e.target.value.toUpperCase().trim(),
                      },
                    }))
                  }
                  className="wz-input"
                  required
                />
              </div>
            )}

            {/* Código Interbancario (CCI) para bancos de Perú */}
            {currentMethodConfig.supportsCci && (
              <div className="wz-field">
                <span className="wz-label">Código Interbancario CCI (opcional)</span>
                <input
                  type="text"
                  placeholder="Ej. 002-191-XXXXXXXXXXXX-XX (20 dígitos)"
                  value={formData.detallesPagoExtra?.cci || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      detallesPagoExtra: {
                        ...prev.detallesPagoExtra,
                        cci: e.target.value.replace(/[^\d\s-]/g, ''),
                      },
                    }))
                  }
                  className="wz-input"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dirección domiciliaria */}
      <div className="wz-field" style={{ marginTop: '1.25rem' }}>
        <span className="wz-label">Dirección domiciliaria completa *</span>
        <input
          type="text"
          placeholder="Av. Principal 123, Ciudad, País"
          value={formData.direccion || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, direccion: e.target.value }))}
          className="wz-input"
          required
        />
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">
          Atrás
        </button>
        <button onClick={onNext} disabled={!canContinue} className="wz-btn-main">
          Siguiente
        </button>
      </div>
    </div>
  );
}
