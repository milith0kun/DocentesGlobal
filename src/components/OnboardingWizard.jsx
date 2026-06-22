'use client';

import { useState } from 'react';
import { isValidEmail } from '../utils/emailValidation.js';

import { marcaConfig, stepWidths, parseJsonResponse, phoneCountries } from './wizard/config/wizard-config.js';
import WizardHeader from './wizard/WizardHeader.jsx';
import WizardStepper from './wizard/WizardStepper.jsx';

import Step01Marca from './wizard/steps/Step01Marca.jsx';
import Step02DatosPersonales from './wizard/steps/Step02DatosPersonales.jsx';
import Step03Metodologia from './wizard/steps/Step03Metodologia.jsx';
import Step04Fechas from './wizard/steps/Step04Fechas.jsx';
import Step06Protocolo from './wizard/steps/Step06Protocolo.jsx';
import Step07Asistencia from './wizard/steps/Step07Asistencia.jsx';
import Step08TopDocente from './wizard/steps/Step08TopDocente.jsx';
import Step09Contacto from './wizard/steps/Step09Contacto.jsx';
import Step10Documentacion from './wizard/steps/Step10Documentacion.jsx';
import Step11Perfil from './wizard/steps/Step11Perfil.jsx';
import StepSuccess from './wizard/steps/StepSuccess.jsx';

const totalSteps = 11;

