'use client';

import { phoneCountries } from '../config/wizard-config.js';

export default function PhoneInput({
  phoneCountryCode,
  setPhoneCountryCode,
  phoneNational,
  setPhoneNational,
  telefono,
  setTelefono,
}) {
  const phoneCountry = phoneCountries.find((c) => c.code === phoneCountryCode) || phoneCountries[0];
  const phoneDigitsValid =
    phoneNational.length >= phoneCountry.min && phoneNational.length <= phoneCountry.max;
  const telefonoValido = phoneDigitsValid && /^\+[1-9]\d{7,14}$/.test(telefono);

  return (
    <div className="wz-field" style={{ marginBottom: '1.25rem' }}>
      <span className="wz-label">Número de WhatsApp</span>
      <div className="wz-phone-field">
        <label className="wz-phone-country">
          <span className="wz-phone-country-label">País</span>
          <select
            value={phoneCountryCode}
            onChange={(event) => {
              const nextCode = event.target.value;
              const nextCountry = phoneCountries.find((c) => c.code === nextCode) || phoneCountries[0];
              const nextNational = phoneNational.slice(0, nextCountry.max);
              setPhoneCountryCode(nextCode);
              setPhoneNational(nextNational);
              setTelefono(nextNational ? `${nextCountry.dial}${nextNational}` : '');
            }}
            className="wz-phone-select"
          >
            {phoneCountries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.dial})
              </option>
            ))}
          </select>
        </label>
        <label className="wz-phone-number">
          <span className="wz-phone-country-label">Número</span>
          <div className={`wz-phone-input-wrap ${phoneNational && !phoneDigitsValid ? 'invalid' : ''}`}>
            <span className="wz-phone-prefix">{phoneCountry.dial}</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={phoneCountry.code === 'PE' ? '999 999 999' : 'Número de WhatsApp'}
              value={phoneNational}
              maxLength={phoneCountry.max}
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, '').slice(0, phoneCountry.max);
                setPhoneNational(digits);
                setTelefono(digits ? `${phoneCountry.dial}${digits}` : '');
              }}
              className="wz-phone-input"
            />
          </div>
        </label>
      </div>
      {phoneNational && !phoneDigitsValid && (
        <span className="wz-field-error">
          Ingresa{' '}
          {phoneCountry.min === phoneCountry.max
            ? `${phoneCountry.min} dígitos`
            : `entre ${phoneCountry.min} y ${phoneCountry.max} dígitos`}{' '}
          para {phoneCountry.name}.
        </span>
      )}
      {telefonoValido && (
        <span className="wz-field-note">Se guardará como {telefono}.</span>
      )}
    </div>
  );
}
