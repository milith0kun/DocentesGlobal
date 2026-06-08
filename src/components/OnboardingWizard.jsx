'use client';

import { useState } from 'react';
import { isValidEmail } from '../utils/emailValidation.js';

const logobiomedic = '/assets/logobiomedic.png';
const geominaWhite = '/assets/geomina-new.png';
const biomedicWhite = '/assets/biomedic-white.png';
const camaraFondoVirtual = '/assets/camara_fondo_virtual.png';
const identidadVisualPpts = '/assets/identidad_visual_ppts.png';
const canalesExternosProhibidos = '/assets/canales_externos_prohibidos.png';
const phoneCountries = [
  { code: 'PE', name: 'Perú', dial: '+51', min: 9, max: 9 },
  { code: 'BO', name: 'Bolivia', dial: '+591', min: 8, max: 8 },
  { code: 'CO', name: 'Colombia', dial: '+57', min: 10, max: 10 },
  { code: 'EC', name: 'Ecuador', dial: '+593', min: 9, max: 9 },
  { code: 'CL', name: 'Chile', dial: '+56', min: 9, max: 9 },
  { code: 'AR', name: 'Argentina', dial: '+54', min: 10, max: 11 },
  { code: 'MX', name: 'México', dial: '+52', min: 10, max: 10 },
  { code: 'ES', name: 'España', dial: '+34', min: 9, max: 9 },
  { code: 'US', name: 'Estados Unidos', dial: '+1', min: 10, max: 10 },
];
const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

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

  const consultarDNI = async (dniVal) => {
    if (!/^\d{8}$/.test(dniVal)) return;
    setLoadingDni(true);
    setDniLookupMessage('');
    try {
      const response = await fetch('/api/reniec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dniVal })
      });

      const resData = await parseJsonResponse(response);
      if (!response.ok || !resData) {
        setDniLookupMessage('No se pudo autocompletar el nombre. Escríbelo manualmente.');
        return;
      }

      if (resData.success && resData.nombre) {
        setFormData(prev => ({ ...prev, nombre: resData.nombre }));
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
    setFormData(prev => ({ ...prev, fechaNacimiento: formatted }));
  };
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
  const mostrarErrorCorreo = formData.correo.trim().length > 0 && !correoValido;
  const phoneCountry = phoneCountries.find((country) => country.code === phoneCountryCode) || phoneCountries[0];
  const phoneDigitsValid =
    phoneNational.length >= phoneCountry.min &&
    phoneNational.length <= phoneCountry.max;
  const telefonoValido = phoneDigitsValid && /^\+[1-9]\d{7,14}$/.test(formData.telefono);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [viewYear, setViewYear] = useState(new Date().getFullYear() - 25);
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [calendarView, setCalendarView] = useState('year'); // 'year' | 'month' | 'day'

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

  const totalSteps = 11;

  const stepLabels = {
    1: 'Selección de Institución',
    2: 'Datos Personales',
    3: 'Metodología Doing by Learning',
    4: 'Fechas de Corte Innegociables',
    5: 'Acceso a Drive Institucional',
    6: 'Protocolo de Imagen & Comunicación',
    7: 'Política de Asistencia',
    8: 'Programa Docente TOP',
    9: 'Contacto y Datos de Pago',
    10: 'Subir Documentación',
    11: 'Perfil Profesional & Comentarios',
  };

  const toggleMarca = (key) => {
    let selected = formData.marca ? formData.marca.split(',') : [];
    if (selected.includes(key)) {
      selected = selected.filter(k => k !== key);
    } else {
      if (selected.length < 2) {
        selected.push(key);
      }
    }
    setFormData({...formData, marca: selected.join(',')});
  };

  const marcaConfig = {
    ciip: { nombre: 'CIIP Latam', color: '#0284c7', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(2,132,199,0.12)' },
    geomina: { nombre: 'Geomina', color: '#0ea5e9', telefono: '51925084564', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(14,165,233,0.12)' },
    biomedic: { nombre: 'Biomedic', color: '#06b6d4', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(6,182,212,0.1)' },
    ambos: { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
    'ciip,geomina': { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
    'geomina,ciip': { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Coordinacion Academica', bgGlow: 'rgba(56,189,248,0.12)' },
    'ciip,biomedic': { nombre: 'CIIP Latam & Biomedic', color: '#0ea5e9', telefono: '51956006498', coordinador: 'Coordinación Académica', bgGlow: 'rgba(14,165,233,0.12)' },
    'biomedic,ciip': { nombre: 'CIIP Latam & Biomedic', color: '#0ea5e9', telefono: '51956006498', coordinador: 'Coordinación Académica', bgGlow: 'rgba(14,165,233,0.12)' },
    'geomina,biomedic': { nombre: 'Geomina & Biomedic', color: '#06b6d4', telefono: '51925084564', coordinador: 'Coordinación Académica', bgGlow: 'rgba(6,182,212,0.1)' },
    'biomedic,geomina': { nombre: 'Geomina & Biomedic', color: '#06b6d4', telefono: '51925084564', coordinador: 'Coordinación Académica', bgGlow: 'rgba(6,182,212,0.1)' },
  };

  const handleNext = () => {
    if (step === 1 && !formData.marca) return;
    if (step === 2 && (!formData.nombre.trim() || !correoValido || !formData.documento.trim() || formData.fechaNacimiento.length !== 10)) return;
    if (step === 3 && !formData.aceptaMetodologia) return;
    if (step === 4 && (!formData.aceptaSabado || !formData.aceptaDomingo || !formData.aceptaLunes)) return;
    if (step === 4) { setShowPenaltyAlert(true); return; } // Muestra Modal de Penalidad
    if (step === 6 && !formData.aceptaProtocolo) return;
    if (step === 7 && !formData.aceptaAsistencia) return;
    if (step === 8 && !formData.aceptaTop) return;
    if (step === 9 && (!telefonoValido || !formData.metodoPago || !formData.numeroCuenta.trim() || !formData.direccion.trim())) return;
    if (step === 9 && formData.metodoPago === 'otro' && !formData.metodoPagoOtro.trim()) return;
    if (step === 10 && (!formData.cvFile || !formData.fotoFile)) return;
    if (step === 10) { setShowDriveAlert(true); return; } // Muestra Modal de Drive
    if (step === 11 && (!formData.profesion.trim() || !formData.softwares.trim() || !formData.cursoSonado.trim() || !formData.mejoraAdmin.trim())) return;
    if (step === 11) { handleFinish(); return; }
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 6) { setStep(4); return; } // Regresa de Protocolo a Fechas
    if (step === 11) { setStep(10); return; } // Regresa de Perfil a Documentación
    if (step > 1) setStep(s => s - 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
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
        const comentarios = formData.comentarios
          ? `\nComentarios: ${formData.comentarios}`
          : '';
        const msg = [
          '*FORMULARIO DOCENTE - CONFORMIDAD*',
          '',
          `*Codigo:* ${resData.code}`,
          `*Docente:* ${formData.nombre}`,
          `*Documento:* ${formData.documento}`,
          `*Correo:* ${formData.correo}`,
          `*Institucion:* ${cfg.nombre}`,
          `*Telefono:* ${formData.telefono}`,
          '',
          '*Datos de Pago:*',
          `- Metodo: ${metodo}`,
          `- Cuenta: ${formData.numeroCuenta}`,
          `- Direccion: ${formData.direccion}`,
          '',
          `*Softwares:* ${formData.softwares}`,
          `*Curso deseado:* ${formData.cursoSonado}`,
          `*Mejora sugerida:* ${formData.mejoraAdmin}${comentarios}`,
          '',
          '*Compromisos Aceptados:*',
          '- Metodologia Doing by Learning',
          '- Fechas de corte innegociables',
          '- Protocolo de imagen',
          '- Politica de asistencia',
          '- Programa Docente TOP',
          '',
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
    setFormData({ nombre:'',correo:'',marca:'',documento:'',fechaNacimiento:'',aceptaMetodologia:false,aceptaSabado:false,aceptaDomingo:false,aceptaLunes:false,aceptaProtocolo:false,aceptaAsistencia:false,aceptaTop:false,telefono:'',metodoPago:'',metodoPagoOtro:'',numeroCuenta:'',direccion:'',cvFile:null,fotoFile:null,profesion:'',softwares:'',cursoSonado:'',mejoraAdmin:'',comentarios:'' });
    setPhoneCountryCode('PE');
    setPhoneNational('');
    setActivePrinciple(null);
    setShowCertificate(false);
    setViewedPrinciples([false, false, false]);
    setStep(1); setIsFinished(false); setGeneratedCode(''); setSubmissionWarning(''); setWhatsappUrl(''); onClose();
  };
  const brandColor = formData.marca ? marcaConfig[formData.marca].color : '#0284c7';
  const brandGlow = formData.marca ? marcaConfig[formData.marca].bgGlow : 'rgba(14,165,233,0.12)';

  const stepWidths = { 1: '380px', 2: '460px', 3: '600px', 4: '620px', 5: '520px', 6: '760px', 7: '860px', 8: '980px', 9: '680px', 10: '600px', 11: '640px' };

  if (!isOpen) return null;

  return (
    <div className="wz" style={{ '--bc': brandColor, '--bg': brandGlow }}>
      {/* ── HEADER ── */}
      <header className="wz-header">
        <div className="wz-h-left">
          {/* El botón de ir atrás se movió a la parte inferior del flujo */}
        </div>
        <div className="wz-h-center">
          {(() => {
            const mkLogo = (key, src, cls, extraStyle) => {
            const isSelected = formData.marca ? formData.marca.split(',').includes(key) : false;
            const isAmbosMode = formData.marca && formData.marca.split(',').length > 1;
            const opacity = step === 1 ? (!formData.marca ? 0.85 : isSelected ? 1 : 0.2) : 1;
            return (
              <img key={key} src={src} alt={key} className={`wz-logo ${cls||''}`}
                style={{ opacity, ...extraStyle, transition:'all 0.4s ease', display: isAmbosMode ? 'inline-block' : 'inline-block' }} />
            );
          };
          const ciip = mkLogo('ciip', biomedicWhite, 'lg-ciip');
          const geo = mkLogo('geomina', geominaWhite, 'lg-geo');
          const bio = mkLogo('biomedic', logobiomedic, 'lg-bio', { filter:'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)' });
          const sep = (k) => <div key={k} className="wz-sep" />;
          if (step > 1) {
            const arr = formData.marca ? formData.marca.split(',') : [];
            if (arr.length > 1) {
              return arr.flatMap((k, idx) => {
                const logo = k === 'ciip' ? ciip : k === 'geomina' ? geo : bio;
                if (idx > 0) return [<div key={`s${idx}`} className="wz-sep" />, logo];
                return [logo];
              });
            }
            return formData.marca === 'ciip' ? ciip : formData.marca === 'geomina' ? geo : bio;
          }
          return [ciip, sep('s1'), geo, sep('s2'), bio];
          })()}
        </div>
        <div className="wz-h-right">
          <button onClick={handleReset} className="wz-back" aria-label="Cerrar" style={{ fontSize:'0.9rem', fontWeight:800 }}>✕</button>
        </div>
      </header>

      {/* ── STEPPER SEGMENTADO PREMIUM ── */}
      {!isFinished && (
        <div className="wz-stepper-premium">
          <div className="wz-stepper-info">
            <span className="wz-stepper-step-badge" title={stepLabels[step]}>Paso {step} de {totalSteps}</span>
          </div>
          <div className="wz-stepper-segments">
            {Array.from({ length: totalSteps }).map((_, idx) => {
              const segmentStep = idx + 1;
              const active = step === segmentStep;
              const done = step > segmentStep;
              return (
                <div key={idx} className={`wz-stepper-segment ${active ? 'active' : ''} ${done ? 'done' : ''}`} />
              );
            })}
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="wz-main">
        <div className="wz-content" style={{ maxWidth: isFinished ? '480px' : stepWidths[step] }}>

          {/* ═══ ÉXITO ═══ */}
          {isFinished && (
            <div className="wz-fade">
              <div className="wz-success-layout">
                <div className="wz-success-media" aria-hidden="true">
                  <video
                    src="/videos/hero-docente-alpha.webm"
                    className="wz-success-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disableRemotePlayback
                  />
                </div>
                <div className="wz-success-copy">
                  <h1 className="wz-title" style={{ textAlign:'center', fontSize:'2rem', marginBottom:'0.5rem' }}>¡Conformidad Registrada!</h1>
                  <p className="wz-sub" style={{ textAlign:'center', marginBottom:'1.2rem', fontSize:'0.95rem' }}>Tu conformidad ha sido registrada exitosamente. Para finalizar tu proceso, por favor envía el mensaje de confirmación a tu coordinador académico a través de WhatsApp.</p>
                  <div className="wz-success-panel">
                    <div className="wz-sum-row"><span>Código de Registro</span><strong style={{ color:'#059669', fontSize:'1.1rem' }}>{generatedCode}</strong></div>
                    <div className="wz-sum-row"><span>Docente</span><strong>{formData.nombre}</strong></div>
                    <div className="wz-sum-row" style={{ borderBottom:'none' }}><span>Institución</span><strong style={{ color: brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong></div>
                  </div>
                  {submissionWarning && <p className="wz-success-note">{submissionWarning}</p>}
                  <div className="wz-success-actions">
                    <button
                      type="button"
                      onClick={() => whatsappUrl && window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
                      className="wz-btn-main wz-btn-whatsapp"
                      disabled={!whatsappUrl}
                      style={{ fontSize: '1rem', padding: '0.85rem' }}
                    >
                      Enviar confirmación por WhatsApp
                    </button>
                    <button onClick={handleReset} className="wz-btn-ghost">Volver al Inicio</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isFinished && (
            <>
              {/* ═══ PASO 1: SELECCIÓN DE INSTITUCIÓN ═══ */}
              {step === 1 && (
                <div className="wz-fade">
                  <h2 className="wz-title" style={{ textAlign:'center' }}>Selecciona tu Institución</h2>
                  <p className="wz-sub" style={{ textAlign:'center', marginBottom:'1.5rem' }}>Elige la institución a la que perteneces (puedes marcar hasta 2 opciones).</p>
                  
                  <style>{`
                    .custom-brand-list { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
                    .custom-brand-card {
                      background: #09111e; border: 2px solid transparent; border-radius: 12px;
                      height: 84px; display: flex; align-items: center; justify-content: center; gap: 1rem;
                      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                      position: relative; overflow: hidden; list-style: none; outline: none;
                    }
                    .custom-brand-card img {
                      opacity: 0.45; max-width: 90%; max-height: 100%; transition: all 0.3s ease;
                      object-fit: contain;
                    }
                    .custom-brand-card:hover {
                      background: #0f1e34; border-color: rgba(255, 255, 255, 0.08);
                    }
                    .custom-brand-card:hover img {
                      opacity: 0.8; transform: scale(1.02);
                    }
                    .custom-brand-card.on {
                      background: #0f1e34; border-color: var(--bc);
                      box-shadow: 0 0 0 1px var(--bc), 0 8px 24px -6px var(--bc);
                    }
                    .custom-brand-card.on img {
                      opacity: 1; transform: scale(1.05);
                    }
                    .custom-brand-card img.lg-ciip-btn { height: 55px; max-height: 60px; }
                    .custom-brand-card img.lg-geomina-btn { height: 40px; max-height: 45px; }
                    .custom-brand-card img.lg-biomedic-btn { height: 45px; max-height: 50px; }
                    .custom-brand-card.part-of-ambos {
                      background: #0f1e34; border-color: rgba(56, 189, 248, 0.45);
                      box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.25);
                    }
                    .custom-brand-card.part-of-ambos img { opacity: 1; }
                    @media(max-width: 640px) { 
                      .custom-brand-card { height: 60px; } 
                      .custom-brand-card img.lg-ciip-btn { height: 42px; max-height: 48px; }
                      .custom-brand-card img.lg-geomina-btn { height: 32px; max-height: 38px; }
                      .custom-brand-card img.lg-biomedic-btn { height: 38px; max-height: 42px; }
                    }
                  `}</style>
                  
                  <div className="custom-brand-list" style={{ maxWidth:'100%', margin:'0 auto' }}>
                    {[
                      { key:'ciip', logo:biomedicWhite },
                      { key:'geomina', logo:geominaWhite },
                      { key:'biomedic', logo:logobiomedic },
                    ].map(b => {
                      const on = formData.marca && formData.marca.split(',').includes(b.key);
                      return (
                        <div key={b.key} onClick={() => toggleMarca(b.key)}
                          className={`custom-brand-card ${on ? 'on' : ''}`}
                          style={{ '--bc': marcaConfig[b.key]?.color }}>
                          <img src={b.logo} alt={b.key} className={`lg-${b.key}-btn`} style={{
                            filter: b.key==='biomedic' ? 'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)' : 'none'
                          }} />
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="wz-nav">
                    <button onClick={onClose} className="wz-btn-ghost">Cancelar</button>
                    <button onClick={handleNext} disabled={!formData.marca} className="wz-btn-main">Continuar</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 2: DATOS PERSONALES ═══ */}
              {step === 2 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Datos Personales</h2>
                  <p className="wz-sub">Ingresa tus datos personales.</p>
                  
                  <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                    <div className="wz-field">
                      <span className="wz-label">Documento de Identidad</span>
                      <input type="text" placeholder="DNI / Pasaporte / CE" value={formData.documento}
                        onChange={e => {
                          const val = e.target.value;
                          setFormData({...formData, documento: val});
                          setDniLookupMessage('');
                          if (/^\d{8}$/.test(val)) {
                            consultarDNI(val);
                          }
                        }} className="wz-input" autoComplete="off" />
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Nombre completo</span>
                      <div style={{ position: 'relative' }}>
                        <input type="text"
                          placeholder={loadingDni ? "Buscando nombre en RENIEC..." : (formData.documento.trim() ? "Ej. Juan Pérez" : "Escribe tu Documento primero...")}
                          value={formData.nombre}
                          disabled={!formData.documento.trim() || loadingDni}
                          onChange={e => setFormData({...formData, nombre:e.target.value})}
                          className="wz-input"
                          autoComplete="off"
                          style={{ paddingRight: loadingDni ? '2.5rem' : '1rem' }} />
                        {loadingDni && (
                          <span className="wz-input-spinner" />
                        )}
                      </div>
                      {dniLookupMessage && <span className="wz-field-note">{dniLookupMessage}</span>}
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Correo Electrónico</span>
                      <input type="email"
                        placeholder={formData.documento.trim() ? "juan.perez@ejemplo.com" : "Escribe tu Documento primero..."}
                        value={formData.correo}
                        disabled={!formData.documento.trim()}
                        onChange={e => setFormData({...formData, correo:e.target.value})}
                        className={`wz-input ${mostrarErrorCorreo ? 'invalid' : ''}`}
                        aria-invalid={mostrarErrorCorreo}
                        aria-describedby={mostrarErrorCorreo ? 'correo-error' : undefined}
                        autoComplete="off" />
                      {mostrarErrorCorreo && (
                        <span id="correo-error" className="wz-field-error">Ingresa un correo valido, por ejemplo nombre@dominio.com.</span>
                      )}
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Fecha de Nacimiento</span>
                      <div className="wz-datepicker-container" style={{ position: 'relative', width: '100%' }}>
                        <input type="text"
                          placeholder="DD/MM/AAAA"
                          value={formData.fechaNacimiento}
                          onChange={handleFechaNacimientoChange}
                          onClick={openCalendar}
                          onFocus={openCalendar}
                          className="wz-input"
                          maxLength={10}
                          autoComplete="off"
                          style={{ paddingRight: '2.5rem', cursor: 'pointer' }} />
                        
                        <button
                          type="button"
                          onClick={openCalendar}
                          className="wz-datepicker-input-icon"
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </button>

                        {showDatePicker && (
                          <>
                            <div className="wz-datepicker-overlay" onClick={() => setShowDatePicker(false)} />
                            <div className="wz-datepicker-popover">
                              
                              {/* VISTA 1: SELECCIONAR AÑO */}
                              {calendarView === 'year' && (
                                <div className="wz-datepicker-view-year">
                                  <div className="wz-datepicker-view-title">Selecciona tu Año de Nacimiento</div>
                                  <div className="wz-datepicker-years-grid">
                                    {Array.from({ length: new Date().getFullYear() - 1939 }, (_, i) => 1940 + i).reverse().map(y => (
                                      <button
                                        key={y}
                                        type="button"
                                        className={`wz-datepicker-year-btn ${y === viewYear ? 'selected' : ''}`}
                                        onClick={() => {
                                          setViewYear(y);
                                          setCalendarView('month');
                                        }}
                                      >
                                        {y}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* VISTA 2: SELECCIONAR MES */}
                              {calendarView === 'month' && (
                                <div className="wz-datepicker-view-month">
                                  <div className="wz-datepicker-view-header">
                                    <button type="button" className="wz-datepicker-back-btn" onClick={() => setCalendarView('year')}>
                                      ← Año {viewYear}
                                    </button>
                                    <div className="wz-datepicker-view-title">Selecciona el Mes</div>
                                  </div>
                                  <div className="wz-datepicker-months-grid">
                                    {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, idx) => (
                                      <button
                                        key={m}
                                        type="button"
                                        className={`wz-datepicker-month-btn ${idx === viewMonth ? 'selected' : ''}`}
                                        onClick={() => {
                                          setViewMonth(idx);
                                          setCalendarView('day');
                                        }}
                                      >
                                        {m.substring(0, 3)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* VISTA 3: SELECCIONAR DÍA */}
                              {calendarView === 'day' && (
                                <div className="wz-datepicker-view-day">
                                  <div className="wz-datepicker-header">
                                    <button
                                      type="button"
                                      className="wz-datepicker-nav-btn"
                                      onClick={() => {
                                        if (viewMonth === 0) {
                                          setViewMonth(11);
                                          setViewYear(prev => prev - 1);
                                        } else {
                                          setViewMonth(prev => prev - 1);
                                        }
                                      }}
                                    >
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                    </button>

                                    <div className="wz-datepicker-header-label">
                                      <button type="button" className="wz-datepicker-label-btn" onClick={() => setCalendarView('month')}>
                                        {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][viewMonth]}
                                      </button>
                                      <button type="button" className="wz-datepicker-label-btn" onClick={() => setCalendarView('year')}>
                                        {viewYear}
                                      </button>
                                    </div>

                                    <button
                                      type="button"
                                      className="wz-datepicker-nav-btn"
                                      onClick={() => {
                                        if (viewMonth === 11) {
                                          setViewMonth(0);
                                          setViewYear(prev => prev + 1);
                                        } else {
                                          setViewMonth(prev => prev + 1);
                                        }
                                      }}
                                    >
                                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    </button>
                                  </div>

                                  <div className="wz-datepicker-grid">
                                    {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map(d => (
                                      <span key={d} className="wz-datepicker-weekday">{d}</span>
                                    ))}
                                    {(() => {
                                      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
                                      const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
                                      const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
                                      const cells = [];
                                      
                                      // Rellenar días del mes anterior
                                      const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
                                      for (let i = startDay - 1; i >= 0; i--) {
                                        cells.push({ day: prevMonthDays - i, isCurrent: false, offset: -1 });
                                      }
                                      
                                      // Días del mes actual
                                      for (let i = 1; i <= daysInMonth; i++) {
                                        cells.push({ day: i, isCurrent: true, offset: 0 });
                                      }
                                      
                                      // Rellenar días del mes siguiente
                                      const totalCells = Math.ceil(cells.length / 7) * 7;
                                      const nextDays = totalCells - cells.length;
                                      for (let i = 1; i <= nextDays; i++) {
                                        cells.push({ day: i, isCurrent: false, offset: 1 });
                                      }

                                      return cells.map((cell, idx) => {
                                        let isSelected = false;
                                        if (formData.fechaNacimiento) {
                                          const partes = formData.fechaNacimiento.split('/');
                                          if (partes.length === 3) {
                                            const selD = Number(partes[0]);
                                            const selM = Number(partes[1]) - 1;
                                            const selY = Number(partes[2]);
                                            
                                            let targetMonth = viewMonth + cell.offset;
                                            let targetYear = viewYear;
                                            if (targetMonth < 0) {
                                              targetMonth = 11;
                                              targetYear -= 1;
                                            } else if (targetMonth > 11) {
                                              targetMonth = 0;
                                              targetYear += 1;
                                            }
                                            isSelected = selD === cell.day && selM === targetMonth && selY === targetYear;
                                          }
                                        }

                                        return (
                                          <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                              let targetMonth = viewMonth + cell.offset;
                                              let targetYear = viewYear;
                                              if (targetMonth < 0) {
                                                targetMonth = 11;
                                                targetYear -= 1;
                                              } else if (targetMonth > 11) {
                                                targetMonth = 0;
                                                targetYear += 1;
                                              }
                                              const dd = String(cell.day).padStart(2, '0');
                                              const mm = String(targetMonth + 1).padStart(2, '0');
                                              setFormData(prev => ({ ...prev, fechaNacimiento: `${dd}/${mm}/${targetYear}` }));
                                              setShowDatePicker(false);
                                            }}
                                            className={`wz-datepicker-day ${cell.isCurrent ? 'current' : 'adjacent'} ${isSelected ? 'selected' : ''}`}
                                          >
                                            {cell.day}
                                          </button>
                                        );
                                      });
                                    })()}
                                  </div>
                                </div>
                              )}

                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.nombre.trim()||!correoValido||!formData.documento.trim()||formData.fechaNacimiento.length !== 10} className="wz-btn-main">Continuar</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 3: FILOSOFÍA ═══ */}
              {step === 3 && (() => {
                const allPrinciplesViewed = viewedPrinciples.every(v => v);
                return (
                  <div className="wz-fade">
                    <span className="wz-tag">Doing by Learning</span>
                    <h2 className="wz-title">Nuestra Filosofía</h2>
                    <p className="wz-sub" style={{ marginBottom: '1.5rem' }}>Transformamos carreras mediante habilidades prácticas. Este manual no es solo una guía, es el estándar de calidad que nos posiciona en Latinoamérica.</p>
                    
                    <div className="wz-principles-list">
                      {[
                        { n:'01', t:'Enfoque 100% Práctico y Aplicado', d:'Creemos firmemente en el poder de aprender haciendo. Por ello, transformamos la teoría en experiencia directa: cada nuevo concepto cobra vida al resolver casos reales de la industria en vivo. El software es nuestro gran escenario para que los estudiantes comprueben la aplicación inmediata de su conocimiento.' },
                        { n:'02', t:'Inmersión Total en las Herramientas', d:'Evolucionamos la educación dejando atrás la exposición tradicional. Les invitamos a sustituir las extensas presentaciones por una inmersión directa en el entorno de trabajo digital. Queremos que sus sesiones sean espacios dinámicos y de acción pura, donde el estudiante alcance el dominio técnico interactuando con la herramienta desde el primer minuto.' },
                        { n:'03', t:'Liderazgo y Fluidez del Aprendizaje', d:'Usted es el guía que marca el ritmo del éxito grupal. Confiamos en su liderazgo para mantener un avance constante y motivador, gestionando con agilidad las consultas o incidencias técnicas individuales. De esta manera, garantizamos que la energía de la clase fluya sin interrupciones y todo el equipo alcance su meta de aprendizaje.' },
                      ].map((p,i) => {
                        const isOpen = activePrinciple === i;
                        const isViewed = viewedPrinciples[i];
                        return (
                          <div key={i} 
                            className={`wz-principle ${isOpen ? 'open' : ''} ${isViewed ? 'viewed' : ''}`}
                            onClick={() => {
                              setActivePrinciple(isOpen ? null : i);
                              setViewedPrinciples(prev => {
                                const next = [...prev];
                                next[i] = true;
                                return next;
                              });
                            }}
                            style={{ cursor: 'pointer', paddingBottom: isOpen ? '1.25rem' : '1rem' }}
                          >
                            <div className="wz-principle-header" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '1.25rem' }}>
                              <div className="wz-principle-num">{p.n}</div>
                              <div className="wz-principle-text" style={{ flex: 1 }}>
                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {p.t}
                                </h4>
                              </div>
                              <div className={`wz-principle-arrow ${isOpen ? 'rotated' : ''}`} style={{ transition: 'transform 0.3s ease', color: isOpen ? 'var(--bc)' : '#94a3b8' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </div>
                            </div>
                            
                            <div className={`wz-principle-content-wrapper ${isOpen ? 'open' : ''}`}>
                              <div className="wz-principle-content" style={{ marginTop: '0.85rem' }}>
                                <p className="wz-principle-desc">{p.d}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className={`wz-check-row ${formData.aceptaMetodologia?'on':''} ${!allPrinciplesViewed?'disabled':''}`} style={{ marginTop: '1.5rem' }} onClick={() => {
                      if (allPrinciplesViewed) {
                        setFormData({...formData, aceptaMetodologia:!formData.aceptaMetodologia});
                      }
                    }}>
                      <div className={`wz-checkbox ${formData.aceptaMetodologia?'on':''}`} />
                      <span>He leído y comprendo firmemente la metodología Doing by Learning.</span>
                    </div>

                    {!allPrinciplesViewed && (
                      <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ color: 'var(--bc)', fontWeight: 'bold' }}>ℹ</span> Por favor, haz clic y lee los 3 pilares de nuestra metodología para poder aceptar.
                      </p>
                    )}

                    <div className="wz-nav">
                      <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                      <button onClick={handleNext} disabled={!formData.aceptaMetodologia || !allPrinciplesViewed} className="wz-btn-main">Confirmar</button>
                    </div>
                  </div>
                );
              })()}

              {/* ═══ PASO 4: FECHAS DE CORTE ═══ */}
              {step === 4 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Fechas de Corte Innegociables</h2>
                  <p className="wz-sub">La proactividad es tu mayor activo. No esperes recordatorios para realizar tus entregas.</p>
                  
                  <div className="wz-agenda">
                    {[
                      { key:'aceptaSabado', day:'Sábado', time:'1:00 PM', label:'Material Sesión 1', desc:'Diapositivas, guías y recursos para la clase del sábado.', color:'#0ea5e9' },
                      { key:'aceptaDomingo', day:'Domingo', time:'1:00 PM', label:'Material Sesión 2', desc:'Diapositivas y guías de la clase dominical. Sin excepciones.', color:'#0284c7' },
                      { key:'aceptaLunes', day:'Lunes', time:'9:00 AM', label:'Examen Final', desc:'10 preguntas de opción múltiple, caso práctico y resolución exacta.', color:'#7c3aed' },
                    ].map((item,i) => {
                      const on = formData[item.key];
                      return (
                        <div key={i} className={`wz-agenda-row ${on?'on':''}`} onClick={() => setFormData({...formData, [item.key]:!on})} style={{ '--tlc': item.color }}>
                          <div className={`wz-agenda-check ${on?'on':''}`} />
                          <div className="wz-agenda-time">
                            <span className="wz-a-day">{item.day}</span>
                            <span className="wz-a-hr" style={{ color: item.color }}>{item.time}</span>
                          </div>
                          <div className="wz-agenda-content">
                            <h4 className="wz-a-label">{item.label}</h4>
                            <p className="wz-a-desc">{item.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaSabado||!formData.aceptaDomingo||!formData.aceptaLunes} className="wz-btn-main">Aceptar Plazos</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 6: PROTOCOLO ═══ */}
              {step === 6 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Protocolo de Imagen & Comunicación</h2>
                  <p className="wz-sub">Eres el rostro de nuestra marca para toda Latinoamérica. El profesionalismo digital no es opcional.</p>
                  
                  <div className="wz-protocol-split">
                    {/* LADO IZQUIERDO: REGLAS */}
                    <div className="wz-protocol-list-container">
                      {[
                        { title: 'Cámara y Fondo Virtual', desc: 'Cámara encendida toda la sesión con uso exclusivo del fondo institucional proporcionado.', req: true, imgStr: camaraFondoVirtual },
                        { title: 'Identidad Visual en PPTs', desc: 'Los logos de CIIP, Geomina o Biomedic deben estar presentes de forma obligatoria en cada material entregado.', req: true, imgStr: identidadVisualPpts },
                        { title: 'Canales Externos Prohibidos', desc: 'Queda estrictamente prohibido crear grupos paralelos de WhatsApp o Telegram con los alumnos.', req: false, imgStr: canalesExternosProhibidos },
                      ].map((item, i) => (
                        <div key={i} className="wz-protocol-slide">
                          <img src={item.imgStr} alt={item.title} className="wz-mobile-carousel-img" />
                          <div 
                             className={`wz-protocol-item ${activeProtocol === i ? 'active' : ''}`}
                             onMouseEnter={() => setActiveProtocol(i)}
                             onClick={() => setActiveProtocol(i)}
                          >
                            <div className="wz-pi-header">
                              <h4 className="wz-pi-title">{item.title}</h4>
                              <span className={`wz-cl-tag ${item.req ? 'req' : 'ban'}`}>{item.req ? 'Obligatorio' : 'Prohibido'}</span>
                            </div>
                            <p className="wz-pi-desc">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LADO DERECHO: IMAGEN DINÁMICA SEPARADA */}
                    <div className="wz-protocol-image-container">
                       {activeProtocol === 0 && <img src={camaraFondoVirtual} alt="Cámara y Fondo Virtual" className="wz-pi-image fade-in" />}
                       {activeProtocol === 1 && <img src={identidadVisualPpts} alt="Identidad Visual en PPTs" className="wz-pi-image fade-in" />}
                       {activeProtocol === 2 && <img src={canalesExternosProhibidos} alt="Canales Externos Prohibidos" className="wz-pi-image fade-in" />}
                    </div>
                  </div>

                  <div className={`wz-check-row ${formData.aceptaProtocolo?'on':''}`} style={{ marginTop: '0.5rem' }} onClick={() => setFormData({...formData, aceptaProtocolo:!formData.aceptaProtocolo})}>
                    <div className={`wz-checkbox ${formData.aceptaProtocolo?'on':''}`} />
                    <span>He leído, comprendo y acepto el protocolo de imagen y comunicación.</span>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaProtocolo} className="wz-btn-main">Aceptar Protocolo</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 7: ASISTENCIA ═══ */}
              {step === 7 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Política de Asistencia y Compromiso Académico</h2>
                  <p className="wz-sub">
                    El contrato firmado representa un compromiso sagrado con la institución y, principalmente,
                    con los alumnos que confían en su guía. Para garantizar una experiencia educativa sin
                    interrupciones, establecemos los siguientes lineamientos:
                  </p>

                  <div className="wz-attendance-grid">
                    {[
                      {
                        number: '01',
                        title: 'Aviso de Emergencia',
                        badge: 'Mínimo 4 días',
                        text: 'En caso de fuerza mayor, se debe notificar a la Dirección Académica con al menos 4 días de anticipación para coordinar las medidas correspondientes y evitar la cancelación de clases.',
                      },
                      {
                        number: '02',
                        title: 'Gestión de Reemplazos',
                        badge: 'Autorización previa',
                        text: 'Si por una situación muy particular y excepcional el docente no puede asistir, deberá proponer un reemplazo de igual o mayor nivel profesional, sujeto a la autorización previa de la Dirección Académica.',
                      },
                      {
                        number: '03',
                        title: 'Frecuencia y Penalidades',
                        badge: 'Según contrato',
                        text: 'Esta medida es viable únicamente en casos de extrema urgencia y de forma muy esporádica. Las faltas injustificadas no están permitidas. El incumplimiento de sesiones o las ausencias frecuentes impactarán en el récord docente y se aplicará la penalidad correspondiente según el contrato.',
                      },
                      {
                        number: '04',
                        title: 'Aporte de Valor',
                        badge: 'Compromiso activo',
                        text: 'El docente se compromete de manera activa a enviar material adicional voluntario como un aporte continuo al desarrollo de los estudiantes.',
                      },
                    ].map((item) => (
                      <article className="wz-attendance-card" key={item.number}>
                        <div className="wz-attendance-card-head">
                          <span className="wz-attendance-number">{item.number}</span>
                          <span className="wz-attendance-badge">{item.badge}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </article>
                    ))}
                  </div>

                  <div className={`wz-check-row ${formData.aceptaAsistencia?'on':''}`} onClick={() => setFormData({...formData, aceptaAsistencia:!formData.aceptaAsistencia})}>
                    <div className={`wz-checkbox ${formData.aceptaAsistencia?'on':''}`} />
                    <span>He leído y acepto la Política de Asistencia y Compromiso Académico.</span>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaAsistencia} className="wz-btn-main">Aceptar Política</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 8: PROGRAMA TOP ═══ */}
              {step === 8 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Programa Docente TOP</h2>
                  <p className="wz-sub">
                    Buscamos talentos que inspiren, no solo expositores. Si cumple con los criterios de calidad
                    académica, asistencia perfecta del 100% y entrega puntual de materiales, accederá a la
                    categoría Élite y podrá aspirar a beneficios institucionales exclusivos.
                  </p>
                  <div className="wz-top-overview">
                    <h3 className="wz-top-overview-title">Criterios para acceder a la categoría Élite</h3>
                    <p className="wz-top-overview-text">
                      La evaluación reconoce el desempeño integral, la constancia y el aporte real del docente
                      a la experiencia de aprendizaje.
                    </p>
                    <div className="wz-top-kpis">
                      <div className="wz-top-kpi">
                        <span className="wz-top-kpi-label">Calidad</span>
                        <strong>Académica</strong>
                      </div>
                      <div className="wz-top-kpi">
                        <span className="wz-top-kpi-label">Asistencia</span>
                        <strong>100%</strong>
                      </div>
                      <div className="wz-top-kpi">
                        <span className="wz-top-kpi-label">Materiales</span>
                        <strong>Puntuales</strong>
                      </div>
                    </div>
                  </div>

                  <div className="wz-top-benefits">
                    {[
                      ['Capacitación de Primer Nivel', 'Acceso a becas y capacitaciones 100% gratuitas, además de descuentos exclusivos en programas avanzados de la institución.'],
                      ['Networking de Alto Valor', 'Conexiones directas con redes de expertos internacionales y profesionales líderes en la industria de la región.'],
                      ['Representación de Marca', 'Oportunidad de representar a la institución como ponente principal en eventos internacionales y conferencias globales.'],
                      ['Presencia en Medios', 'Participación exclusiva en los podcasts oficiales, entrevistas de difusión y paneles de opinión especializados.'],
                      ['Lanzamientos e Innovación', 'Prioridad para liderar nuevos proyectos de desarrollo, consultoría y cursos emergentes de la organización.'],
                    ].map(([title, text], index) => (
                      <article className="wz-top-benefit" key={title}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <h3>{title}</h3>
                          <p>{text}</p>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="wz-certificate">
                    <div className="wz-certificate-copy">
                      <span className="wz-certificate-kicker">Reconocimiento institucional</span>
                      <h3>Certificado del Programa Docente TOP</h3>
                      <p>Conoce el modelo de certificado que reconoce la participación, el compromiso y la excelencia académica del docente.</p>
                    </div>
                    <button type="button" className="wz-certificate-button" onClick={() => setShowCertificate(true)}>
                      Ver certificado
                    </button>
                  </div>

                  <div className={`wz-check-row ${formData.aceptaTop?'on':''}`} onClick={() => setFormData({...formData, aceptaTop:!formData.aceptaTop})}>
                    <div className={`wz-checkbox ${formData.aceptaTop?'on':''}`} />
                    <span>He leído las condiciones del Programa Docente TOP y los objetivos de calidad.</span>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaTop} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 9: CONTACTO Y PAGO ═══ */}
              {step === 9 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Contacto y Datos de Pago</h2>
                  <p className="wz-sub">Datos necesarios para la gestión de honorarios y comunicación directa.</p>
                  
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">Número de WhatsApp</span>
                    <div className="wz-phone-field">
                      <label className="wz-phone-country">
                        <span className="wz-phone-country-label">País</span>
                        <select
                          value={phoneCountryCode}
                          onChange={(event) => {
                            const nextCode = event.target.value;
                            const nextCountry = phoneCountries.find((country) => country.code === nextCode) || phoneCountries[0];
                            const nextNational = phoneNational.slice(0, nextCountry.max);
                            setPhoneCountryCode(nextCode);
                            setPhoneNational(nextNational);
                            setFormData((current) => ({
                              ...current,
                              telefono: nextNational ? `${nextCountry.dial}${nextNational}` : '',
                            }));
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
                              setFormData((current) => ({
                                ...current,
                                telefono: digits ? `${phoneCountry.dial}${digits}` : '',
                              }));
                            }}
                            className="wz-phone-input"
                          />
                        </div>
                      </label>
                    </div>
                    {phoneNational && !phoneDigitsValid && (
                      <span className="wz-field-error">
                        Ingresa {phoneCountry.min === phoneCountry.max
                          ? `${phoneCountry.min} dígitos`
                          : `entre ${phoneCountry.min} y ${phoneCountry.max} dígitos`} para {phoneCountry.name}.
                      </span>
                    )}
                    {telefonoValido && (
                      <span className="wz-field-note">Se guardará como {formData.telefono}.</span>
                    )}
                  </div>

                  <span className="wz-label" style={{ display:'block', marginBottom:'0.75rem' }}>Cuenta de abono preferente</span>
                  <div className="wz-payment-grid">
                    {[
                      { key:'yape', label:'YAPE' },
                      { key:'bcp', label:'BCP' },
                      { key:'bolivia', label:'Banco de Bolivia' },
                      { key:'paypal', label:'PayPal' },
                      { key:'falabella', label:'Banco Falabella' },
                      { key:'otro', label:'Otro' },
                    ].map(m => {
                      const on = formData.metodoPago === m.key;
                      return (
                        <div key={m.key} className={`wz-pay-card ${on?'on':''}`} onClick={() => setFormData({...formData, metodoPago:m.key})}>
                          <div className={`wz-radio ${on?'on':''}`} />
                          <span>{m.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {formData.metodoPago === 'otro' && (
                    <div className="wz-field" style={{ marginTop:'0.75rem' }}>
                      <input type="text" placeholder="Especifique su método de pago" value={formData.metodoPagoOtro}
                        onChange={e => setFormData({...formData, metodoPagoOtro:e.target.value})} className="wz-input" />
                    </div>
                  )}

                  <div className="wz-grid-2" style={{ marginTop:'1.25rem' }}>
                    <div className="wz-field">
                      <span className="wz-label">Número de cuenta o celular de abono</span>
                      <input type="text" placeholder="Ej. 191-XXX-XXXXXXX" value={formData.numeroCuenta}
                        onChange={e => setFormData({...formData, numeroCuenta:e.target.value})} className="wz-input" />
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Dirección de vivienda</span>
                      <input type="text" placeholder="Av. Principal 123, Lima" value={formData.direccion}
                        onChange={e => setFormData({...formData, direccion:e.target.value})} className="wz-input" />
                    </div>
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!telefonoValido||!formData.metodoPago||!formData.numeroCuenta.trim()||!formData.direccion.trim()||(formData.metodoPago==='otro'&&!formData.metodoPagoOtro.trim())} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 10: DOCUMENTACIÓN ═══ */}
              {step === 10 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Documentación</h2>
                  <p className="wz-sub" style={{ marginBottom:'2rem' }}>Adjunta tu CV actualizado y una fotografía profesional.</p>
                  
                  <div className="wz-upload-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <div className="wz-upload-zone" onClick={() => !formData.cvFile && document.getElementById('cv-upload').click()} style={{ border: formData.cvFile ? '1px solid #e2e8f0' : '2px dashed #cbd5e1', borderRadius: '16px', padding: formData.cvFile ? '1rem' : '1.25rem 1rem', textAlign: 'center', cursor: formData.cvFile ? 'default' : 'pointer', background: formData.cvFile ? '#ffffff' : '#f8fafc', boxShadow: formData.cvFile ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                        <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }}
                          onChange={e => setFormData({...formData, cvFile: e.target.files[0]})} />
                        
                        {formData.cvFile ? (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0', fontWeight: 800 }}>Curriculum Vitae</h4>
                                <button onClick={(e) => { e.stopPropagation(); setFormData({...formData, cvFile: null}) }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '1.4rem', lineHeight: 1 }} title="Eliminar archivo">×</button>
                              </div>
                              <div style={{ width: '100%', height: '220px', background: 'transparent', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {formData.cvFile.type === 'application/pdf' ? (
                                  <iframe src={URL.createObjectURL(formData.cvFile)} style={{ width: '100%', height: '100%', border: '1px solid #e2e8f0', borderRadius: '8px' }} title="CV Preview" />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:'0.5rem' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    <span style={{ fontSize: '0.85rem' }}>Documento DOC/DOCX cargado</span>
                                  </div>
                                )}
                              </div>
                            </div>
                        ) : (
                          <>
                            <div className="wz-upload-svg" style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Curriculum Vitae</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0', fontWeight: 500 }}>PDF o DOC • Máx. 10 MB</p>
                          </>
                        )}
                      </div>
                      
                      {/* DETALLE FUERA DE LA CAJA */}
                      {formData.cvFile && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', textAlign: 'center' }}>{formData.cvFile.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="wz-upload-zone" onClick={() => !formData.fotoFile && document.getElementById('foto-upload').click()} style={{ border: formData.fotoFile ? '1px solid #e2e8f0' : '2px dashed #cbd5e1', borderRadius: '16px', padding: formData.fotoFile ? '1rem' : '1.25rem 1rem', textAlign: 'center', cursor: formData.fotoFile ? 'default' : 'pointer', background: formData.fotoFile ? '#ffffff' : '#f8fafc', boxShadow: formData.fotoFile ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                        <input id="foto-upload" type="file" accept="image/*" style={{ display:'none' }}
                          onChange={e => setFormData({...formData, fotoFile: e.target.files[0]})} />
                        
                        {formData.fotoFile ? (
                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0', fontWeight: 800 }}>Fotografía Profesional</h4>
                                <button onClick={(e) => { e.stopPropagation(); setFormData({...formData, fotoFile: null}) }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '1.4rem', lineHeight: 1 }} title="Eliminar foto">×</button>
                              </div>
                              <div style={{ width: '100%', height: '220px', background: 'transparent', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={URL.createObjectURL(formData.fotoFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              </div>
                            </div>
                        ) : (
                          <>
                            <div className="wz-upload-svg" style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </div>
                            <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Fotografía Profesional</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0', fontWeight: 500 }}>JPG o PNG • Máx. 10 MB</p>
                          </>
                        )}
                      </div>
                      
                      {/* DETALLE FUERA DE LA CAJA */}
                      {formData.fotoFile && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', textAlign: 'center' }}>{formData.fotoFile.name}</span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{(formData.fotoFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.cvFile||!formData.fotoFile} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 11: PERFIL PROFESIONAL ═══ */}
              {step === 11 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Perfil Profesional</h2>
                  <p className="wz-sub">Queremos conocerte mejor. Tu opinión nos ayuda a crecer juntos.</p>
                  
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">Profesión o especialidad principal</span>
                    <input type="text" placeholder="Ej. Ingeniero Civil, Administrador, Médico, etc." value={formData.profesion}
                      onChange={e => setFormData({...formData, profesion:e.target.value})} className="wz-input" />
                  </div>
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">Softwares especializados que domina</span>
                    <textarea placeholder="Ej. AutoCAD, SAP2000, ETABS, Civil 3D, ArcGIS..." value={formData.softwares}
                      onChange={e => setFormData({...formData, softwares:e.target.value})} className="wz-textarea" rows={3} />
                  </div>
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">¿Qué curso o especialización le gustaría dictar como reto profesional?</span>
                    <textarea placeholder="Cuéntenos el tema y por qué le apasionaría desarrollarlo..." value={formData.cursoSonado}
                      onChange={e => setFormData({...formData, cursoSonado:e.target.value})} className="wz-textarea" rows={3} />
                  </div>
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">¿Qué proceso académico o administrativo optimizaría?</span>
                    <textarea placeholder="Desde su perspectiva como docente, ¿qué mejoraría?" value={formData.mejoraAdmin}
                      onChange={e => setFormData({...formData, mejoraAdmin:e.target.value})} className="wz-textarea" rows={3} />
                  </div>
                  <div className="wz-field">
                    <span className="wz-label">Comentarios adicionales <span style={{ color:'#94a3b8', fontWeight:500 }}>(opcional)</span></span>
                    <textarea placeholder="¿Alguna observación, recomendación o información adicional?" value={formData.comentarios}
                      onChange={e => setFormData({...formData, comentarios:e.target.value})} className="wz-textarea" rows={2} />
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={isSubmitting || !formData.profesion.trim() || !formData.softwares.trim() || !formData.cursoSonado.trim() || !formData.mejoraAdmin.trim()} className="wz-btn-main">
                      {isSubmitting ? 'Guardando registro...' : 'Finalizar registro'}
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 12: DECLARACIÓN ═══ */}
              {step === 12 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Declaración de Conformidad</h2>
                  <p className="wz-sub">Revisa tus datos y envía tu conformidad por WhatsApp a {marcaConfig[formData.marca]?.nombre}.</p>
                  <div className="wz-declaration">
                    <p>"Confirmo que acepto el Manual Operativo del Docente. Comprendo la metodología práctica, los horarios de entrega innegociables y la Política de Asistencia y Compromiso Académico. Autorizo el uso de mi firma digital para certificados."</p>
                  </div>
                  <div className="wz-summary">
                    <div className="wz-sum-row"><span>Docente</span><strong>{formData.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Documento</span><strong>{formData.documento}</strong></div>
                    <div className="wz-sum-row"><span>Correo</span><strong>{formData.correo}</strong></div>
                    <div className="wz-sum-row"><span>Institución</span><strong style={{ color:brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Teléfono</span><strong>{formData.telefono}</strong></div>
                    <div className="wz-sum-row"><span>Método de Pago</span><strong>{formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase()}</strong></div>
                    <div className="wz-sum-row" style={{ borderBottom:'none' }}><span>Compromisos</span><strong style={{ color:'#059669' }}>Todos Aceptados</strong></div>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleFinish} disabled={isSubmitting} className="wz-btn-wa" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                      {isSubmitting ? 'Procesando y Subiendo Archivos...' : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
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
                src="/assets/certificado-docente-top.png"
                alt="Modelo de certificado institucional CIIP Latam para docentes"
                className="wz-certificate-image"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL PENALIDAD (PASO 4) ═══ */}
      {showPenaltyAlert && (
        <div className="wz-modal-overlay fade-in">
          <div className="wz-modal-content condition-modal">
            <span className="wz-modal-tag">Término Innegociable</span>
            <h3 className="wz-modal-title">Penalidad por Incumplimiento</h3>
            <p className="wz-modal-desc">
              Si la Dirección Académica se ve en la necesidad de <strong>solicitarte el material</strong> por falta de entrega a tiempo en los plazos que acabas de aceptar, se contabilizará automáticamente como una <strong>penalidad de desempeño</strong> en tu perfil. No existen recordatorios previos.
            </p>
            <button onClick={() => { setShowPenaltyAlert(false); setStep(6); }} className="wz-btn-firm">
              Comprendo y Acepto la Condición
            </button>
          </div>
        </div>
      )}

      {/* ═══ MODAL DRIVE INSTITUCIONAL (PASO 10) ═══ */}
      {showDriveAlert && (
        <div className="wz-modal-overlay fade-in">
          <div className="wz-modal-content condition-modal" style={{ borderTop: '4px solid #0ea5e9' }}>
            <span className="wz-modal-tag" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', display:'inline-flex', alignItems:'center', gap:'0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Google Drive
            </span>
            <h3 className="wz-modal-title" style={{ marginTop: '0.8rem' }}>Habilitación de Carpetas</h3>
            <p className="wz-modal-desc" style={{ marginBottom: '1.5rem' }}>
              No es necesario que crees ninguna carpeta. La Dirección Académica configurará automáticamente tu espacio institucional y <strong>recibirás un correo</strong> cuando tus carpetas de subida estén listas.
            </p>
            <button onClick={() => { setShowDriveAlert(false); setStep(11); }} className="wz-btn-firm" style={{ width: '100%', background: 'var(--bc)', boxShadow: '0 8px 24px -8px rgba(14,165,233,0.5)' }}>
              Entendido, Continuar
            </button>
          </div>
        </div>
      )}

      {/* ═══ CSS ═══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        /* ── RESET & BASE ── */
        .wz {
          position:fixed; inset:0; z-index:2000;
          background:#fafbfd;
          font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif;
          color:#1e293b; display:flex; flex-direction:column;
          overflow:hidden;
        }
        .wz,
        .wz * {
          min-width: 0;
        }
        .wz p,
        .wz span,
        .wz strong,
        .wz h1,
        .wz h2,
        .wz h3,
        .wz h4,
        .wz button,
        .wz a,
        .wz label {
          overflow-wrap: anywhere;
        }

        /* ── HEADER ── */
        .wz-header {
          height:92px; flex-shrink:0; display:flex; align-items:center; justify-content:space-between;
          padding:0 2rem; background:linear-gradient(135deg,#060e1a 0%,#0a1e35 100%); position:relative;
        }
        .wz-h-left, .wz-h-right { width:80px; display:flex; align-items:center; }
        .wz-h-right { justify-content:flex-end; }
        .wz-h-center { display:flex; align-items:center; justify-content:center; gap:clamp(0.55rem, 2.4vw, 1rem); min-width:0; }
        .wz-logo { height:42px; width:auto; max-width:28vw; object-fit:contain; flex:0 1 auto; transition:all 0.4s ease; }
        .wz-logo.lg-ciip { height:56px; }
        .wz-logo.lg-geo { height:35px; transform:translateY(5px); }
        .wz-logo.lg-bio { height:50px; }
        .wz-sep { width:1px; height:24px; background:linear-gradient(to bottom,transparent,rgba(56,189,248,0.2),transparent); }
        .wz-back {
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          color:#94a3b8; cursor:pointer; width:38px; height:38px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; transition:all 0.2s;
        }
        .wz-back:hover { background:rgba(56,189,248,0.12); color:#38bdf8; border-color:rgba(56,189,248,0.3); }

        /* ── STEPPER SEGMENTADO PREMIUM ── */
        .wz-stepper-premium {
          background:#fff; border-bottom:1px solid #e8ecf1;
          padding:0.85rem 2.5rem; display:flex; flex-direction:column; gap:0.6rem;
          flex-shrink:0; position:relative; z-index:10; align-items:center;
        }
        .wz-stepper-info {
          display:flex; align-items:center; gap:0.5rem;
          font-family:'Plus Jakarta Sans',sans-serif;
        }
        .wz-stepper-step-badge {
          font-size:0.75rem; font-weight:800; text-transform:uppercase;
          letter-spacing:1px; color:var(--bc);
        }
        .wz-stepper-dot-separator {
          color:#cbd5e1; font-size:0.75rem;
        }
        .wz-stepper-step-name {
          font-size:0.85rem; font-weight:750; color:#1e293b;
          max-width:min(52vw, 32rem);
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .wz-stepper-segments {
          display:flex; align-items:center; gap:0.35rem; width:100%; max-width:680px;
        }
        .wz-stepper-segment {
          flex:1; height:4px; border-radius:4px;
          background:#f1f5f9; transition:all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .wz-stepper-segment.active {
          background:var(--bc); box-shadow:0 0 8px var(--bc);
        }
        .wz-stepper-segment.done {
          background:var(--bc); opacity:0.65;
        }

        /* ── MAIN AREA ── */
        .wz-main {
          flex:1; display:flex; align-items:flex-start; justify-content:center;
          min-height:0; padding:1.5rem 3rem; overflow-y:auto; overflow-x:hidden;
          overscroll-behavior:contain;
          -webkit-overflow-scrolling:touch;
        }
        .wz-content {
          width:100%; transition:max-width 0.35s ease;
          margin-top:auto; margin-bottom:auto;
          max-width:min(100%, var(--wz-content-max, 100%));
        }

        /* ── TYPOGRAPHY ── */
        .wz-title {
          font-family:'Outfit',sans-serif; font-size:1.65rem; font-weight:850;
          letter-spacing:-0.8px; color:#0f172a; margin:0 0 0.35rem;
          line-height:1.16;
        }
        .wz-sub { font-size:0.9rem; color:#64748b; line-height:1.55; margin:0 0 1.5rem; font-weight:500; }
        .wz-tag {
          display:inline-block; font-size:0.65rem; font-weight:800; text-transform:uppercase;
          letter-spacing:2px; color:var(--bc); background:var(--bg);
          padding:0.3rem 0.85rem; border-radius:50px; margin-bottom:0.65rem;
          border:1px solid rgba(14,165,233,0.1);
        }
        .wz-tag.gold { color:#b45309; background:rgba(245,158,11,0.08); border-color:rgba(245,158,11,0.15); }

        /* ── LABELS & INPUTS ── */
        .wz-label {
          font-size:0.68rem; font-weight:800; color:#94a3b8;
          text-transform:uppercase; letter-spacing:1.5px;
        }
        .wz-field { display:flex; flex-direction:column; gap:0.4rem; }
        .wz-input {
          width:100%; padding:0.75rem 1rem; border:1.5px solid #e8ecf1;
          border-radius:10px; font-size:0.9rem; font-family:inherit;
          color:#0f172a; outline:none; background:#fff; transition:all 0.2s;
          min-width:0;
        }
        .wz-input::placeholder { color:#b0b8c4; }
        .wz-input:focus { border-color:var(--bc); box-shadow:0 0 0 3px var(--bg); }
        .wz-input:disabled { background:#f8fafc; color:#64748b; cursor:not-allowed; }
        .wz-input.invalid { border-color:#ef4444; background:#fff7f7; }
        .wz-input.invalid:focus { border-color:#ef4444; box-shadow:0 0 0 3px rgba(239,68,68,0.1); }
        .wz-field-error { font-size:0.76rem; color:#dc2626; font-weight:700; line-height:1.35; }
        .wz-field-note { font-size:0.76rem; color:#64748b; font-weight:650; line-height:1.38; }
        .wz-phone-field {
          display:grid;
          grid-template-columns:minmax(180px, 0.9fr) minmax(0, 1.1fr);
          gap:0.75rem;
          align-items:end;
        }
        .wz-phone-country,
        .wz-phone-number {
          display:flex;
          flex-direction:column;
          gap:0.35rem;
          min-width:0;
        }
        .wz-phone-country-label {
          color:#94a3b8;
          font-size:0.66rem;
          font-weight:800;
          letter-spacing:1px;
          text-transform:uppercase;
        }
        .wz-phone-select {
          width:100%;
          min-height:43px;
          padding:0.68rem 0.78rem;
          border:1.5px solid #e8ecf1;
          border-radius:10px;
          background:#fff;
          color:#0f172a;
          font-family:inherit;
          font-size:0.86rem;
          font-weight:700;
          outline:none;
        }
        .wz-phone-select:focus {
          border-color:var(--bc);
          box-shadow:0 0 0 3px var(--bg);
        }
        .wz-phone-input-wrap {
          display:flex;
          align-items:center;
          min-height:43px;
          border:1.5px solid #e8ecf1;
          border-radius:10px;
          background:#fff;
          overflow:hidden;
          transition:all 0.2s;
        }
        .wz-phone-input-wrap:focus-within {
          border-color:var(--bc);
          box-shadow:0 0 0 3px var(--bg);
        }
        .wz-phone-input-wrap.invalid {
          border-color:#ef4444;
          background:#fff7f7;
        }
        .wz-phone-prefix {
          flex:0 0 auto;
          padding:0 0.78rem;
          color:#0f2f52;
          font-size:0.86rem;
          font-weight:850;
          border-right:1px solid #eef2f7;
        }
        .wz-phone-input {
          min-width:0;
          width:100%;
          border:0;
          outline:0;
          padding:0.68rem 0.78rem;
          background:transparent;
          color:#0f172a;
          font-family:inherit;
          font-size:0.9rem;
          font-weight:650;
        }
        .wz-phone-input::placeholder {
          color:#b0b8c4;
          font-weight:500;
        }
        
        .wz-input-spinner {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px;
          border: 2px solid rgba(56, 189, 248, 0.2);
          border-top-color: var(--bc);
          border-radius: 50%;
          animation: inputSpin 0.8s linear infinite;
        }
        @keyframes inputSpin {
          to { transform: translateY(-50%) rotate(360deg); }
        }

        /* ── CUSTOM DATEPICKER PREMIUM ── */
        .wz-datepicker-container {
          position: relative;
          width: 100%;
        }
        .wz-datepicker-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 998;
          background: transparent;
        }
        .wz-datepicker-popover {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          width: 320px;
          background: rgba(255, 255, 255, 0.98);
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
          padding: 1.15rem;
          z-index: 999;
          animation: scaleUpCalendar 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(8px);
        }
        @keyframes scaleUpCalendar {
          from { opacity: 0; transform: scale(0.97) translateY(5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounceCloud {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .wz-datepicker-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.95rem;
          gap: 0.4rem;
        }
        .wz-datepicker-header-label {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .wz-datepicker-label-btn {
          border: none;
          background: none;
          font-size: 0.85rem;
          font-weight: 850;
          color: #1e293b;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .wz-datepicker-label-btn:hover {
          background: var(--bg);
          color: var(--bc);
        }
        .wz-datepicker-view-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 0.8rem;
          text-align: center;
        }
        .wz-datepicker-view-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
        }
        .wz-datepicker-back-btn {
          border: none;
          background: var(--bg);
          color: var(--bc);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.3rem 0.65rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .wz-datepicker-back-btn:hover {
          filter: brightness(0.95);
        }
        .wz-datepicker-years-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.35rem;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .wz-datepicker-years-grid::-webkit-scrollbar {
          width: 4px;
        }
        .wz-datepicker-years-grid::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
        }
        .wz-datepicker-years-grid::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .wz-datepicker-year-btn, .wz-datepicker-month-btn {
          border: 1.5px solid #e2e8f0;
          background: #fff;
          padding: 0.45rem 0;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s;
        }
        .wz-datepicker-year-btn:hover, .wz-datepicker-month-btn:hover {
          border-color: var(--bc);
          background: var(--bg);
          color: var(--bc);
        }
        .wz-datepicker-year-btn.selected, .wz-datepicker-month-btn.selected {
          background: var(--bc) !important;
          color: #fff !important;
          border-color: var(--bc) !important;
        }
        .wz-datepicker-months-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.4rem;
        }
        .wz-datepicker-nav-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border: 1.5px solid #e8ecf1;
          border-radius: 8px;
          background: #fff;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .wz-datepicker-nav-btn:hover {
          border-color: var(--bc);
          color: var(--bc);
          background: var(--bg);
        }
        .wz-datepicker-nav-btn svg {
          width: 14px;
          height: 14px;
          stroke-width: 2.5px;
        }
        .wz-datepicker-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.2rem;
          text-align: center;
        }
        .wz-datepicker-weekday {
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          padding: 0.35rem 0;
        }
        .wz-datepicker-day {
          border: none;
          background: none;
          font-size: 0.8rem;
          font-weight: 600;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .wz-datepicker-day.current {
          color: #334155;
        }
        .wz-datepicker-day.adjacent {
          color: #cbd5e1;
        }
        .wz-datepicker-day:hover {
          background: #f1f5f9;
        }
        .wz-datepicker-day.selected {
          background: var(--bc) !important;
          color: #fff !important;
          font-weight: 700;
          box-shadow: 0 4px 10px var(--bg);
        }

        @media (max-width: 768px) {
          .wz-datepicker-years-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            max-height: 240px !important;
            gap: 0.5rem !important;
          }
          .wz-datepicker-year-btn, .wz-datepicker-month-btn {
            font-size: 0.95rem !important;
            padding: 0.65rem 0 !important;
          }
          .wz-datepicker-overlay {
            background: transparent !important;
          }
          .wz-datepicker-popover {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
            max-width: 340px !important;
            animation: scaleUpCalendar 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
        @keyframes slideUpCalendar {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* ── BRAND SELECTOR (PASO 1) ── */
        .wz-brand-list { display:flex; flex-direction:column; gap:0.65rem; }
        .wz-brand-card {
          background:#09111e; border:2px solid transparent; border-radius:12px;
          padding:0.75rem 2.5rem; display:flex; align-items:center; justify-content:center; gap:1rem;
          cursor:pointer; transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position:relative; overflow:hidden;
        }
        .wz-brand-card img {
          opacity: 0.35;
          max-width: 76%;
          transition: all 0.3s ease;
        }
        .wz-brand-card:hover {
          background:#0f1e34;
          border-color:rgba(255, 255, 255, 0.08);
        }
        .wz-brand-card:hover img {
          opacity: 0.7;
        }
        .wz-brand-card.on {
          border-color:var(--bc);
          box-shadow:0 0 0 2px var(--bc), 0 8px 24px -6px var(--bc);
          background:#0f1e34;
        }
        .wz-brand-card.on img {
          opacity: 1;
        }
        .wz-brand-card.part-of-ambos {
          border-color:rgba(56, 189, 248, 0.45);
          box-shadow:0 0 0 1px rgba(56, 189, 248, 0.25);
          background:#0f1e34;
        }
        .wz-brand-card.part-of-ambos img {
          opacity: 1;
        }
        .wz-brand-card.ambos-card {
          background:linear-gradient(135deg, #080f1a 0%, #122137 100%);
          border:2px dashed rgba(255, 255, 255, 0.08);
          padding:0.65rem 2.5rem;
        }
        .wz-brand-card.ambos-card:hover {
          border-color:rgba(56, 189, 248, 0.2);
          background:linear-gradient(135deg, #0b1626 0%, #172d4b 100%);
        }
        .wz-brand-card.ambos-card.on {
          border-style:solid;
          border-color:#38bdf8;
          box-shadow:0 0 0 2px #38bdf8, 0 8px 30px -6px rgba(56, 189, 248, 0.35);
          background:linear-gradient(135deg, #0c1c30 0%, #1a3c66 100%);
        }

        .wz-radio {
          width:16px; height:16px; border:2px solid rgba(255,255,255,0.25);
          border-radius:50%; flex-shrink:0; transition:all 0.2s;
          position:absolute; left:1rem; top:50%; transform:translateY(-50%);
        }
        .wz-brand-card.on .wz-radio {
          border-color:var(--bc); background:var(--bc);
          box-shadow:inset 0 0 0 3px #0f1e34;
        }
        .wz-brand-card.ambos-card.on .wz-radio {
          border-color:#38bdf8; background:#38bdf8;
          box-shadow:inset 0 0 0 3px #0c1c30;
        }
        .wz-brand-card.part-of-ambos .wz-radio {
          border-color:rgba(56, 189, 248, 0.7);
          background:rgba(56, 189, 248, 0.25);
          box-shadow:inset 0 0 0 3px #0f1e34;
        }

        .ambos-text {
          font-size:0.75rem; font-weight:700; color:#94a3b8; transition:color 0.2s;
          line-height:1.25; text-align:center;
        }
        .wz-brand-card.ambos-card.on .ambos-text {
          color:#fff;
        }

        /* ── PILARES (PASO 2 - MANIFIESTO TIPOGRÁFICO / ACORDEÓN) ── */
        .wz-principles-list { display:flex; flex-direction:column; gap:1rem; }
        .wz-principle {
          display:flex; flex-direction:column; align-items:stretch;
          padding:1.15rem 1.35rem; border:1px solid #e8ecf1; border-radius:16px;
          background:#fff; transition:all 0.3s ease; position:relative; overflow:hidden;
        }
        .wz-principle::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background:var(--bg); transition:background 0.3s;
        }
        .wz-principle:hover { border-color:var(--bc); transform:translateX(3px); box-shadow:0 8px 16px -8px rgba(0,0,0,0.06); }
        .wz-principle:hover::before { background:var(--bc); }
        .wz-principle.open {
          border-color:rgba(14,165,233,0.38);
          background:linear-gradient(135deg, rgba(224,242,254,0.9) 0%, rgba(236,254,255,0.72) 48%, #ffffff 100%);
          box-shadow:0 14px 30px -22px rgba(2,132,199,0.5);
        }
        .wz-principle.open::before { background:var(--bc); }
        .wz-principle.viewed { border-color: rgba(34, 197, 94, 0.2); }
        .wz-principle.viewed.open { border-color:var(--bc); }
        
        .wz-principle-num {
          font-family:'Outfit',sans-serif; font-size:2rem; font-weight:900;
          color:var(--bg); line-height:0.8; letter-spacing:-2px;
          transition:color 0.3s;
        }
        .wz-principle:hover .wz-principle-num { color:var(--bc); }
        .wz-principle.open .wz-principle-num { color:var(--bc); }
        
        .wz-principle-text h4 {
          font-family:'Outfit',sans-serif; font-size:1.1rem; font-weight:850;
          color:#0f172a; margin:0; letter-spacing:-0.3px;
        }
        
        .wz-principle-content-wrapper {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.3s ease-in-out;
        }
        .wz-principle-content-wrapper.open {
          grid-template-rows: 1fr;
        }
        .wz-principle-content {
          overflow: hidden;
        }
        .wz-principle-desc {
          font-size:0.86rem; color:#475569; line-height:1.55; margin:0; font-weight:500;
          padding-left: 3.25rem;
        }
        .wz-principle-arrow.rotated {
          transform: rotate(180deg);
        }

        /* ── CHECKBOX ROW ── */
        .wz-check-row {
          display:flex; align-items:center; gap:0.85rem; cursor:pointer;
          padding:0.85rem 1.1rem; border-radius:12px; margin-top:0.25rem;
          border:1.5px dashed #dde3ea; transition:all 0.2s; user-select:none;
        }
        .wz-check-row:hover { border-color:#b0b8c4; background:rgba(255,255,255,0.6); }
        .wz-check-row.on { border-color:var(--bc); border-style:solid; background:#fff; box-shadow:0 0 0 1px var(--bc); }
        .wz-check-row.disabled {
          opacity: 0.55;
          cursor: not-allowed;
          background: rgba(241, 245, 249, 0.4);
          border-color: #cbd5e1;
        }
        .wz-check-row.disabled:hover {
          background: rgba(241, 245, 249, 0.4);
          border-color: #cbd5e1;
        }

        .wz-check-row span { font-size:0.88rem; font-weight:600; color:#334155; }
        .wz-check-row.on span { color:#0f172a; font-weight:700; }
        .wz-checkbox {
          width:18px; height:18px; border:2px solid #cbd5e1; border-radius:5px;
          flex-shrink:0; transition:all 0.2s; position:relative; background:#fff;
        }
        .wz-checkbox.on { background:var(--bc); border-color:var(--bc); }
        .wz-checkbox.on::after {
          content:''; position:absolute; top:2px; left:5px;
          width:5px; height:9px; border:solid #fff; border-width:0 2px 2px 0;
          transform:rotate(45deg);
        }
        .wz-checkbox.small { width:14px; height:14px; border-radius:4px; }
        .wz-checkbox.small.on::after { top:1px; left:4px; width:4px; height:7px; border-width:0 1.5px 1.5px 0; }

        /* ── AGENDA (PASO 3) ── */
        .wz-agenda { display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.5rem; }
        .wz-agenda-row {
          display:flex; align-items:flex-start; gap:1.25rem;
          padding:1.25rem 1.5rem; border:1px solid #e8ecf1; border-radius:16px;
          background:#fff; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden;
        }
        .wz-agenda-row:hover { border-color:#cbd5e1; background:rgba(248,250,252,0.6); }
        .wz-agenda-row.on { border-color:var(--tlc); background:rgba(255,255,255,1); box-shadow:0 0 0 1px var(--tlc); }
        .wz-agenda-row::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background:var(--tlc); opacity:0; transition:opacity 0.3s;
        }
        .wz-agenda-row.on::before { opacity:1; }
        
        .wz-agenda-check {
          width:22px; height:22px; border:2px solid #cbd5e1; border-radius:6px;
          flex-shrink:0; transition:all 0.2s; position:relative; background:#fff; margin-top:2px;
        }
        .wz-agenda-row:hover .wz-agenda-check { border-color:#94a3b8; }
        .wz-agenda-check.on { background:var(--tlc); border-color:var(--tlc); }
        .wz-agenda-check.on::after {
          content:''; position:absolute; top:3px; left:6px;
          width:6px; height:10px; border:solid #fff; border-width:0 2px 2px 0;
          transform:rotate(45deg);
        }

        .wz-agenda-time { flex-shrink:0; width:90px; }
        .wz-a-day { display:block; font-family:'Outfit',sans-serif; font-size:1.05rem; font-weight:850; color:#0f172a; margin-bottom:0.15rem; }
        .wz-a-hr { display:block; font-size:0.75rem; font-weight:800; letter-spacing:0.5px; }

        .wz-agenda-content { flex-grow:1; padding-left:1rem; border-left:1px solid #e8ecf1; }
        .wz-agenda-row.on .wz-agenda-content { border-left-color:rgba(14,165,233,0.2); }
        .wz-a-label { font-family:'Outfit',sans-serif; font-size:1rem; font-weight:800; color:#0f172a; margin:0 0 0.25rem; }
        .wz-a-desc { font-size:0.82rem; color:#64748b; line-height:1.5; margin:0; font-weight:500; }

        .wz-alerts-group { display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1rem; }
        .wz-alert { font-size:0.8rem; color:#475569; padding:0.85rem 1.15rem; border-radius:12px; line-height:1.5; }
        .wz-alert strong { font-weight:800; }
        .wz-alert.info { background:rgba(14,165,233,0.04); border:1px solid rgba(14,165,233,0.15); color:#0369a1; }
        .wz-alert.info strong { color:#075985; }
        .wz-alert.warn { background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.2); color:#92400e; }
        .wz-alert.warn strong { color:#78350f; }

        /* ── POLÍTICA DE ASISTENCIA ── */
        .wz-attendance-grid {
          display:grid;
          grid-template-columns:repeat(2, minmax(0, 1fr));
          gap:0.8rem;
          margin-bottom:1rem;
        }
        .wz-attendance-card {
          min-width:0;
          padding:1rem 1.05rem;
          border:1px solid rgba(14,165,233,0.14);
          border-radius:14px;
          background:linear-gradient(145deg, #ffffff 0%, rgba(240,249,255,0.62) 100%);
          box-shadow:0 12px 26px -24px rgba(2,132,199,0.65);
        }
        .wz-attendance-card-head {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:0.65rem;
          margin-bottom:0.55rem;
        }
        .wz-attendance-number {
          font-family:'Outfit',sans-serif;
          color:var(--bc);
          font-size:0.82rem;
          font-weight:900;
        }
        .wz-attendance-badge {
          padding:0.24rem 0.48rem;
          border-radius:6px;
          background:rgba(14,165,233,0.09);
          color:#075985;
          font-size:0.64rem;
          font-weight:800;
          line-height:1.2;
          text-align:right;
        }
        .wz-attendance-card h3 {
          margin:0 0 0.38rem;
          color:#0f172a;
          font-family:'Outfit',sans-serif;
          font-size:0.98rem;
          font-weight:820;
          line-height:1.25;
        }
        .wz-attendance-card p {
          margin:0;
          color:#526173;
          font-size:0.8rem;
          line-height:1.5;
          font-weight:520;
        }

        /* ── CUSTOM NOTIFICATION PREMIUM ── */
        .wz-notification {
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          background: rgba(14, 165, 233, 0.05);
          border: 1px solid rgba(14, 165, 233, 0.16);
          border-radius: 14px;
          padding: 1rem 1.15rem;
          margin-top: 1rem;
          margin-bottom: 1.25rem;
          animation: notifyPulse 3.3s infinite ease-in-out;
        }
        @keyframes notifyPulse {
          0%, 100% { border-color: rgba(14, 165, 233, 0.16); box-shadow: 0 0 0 rgba(14, 165, 233, 0); }
          50% { border-color: rgba(14, 165, 233, 0.32); box-shadow: 0 0 12px rgba(14, 165, 233, 0.06); }
        }
        .wz-notification-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(14, 165, 233, 0.12);
          color: #0284c7;
          flex-shrink: 0;
        }
        .wz-notification-icon svg {
          width: 16px;
          height: 16px;
          stroke-width: 2.5px;
        }
        .wz-notification-text {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
          text-align: left;
        }
        .wz-notification-title {
          font-size: 0.72rem;
          font-weight: 850;
          color: #0369a1;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        .wz-notification-desc {
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          line-height: 1.45;
        }

        /* ── PROTOCOLO SPLIT (PASO 4) ── */
        .wz-protocol-split { display:flex; gap:2.5rem; margin-bottom:1.5rem; align-items:stretch; }
        .wz-protocol-list-container { flex:1; display:flex; flex-direction:column; gap:0.5rem; }
        .wz-mobile-carousel-img { display:none; }
        
        .wz-protocol-item {
          padding:1.5rem; border:1px solid transparent; border-radius:16px;
          cursor:pointer; transition:all 0.3s ease; position:relative;
        }
        .wz-protocol-item::before {
          content:''; position:absolute; left:0; top:1.5rem; bottom:1.5rem; width:4px;
          background:transparent; border-radius:0 4px 4px 0; transition:background 0.3s;
        }
        .wz-protocol-item:hover { background:rgba(248,250,252,0.8); }
        .wz-protocol-item.active { background:#fff; border-color:#e2e8f0; box-shadow:0 12px 24px -12px rgba(0,0,0,0.06); }
        .wz-protocol-item.active::before { background:var(--bc); }
        
        .wz-pi-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.6rem; }
        .wz-pi-title { font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:800; color:#0f172a; margin:0; }
        .wz-pi-desc { font-size:0.9rem; color:#475569; line-height:1.55; margin:0; font-weight:500; }
        
        .wz-cl-tag { font-size:0.65rem; font-weight:800; text-transform:uppercase; letter-spacing:1px; padding:0.25rem 0.6rem; border-radius:6px; }
        .wz-cl-tag.req { background:rgba(15,23,42,0.04); color:#334155; }
        .wz-cl-tag.ban { background:rgba(220,38,38,0.06); color:#991b1b; }
        
        .wz-protocol-image-container {
          width:320px; flex-shrink:0; background:#f8fafc; border-radius:24px;
          border:1px solid #e2e8f0; overflow:hidden; position:relative;
          display:flex; align-items:center; justify-content:center;
        }
        .wz-pi-image {
          width: 100%;
          height: 100%;
          min-height: 280px;
          object-fit: contain;
          object-position: center;
          display: block;
          padding: 1rem;
        }
        .wz-pi-placeholder {
          width:100%; height:100%; min-height:280px; display:flex; align-items:center; justify-content:center;
          color:#64748b; font-size:0.9rem; font-weight:700; font-family:'Outfit',sans-serif; text-align:center; padding:2rem;
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        /* ── MÉTRICAS (PASO 5) ── */
        .wz-metrics-grid {
          display:grid; grid-template-columns:1fr 1fr 1.6fr; gap:1.5rem; margin-bottom:1.5rem;
        }
        .wz-metric-box {
          background:#fff; border:1px solid #e8ecf1; border-radius:24px;
          padding:2rem 1.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center;
          text-align:center; transition:all 0.3s ease; position:relative; overflow:hidden;
        }
        .wz-metric-box:hover { border-color:#cbd5e1; box-shadow:0 12px 32px -12px rgba(0,0,0,0.06); transform:translateY(-2px); }
        .wz-metric-value {
          font-family:'Outfit',sans-serif; font-size:3.8rem; font-weight:900; line-height:1;
          color:var(--bc); margin-bottom:0.5rem; letter-spacing:-2px;
        }
        .wz-metric-label { font-size:0.95rem; color:#475569; font-weight:700; line-height:1.4; }
        
        .wz-metric-box.danger { background:rgba(239,68,68,0.02); border-color:rgba(239,68,68,0.15); }
        .wz-metric-box.danger .wz-metric-value { color:#dc2626; font-size:3.2rem; }
        .wz-metric-box.danger .wz-metric-label { color:#991b1b; }
        .wz-metric-tag {
          position:relative; top:auto; background:rgba(239,68,68,0.1); color:#dc2626;
          font-size:0.7rem; font-weight:800; text-transform:uppercase; padding:0.35rem 0.75rem;
          border-radius:6px; letter-spacing:1px; margin-bottom:0.75rem;
        }
        
        .fade-in { animation:fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:none; } }


        /* ── DECLARACIÓN (PASO 7) ── */
        .wz-declaration {
          border:1px solid #e2e8f0; border-radius:14px; padding:1.25rem 1.5rem;
          margin-bottom:1rem; position:relative;
        }
        .wz-declaration::before {
          content:'"'; position:absolute; top:4px; left:12px;
          font-family:'Outfit',serif; font-size:3rem; color:rgba(14,165,233,0.1);
          line-height:1; pointer-events:none;
        }
        .wz-declaration p {
          font-size:0.88rem; color:#334155; line-height:1.65; margin:0;
          font-style:italic; padding-left:0.25rem;
        }
        .wz-summary {
          border:1px solid #e8ecf1; border-radius:12px; padding:0.75rem 1.15rem; margin-bottom:0.5rem;
        }
        .wz-success-panel {
          border:1px solid rgba(34,197,94,0.18);
          border-radius:14px;
          padding:0.8rem 1.15rem;
          margin-bottom:0.75rem;
          background:linear-gradient(180deg, rgba(34,197,94,0.055), rgba(255,255,255,0.92));
          box-shadow:0 12px 28px -22px rgba(15,23,42,0.28);
        }
        .wz-success-layout {
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:1.5rem;
        }
        .wz-success-media {
          width: 100%;
          max-width: 320px;
          display:flex;
          align-items:center;
          justify-content:center;
          overflow:hidden;
          margin: 0 auto;
        }
        .wz-success-video {
          width:100%;
          height:auto;
          object-fit:contain;
          transform:scale(1.08);
          filter:drop-shadow(0 22px 34px rgba(14,116,144,0.12));
        }
        .wz-success-copy {
          width: 100%;
        }
        .wz-success-actions {
          display:grid;
          grid-template-columns:1fr;
          gap:0.65rem;
          margin-top:1.15rem;
        }
        .wz-btn-whatsapp {
          width:100%;
          background:#16a34a;
        }
        .wz-btn-whatsapp:hover:not(:disabled) {
          background:#15803d;
        }
        .wz-success-note {
          margin:0.75rem 0 0;
          padding:0.75rem 0.9rem;
          border:1px solid rgba(245,158,11,0.22);
          border-radius:10px;
          background:rgba(245,158,11,0.06);
          color:#92400e;
          font-size:0.78rem;
          line-height:1.45;
          font-weight:650;
          text-align:left;
        }
        .wz-sum-row {
          display:flex; justify-content:space-between; align-items:center; gap:0.85rem;
          padding:0.55rem 0; border-bottom:1px solid #f1f5f9; font-size:0.85rem;
        }
        .wz-sum-row span { color:#94a3b8; font-weight:500; flex:0 0 auto; }
        .wz-sum-row strong { color:#0f172a; font-weight:700; min-width:0; text-align:right; }

        .wz-footer {
          text-align:center; font-size:0.65rem; font-weight:700; color:#b0b8c4;
          margin-top:1.25rem; letter-spacing:0.5px; text-transform:uppercase;
        }

        /* ── BUTTONS ── */
        .wz-nav { display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem; }
        .wz-btn-main {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:750; color:#fff;
          background:var(--bc); border:none; border-radius:10px; cursor:pointer;
          transition:all 0.2s; font-family:inherit;
          line-height:1.2;
        }
        .wz-btn-main:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); }
        .wz-btn-main:disabled { background:#e2e8f0 !important; color:#94a3b8 !important; cursor:not-allowed; }
        .wz-btn-ghost {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:700; color:#64748b;
          background:#f1f5f9; border:none; border-radius:10px; cursor:pointer;
          transition:all 0.2s; font-family:inherit;
          line-height:1.2;
        }
        .wz-btn-ghost:hover { background:#e2e8f0; color:#1e293b; }
        .wz-btn-wa {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:750; color:#fff;
          background:linear-gradient(135deg,#25d366,#128c7e); border:none; border-radius:10px;
          cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:0.5rem;
          font-family:inherit;
          line-height:1.2;
        }
        .wz-btn-wa:hover { filter:brightness(1.08); transform:translateY(-1px); }

        /* ── MODAL OVERLAY ── */
        .wz-modal-overlay {
          position:fixed; inset:0; background:rgba(15,23,42,0.85); backdrop-filter:blur(8px);
          z-index:3000; display:flex; align-items:center; justify-content:center; padding:1.5rem;
          animation:wzFade 0.3s ease;
        }
        .wz-modal-content {
          background:#fff; border-radius:24px; padding:3.5rem 3rem; max-width:520px; width:100%;
          text-align:left; box-shadow:0 24px 48px -12px rgba(0,0,0,0.4); border:1px solid #e2e8f0;
          transform:scale(0.95); animation:modalPop 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes modalPop { to { transform:none; } }
        
        .wz-modal-tag {
          display:inline-block; font-size:0.7rem; font-weight:800; color:#b45309; text-transform:uppercase;
          letter-spacing:1.5px; background:rgba(245,158,11,0.08); padding:0.4rem 1rem;
          border-radius:50px; margin-bottom:1.5rem;
        }
        .wz-modal-title { font-family:'Outfit',sans-serif; font-size:2.2rem; font-weight:900; color:#0f172a; margin:0 0 1.25rem; letter-spacing:-1px; line-height:1.1; }
        .wz-modal-desc { font-size:1.05rem; color:#475569; line-height:1.65; margin:0 0 2.5rem; font-weight:500; }
        .wz-modal-desc strong { font-weight:800; color:#0f172a; }
        
        .wz-btn-firm {
          padding:1.1rem 2rem; font-size:1rem; font-weight:800; color:#fff; width:100%;
          background:#0f172a; border:none; border-radius:14px; cursor:pointer;
          box-shadow:0 8px 24px -8px rgba(15,23,42,0.4); transition:all 0.3s cubic-bezier(0.16,1,0.3,1); font-family:inherit;
        }
        .wz-btn-firm:hover { transform:translateY(-2px); box-shadow:0 12px 32px -8px rgba(15,23,42,0.5); background:#1e293b; }

        /* ── ANIMATION ── */
        .wz-fade { animation:wzFade 0.4s ease both; }
        @keyframes wzFade {
          from { opacity:0; transform:translateY(12px); }
          to { opacity:1; transform:none; }
        }

        /* ── PAYMENT GRID (PASO 7) ── */
        .wz-payment-grid { display:grid; grid-template-columns:repeat(3, 1fr); gap:0.75rem; margin-bottom:1rem; }
        .wz-pay-card {
          display:flex; align-items:center; gap:0.75rem; padding:0.85rem 1rem;
          border:1px solid #e8ecf1; border-radius:12px; cursor:pointer;
          background:#fff; transition:all 0.2s; font-size:0.88rem; font-weight:600; color:#334155;
        }
        .wz-pay-card:hover { border-color:#cbd5e1; }
        .wz-pay-card.on { border-color:var(--bc); background:var(--bg); }

        /* ── UPLOAD ZONE (PASO 8) ── */
        .wz-upload-section { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; margin-bottom:1rem; }
        .wz-upload-zone {
          border:2px dashed #e2e8f0; border-radius:20px; padding:2.5rem 1.5rem;
          text-align:center; cursor:pointer; background:#fff; transition:all 0.3s;
          display:flex; flex-direction:column; align-items:center; gap:0.5rem;
        }
        .wz-upload-zone:hover { border-color:var(--bc); background:var(--bg); }
        .wz-upload-icon { font-size:2.5rem; line-height:1; margin-bottom:0.25rem; }
        .wz-upload-zone h4 { font-size:1rem; font-weight:800; color:#0f172a; margin:0; }
        .wz-upload-zone p { font-size:0.8rem; color:#94a3b8; margin:0; font-weight:500; }
        .wz-upload-filename {
          font-size:0.78rem; color:var(--bc); font-weight:700;
          background:var(--bg); padding:0.3rem 0.8rem; border-radius:8px; margin-top:0.5rem;
        }

        /* ── TEXTAREA (PASO 9) ── */
        .wz-textarea {
          width:100%; padding:0.85rem 1rem; border:1px solid #e2e8f0; border-radius:12px;
          background:#fff; font-family:inherit; font-size:0.88rem; color:#1e293b;
          resize:vertical; outline:none; transition:all 0.2s; font-weight:500; line-height:1.5;
          box-sizing:border-box;
        }
        .wz-textarea:focus { border-color:var(--bc); box-shadow:0 0 0 3px var(--bg); }
        .wz-textarea::placeholder { color:#94a3b8; font-weight:400; }

        /* ── GRID HELPER ── */
        .wz-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:0.5rem; }

        /* ── PROGRAMA TOP (PASO 8) ── */
        .wz-top-overview {
          border:1px solid rgba(14,165,233,0.2);
          border-radius:16px;
          background: linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0.01) 100%);
          padding:1.1rem 1.2rem;
          margin-bottom:1rem;
        }
        .wz-top-overview-title {
          font-family:'Outfit',sans-serif;
          font-size:1.02rem;
          font-weight:820;
          color:#0f172a;
          margin:0 0 0.45rem;
        }
        .wz-top-overview-text {
          margin:0;
          color:#475569;
          font-size:0.85rem;
          line-height:1.55;
          font-weight:550;
        }
        .wz-top-kpis {
          margin-top:0.85rem;
          display:grid;
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:0.55rem;
        }
        .wz-top-kpi {
          border:1px solid rgba(14,165,233,0.15);
          border-radius:10px;
          padding:0.65rem 0.7rem;
          background:#fff;
        }
        .wz-top-kpi-label {
          display:block;
          font-size:0.68rem;
          font-weight:760;
          letter-spacing:0.2px;
          color:#64748b;
          margin-bottom:0.2rem;
        }
        .wz-top-kpi strong {
          font-family:'Outfit',sans-serif;
          font-size:1.08rem;
          font-weight:840;
          color:#0f172a;
        }
        .wz-top-grid {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:0.85rem;
          margin-bottom:0.9rem;
        }
        .wz-top-card {
          border:1px solid #e2e8f0;
          border-radius:16px;
          background:#fff;
          padding:1rem 1.05rem;
        }
        .wz-top-card-title {
          margin:0 0 0.7rem;
          font-family:'Outfit',sans-serif;
          font-size:0.98rem;
          font-weight:810;
          color:#0f172a;
        }
        .wz-top-list {
          margin:0;
          padding:0;
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:0.55rem;
        }
        .wz-top-list li {
          margin:0;
          position:relative;
          padding-left:1.25rem;
          font-size:0.83rem;
          line-height:1.5;
          font-weight:540;
          color:#334155;
        }
        .wz-top-list li::before {
          content:'✓';
          position:absolute;
          left:0;
          top:0;
          color:var(--bc);
          font-weight:800;
          font-size:0.9rem;
        }
        .wz-top-list li strong {
          color:#0f172a;
          font-weight:760;
        }
        .wz-top-benefits {
          display:grid;
          grid-template-columns:repeat(3, minmax(0, 1fr));
          gap:0.65rem;
          margin-bottom:0.85rem;
        }
        .wz-top-benefit {
          min-width:0;
          display:flex;
          gap:0.7rem;
          padding:0.85rem;
          border:1px solid #e2e8f0;
          border-radius:12px;
          background:#fff;
        }
        .wz-top-benefit > span {
          flex:0 0 auto;
          color:var(--bc);
          font-family:'Outfit',sans-serif;
          font-size:0.75rem;
          font-weight:900;
        }
        .wz-top-benefit h3 {
          margin:0 0 0.24rem;
          color:#0f172a;
          font-family:'Outfit',sans-serif;
          font-size:0.9rem;
          font-weight:810;
          line-height:1.25;
        }
        .wz-top-benefit p {
          margin:0;
          color:#526173;
          font-size:0.76rem;
          line-height:1.45;
        }
        .wz-certificate {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:1rem;
          padding:1rem 1.1rem;
          margin-bottom:0.9rem;
          border:1px solid rgba(212,161,49,0.32);
          border-radius:14px;
          background:linear-gradient(135deg, #071728 0%, #0d2d4b 66%, #124f65 100%);
          box-shadow:0 16px 34px -26px rgba(7,23,40,0.9);
        }
        .wz-certificate-copy {
          min-width:0;
        }
        .wz-certificate-kicker {
          display:block;
          margin-bottom:0.24rem;
          color:#f4c968;
          font-size:0.64rem;
          font-weight:850;
          letter-spacing:0.7px;
          text-transform:uppercase;
        }
        .wz-certificate h3 {
          margin:0 0 0.28rem;
          color:#fff;
          font-family:'Outfit',sans-serif;
          font-size:1rem;
          font-weight:820;
        }
        .wz-certificate p {
          max-width:34rem;
          margin:0;
          color:#cbd5e1;
          font-size:0.76rem;
          line-height:1.45;
        }
        .wz-certificate-button {
          flex:0 0 auto;
          min-height:40px;
          padding:0.55rem 0.82rem;
          border:1px solid rgba(244,201,104,0.42);
          border-radius:8px;
          background:#f4c968;
          color:#13263b;
          font-family:inherit;
          font-size:0.78rem;
          font-weight:850;
          cursor:pointer;
        }
        .wz-certificate-overlay {
          position:fixed;
          inset:0;
          z-index:3600;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:clamp(0.75rem, 2vw, 1.5rem);
          background:rgba(5,15,27,0.88);
          backdrop-filter:blur(10px);
          overflow-y:auto;
        }
        .wz-certificate-modal {
          position:relative;
          width:min(1120px, 100%);
          max-height:calc(100dvh - 1.5rem);
          display:flex;
          flex-direction:column;
          padding:1rem;
          border:1px solid rgba(244,201,104,0.3);
          border-radius:14px;
          background:linear-gradient(145deg, #071728 0%, #0c2945 100%);
          box-shadow:0 30px 70px rgba(0,0,0,0.42);
          overflow:hidden;
        }
        .wz-certificate-close {
          position:absolute;
          top:0.75rem;
          right:0.75rem;
          z-index:2;
          width:38px;
          height:38px;
          border:1px solid rgba(255,255,255,0.16);
          border-radius:50%;
          background:rgba(5,15,27,0.76);
          color:#fff;
          font-size:1.45rem;
          line-height:1;
          cursor:pointer;
        }
        .wz-certificate-modal-head {
          flex:0 0 auto;
          padding:0.2rem 3.2rem 0.85rem 0.2rem;
        }
        .wz-certificate-modal-head span {
          color:#f4c968;
          font-size:0.68rem;
          font-weight:850;
          letter-spacing:0.8px;
          text-transform:uppercase;
        }
        .wz-certificate-modal-head h2 {
          margin:0.18rem 0 0;
          color:#fff;
          font-family:'Outfit',sans-serif;
          font-size:clamp(1.05rem, 2vw, 1.45rem);
        }
        .wz-certificate-image-wrap {
          min-height:0;
          overflow:auto;
          border-radius:8px;
          background:#fff;
          overscroll-behavior:contain;
          -webkit-overflow-scrolling:touch;
        }
        .wz-certificate-image {
          display:block;
          width:100%;
          height:auto;
          max-width:none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width:860px) {
          .wz-success-layout {
            gap:0.8rem;
          }
          .wz-success-media {
            min-height:170px;
            order:-1;
            margin: 0 auto;
          }
          .wz-success-video {
            width:min(100%, 300px);
            transform:scale(1.02);
          }
          .wz-success-copy .wz-title,
          .wz-success-copy .wz-sub {
            text-align:center !important;
          }
          .wz-main { padding:1.5rem 2rem; }
          .wz-protocol-split { display:block; margin-bottom:0; }
          .wz-protocol-image-container { display:none; }
          .wz-protocol-list-container { 
            flex-direction:row; overflow-x:auto; scroll-snap-type:x mandatory; 
            gap:1rem; padding-bottom:1rem; scrollbar-width:none; 
            margin: 0 -1rem; padding: 0 1rem 1.5rem 1rem;
          }
          .wz-protocol-list-container::-webkit-scrollbar { display:none; }
          .wz-protocol-slide { min-width:88%; scroll-snap-align:center; display:flex; flex-direction:column; }
          .wz-protocol-item { padding:1.25rem; margin-top:0; border: 1px solid #e8ecf1; }
          .wz-mobile-carousel-img { display:block; width:100%; height:210px; object-fit:contain; border-radius:16px; margin-bottom:1rem; background:rgba(241,245,249,0.4); padding: 0.5rem; }
          .wz-metrics-grid { grid-template-columns:1fr 1fr !important; }
          .wz-metric-box.danger { grid-column:span 2; }
          .wz-top-kpis { grid-template-columns:repeat(3, minmax(0, 1fr)); }
          .wz-top-grid { grid-template-columns:1fr; }
          .wz-top-benefits { grid-template-columns:1fr; }
        }
        @media (max-width:680px) {
          .wz {
            position: absolute;
            inset: 0;
            bottom: auto;
            min-height: 100dvh;
            display: flex;
            flex-direction: column;
            padding: 0;
            overflow: visible !important; /* Fixes the clipping issue */
          }
          .wz-header {
            position: sticky;
            top: 0;
            z-index: 100;
            padding:0 3.15rem 0 0.75rem;
            height: 64px;
            justify-content:center;
          }
          .wz-h-left {
            display:none;
          }
          .wz-h-right {
            position:absolute;
            right:0.7rem;
            top:50%;
            transform:translateY(-50%);
            width:36px;
            justify-content:center;
          }
          .wz-back {
            width:34px;
            height:34px;
            font-size:0.78rem !important;
          }
          .wz-h-center { gap:0.5rem; max-width:calc(100vw - 100px); overflow:hidden; }
          .wz-logo { max-width:30vw; }
          .wz-logo.lg-ciip { height:26px !important; max-width:60px; transform:translateY(0); }
          .wz-logo.lg-geo { height:18px !important; max-width:64px; transform:translateY(1px); }
          .wz-logo.lg-bio { height:24px !important; max-width:56px; transform:translateY(0); }
          .wz-sep { height:16px; background:linear-gradient(to bottom,transparent,rgba(56,189,248,0.32),transparent); }
          .wz-brand-card {
            min-height: 58px;
            padding: 0.7rem 1rem !important;
            gap: 0.75rem;
          }
          .wz-brand-card img {
            height: auto !important;
            max-height: 38px;
            max-width: 70%;
            object-fit: contain;
          }
          .wz-brand-card.ambos-card {
            min-height: 50px;
            padding: 0.75rem 1rem !important;
          }
          .ambos-text {
            font-size: 0.82rem;
            line-height: 1.35;
          }
          .wz-stepper-premium {
            position: sticky;
            top: 64px;
            z-index: 90;
            padding:0.65rem 1.25rem; gap:0.45rem;
          }
          .wz-stepper-step-name { font-size:0.78rem; }
          .wz-stepper-info {
            width:100%;
            justify-content:center;
            overflow:hidden;
          }
          .wz-stepper-step-name {
            max-width:58vw;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .wz-stepper-segments { gap:0.25rem; }
          .wz-stepper-segment { height:3px; }
          .wz-main {
            display: flex;
            flex-direction: column;
            flex: 1 0 auto;
            align-items: center; /* Center horizontally */
            justify-content: flex-start;
            padding:1rem 0.875rem max(1.25rem, env(safe-area-inset-bottom));
            overflow: visible !important; /* NO internal scroll, let it grow */
            border-radius:0;
            min-height: auto;
          }
          .wz-content {
            width: 88% !important;
            max-width: 350px !important; /* Much narrower on mobile */
            margin: auto !important; /* Vertically and horizontally center */
          }
          .wz-content:has(.wz-success-layout) {
            width: min(94%, 390px) !important;
            max-width: 390px !important;
          }
          
          .wz-title { font-size:1.5rem !important; margin-bottom:0.5rem; line-height:1.16 !important; }
          .wz-sub { font-size:0.85rem !important; margin-bottom:1.25rem !important; line-height:1.48 !important; }
          .wz-grid-2 { grid-template-columns:1fr !important; gap:1rem !important; }
          .wz-phone-field {
            grid-template-columns:1fr;
          }
          
          .wz-principles-list { gap:0.75rem; }
          .wz-principle { flex-direction:column; align-items:stretch; padding:1rem 1.15rem; }
          .wz-principle-num { font-size:1.6rem; }
          .wz-principle-text h4 { font-size:1rem; }
          .wz-principle-desc { padding-left:2.85rem; font-size:0.82rem; }
          
          .wz-agenda-row { flex-direction:row; flex-wrap:wrap; align-items:center; gap:0.85rem; padding:1.15rem; }
          .wz-agenda-time { flex:1; width:auto; display:flex; align-items:baseline; gap:0.5rem; }
          .wz-a-day { font-size:1.05rem; margin-bottom:0; }
          .wz-a-hr { font-size:0.85rem; }
          .wz-agenda-content { padding-left:0; border-left:none; padding-top:0.75rem; border-top:1px solid #e8ecf1; width:100%; margin-top:0.15rem; }
          .wz-agenda-row.on .wz-agenda-content { border-top-color:rgba(14,165,233,0.2); }
          
          .wz-metrics-grid { grid-template-columns:1fr 1fr !important; gap:0.85rem; }
          .wz-metric-box.danger { grid-column:span 2; }
          .wz-metric-box { padding:1.25rem 1rem; border-radius:16px; }
          .wz-metric-value { font-size:2.6rem; margin-bottom:0.25rem; }
          .wz-metric-box.danger .wz-metric-value { font-size:2.5rem; }
          .wz-metric-label { font-size:0.8rem; }

          .wz-top-overview { padding:1rem; }
          .wz-top-kpis { grid-template-columns:repeat(3, 1fr); gap:0.4rem; }
          .wz-top-kpi { padding:0.5rem 0.4rem; }
          .wz-top-kpi-label { font-size:0.58rem; letter-spacing:0; }
          .wz-top-kpi strong { font-size:0.9rem; }
          .wz-top-card { padding:1rem; }
          .wz-top-card-title { font-size:0.92rem; }
          .wz-attendance-grid { grid-template-columns:1fr; }
          .wz-attendance-card { padding:0.9rem; }
          .wz-certificate {
            align-items:stretch;
            flex-direction:column;
          }
          .wz-certificate-button {
            width:100%;
          }
          .wz-certificate-overlay {
            align-items:flex-start;
            padding:0.5rem;
          }
          .wz-certificate-modal {
            max-height:calc(100dvh - 1rem);
            padding:0.65rem;
            border-radius:10px;
          }
          .wz-certificate-modal-head {
            padding:0.25rem 2.8rem 0.65rem 0.1rem;
          }
          .wz-certificate-close {
            top:0.5rem;
            right:0.5rem;
            width:34px;
            height:34px;
          }

          .wz-nav { flex-direction:column-reverse; gap:0.5rem; margin-top:1.5rem; }
          .wz-btn-main, .wz-btn-ghost, .wz-btn-wa {
            width:100%;
            min-height:44px;
            text-align:center;
            justify-content:center;
            padding:0.75rem;
            white-space:normal;
          }
          .wz-sum-row {
            align-items:flex-start;
            gap:0.4rem;
          }
          .wz-sum-row strong {
            text-align:right;
            max-width:62%;
          }
          .wz-modal-content { width:92%; padding:2rem 1.5rem; border-radius:20px; }
          .wz-modal-title { font-size:1.6rem; margin-bottom:0.85rem; letter-spacing:-0.5px; }
          .wz-modal-desc { font-size:0.9rem; margin-bottom:1.5rem; }
          .wz-modal-tag { font-size:0.65rem; margin-bottom:1rem; padding:0.35rem 0.75rem; }
          .wz-btn-firm { padding:0.9rem 1.25rem; font-size:0.92rem; }

          .wz-payment-grid { grid-template-columns:1fr 1fr !important; gap:0.6rem; }
          .wz-pay-card { padding:0.75rem 0.65rem; font-size:0.78rem; gap:0.5rem; }
          .wz-upload-section { grid-template-columns:1fr !important; }
          .wz-upload-zone { padding:1.5rem 1rem; }
        }

        @media (max-width:380px) {
          .wz-header { padding:0 2.9rem 0 0.6rem; }
          .wz-h-right { right:0.55rem; width:32px; }
          .wz-back { width:31px; height:31px; }
          .wz-h-center { gap:0.42rem; max-width:calc(100vw - 88px); }
          .wz-logo.lg-ciip { height:31px !important; max-width:64px; }
          .wz-logo.lg-geo { height:20px !important; max-width:66px; }
          .wz-logo.lg-bio { height:26px !important; max-width:58px; }
          .wz-sep { height:17px; }
          .wz-brand-card img {
            max-height: 34px;
            max-width: 68%;
          }
          .wz-stepper-step-name {
            max-width:50vw;
          }
          .wz-sum-row {
            flex-direction:column;
            align-items:stretch;
          }
          .wz-sum-row strong {
            max-width:none;
            text-align:left;
          }
          .wz-attendance-card-head {
            align-items:flex-start;
            flex-direction:column;
            gap:0.35rem;
          }
          .wz-top-kpis {
            grid-template-columns:1fr;
          }
        }

        @media (max-width:340px) {
          .wz-sep { display:none; }
          .wz-h-center { gap:0.5rem; }
        }

        /* ── OPTIMIZACIONES DE ALTURA (EVITAR SCROLL EN LAPTOPS Y VIEWPORTS BAJOS) ── */
        @media (max-height: 800px) {
          .wz-header {
            height: 64px !important;
          }
          .wz-logo {
            height: 32px !important;
          }
          .wz-logo.lg-ciip {
            height: 44px !important;
          }
          .wz-logo.lg-geo {
            height: 26px !important;
          }
          .wz-stepper-premium {
            padding: 0.5rem 1.5rem !important;
            gap: 0.25rem !important;
          }
          .wz-stepper-step-name {
            font-size: 0.78rem !important;
          }
          .wz-main {
            padding: 0.75rem 1.5rem !important;
          }
          .wz-title {
            font-size: 1.4rem !important;
            margin-bottom: 0.2rem !important;
          }
          .wz-sub {
            font-size: 0.82rem !important;
            margin-bottom: 0.85rem !important;
          }
          .wz-field {
            margin-bottom: 0.65rem !important;
          }
          .wz-field .wz-label {
            font-size: 0.76rem !important;
            margin-bottom: 0.2rem !important;
          }
          .wz-input {
            padding: 0.55rem 0.8rem !important;
            font-size: 0.82rem !important;
          }
          .wz-textarea {
            padding: 0.55rem 0.8rem !important;
            font-size: 0.82rem !important;
            min-height: 48px !important;
            height: 48px !important;
          }
          .wz-principles-list {
            gap: 0.5rem !important;
          }
          .wz-principle {
            padding: 0.6rem 0.85rem !important;
          }
          .wz-principle-num {
            font-size: 1.4rem !important;
          }
          .wz-principle-text h4 {
            font-size: 0.88rem !important;
          }
          .wz-success-layout {
            gap: 0.85rem !important;
          }
          .wz-success-media {
            min-height: 180px !important;
          }
          .wz-success-video {
            width: min(100%, 260px) !important;
          }
          .wz-success-copy h1.wz-title {
            font-size: 1.5rem !important;
          }
          .wz-success-panel {
            padding: 0.55rem 0.85rem !important;
          }
          .wz-sum-row {
            padding: 0.35rem 0 !important;
            font-size: 0.8rem !important;
          }
          .wz-success-actions {
            margin-top: 0.85rem !important;
            gap: 0.5rem !important;
          }
          .wz-attendance-grid {
            gap:0.55rem !important;
            margin-bottom:0.7rem !important;
          }
          .wz-attendance-card {
            padding:0.72rem 0.8rem !important;
          }
          .wz-attendance-card-head {
            margin-bottom:0.35rem !important;
          }
          .wz-attendance-card h3 {
            font-size:0.88rem !important;
            margin-bottom:0.22rem !important;
          }
          .wz-attendance-card p {
            font-size:0.72rem !important;
            line-height:1.38 !important;
          }
          .wz-top-overview {
            padding:0.75rem 0.85rem !important;
            margin-bottom:0.65rem !important;
          }
          .wz-top-overview-text {
            font-size:0.76rem !important;
            line-height:1.4 !important;
          }
          .wz-top-kpis {
            margin-top:0.6rem !important;
          }
          .wz-top-benefits {
            gap:0.45rem !important;
            margin-bottom:0.6rem !important;
          }
          .wz-top-benefit {
            padding:0.62rem !important;
            gap:0.5rem !important;
          }
          .wz-top-benefit h3 {
            font-size:0.8rem !important;
          }
          .wz-top-benefit p {
            font-size:0.68rem !important;
            line-height:1.35 !important;
          }
          .wz-certificate {
            padding:0.72rem 0.85rem !important;
            margin-bottom:0.65rem !important;
          }
          .wz-certificate h3 {
            font-size:0.9rem !important;
          }
          .wz-certificate p {
            font-size:0.68rem !important;
          }
          .wz-btn-main, .wz-btn-ghost, .wz-btn-wa {
            padding: 0.6rem 1.4rem !important;
            font-size: 0.82rem !important;
          }
        }

        @media (max-height: 680px) {
          .wz-header {
            height: 52px !important;
          }
          .wz-logo {
            height: 26px !important;
          }
          .wz-logo.lg-ciip {
            height: 36px !important;
          }
          .wz-logo.lg-geo {
            height: 22px !important;
          }
          .wz-stepper-premium {
            padding: 0.35rem 1rem !important;
          }
          .wz-main {
            padding: 0.4rem 1rem !important;
          }
          .wz-title {
            font-size: 1.25rem !important;
            line-height: 1.14 !important;
          }
          .wz-sub {
            font-size: 0.78rem !important;
            margin-bottom: 0.5rem !important;
          }
          .wz-field {
            margin-bottom: 0.5rem !important;
          }
          .wz-textarea {
            min-height: 40px !important;
            height: 40px !important;
            padding: 0.45rem 0.75rem !important;
          }
          .wz-success-layout {
            grid-template-columns: 1fr !important;
            text-align: center !important;
          }
          .wz-success-media {
            display: none !important;
          }
          .wz-success-copy h1.wz-title {
            text-align: center !important;
          }
          .wz-success-copy p.wz-sub {
            text-align: center !important;
          }
          .wz-attendance-grid {
            grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
          }
          .wz-attendance-card {
            padding:0.55rem 0.65rem !important;
          }
          .wz-attendance-badge {
            font-size:0.58rem !important;
          }
          .wz-attendance-card p {
            font-size:0.66rem !important;
            line-height:1.3 !important;
          }
          .wz-top-benefits {
            grid-template-columns:repeat(3, minmax(0, 1fr)) !important;
          }
          .wz-top-benefit {
            padding:0.5rem !important;
          }
          .wz-top-benefit p {
            display:none !important;
          }
          .wz-certificate p {
            display:none !important;
          }
        }

      `}</style>

      <svg style={{ position:'absolute', width:0, height:0, pointerEvents:'none' }}>
        <defs>
          <filter id="remove-black">
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 1 1 1 0 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