export default function OnboardingWizard({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [showPenaltyAlert, setShowPenaltyAlert] = useState(false);
  const [showDriveAlert, setShowDriveAlert] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [submissionWarning, setSubmissionWarning] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loadingDni, setLoadingDni] = useState(false);
  const [dniLookupMessage, setDniLookupMessage] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('PE');
  const [phoneNational, setPhoneNational] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activePrinciple, setActivePrinciple] = useState(null);
  const [viewedPrinciples, setViewedPrinciples] = useState([false, false, false]);

  const [formData, setFormData] = useState({
    nombre: '', correo: '', marca: '', documento: '', fechaNacimiento: '',
    aceptaMetodologia: false,
    aceptaSabado: false, aceptaDomingo: false, aceptaLunes: false,
    aceptaProtocolo: false, aceptaAsistencia: false, aceptaTop: false,
    telefono: '', metodoPago: '', metodoPagoOtro: '', numeroCuenta: '', direccion: '',
    cvFile: null, fotoFile: null,
    profesion: '', softwares: '', cursoSonado: '', mejoraAdmin: '', comentarios: '',
  });

  const correoValido = isValidEmail(formData.correo);
  const phoneCountry = phoneCountries.find((c) => c.code === phoneCountryCode) || phoneCountries[0];
  const phoneDigitsValid = phoneNational.length >= phoneCountry.min && phoneNational.length <= phoneCountry.max;
  const telefonoValido = phoneDigitsValid && /^\+[1-9]\d{7,14}$/.test(formData.telefono);

  const consultarDNI = async (dniVal) => {
    if (!/^\d{8}$/.test(dniVal)) return;
    setLoadingDni(true);
    setDniLookupMessage('');
    try {
      const response = await fetch('/api/reniec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dniVal }),
      });
      const resData = await parseJsonResponse(response);
      if (!response.ok || !resData) {
        setDniLookupMessage('No se pudo autocompletar el nombre. Escríbelo manualmente.');
        return;
      }
      if (resData.success && resData.nombre) {
        setFormData((prev) => ({ ...prev, nombre: resData.nombre }));
        setDniLookupMessage('');
      } else {
        setDniLookupMessage('No se encontraron datos para este documento. Escríbelo manualmente.');
      }
    } catch {
      setDniLookupMessage('No se pudo conectar con la consulta DNI. Escríbelo manualmente.');
    } finally {
      setLoadingDni(false);
    }
  };

  const handleDocumentoChange = (val) => {
    setFormData((prev) => ({ ...prev, documento: val }));
    setDniLookupMessage('');
    if (/^\d{8}$/.test(val)) {
      consultarDNI(val);
    }
  };

  const handleNext = () => {
    if (step === 1 && !formData.marca) return;
    if (step === 2 && (!formData.nombre.trim() || !correoValido || !formData.documento.trim() || formData.fechaNacimiento.length !== 10)) return;
    if (step === 3 && !formData.aceptaMetodologia) return;
    if (step === 4 && (!formData.aceptaSabado || !formData.aceptaDomingo || !formData.aceptaLunes)) return;
    if (step === 4) { setShowPenaltyAlert(true); return; }
    if (step === 6 && !formData.aceptaProtocolo) return;
    if (step === 7 && !formData.aceptaAsistencia) return;
    if (step === 8 && !formData.aceptaTop) return;
    if (step === 9 && (!telefonoValido || !formData.metodoPago || !formData.numeroCuenta.trim() || !formData.direccion.trim())) return;
    if (step === 9 && formData.metodoPago === 'otro' && !formData.metodoPagoOtro.trim()) return;
    if (step === 10 && (!formData.cvFile || !formData.fotoFile)) return;
    if (step === 11 && (!formData.profesion.trim() || !formData.softwares.trim() || !formData.cursoSonado.trim() || !formData.mejoraAdmin.trim())) return;
    if (step === 11) { handleFinish(); return; }
    if (step < totalSteps) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 6) { setStep(4); return; }
    if (step === 11) { setStep(10); return; }
    if (step > 1) setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'cvFile' && key !== 'fotoFile') {
          formDataToSend.append(key, formData[key] || '');
        }
      });
      if (formData.cvFile) formDataToSend.append('cv', formData.cvFile);
      if (formData.fotoFile) formDataToSend.append('foto', formData.fotoFile);

      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      const resData = await parseJsonResponse(response);
      if (!response.ok || !resData) {
        alert(resData?.error || 'Error del servidor al enviar el formulario. Intenta nuevamente.');
        return;
      }

      if (resData.success) {
        setGeneratedCode(resData.code);
        setSubmissionWarning(resData.warning || '');
        const cfg = marcaConfig[formData.marca];
        const metodo = formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase();
        const comentarios = formData.comentarios ? `\nComentarios: ${formData.comentarios}` : '';
        const msg = [
          '*FORMULARIO DOCENTE - CONFORMIDAD*', '',
          `*Codigo:* ${resData.code}`,
          `*Docente:* ${formData.nombre}`,
          `*Documento:* ${formData.documento}`,
          `*Correo:* ${formData.correo}`,
          `*Institucion:* ${cfg.nombre}`,
          `*Telefono:* ${formData.telefono}`,
          '', '*Datos de Pago:*',
          `- Metodo: ${metodo}`,
          `- Cuenta: ${formData.numeroCuenta}`,
          `- Direccion: ${formData.direccion}`,
          '', `*Softwares:* ${formData.softwares}`,
          `*Curso deseado:* ${formData.cursoSonado}`,
          `*Mejora sugerida:* ${formData.mejoraAdmin}${comentarios}`,
          '', '*Compromisos Aceptados:*',
          '- Metodologia Doing by Learning',
          '- Fechas de corte innegociables',
          '- Protocolo de imagen',
          '- Politica de asistencia',
          '- Programa Docente TOP',
          '', `*PDF Declaración:* ${resData.pdfUrl || 'Pendiente'}`,
          `*Fecha:* ${resData.fecha}`,
          `*Carpeta Drive:* ${resData.driveFolder || 'Pendiente'}`,
          resData.warning ? `*Aviso:* ${resData.warning}` : '',
        ].join('\n');

        setWhatsappUrl(`https://wa.me/${cfg.telefono}?text=${encodeURIComponent(msg)}`);
        setIsFinished(true);
      } else {
        alert('Error al enviar los datos: ' + resData.error);
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error de conexión al enviar el formulario.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nombre: '', correo: '', marca: '', documento: '', fechaNacimiento: '',
      aceptaMetodologia: false, aceptaSabado: false, aceptaDomingo: false, aceptaLunes: false,
      aceptaProtocolo: false, aceptaAsistencia: false, aceptaTop: false,
      telefono: '', metodoPago: '', metodoPagoOtro: '', numeroCuenta: '', direccion: '',
      cvFile: null, fotoFile: null,
      profesion: '', softwares: '', cursoSonado: '', mejoraAdmin: '', comentarios: '',
    });
    setPhoneCountryCode('PE');
    setPhoneNational('');
    setActivePrinciple(null);
    setShowCertificate(false);
    setViewedPrinciples([false, false, false]);
    setStep(1);
    setIsFinished(false);
    setGeneratedCode('');
    setSubmissionWarning('');
    setWhatsappUrl('');
    onClose();
  };

  const brandColor = formData.marca ? marcaConfig[formData.marca]?.color ?? '#0284c7' : '#0284c7';
  const brandGlow = formData.marca ? marcaConfig[formData.marca]?.bgGlow ?? 'rgba(14,165,233,0.12)' : 'rgba(14,165,233,0.12)';

  if (!isOpen) return null;

  return (
    <div className="wz" style={{ '--bc': brandColor, '--bg': brandGlow }}>
      <WizardHeader step={step} formData={formData} onClose={handleReset} />

      {!isFinished && <WizardStepper step={step} />}

      <main className="wz-main">
        <div className="wz-content" style={{ maxWidth: isFinished ? '480px' : stepWidths[step] }}>

          {isFinished && (
            <StepSuccess
              formData={formData}
              generatedCode={generatedCode}
              submissionWarning={submissionWarning}
              whatsappUrl={whatsappUrl}
              brandColor={brandColor}
              onReset={handleReset}
            />
          )}

          {!isFinished && (
            <>
              {step === 1 && (
                <Step01Marca
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onClose={onClose}
                />
              )}

              {step === 2 && (
                <Step02DatosPersonales
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  loadingDni={loadingDni}
                  dniLookupMessage={dniLookupMessage}
                  onDocumentoChange={handleDocumentoChange}
                />
              )}

              {step === 3 && (
                <Step03Metodologia
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  activePrinciple={activePrinciple}
                  setActivePrinciple={setActivePrinciple}
                  viewedPrinciples={viewedPrinciples}
                  setViewedPrinciples={setViewedPrinciples}
                />
              )}

              {step === 4 && (
                <Step04Fechas
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {step === 6 && (
                <Step06Protocolo
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  activeProtocol={activeProtocol}
                  setActiveProtocol={setActiveProtocol}
                />
              )}

              {step === 7 && (
                <Step07Asistencia
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {step === 8 && (
                <Step08TopDocente
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  onShowCertificate={() => setShowCertificate(true)}
                />
              )}

              {step === 9 && (
                <Step09Contacto
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  phoneCountryCode={phoneCountryCode}
                  setPhoneCountryCode={setPhoneCountryCode}
                  phoneNational={phoneNational}
                  setPhoneNational={setPhoneNational}
                />
              )}

              {step === 10 && (
                <Step10Documentacion
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {step === 11 && (
                <Step11Perfil
                  formData={formData}
                  setFormData={setFormData}
                  onNext={handleNext}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Step 12 - legacy declaration screen (kept for backward compat, not normally reached) */}
              {step === 12 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Declaración de Conformidad</h2>
                  <p className="wz-sub">
                    Revisa tus datos y envía tu conformidad por WhatsApp a{' '}
                    {marcaConfig[formData.marca]?.nombre}.
                  </p>
                  <div className="wz-declaration">
                    <p>
                      "Confirmo que acepto el Manual Operativo del Docente. Comprendo la metodología
                      práctica, los horarios de entrega innegociables y la Política de Asistencia y
                      Compromiso Académico. Autorizo el uso de mi firma digital para certificados."
                    </p>
                  </div>
                  <div className="wz-summary">
                    <div className="wz-sum-row"><span>Docente</span><strong>{formData.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Documento</span><strong>{formData.documento}</strong></div>
                    <div className="wz-sum-row"><span>Correo</span><strong>{formData.correo}</strong></div>
                    <div className="wz-sum-row"><span>Institución</span><strong style={{ color: brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Teléfono</span><strong>{formData.telefono}</strong></div>
                    <div className="wz-sum-row"><span>Método de Pago</span><strong>{formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase()}</strong></div>
                    <div className="wz-sum-row" style={{ borderBottom: 'none' }}><span>Compromisos</span><strong style={{ color: '#059669' }}>Todos Aceptados</strong></div>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleFinish} disabled={isSubmitting} className="wz-btn-wa" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                      {isSubmitting ? 'Procesando y Subiendo Archivos...' : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Enviar a {marcaConfig[formData.marca]?.nombre}
                        </>
                      )}
                    </button>
                  </div>
                  <p className="wz-footer">CIIP LATAM • GEOMINA • BIOMEDIC | © 2026</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Certificate modal */}
      {showCertificate && (
        <div className="wz-certificate-overlay" role="dialog" aria-modal="true" aria-label="Certificado del Programa Docente TOP">
          <div className="wz-certificate-modal">
            <button
              type="button"
              className="wz-certificate-close"
              onClick={() => setShowCertificate(false)}
              aria-label="Cerrar certificado"
            >
              ×
            </button>
            <div className="wz-certificate-modal-head">
              <span>Programa Docente TOP</span>
              <h2>Modelo de certificado institucional</h2>
            </div>
            <div className="wz-certificate-image-wrap">
              <img
                src="/assets/certificado-docente-top.webp"
                alt="Modelo de certificado institucional CIIP Latam para docentes"
                className="wz-certificate-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Penalidad (Step 4) */}
      {showPenaltyAlert && (
        <div className="wz-modal-overlay fade-in">
          <div className="wz-modal-content condition-modal">
            <span className="wz-modal-tag">Importante</span>
            <h3 className="wz-modal-title">Penalidad por Incumplimiento</h3>
            <p className="wz-modal-desc">
              Si la Dirección Académica se ve en la necesidad de <strong>solicitarte el material</strong> por
              falta de entrega a tiempo en los plazos que acabas de aceptar, se contabilizará
              automáticamente como una <strong>penalidad de desempeño</strong> en tu perfil. Confiamos en su
              compromiso.
            </p>
            <button
              onClick={() => { setShowPenaltyAlert(false); setShowDriveAlert(true); }}
              className="wz-btn-firm"
            >
              Comprendo y Acepto la Condición
            </button>
          </div>
        </div>
      )}

      {/* Modal Drive (Step 4 → 6) */}
      {showDriveAlert && (
        <div className="wz-modal-overlay fade-in">
          <div className="wz-modal-content condition-modal" style={{ borderTop: '4px solid #0ea5e9' }}>
            <span className="wz-modal-tag" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Google Drive
            </span>
            <h3 className="wz-modal-title" style={{ marginTop: '0.8rem' }}>Habilitación de Carpetas</h3>
            <p className="wz-modal-desc" style={{ marginBottom: '1.5rem' }}>
              No es necesario que crees ninguna carpeta por tu cuenta. LA DIRECCIÓN ACADÉMICA encargada le
              hará llegar los enlaces correspondientes a su correo o WhatsApp.
              <br /><br />
              <strong style={{ color: '#0ea5e9' }}>No olvide:</strong>{' '}
              <u>Esta carpeta no puede ser compartida con otros estudiantes.</u>
            </p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button
                onClick={() => { setShowDriveAlert(false); setStep(6); }}
                className="wz-btn-firm"
                style={{ flex: 1, background: 'var(--bc)', boxShadow: '0 8px 24px -8px rgba(14,165,233,0.5)' }}
              >
                Entendido, Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="remove-black">
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
