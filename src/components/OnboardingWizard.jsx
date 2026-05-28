import React, { useState } from 'react';
import logociip from '../assets/logociip.png';
import logogeomina from '../assets/logogeomina.png';
import logobiomedic from '../assets/logobiomedic.png';
import geominaWhite from '../assets/geomina-new.png';
import biomedicWhite from '../assets/biomedic-white.png';
import metodoPractico from '../assets/metodo_practico.png';
import ceroRelleno from '../assets/cero_relleno.png';

export default function OnboardingWizard({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    marca: '', // 'ciip' | 'geomina' | 'biomedic'
    aceptaMetodologia: false,
    aceptaSabado: false,
    aceptaDomingo: false,
    aceptaLunes: false,
    respuestaExamen: '',
    respuestaCamara: '',
    firma: ''
  });

  const [errorCuestionario, setErrorCuestionario] = useState({
    examen: false,
    camara: false
  });

  const totalSteps = 6;

  const marcaConfig = {
    ciip: {
      nombre: 'CIIP Latam',
      color: '#0284c7', // Color azul corporativo
      telefono: '51925084564',
      bgGlow: 'rgba(2, 132, 199, 0.15)'
    },
    geomina: {
      nombre: 'Geomina',
      color: '#0ea5e9', // Color celeste corporativo
      telefono: '51925084564',
      bgGlow: 'rgba(14, 165, 233, 0.15)'
    },
    biomedic: {
      nombre: 'Biomedic',
      color: '#06b6d4', // Color cian corporativo
      telefono: '51925084564',
      bgGlow: 'rgba(6, 182, 212, 0.12)'
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.nombre.trim() || !formData.correo.trim() || !formData.marca) {
        return;
      }
    }
    if (step === 2 && !formData.aceptaMetodologia) return;
    if (step === 3 && (!formData.aceptaSabado || !formData.aceptaDomingo || !formData.aceptaLunes)) return;

    if (step === 4) {
      const examenCorrecto = formData.respuestaExamen === 'lunes';
      const camaraCorrecta = formData.respuestaCamara === 'obligatoria';
      
      setErrorCuestionario({
        examen: !examenCorrecto,
        camara: !camaraCorrecta
      });

      if (!examenCorrecto || !camaraCorrecta) {
        return;
      }
    }

    if (step === 5 && !formData.firma.trim()) return;

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      if (step === 4) {
        setErrorCuestionario({ examen: false, camara: false });
      }
    }
  };

  const generateUniqueCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const marcaLabel = formData.marca ? formData.marca.toUpperCase() : 'DOC';
    return `MOD-${marcaLabel}-${code}`;
  };

  const downloadCSV = (uniqueCode) => {
    const brandName = formData.marca ? marcaConfig[formData.marca].nombre : 'N/A';
    
    const headers = [
      'Codigo Conformidad',
      'Docente',
      'Correo Electronico',
      'Institucion',
      'Acepto Metodologia',
      'Hito Sabado 1:00 PM',
      'Hito Domingo 1:00 PM',
      'Hito Lunes 9:00 AM (Examen)',
      'Firma Digital',
      'Fecha Registro'
    ];

    const values = [
      uniqueCode,
      formData.nombre,
      formData.correo,
      brandName,
      'Aceptado (100% Practico)',
      'Confirmado (Material S1)',
      'Confirmado (Material S2)',
      'Confirmado (Examen & Caso)',
      formData.firma,
      new Date().toLocaleString()
    ];

    const csvContent = "\uFEFF" + [
      headers.join(';'),
      values.map(val => `"${val.replace(/"/g, '""')}"`).join(';')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Conformidad_${formData.nombre.replace(/\s+/g, '_')}_${brandName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFinish = () => {
    const uniqueCode = generateUniqueCode();
    const config = marcaConfig[formData.marca];

    setGeneratedCode(uniqueCode);
    downloadCSV(uniqueCode);

    const textMsg = `*DECLARACIÓN DE CONFORMIDAD DOCENTE*

*Código Único:* ${uniqueCode}
*Docente:* ${formData.nombre}
*Correo:* ${formData.correo}
*Institución:* ${config.nombre}

*Compromisos Aceptados:*
✓ Metodología Doing by Learning (100% Práctico)
✓ Entregas Sábado (Material S1 - Límite 1:00 PM)
✓ Entregas Domingo (Material S2 - Límite 1:00 PM)
✓ Entregas Lunes (Examen & Caso - Corte 9:00 AM)
✓ Política de Cámara encendida y Fondo Virtual

*Firma Digital:* ${formData.firma}
*Fecha:* ${new Date().toLocaleDateString()}

_Confirmo la aceptación total del Manual Digital Docente de Excelencia._`;

    const whatsappUrl = `https://wa.me/${config.telefono}?text=${encodeURIComponent(textMsg)}`;
    window.open(whatsappUrl, '_blank');
    setIsFinished(true);
  };

  const handleResetAndClose = () => {
    setFormData({
      nombre: '',
      correo: '',
      marca: '',
      aceptaMetodologia: false,
      aceptaSabado: false,
      aceptaDomingo: false,
      aceptaLunes: false,
      respuestaExamen: '',
      respuestaCamara: '',
      firma: ''
    });
    setStep(1);
    setIsFinished(false);
    setGeneratedCode('');
    onClose();
  };

  const renderProgress = () => {
    const percentage = ((step - 1) / (totalSteps - 1)) * 100;
    const activeColor = formData.marca ? marcaConfig[formData.marca].color : '#0284c7';
    return (
      <div className="wizard-progress-bar-container">
        <div 
          className="wizard-progress-bar-fill" 
          style={{ 
            width: `${percentage}%`, 
            background: `linear-gradient(90deg, ${activeColor} 0%, #38bdf8 100%)`,
            boxShadow: `0 0 10px ${activeColor}`
          }} 
        />
      </div>
    );
  };

  // Dynamic branding variables
  const brandColorActive = formData.marca ? marcaConfig[formData.marca].color : '#0284c7';
  const brandGlowActive = formData.marca ? marcaConfig[formData.marca].bgGlow : 'rgba(14, 165, 233, 0.15)';

  return (
    <div className="wizard-backdrop" style={{ 
      '--brand-color-active': brandColorActive,
      '--brand-glow-active': brandGlowActive
    }}>
      {/* Ambient glowing orbs in background */}
      <div className="wizard-bg-glow glow-1" />
      <div className="wizard-bg-glow glow-2" />
      <div className="wizard-bg-mesh" />

      <div className="wizard-window">
        {/* HEADER ADAPTATIVO DEL HOME (Logos unificados oscuros y separadores brillantes) */}
        <header className="wizard-header">
          <div className="wizard-header-left">
            {!isFinished && (
              <button 
                onClick={step > 1 ? handleBack : onClose} 
                className="wizard-back-btn" 
                aria-label={step > 1 ? "Regresar al paso anterior" : "Cerrar e ir al Home"}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="wizard-header-center">
            {/* Cabecera de logos unificados del Home */}
            <div className="wizard-logos-row">
              {(() => {
                // Definición de los logos
                const logoCiip = (
                  <img 
                    key="ciip"
                    src={biomedicWhite} 
                    alt="CIIP" 
                    className="wizard-nav-logo logo-ciip" 
                    style={{ 
                      opacity: step === 1 
                        ? (!formData.marca ? 0.85 : formData.marca === 'ciip' ? 1 : 0.22)
                        : 1,
                      transition: 'all 0.4s ease'
                    }}
                  />
                );

                const logoGeomina = (
                  <img 
                    key="geomina"
                    src={geominaWhite} 
                    alt="Geomina" 
                    className="wizard-nav-logo" 
                    style={{ 
                      opacity: step === 1 
                        ? (!formData.marca ? 0.85 : formData.marca === 'geomina' ? 1 : 0.22)
                        : 1,
                      transition: 'all 0.4s ease'
                    }}
                  />
                );

                const logoBiomedic = (
                  <img 
                    key="biomedic"
                    src={logobiomedic} 
                    alt="Biomedic" 
                    className="wizard-nav-logo logo-biomedic" 
                    style={{ 
                      filter: 'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)',
                      opacity: step === 1 
                        ? (!formData.marca ? 0.95 : formData.marca === 'biomedic' ? 1 : 0.22)
                        : 1,
                      transition: 'all 0.4s ease'
                    }}
                  />
                );

                const divisor = (key) => <div key={key} className="wizard-logo-sep" />;

                // Si estamos en pasos posteriores (2 a 6)
                if (step > 1) {
                  if (formData.marca === 'ciip') return logoCiip;
                  if (formData.marca === 'geomina') return logoGeomina;
                  if (formData.marca === 'biomedic') return logoBiomedic;
                  return null;
                }

                // Si estamos en el Paso 1
                if (!formData.marca) {
                  // Orden original
                  return [logoCiip, divisor('sep1'), logoGeomina, divisor('sep2'), logoBiomedic];
                } else if (formData.marca === 'ciip') {
                  // CIIP al centro, Geomina y Biomedic rotan a los lados
                  return [logoGeomina, divisor('sep1'), logoCiip, divisor('sep2'), logoBiomedic];
                } else if (formData.marca === 'geomina') {
                  // Geomina al centro (ya lo está)
                  return [logoCiip, divisor('sep1'), logoGeomina, divisor('sep2'), logoBiomedic];
                } else if (formData.marca === 'biomedic') {
                  // Biomedic al centro, CIIP y Geomina rotan a los lados
                  return [logoCiip, divisor('sep1'), logoBiomedic, divisor('sep2'), logoGeomina];
                }
                return null;
              })()}
            </div>
          </div>
          
          <div className="wizard-header-right">
            {!isFinished ? (
              <span className="wizard-step-indicator">Paso {step} de {totalSteps}</span>
            ) : (
              <button onClick={handleResetAndClose} className="wizard-back-btn" aria-label="Cerrar manual" style={{ borderRadius: '12px', width: 'auto', padding: '0 1rem', fontSize: '0.85rem', fontWeight: '800' }}>
                Cerrar ✕
              </button>
            )}
          </div>
          {!isFinished && renderProgress()}
        </header>

        {/* WIZARD BODY (Tarjeta Glassmorphic Clara) */}
        <div className="wizard-body">
          <div className={`wizard-card-premium ${(step === 1 || step === 2) && !isFinished ? 'step-1-wide' : ''}`}>
            <div className="wizard-card-content">

              {/* PANTALLA DE ÉXITO FINAL */}
              {isFinished ? (
                <div className="step-pane animate-slide-up" style={{ textAlign: 'center' }}>
                  <div className="wizard-illustration-wrapper">
                    <div className="wizard-circle-glow" style={{ background: 'rgba(34, 197, 94, 0.15)' }} />
                    <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 2 }}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  
                  <h1 className="wizard-main-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>¡Ficha Registrada!</h1>
                  <p className="wizard-main-subtitle" style={{ marginBottom: '2rem', color: '#64748b' }}>
                    Tu inducción operativa ha finalizado correctamente. Se ha generado la declaración de conformidad.
                  </p>

                  <div className="onboarding-summary-card" style={{ marginBottom: '2.5rem' }}>
                    <div className="summary-row">
                      <span className="summary-label">Código Único</span>
                      <span className="summary-val" style={{ color: '#22c55e', fontSize: '1.1rem', letterSpacing: '0.5px' }}>{generatedCode}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Docente</span>
                      <span className="summary-val">{formData.nombre}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Ecosistema</span>
                      <span className="summary-val" style={{ color: brandColorActive }}>
                        {marcaConfig[formData.marca]?.nombre}
                      </span>
                    </div>
                    <div className="summary-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                      <span className="summary-label">Firma Digital</span>
                      <span className="signature-font-mini">{formData.firma}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                      onClick={handleResetAndClose}
                      className="wizard-btn-primary"
                      style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)', width: '100%' }}
                    >
                      Volver al Inicio
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* PASO 1: DATOS E INSTITUCIÓN */}
                  {step === 1 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Información Docente</h2>
                      <p className="step-subtitle">Ingresa tus datos personales y selecciona la institución correspondiente.</p>

                      <div className="wizard-step1-grid">
                        {/* Lado Izquierdo: Selección de Marca */}
                        <div className="wizard-step1-left">
                          <label className="wizard-label" style={{ marginBottom: '0.85rem', display: 'block' }}>Institución Correspondiente</label>
                          <div className="brand-selector-vertical">
                            {[
                              { key: 'ciip', logo: biomedicWhite, label: 'CIIP Latam', height: '46px' },
                              { key: 'geomina', logo: geominaWhite, label: 'Geomina', height: '28px' },
                              { key: 'biomedic', logo: logobiomedic, label: 'Biomedic', height: '32px' }
                            ].map(brand => {
                              const active = formData.marca === brand.key;
                              const config = marcaConfig[brand.key];
                              return (
                                <div
                                  key={brand.key}
                                  onClick={() => setFormData({ ...formData, marca: brand.key })}
                                  className={`brand-select-card-row ${active ? 'active' : ''}`}
                                  style={{ '--brand-color-active': config.color }}
                                >
                                  <div className="brand-card-indicator">
                                    <div className="brand-card-dot">
                                      {active && (
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                  <div className="brand-card-logo-container">
                                    <img 
                                      src={brand.logo} 
                                      alt={brand.label} 
                                      className={`brand-card-logo ${brand.key === 'biomedic' ? 'logo-biomedic' : ''}`}
                                      style={{ 
                                        height: brand.height,
                                        filter: brand.key === 'biomedic' 
                                          ? 'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)' 
                                          : 'none',
                                        opacity: active ? 1 : 0.85,
                                        transition: 'all 0.3s ease'
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Lado Derecho: Formulario */}
                        <div className="wizard-step1-right">
                          <div className="wizard-form-group">
                            <label className="wizard-label">Nombre y Apellido completo</label>
                            <div className="input-with-icon-wrapper">
                              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              <input
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                className="wizard-input-premium"
                                autoComplete="off"
                              />
                            </div>
                          </div>

                          <div className="wizard-form-group" style={{ marginBottom: '1rem' }}>
                            <label className="wizard-label">Correo Electrónico</label>
                            <div className="input-with-icon-wrapper">
                              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                              </svg>
                              <input
                                type="email"
                                placeholder="juan.perez@ejemplo.com"
                                value={formData.correo}
                                onChange={e => setFormData({ ...formData, correo: e.target.value })}
                                className="wizard-input-premium"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="wizard-navigation-buttons" style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem' }}>
                        <button onClick={onClose} className="wizard-btn-secondary">
                          Cancelar
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.nombre.trim() || !formData.correo.trim() || !formData.marca}
                          className="wizard-btn-primary"
                        >
                          Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 2: METODOLOGÍA */}
                  {step === 2 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Nuestra Metodología</h2>
                      <p className="step-subtitle">Buscamos el aprendizaje práctico e interactivo para nuestros alumnos.</p>

                      <div className="wizard-pillars-list">
                        <div className="wizard-pillar-item">
                          <div className="pillar-image-container">
                            <img src={metodoPractico} alt="100% Práctico" className="pillar-img" />
                          </div>
                          <div className="pillar-text-content">
                            <h4 className="pillar-title">100% Práctico</h4>
                            <p className="pillar-desc">Prohibido el relleno teórico. Los estudiantes aprenden resolviendo casos reales directamente en software.</p>
                          </div>
                        </div>
                        <div className="wizard-pillar-item">
                          <div className="pillar-image-container">
                            <img src={ceroRelleno} alt="Cero Relleno" className="pillar-img" />
                          </div>
                          <div className="pillar-text-content">
                            <h4 className="pillar-title">Cero Relleno</h4>
                            <p className="pillar-desc">Nada de videos extensos grabados o diapositivas con exceso de texto. Acción pura sobre el software.</p>
                          </div>
                        </div>
                      </div>

                      <div className={`checkbox-agreement-wrapper ${formData.aceptaMetodologia ? 'checked' : ''}`} onClick={() => setFormData({ ...formData, aceptaMetodologia: !formData.aceptaMetodologia })}>
                        <div className={`custom-checkbox ${formData.aceptaMetodologia ? 'checked' : ''}`}>
                          {formData.aceptaMetodologia && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <span className="checkbox-label">He leído y comprendo la metodología Doing by Learning.</span>
                      </div>

                      <div className="wizard-navigation-buttons" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={handleBack} className="wizard-btn-secondary">
                          Atrás
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.aceptaMetodologia}
                          className="wizard-btn-primary"
                        >
                          Confirmar y Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 3: HORARIOS Y ENTREGAS */}
                  {step === 3 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Fechas de Corte</h2>
                      <p className="step-subtitle">Los plazos de entrega del material son innegociables. Confirma cada hito.</p>

                      <div className="wizard-switches-group">
                        {[
                          {
                            key: 'aceptaSabado',
                            title: 'Material Sesión 1 (Límite: Sábado 1:00 PM)',
                            desc: 'Subida de diapositivas y guías del primer bloque a la carpeta compartida.'
                          },
                          {
                            key: 'aceptaDomingo',
                            title: 'Material Sesión 2 (Límite: Domingo 1:00 PM)',
                            desc: 'Carga de guías, casos y recursos correspondientes al segundo bloque.'
                          },
                          {
                            key: 'aceptaLunes',
                            title: 'Evaluación Final (Corte: Lunes 9:00 AM)',
                            desc: 'Subida del examen de 10 preguntas, caso práctico en PDF y solucionario.'
                          }
                        ].map(sw => (
                          <div key={sw.key} className="switch-row-card" onClick={() => setFormData({ ...formData, [sw.key]: !formData[sw.key] })}>
                            <div className="switch-text-col">
                              <h4 className="switch-card-title">{sw.title}</h4>
                              <p className="switch-card-desc">{sw.desc}</p>
                            </div>
                            <div className={`custom-switch ${formData[sw.key] ? 'on' : ''}`}>
                              <div className="switch-knob" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="wizard-navigation-buttons" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={handleBack} className="wizard-btn-secondary">
                          Atrás
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.aceptaSabado || !formData.aceptaDomingo || !formData.aceptaLunes}
                          className="wizard-btn-primary"
                        >
                          Aceptar Plazos
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 4: CUESTIONARIO */}
                  {step === 4 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Control de Calidad</h2>
                      <p className="step-subtitle">Responde para certificar que todo el proceso operativo ha quedado claro.</p>

                      <div className="cuestionario-form-group">
                        <label className="wizard-label">1. ¿Cuál es el plazo límite para entregar el Examen Final?</label>
                        <div className="options-stacked-list">
                          {[
                            { key: 'lunes', val: 'Lunes 9:00 AM (Con Solucionario y Caso)' },
                            { key: 'sabado', val: 'Sábado 1:00 PM en aula' },
                            { key: 'tarde', val: 'Al finalizar todo el dictado del módulo' }
                          ].map(opt => (
                            <div
                              key={opt.key}
                              onClick={() => setFormData({ ...formData, respuestaExamen: opt.key })}
                              className={`option-choice-card ${formData.respuestaExamen === opt.key ? 'selected' : ''}`}
                            >
                              <div className="option-choice-circle" />
                              <span className="option-choice-text">{opt.val}</span>
                            </div>
                          ))}
                        </div>
                        {errorCuestionario.examen && (
                          <span className="wizard-validation-error">Respuesta incorrecta. Recuerda que los exámenes se evalúan el Lunes a las 9:00 AM.</span>
                        )}
                      </div>

                      <div className="cuestionario-form-group" style={{ marginTop: '1.75rem' }}>
                        <label className="wizard-label">2. ¿Cuál es la política de Imagen Personal en Cámara?</label>
                        <div className="options-stacked-list">
                          {[
                            { key: 'obligatoria', val: 'Cámara encendida y uso obligatorio del Fondo Virtual de la marca' },
                            { key: 'opcional', val: 'Opcional si el docente tiene mala iluminación' },
                            { key: 'apagar', val: 'Apagada si comparte pantalla para mejor conexión' }
                          ].map(opt => (
                            <div
                              key={opt.key}
                              onClick={() => setFormData({ ...formData, respuestaCamara: opt.key })}
                              className={`option-choice-card ${formData.respuestaCamara === opt.key ? 'selected' : ''}`}
                            >
                              <div className="option-choice-circle" />
                              <span className="option-choice-text">{opt.val}</span>
                            </div>
                          ))}
                        </div>
                        {errorCuestionario.camara && (
                          <span className="wizard-validation-error">Respuesta incorrecta. La cámara web debe estar encendida con fondo virtual oficial.</span>
                        )}
                      </div>

                      <div className="wizard-navigation-buttons" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={handleBack} className="wizard-btn-secondary">
                          Atrás
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.respuestaExamen || !formData.respuestaCamara}
                          className="wizard-btn-primary"
                        >
                          Validar Respuestas
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 5: FIRMA DIGITAL */}
                  {step === 5 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Firma de Conformidad</h2>
                      <p className="step-subtitle">Digita tu nombre completo para firmar electrónicamente la conformidad del manual.</p>

                      <div className="wizard-form-group" style={{ marginBottom: '2rem' }}>
                        <label className="wizard-label">Nombre del Firmante</label>
                        <input
                          type="text"
                          placeholder="Escribe tu nombre para firmar"
                          value={formData.firma}
                          onChange={e => setFormData({ ...formData, firma: e.target.value })}
                          className="wizard-input-premium"
                          style={{ paddingLeft: '1.25rem' }}
                          autoComplete="off"
                        />
                      </div>

                      {formData.firma.trim() && (
                        <div className="digital-signature-preview-box">
                          <span className="signature-badge">Firma Digital Generada</span>
                          <p className="signature-font">{formData.firma}</p>
                          <span className="signature-hash">Verificación Electrónica Docente</span>
                        </div>
                      )}

                      <div className="wizard-navigation-buttons" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={handleBack} className="wizard-btn-secondary">
                          Atrás
                        </button>
                        <button
                          onClick={handleNext}
                          disabled={!formData.firma.trim()}
                          className="wizard-btn-primary"
                        >
                          Firmar y Continuar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* PASO 6: RESUMEN Y ENVÍO */}
                  {step === 6 && (
                    <div className="step-pane animate-slide-up">
                      <h2 className="step-title">Todo Listo</h2>
                      <p className="step-subtitle">Tu ficha de inducción ha sido procesada de manera correcta. Completa el alta.</p>

                      <div className="onboarding-summary-card">
                        <div className="summary-row">
                          <span className="summary-label">Docente</span>
                          <span className="summary-val">{formData.nombre}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Correo</span>
                          <span className="summary-val">{formData.correo}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Ecosistema</span>
                          <span className="summary-val" style={{ color: brandColorActive, fontWeight: 700 }}>
                            {marcaConfig[formData.marca]?.nombre}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Compromisos</span>
                          <span className="summary-val" style={{ color: '#22c55e', fontWeight: 700 }}>Aceptados y Verificados</span>
                        </div>
                        <div className="summary-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                          <span className="summary-label">Firma Digital</span>
                          <span className="signature-font-mini">{formData.firma}</span>
                        </div>
                      </div>

                      <div className="wizard-navigation-buttons" style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                        <button onClick={handleBack} className="wizard-btn-secondary" style={{ flexShrink: 0, padding: '1.2rem 2rem' }}>
                          Atrás
                        </button>
                        <button
                          onClick={handleFinish}
                          className="wizard-btn-primary"
                          style={{ flexGrow: 1, padding: '1.2rem' }}
                        >
                          Confirmar, Descargar Excel & WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* STYLE INJECTED */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Mrs+Saint+Delafield&display=swap');

        .wizard-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #f0f9ff;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #1e293b;
          overflow: hidden;
        }

        /* Ambient glowing orbs */
        .wizard-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 0;
        }

        .wizard-backdrop .glow-1 {
          top: -15%;
          left: 5%;
          width: 550px;
          height: 550px;
          background: radial-gradient(circle, var(--brand-glow-active) 0%, rgba(255,255,255,0) 70%);
          animation: wizardGlowPulse 10s ease-in-out infinite;
        }

        .wizard-backdrop .glow-2 {
          bottom: -15%;
          right: 5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--brand-glow-active) 0%, rgba(255,255,255,0) 70%);
          animation: wizardGlowPulse 12s ease-in-out infinite reverse;
        }

        .wizard-bg-mesh {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.04) 1px, transparent 0);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes wizardGlowPulse {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(15px, -10px) scale(1.08); opacity: 0.75; }
        }

        .wizard-window {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        /* HEADER ADAPTADO DEL HOME (Logos unificados sobre fondo oscuro) */
        .wizard-header {
          height: 80px;
          border-bottom: 1px solid rgba(56, 189, 248, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          position: relative;
          background: linear-gradient(135deg, #060e1a 0%, #0a1e35 100%);
          flex-shrink: 0;
        }

        .wizard-logos-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .wizard-logo-sep {
          width: 1px;
          height: 28px;
          background: linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.25), transparent);
        }

        .wizard-nav-logo {
          height: 48px;
          width: auto;
          object-fit: contain;
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-nav-logo.logo-biomedic {
          height: 47px;
        }

        .wizard-progress-bar-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.03);
        }

        .wizard-progress-bar-fill {
          height: 100%;
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-back-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          cursor: pointer;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .wizard-back-btn:hover {
          background: rgba(56, 189, 248, 0.12);
          border-color: rgba(56, 189, 248, 0.3);
          color: #38bdf8;
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
        }

        .wizard-step-indicator {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--brand-color-active);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.45rem 1.1rem;
          border-radius: 50px;
          letter-spacing: 0.5px;
        }

        /* BODY DEL WIZARD (Glassmorphism Claro) */
        .wizard-body {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
        }

        .wizard-card-premium {
          width: 100%;
          max-width: 640px;
          background: rgba(255, 255, 255, 0.76);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(224, 242, 254, 0.8);
          border-radius: 32px;
          box-shadow: 
            0 24px 48px -12px rgba(2, 132, 199, 0.08), 
            0 4px 16px -2px rgba(2, 132, 199, 0.03);
          overflow: hidden;
          transition: max-width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-card-premium.step-1-wide {
          max-width: 880px;
        }

        .wizard-card-content {
          padding: 3rem 2.5rem;
        }

        /* TIPOGRAFÍAS DE PASO */
        .step-title {
          font-family: 'Outfit', sans-serif;
          font-size: 2.1rem;
          font-weight: 850;
          letter-spacing: -1.2px;
          color: #0f172a;
          margin-bottom: 0.5rem;
          text-align: left;
        }

        .step-subtitle {
          font-size: 1.05rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          text-align: left;
          font-weight: 500;
        }

        /* ILUSTRACIÓN PASO ÉXITO */
        .wizard-illustration-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .wizard-circle-glow {
          position: absolute;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: rgba(14, 165, 233, 0.08);
          filter: blur(12px);
        }

        .wizard-main-title {
          font-family: 'Outfit', sans-serif;
          font-size: 3.1rem;
          font-weight: 900;
          letter-spacing: -2px;
          color: #0f172a;
          text-align: center;
          margin-bottom: 1rem;
        }

        .wizard-main-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          line-height: 1.7;
          text-align: center;
          max-width: 480px;
          margin: 0 auto;
          font-weight: 500;
        }

        /* FORMULARIOS TEMA CLARO */
        .wizard-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .wizard-label {
          font-size: 0.76rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: color 0.3s ease;
        }

        .wizard-form-group:focus-within .wizard-label {
          color: var(--brand-color-active);
        }

        /* INPUTS CON ICONOS PREMIUM */
        .input-with-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .input-icon {
          position: absolute;
          left: 1.15rem;
          color: #94a3b8;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-input-premium {
          width: 100%;
          padding: 0.9rem 1.15rem 0.9rem 3.1rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          font-size: 0.95rem;
          font-family: inherit;
          color: #0f172a;
          outline: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(248, 250, 252, 0.8);
        }

        .wizard-input-premium::placeholder {
          color: #94a3b8;
        }

        .input-with-icon-wrapper:focus-within .input-icon {
          color: var(--brand-color-active);
          transform: scale(1.05) translateY(-1px);
        }

        .wizard-input-premium:focus {
          background: #ffffff;
          border-color: var(--brand-color-active);
          box-shadow: 
            0 0 0 4px var(--brand-glow-active),
            0 10px 20px -6px rgba(14, 165, 233, 0.08);
        }

        /* GRID DE DOS COLUMNAS PASO 1 */
        .wizard-step1-grid {
          display: grid;
          grid-template-columns: 290px 1fr;
          gap: 2.5rem;
          text-align: left;
          margin-bottom: 0.5rem;
          align-items: stretch;
        }

        .wizard-step1-left {
          display: flex;
          flex-direction: column;
        }

        .wizard-step1-right {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          justify-content: center;
        }

        /* SELECTOR DE MARCA VERTICAL CON FILAS OSCURAS */
        .brand-selector-vertical {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
          width: 100%;
          max-width: 290px;
        }

        .brand-select-card-row {
          border: 1px solid rgba(56, 189, 248, 0.08);
          border-radius: 16px;
          padding: 0.75rem 1.15rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          background: linear-gradient(135deg, #060e1a 0%, #0c1e35 100%);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(6, 14, 26, 0.08);
        }

        .brand-select-card-row::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }

        .brand-select-card-row:hover {
          border-color: rgba(56, 189, 248, 0.25);
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 20px rgba(6, 14, 26, 0.2);
        }

        .brand-select-card-row:hover::before {
          transform: translateX(100%);
        }

        .brand-select-card-row.active {
          border-color: var(--brand-color-active) !important;
          background: linear-gradient(135deg, #060e1a 0%, #102542 100%);
          box-shadow: 
            0 0 0 1px var(--brand-color-active),
            0 8px 24px -6px var(--brand-color-active);
        }

        .brand-card-indicator {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          background: rgba(255, 255, 255, 0.03);
          flex-shrink: 0;
        }

        .brand-select-card-row:hover .brand-card-indicator {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .brand-select-card-row.active .brand-card-indicator {
          border-color: var(--brand-color-active);
          background: var(--brand-color-active);
          box-shadow: 0 0 10px var(--brand-color-active);
          transform: scale(1.05);
        }

        .brand-card-dot {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
        }

        .brand-select-card-row.active .brand-card-dot {
          background: transparent;
        }

        .brand-card-logo-container {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
        }

        .brand-card-logo {
          max-height: 100%;
          width: auto;
          object-fit: contain;
        }

        .brand-card-logo.logo-biomedic {
          height: 24px;
        }

        .brand-card-desc {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: color 0.25s ease;
        }

        .brand-select-card.active .brand-card-desc {
          color: #0f172a;
          font-weight: 850;
        }

        /* PILARES DEL PASO 2 */
        .wizard-pillars-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .wizard-pillar-item {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.72) 0%, rgba(248, 250, 252, 0.55) 100%);
          border: 1px solid rgba(224, 242, 254, 0.85);
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 15px rgba(2, 132, 199, 0.02);
        }

        .wizard-pillar-item:hover {
          transform: translateY(-5px);
          border-color: var(--brand-color-active);
          background: #ffffff;
          box-shadow: 
            0 16px 36px -12px var(--brand-glow-active),
            0 4px 12px rgba(2, 132, 199, 0.02);
        }

        .pillar-text-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .pillar-image-container {
          width: 100%;
          height: 170px;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          border-bottom: 1.5px solid rgba(224, 242, 254, 0.8);
          background: #0f172a;
          position: relative;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-pillar-item:hover .pillar-image-container {
          border-color: var(--brand-color-active);
        }

        .pillar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-pillar-item:hover .pillar-img {
          transform: scale(1.06);
        }

        .pillar-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 850;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .pillar-desc {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.55;
          margin: 0;
          font-weight: 500;
        }

        /* CHECKBOXES Y SWITCHES */
        .checkbox-agreement-wrapper {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          cursor: pointer;
          padding: 1.1rem 1.5rem;
          text-align: left;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.4);
          border: 1.5px dashed #e2e8f0;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 0.5rem;
        }

        .checkbox-agreement-wrapper:hover {
          border-color: #cbd5e1;
          background: rgba(255, 255, 255, 0.7);
        }

        .checkbox-agreement-wrapper.checked {
          border-color: var(--brand-color-active);
          border-style: solid;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 
            0 10px 24px -10px var(--brand-glow-active),
            0 0 0 1px var(--brand-color-active);
        }

        .custom-checkbox {
          width: 22px;
          height: 22px;
          border: 2px solid #cbd5e1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
          background: #ffffff;
        }

        .checkbox-agreement-wrapper:hover .custom-checkbox {
          border-color: #94a3b8;
        }

        .custom-checkbox.checked {
          background: var(--brand-color-active);
          border-color: var(--brand-color-active);
          box-shadow: 0 0 8px var(--brand-glow-active);
        }

        .checkbox-label {
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
          user-select: none;
          transition: color 0.25s ease;
        }

        .checkbox-agreement-wrapper.checked .checkbox-label {
          color: #0f172a;
          font-weight: 700;
        }

        .wizard-switches-group {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          margin-bottom: 2rem;
          text-align: left;
        }

        .switch-row-card {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(224, 242, 254, 0.5);
          padding: 1.25rem 1.75rem;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .switch-row-card:hover {
          border-color: rgba(14, 165, 233, 0.25);
          background: #ffffff;
        }

        .switch-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .switch-card-desc {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .custom-switch {
          width: 44px;
          height: 24px;
          background: #cbd5e1;
          border-radius: 50px;
          position: relative;
          transition: background 0.3s ease;
          flex-shrink: 0;
        }

        .custom-switch.on {
          background: var(--brand-color-active);
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
        }

        .switch-knob {
          width: 18px;
          height: 18px;
          background: #ffffff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 3px;
          transition: left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .custom-switch.on .switch-knob {
          left: 23px;
        }

        /* CUESTIONARIO */
        .cuestionario-form-group {
          text-align: left;
        }

        .options-stacked-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 0.85rem;
        }

        .option-choice-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.1rem 1.35rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.45);
        }

        .option-choice-card:hover {
          border-color: #cbd5e1;
          background: #ffffff;
        }

        .option-choice-card.selected {
          border-color: var(--brand-color-active) !important;
          background: #ffffff;
          box-shadow: 0 4px 15px -6px var(--brand-color-active);
        }

        .option-choice-circle {
          width: 18px;
          height: 18px;
          border: 1.5px solid #cbd5e1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .option-choice-card.selected .option-choice-circle {
          border-color: var(--brand-color-active);
          border-width: 5px;
        }

        .option-choice-text {
          font-size: 0.95rem;
          font-weight: 600;
          color: #334155;
        }

        .wizard-validation-error {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #dc2626;
          margin-top: 0.65rem;
        }

        /* FIRMA DIGITAL */
        .digital-signature-preview-box {
          border: 1px solid rgba(14, 165, 233, 0.15);
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.03) 0%, rgba(6, 182, 212, 0.02) 100%);
          border-radius: 20px;
          padding: 2.25rem 2rem;
          text-align: center;
          position: relative;
        }

        .signature-font {
          font-family: 'Mrs Saint Delafield', 'Brush Script MT', cursive;
          font-size: 4rem;
          color: #0369a1;
          margin: 0.5rem 0;
          line-height: 1;
        }

        .signature-font-mini {
          font-family: 'Mrs Saint Delafield', 'Brush Script MT', cursive;
          font-size: 2.2rem;
          color: #0369a1;
          line-height: 1;
        }

        .signature-badge {
          font-size: 0.68rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 0.3rem 0.85rem;
          border-radius: 50px;
          display: inline-block;
        }

        .signature-hash {
          font-size: 0.72rem;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* RESUMEN FINAL */
        .onboarding-summary-card {
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid rgba(224, 242, 254, 0.5);
          border-radius: 24px;
          padding: 2rem 2.25rem;
          text-align: left;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(224, 242, 254, 0.5);
          font-size: 0.95rem;
        }

        .summary-label {
          color: #64748b;
          font-weight: 600;
        }

        .summary-val {
          color: #0f172a;
          font-weight: 750;
        }

        /* BOTONES DE ACCIÓN */
        .wizard-navigation-buttons {
          margin-top: 2.5rem;
          display: flex;
          justify-content: flex-end;
        }

        .wizard-btn-primary {
          padding: 0.95rem 2.2rem;
          font-size: 0.95rem;
          font-weight: 750;
          color: #ffffff;
          background: var(--brand-color-active);
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .wizard-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 8px 20px var(--brand-glow-active);
        }

        .wizard-btn-primary:disabled {
          background: #e2e8f0 !important;
          color: #94a3b8 !important;
          cursor: not-allowed;
          box-shadow: none !important;
        }

        .wizard-btn-secondary {
          padding: 0.95rem 2.2rem;
          font-size: 0.95rem;
          font-weight: 750;
          color: #64748b;
          background: #f1f5f9;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .wizard-btn-secondary:hover {
          background: #e2e8f0;
          color: #1e293b;
          transform: translateY(-1px);
        }

        /* ANIMACIONES */
        .animate-slide-up {
          animation: slideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 680px) {
          .wizard-header {
            padding: 0 1rem !important;
          }
          .wizard-logos-row {
            gap: 0.75rem !important;
          }
          .wizard-nav-logo {
            height: 32px !important;
          }
          .wizard-nav-logo.logo-biomedic {
            height: 22px !important;
          }
          .wizard-body {
            padding: 1.5rem 1rem !important;
          }
          .wizard-card-content {
            padding: 2.25rem 1.5rem !important;
          }
          .step-title {
            font-size: 1.8rem !important;
          }
          .wizard-card-premium.step-1-wide {
            max-width: 100% !important;
          }
          .wizard-step1-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .wizard-step1-left {
            gap: 1rem !important;
          }
          .brand-selector-vertical {
            max-width: 100% !important;
          }
          .brand-select-card-row {
            padding: 0.75rem 1rem !important;
            gap: 1rem !important;
          }
          .brand-card-logo-container {
            height: 38px !important;
          }
          .wizard-pillars-list {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .wizard-pillar-item {
            flex-direction: column !important;
          }
          .pillar-image-container {
            height: 150px !important;
          }
          .pillar-text-content {
            padding: 1.25rem !important;
          }
        }
      `}</style>
      {/* SVG filter to remove black backgrounds from inverted logos */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="remove-black">
            <feColorMatrix type="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              1 1 1 0 0
            "/>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
