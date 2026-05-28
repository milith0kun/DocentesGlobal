import React, { useState } from 'react';
import logociip from '../assets/logociip.png';
import logogeomina from '../assets/logogeomina.png';
import logobiomedic from '../assets/logobiomedic.png';
import geominaWhite from '../assets/geomina-new.png';
import biomedicWhite from '../assets/biomedic-white.png';
import metodoPractico from '../assets/metodo_practico.png';
import ceroRelleno from '../assets/cero_relleno.png';
import controlRitmo from '../assets/control_ritmo.png';

export default function OnboardingWizard({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [showPenaltyAlert, setShowPenaltyAlert] = useState(false);
  const [activeProtocol, setActiveProtocol] = useState(0);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loadingDni, setLoadingDni] = useState(false);

  const consultarDNI = async (dniVal) => {
    if (!/^\d{8}$/.test(dniVal)) return;
    setLoadingDni(true);
    try {
      const response = await fetch('https://apiperu.dev/api/dni', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 2d89ff1a7c2e0936030c05b608ee7e55565db844441231b9532714562a41d026'
        },
        body: JSON.stringify({ dni: dniVal })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        let nombre = resData.data.nombre_completo;
        if (nombre && nombre.includes(',')) {
          const parts = nombre.split(',');
          nombre = `${parts[1].trim()} ${parts[0].trim()}`;
        }
        if (nombre) {
          nombre = nombre
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
        setFormData(prev => ({ ...prev, nombre: nombre || '' }));
      }
    } catch (error) {
      console.error('Error al consultar DNI:', error);
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
    softwares: '', cursoSonado: '', mejoraAdmin: '', comentarios: '',
  });

  const totalSteps = 11;

  const stepLabels = {
    1: 'Selección de Institución',
    2: 'Datos Personales',
    3: 'Metodología Doing by Learning',
    4: 'Fechas de Corte Innegociables',
    5: 'Protocolo de Imagen & Comunicación',
    6: 'Política de Asistencia',
    7: 'Programa Docente TOP',
    8: 'Contacto y Datos de Pago',
    9: 'Subir Documentación',
    10: 'Perfil Profesional & Comentarios',
    11: 'Declaración de Conformidad',
  };

  const marcaConfig = {
    ciip: { nombre: 'CIIP Latam', color: '#0284c7', telefono: '51956006498', coordinador: 'Nicol', bgGlow: 'rgba(2,132,199,0.12)' },
    geomina: { nombre: 'Geomina', color: '#0ea5e9', telefono: '51925084564', coordinador: 'Fiorella', bgGlow: 'rgba(14,165,233,0.12)' },
    biomedic: { nombre: 'Biomedic', color: '#06b6d4', telefono: '51956006498', coordinador: 'Nicol', bgGlow: 'rgba(6,182,212,0.1)' },
    ambos: { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Nicol y Fiorella', bgGlow: 'rgba(56,189,248,0.12)' },
  };

  const handleNext = () => {
    if (step === 1 && !formData.marca) return;
    if (step === 2 && (!formData.nombre.trim() || !formData.correo.trim() || !formData.documento.trim() || formData.fechaNacimiento.length !== 10)) return;
    if (step === 3 && !formData.aceptaMetodologia) return;
    if (step === 4 && (!formData.aceptaSabado || !formData.aceptaDomingo || !formData.aceptaLunes)) return;
    if (step === 4) { setShowPenaltyAlert(true); return; }
    if (step === 5 && !formData.aceptaProtocolo) return;
    if (step === 6 && !formData.aceptaAsistencia) return;
    if (step === 7 && !formData.aceptaTop) return;
    if (step === 8 && (!formData.telefono.trim() || !formData.metodoPago || !formData.numeroCuenta.trim() || !formData.direccion.trim())) return;
    if (step === 8 && formData.metodoPago === 'otro' && !formData.metodoPagoOtro.trim()) return;
    if (step === 9 && (!formData.cvFile || !formData.fotoFile)) return;
    if (step === 10 && (!formData.softwares.trim() || !formData.cursoSonado.trim() || !formData.mejoraAdmin.trim())) return;
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleBack = () => { if (step > 1) setStep(s => s - 1); };

  const generateUniqueCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MOD-${(formData.marca || 'DOC').toUpperCase()}-${code}`;
  };

  const downloadCSV = (uniqueCode) => {
    const brandName = formData.marca ? marcaConfig[formData.marca].nombre : 'N/A';
    const metodo = formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago;
    const headers = ['Codigo','Docente','Correo','Documento','Nacimiento','Institucion','Telefono','MetodoPago','NumeroCuenta','Direccion','Softwares','CursoDeseado','MejoraAdmin','Comentarios','Fecha'];
    const values = [uniqueCode,formData.nombre,formData.correo,formData.documento,formData.fechaNacimiento,brandName,formData.telefono,metodo,formData.numeroCuenta,formData.direccion,formData.softwares,formData.cursoSonado,formData.mejoraAdmin,formData.comentarios,new Date().toLocaleString()];
    const csv = "\uFEFF" + [headers.join(';'), values.map(v=>`"${v}"`).join(';')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Conformidad_${formData.nombre.replace(/\s+/g,'_')}_${brandName}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const handleFinish = () => {
    const code = generateUniqueCode();
    const cfg = marcaConfig[formData.marca];
    setGeneratedCode(code);
    downloadCSV(code);
    const metodo = formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase();
    const msg = `*📋 FORMULARIO DOCENTE – CONFORMIDAD*\n\n*Código:* ${code}\n*Docente:* ${formData.nombre}\n*Documento:* ${formData.documento}\n*Correo:* ${formData.correo}\n*Institución:* ${cfg.nombre}\n*Teléfono:* ${formData.telefono}\n\n💳 *Datos de Pago:*\n• Método: ${metodo}\n• Cuenta: ${formData.numeroCuenta}\n• Dirección: ${formData.direccion}\n\n💻 *Softwares:* ${formData.softwares}\n🚀 *Curso deseado:* ${formData.cursoSonado}\n🤝 *Mejora sugerida:* ${formData.mejoraAdmin}\n${formData.comentarios ? `💬 *Comentarios:* ${formData.comentarios}` : ''}\n\n✅ *Compromisos Aceptados:*\n• Metodología Doing by Learning\n• Fechas de corte innegociables\n• Protocolo de imagen\n• Política de asistencia\n• Programa Docente TOP\n\n*Fecha:* ${new Date().toLocaleDateString()}`;
    window.open(`https://wa.me/${cfg.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
    setIsFinished(true);
  };

  const handleReset = () => {
    setFormData({ nombre:'',correo:'',marca:'',documento:'',fechaNacimiento:'',aceptaMetodologia:false,aceptaSabado:false,aceptaDomingo:false,aceptaLunes:false,aceptaProtocolo:false,aceptaAsistencia:false,aceptaTop:false,telefono:'',metodoPago:'',metodoPagoOtro:'',numeroCuenta:'',direccion:'',cvFile:null,fotoFile:null,softwares:'',cursoSonado:'',mejoraAdmin:'',comentarios:'' });
    setStep(1); setIsFinished(false); setGeneratedCode(''); onClose();
  };

  const brandColor = formData.marca ? marcaConfig[formData.marca].color : '#0284c7';
  const brandGlow = formData.marca ? marcaConfig[formData.marca].bgGlow : 'rgba(14,165,233,0.12)';

  const stepWidths = { 1: '380px', 2: '460px', 3: '600px', 4: '620px', 5: '760px', 6: '720px', 7: '740px', 8: '680px', 9: '600px', 10: '640px', 11: '580px' };

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
              const isSelected = formData.marca === key || (formData.marca === 'ambos' && (key === 'ciip' || key === 'geomina'));
              const opacity = step === 1 ? (!formData.marca ? 0.85 : isSelected ? 1 : 0.2) : 1;
              return (
                <img key={key} src={src} alt={key} className={`wz-logo ${cls||''}`}
                  style={{ opacity, ...extraStyle, transition:'all 0.4s ease' }} />
              );
            };
            const ciip = mkLogo('ciip', biomedicWhite, 'lg-ciip');
            const geo = mkLogo('geomina', geominaWhite, 'lg-geo');
            const bio = mkLogo('biomedic', logobiomedic, 'lg-bio', { filter:'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)' });
            const sep = (k) => <div key={k} className="wz-sep" />;
            if (step > 1) {
              if (formData.marca === 'ambos') return [ciip, sep('s1'), geo];
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
            <span className="wz-stepper-step-badge">Paso {step} de {totalSteps}</span>
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
              <div style={{ textAlign:'center' }}>
                <div className="wz-success-icon">✓</div>
                <h1 className="wz-title" style={{ textAlign:'center', fontSize:'1.8rem', marginBottom:'0.35rem' }}>¡Conformidad Registrada!</h1>
                <p className="wz-sub" style={{ textAlign:'center', marginBottom:'1.5rem' }}>Tu declaración ha sido enviada por WhatsApp y descargada como CSV.</p>
                <div className="wz-summary">
                  <div className="wz-sum-row"><span>Código</span><strong style={{ color:'#22c55e' }}>{generatedCode}</strong></div>
                  <div className="wz-sum-row"><span>Docente</span><strong>{formData.nombre}</strong></div>
                  <div className="wz-sum-row"><span>Ecosistema</span><strong style={{ color: brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong></div>
                  <div className="wz-sum-row" style={{ borderBottom:'none' }}><span>Estado</span><strong style={{ color:'#22c55e' }}>Compromisos aceptados</strong></div>
                </div>
                <button onClick={handleReset} className="wz-btn-main" style={{ width:'100%', marginTop:'1.25rem' }}>Volver al Inicio</button>
              </div>
            </div>
          )}

          {!isFinished && (
            <>
              {/* ═══ PASO 1: SELECCIÓN DE INSTITUCIÓN ═══ */}
              {step === 1 && (
                <div className="wz-fade">
                  <h2 className="wz-title" style={{ textAlign:'center' }}>Selecciona tu Institución</h2>
                  <p className="wz-sub" style={{ textAlign:'center', marginBottom:'1.5rem' }}>Elige la institución a la que perteneces.</p>
                  
                  <div className="wz-brand-list" style={{ maxWidth:'100%', margin:'0 auto' }}>
                    {[
                      { key:'ciip', logo:biomedicWhite, h:'56px' },
                      { key:'geomina', logo:geominaWhite, h:'35px' },
                      { key:'biomedic', logo:logobiomedic, h:'50px' },
                    ].map(b => {
                      const directSelected = formData.marca === b.key;
                      const partOfAmbos = formData.marca === 'ambos' && (b.key === 'ciip' || b.key === 'geomina');
                      const on = directSelected || partOfAmbos;
                      return (
                        <div key={b.key} onClick={() => setFormData({...formData, marca:b.key})}
                          className={`wz-brand-card ${on ? 'on' : ''} ${partOfAmbos ? 'part-of-ambos' : ''}`}
                          style={{ '--bc': marcaConfig[b.key].color }}>
                          <div className={`wz-radio ${on?'on':''}`} />
                          <img src={b.logo} alt={b.key} style={{
                            height:b.h, objectFit:'contain',
                            filter: b.key==='biomedic' ? 'invert(1) hue-rotate(180deg) brightness(1.15) contrast(1.1) url(#remove-black)' : 'none'
                          }} />
                        </div>
                      );
                    })}
                    <div onClick={() => setFormData({...formData, marca:'ambos'})}
                      className={`wz-brand-card ambos-card ${formData.marca === 'ambos' ? 'on' : ''}`}
                      style={{ '--bc': '#38bdf8' }}>
                      <div className={`wz-radio ${formData.marca==='ambos'?'on':''}`} />
                      <span className="ambos-text">Ambas instituciones (CIIP & Geomina)</span>
                    </div>
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
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Correo Electrónico</span>
                      <input type="email"
                        placeholder={formData.documento.trim() ? "juan.perez@ejemplo.com" : "Escribe tu Documento primero..."}
                        value={formData.correo}
                        disabled={!formData.documento.trim()}
                        onChange={e => setFormData({...formData, correo:e.target.value})}
                        className="wz-input"
                        autoComplete="off" />
                    </div>
                    <div className="wz-field">
                      <span className="wz-label">Fecha de Nacimiento</span>
                      <input type="text"
                        placeholder={formData.documento.trim() ? "DD/MM/AAAA" : "Escribe tu Documento primero..."}
                        value={formData.fechaNacimiento}
                        disabled={!formData.documento.trim()}
                        onChange={handleFechaNacimientoChange}
                        className="wz-input"
                        maxLength={10} />
                    </div>
                  </div>
                  
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.nombre.trim()||!formData.correo.trim()||!formData.documento.trim()||formData.fechaNacimiento.length !== 10} className="wz-btn-main">Continuar</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 3: FILOSOFÍA ═══ */}
              {step === 3 && (
                <div className="wz-fade">
                  <span className="wz-tag">Doing by Learning</span>
                  <h2 className="wz-title">Nuestra Filosofía</h2>
                  <p className="wz-sub" style={{ marginBottom: '2rem' }}>Transformamos carreras mediante habilidades prácticas. Este manual no es solo una guía, es el estándar de calidad que nos posiciona en Latinoamérica.</p>
                  
                  <div className="wz-principles-list">
                    {[
                      { n:'01', t:'100% Práctico', d:'Prohibido el relleno teórico. Cada concepto debe ser demostrado resolviendo casos reales directamente en software.' },
                      { n:'02', t:'Cero Relleno', d:'Nada de videos largos ni PPTs con exceso de texto. Exigimos acción pura y directa sobre las herramientas.' },
                      { n:'03', t:'Control de Ritmo', d:'El docente domina el tiempo. Los problemas técnicos individuales no pueden detener el aprendizaje de todo el grupo.' },
                    ].map((p,i) => (
                      <div key={i} className="wz-principle">
                        <div className="wz-principle-num">{p.n}</div>
                        <div className="wz-principle-text">
                          <h4>{p.t}</h4>
                          <p>{p.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`wz-check-row ${formData.aceptaMetodologia?'on':''}`} style={{ marginTop: '1.5rem' }} onClick={() => setFormData({...formData, aceptaMetodologia:!formData.aceptaMetodologia})}>
                    <div className={`wz-checkbox ${formData.aceptaMetodologia?'on':''}`} />
                    <span>He leído y comprendo firmemente la metodología Doing by Learning.</span>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaMetodologia} className="wz-btn-main">Confirmar</button>
                  </div>
                </div>
              )}

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

                  <div className="wz-alerts-group">
                    <div className="wz-alert info">
                      <strong>Drive institucional</strong>: Recibirás una notificación automática por correo cuando las carpetas de subida estén habilitadas.
                    </div>
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaSabado||!formData.aceptaDomingo||!formData.aceptaLunes} className="wz-btn-main">Aceptar Plazos</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 5: PROTOCOLO ═══ */}
              {step === 5 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Protocolo de Imagen & Comunicación</h2>
                  <p className="wz-sub">Eres el rostro de nuestra marca para toda Latinoamérica. El profesionalismo digital no es opcional.</p>
                  
                  <div className="wz-protocol-split">
                    {/* LADO IZQUIERDO: REGLAS */}
                    <div className="wz-protocol-list-container">
                      {[
                        { title: 'Cámara y Fondo Virtual', desc: 'Cámara encendida toda la sesión con uso exclusivo del fondo institucional proporcionado.', req: true, imgStr: 'ejemplo-camara.jpg' },
                        { title: 'Identidad Visual en PPTs', desc: 'Los logos de CIIP, Geomina o Biomedic deben estar presentes de forma obligatoria en cada material entregado.', req: true, imgStr: 'ejemplo-ppt.jpg' },
                        { title: 'Canales Externos Prohibidos', desc: 'Queda estrictamente prohibido crear grupos paralelos de WhatsApp o Telegram con los alumnos.', req: false, imgStr: 'ejemplo-prohibido.jpg' },
                      ].map((item, i) => (
                        <div 
                          key={i} 
                          className={`wz-protocol-item ${activeProtocol === i ? 'active' : ''}`}
                          onMouseEnter={() => setActiveProtocol(i)}
                        >
                          <div className="wz-pi-header">
                            <h4 className="wz-pi-title">{item.title}</h4>
                            <span className={`wz-cl-tag ${item.req ? 'req' : 'ban'}`}>{item.req ? 'Obligatorio' : 'Prohibido'}</span>
                          </div>
                          <p className="wz-pi-desc">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* LADO DERECHO: IMAGEN DINÁMICA SEPARADA */}
                    <div className="wz-protocol-image-container">
                       {activeProtocol === 0 && <div className="wz-pi-placeholder fade-in"><span>[Imagen: ejemplo-camara.jpg]</span></div>}
                       {activeProtocol === 1 && <div className="wz-pi-placeholder fade-in"><span>[Imagen: ejemplo-ppt.jpg]</span></div>}
                       {activeProtocol === 2 && <div className="wz-pi-placeholder fade-in"><span>[Imagen: ejemplo-prohibido.jpg]</span></div>}
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

              {/* ═══ PASO 6: ASISTENCIA ═══ */}
              {step === 6 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Política de Asistencia</h2>
                  <p className="wz-sub">Tu compromiso con el horario garantiza la excelencia del programa.</p>

                  <div className="wz-metrics-grid">
                    <div className="wz-metric-box">
                      <div className="wz-metric-value">0</div>
                      <div className="wz-metric-label">Reprogramaciones<br/>Personales</div>
                    </div>
                    
                    <div className="wz-metric-box">
                      <div className="wz-metric-value">4</div>
                      <div className="wz-metric-label">Días de Aviso<br/>por Emergencia</div>
                    </div>
                    
                    <div className="wz-metric-box danger">
                      <div className="wz-metric-tag">Penalidad Grave</div>
                      <div className="wz-metric-value">50%</div>
                      <div className="wz-metric-label">de retención por más de 2<br/>inasistencias en 4 clases.</div>
                    </div>
                  </div>

                  <div className={`wz-check-row ${formData.aceptaAsistencia?'on':''}`} onClick={() => setFormData({...formData, aceptaAsistencia:!formData.aceptaAsistencia})}>
                    <div className={`wz-checkbox ${formData.aceptaAsistencia?'on':''}`} />
                    <span>Acepto la política de asistencia y comprendo las penalidades.</span>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.aceptaAsistencia} className="wz-btn-main">Aceptar Política</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 7: PROGRAMA TOP ═══ */}
              {step === 7 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Programa Docente TOP</h2>
                  <p className="wz-sub">Buscamos talentos, no solo expositores. Si demuestras excelencia, te abrimos las puertas a la categoría Élite.</p>
                  
                  <div className="wz-alert info" style={{ marginBottom: '2rem' }}>
                    <strong>Sobre el Programa:</strong> [Espacio para explicar claramente los detalles de esta información. Puedes detallar aquí cómo se mide el NPS, o cualquier otro criterio importante que el docente deba entender a la perfección].
                  </div>

                  <div className="wz-elite-grid">
                    {/* Tarjeta Oscura: Beneficios */}
                    <div className="wz-elite-card benefits">
                      <h3 className="wz-ec-title gold">Beneficios Exclusivos</h3>
                      <ul className="wz-elite-list">
                        <li>
                          <div className="wz-elite-check">✓</div>
                          <span>Incremento escalonado de tarifa por hora.</span>
                        </li>
                        <li>
                          <div className="wz-elite-check">✓</div>
                          <span>Asignación prioritaria de múltiples módulos.</span>
                        </li>
                        <li>
                          <div className="wz-elite-check">✓</div>
                          <span>Presencia de marca en podcasts y networking regional.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Tarjeta Clara: Requisitos */}
                    <div className="wz-elite-card requirements">
                      <h3 className="wz-ec-title">Objetivos de Calidad</h3>
                      <div>
                        <div className="wz-elite-metric">
                          <span className="wz-em-label">Calificación Mínima (NPS)</span>
                          <div className="wz-em-value">4.5<small>/5.0</small></div>
                        </div>
                        <div className="wz-elite-metric" style={{ marginBottom: 0 }}>
                          <span className="wz-em-label">Asistencia Perfecta</span>
                          <span className="wz-em-tag">Requerido</span>
                        </div>
                      </div>
                    </div>
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

              {/* ═══ PASO 8: CONTACTO Y PAGO ═══ */}
              {step === 8 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Contacto y Datos de Pago</h2>
                  <p className="wz-sub">Datos necesarios para la gestión de honorarios y comunicación directa.</p>
                  
                  <div className="wz-field" style={{ marginBottom:'1.25rem' }}>
                    <span className="wz-label">Número de WhatsApp (con código de país)</span>
                    <input type="tel" placeholder="+51 999 999 999" value={formData.telefono}
                      onChange={e => setFormData({...formData, telefono:e.target.value})} className="wz-input" />
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

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginTop:'1.25rem' }}>
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
                    <button onClick={handleNext} disabled={!formData.telefono.trim()||!formData.metodoPago||!formData.numeroCuenta.trim()||!formData.direccion.trim()||(formData.metodoPago==='otro'&&!formData.metodoPagoOtro.trim())} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 9: DOCUMENTACIÓN ═══ */}
              {step === 9 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Documentación</h2>
                  <p className="wz-sub">Adjunta tu CV actualizado y una fotografía profesional.</p>
                  
                  <div className="wz-upload-section">
                    <div className="wz-upload-zone" onClick={() => document.getElementById('cv-upload').click()}>
                      <input id="cv-upload" type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }}
                        onChange={e => setFormData({...formData, cvFile: e.target.files[0]})} />
                      <div className="wz-upload-icon">📄</div>
                      <h4>Curriculum Vitae</h4>
                      <p>PDF o DOC • Máximo 10 MB</p>
                      {formData.cvFile && <span className="wz-upload-filename">{formData.cvFile.name}</span>}
                    </div>
                    <div className="wz-upload-zone" onClick={() => document.getElementById('foto-upload').click()}>
                      <input id="foto-upload" type="file" accept="image/*" style={{ display:'none' }}
                        onChange={e => setFormData({...formData, fotoFile: e.target.files[0]})} />
                      <div className="wz-upload-icon">📸</div>
                      <h4>Fotografía Profesional</h4>
                      <p>JPG o PNG • Máximo 10 MB</p>
                      {formData.fotoFile && <span className="wz-upload-filename">{formData.fotoFile.name}</span>}
                    </div>
                  </div>

                  <div className="wz-alert info" style={{ marginTop:'1.5rem' }}>
                    <strong>Nota:</strong> Los archivos serán referenciados en tu declaración. Envíalos directamente a coordinación académica por WhatsApp o correo.
                  </div>

                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleNext} disabled={!formData.cvFile||!formData.fotoFile} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 10: PERFIL PROFESIONAL ═══ */}
              {step === 10 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Perfil Profesional</h2>
                  <p className="wz-sub">Queremos conocerte mejor. Tu opinión nos ayuda a crecer juntos.</p>
                  
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
                    <button onClick={handleNext} disabled={!formData.softwares.trim()||!formData.cursoSonado.trim()||!formData.mejoraAdmin.trim()} className="wz-btn-main">Siguiente</button>
                  </div>
                </div>
              )}

              {/* ═══ PASO 11: DECLARACIÓN ═══ */}
              {step === 11 && (
                <div className="wz-fade">
                  <h2 className="wz-title">Declaración de Conformidad</h2>
                  <p className="wz-sub">Revisa tus datos y envía tu conformidad por WhatsApp a {marcaConfig[formData.marca]?.coordinador}.</p>
                  <div className="wz-declaration">
                    <p>"Confirmo que acepto el Manual Operativo del Docente. Comprendo la metodología práctica y los horarios de entrega innegociables. Acepto el sistema de penalidades y autorizo el uso de mi firma digital para certificados."</p>
                  </div>
                  <div className="wz-summary">
                    <div className="wz-sum-row"><span>Docente</span><strong>{formData.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Documento</span><strong>{formData.documento}</strong></div>
                    <div className="wz-sum-row"><span>Correo</span><strong>{formData.correo}</strong></div>
                    <div className="wz-sum-row"><span>Institución</span><strong style={{ color:brandColor }}>{marcaConfig[formData.marca]?.nombre}</strong></div>
                    <div className="wz-sum-row"><span>Teléfono</span><strong>{formData.telefono}</strong></div>
                    <div className="wz-sum-row"><span>Método de Pago</span><strong>{formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase()}</strong></div>
                    <div className="wz-sum-row" style={{ borderBottom:'none' }}><span>Compromisos</span><strong style={{ color:'#22c55e' }}>Todos Aceptados</strong></div>
                  </div>
                  <div className="wz-nav">
                    <button onClick={handleBack} className="wz-btn-ghost">Atrás</button>
                    <button onClick={handleFinish} className="wz-btn-wa">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Enviar a {marcaConfig[formData.marca]?.coordinador}
                    </button>
                  </div>
                  <p className="wz-footer">CIIP LATAM • GEOMINA • BIOMEDIC | © 2026</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ═══ MODAL CONDICIÓN FULLSCREEN ═══ */}
      {showPenaltyAlert && (
        <div className="wz-modal-overlay">
          <div className="wz-modal-content condition-modal">
            <span className="wz-modal-tag">Término Innegociable</span>
            <h3 className="wz-modal-title">Penalidad por Incumplimiento</h3>
            <p className="wz-modal-desc">
              Si la Dirección Académica se ve en la necesidad de <strong>solicitarte el material</strong> por falta de entrega a tiempo en los plazos que acabas de aceptar, se contabilizará automáticamente como una <strong>penalidad de desempeño</strong> en tu perfil. No existen recordatorios previos.
            </p>
            <button onClick={() => { setShowPenaltyAlert(false); setStep(5); }} className="wz-btn-firm">
              Comprendo y Acepto la Condición
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
          flex:1; display:flex; align-items:center; justify-content:center;
          padding:1.5rem 3rem; overflow:hidden;
        }
        .wz-content {
          width:100%; transition:max-width 0.35s ease;
        }

        /* ── TYPOGRAPHY ── */
        .wz-title {
          font-family:'Outfit',sans-serif; font-size:1.65rem; font-weight:850;
          letter-spacing:-0.8px; color:#0f172a; margin:0 0 0.35rem;
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
        }
        .wz-input::placeholder { color:#b0b8c4; }
        .wz-input:focus { border-color:var(--bc); box-shadow:0 0 0 3px var(--bg); }
        .wz-input:disabled { background:#f8fafc; color:#64748b; cursor:not-allowed; }
        
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

        /* ── PILARES (PASO 2 - MANIFIESTO TIPOGRÁFICO) ── */
        .wz-principles-list { display:flex; flex-direction:column; gap:1.25rem; }
        .wz-principle {
          display:flex; align-items:flex-start; gap:1.5rem;
          padding:1.5rem; border:1px solid #e8ecf1; border-radius:16px;
          background:#fff; transition:all 0.3s ease; position:relative; overflow:hidden;
        }
        .wz-principle::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:4px;
          background:var(--bg); transition:background 0.3s;
        }
        .wz-principle:hover { border-color:var(--bc); transform:translateX(4px); box-shadow:0 12px 24px -12px rgba(0,0,0,0.06); }
        .wz-principle:hover::before { background:var(--bc); }
        .wz-principle-num {
          font-family:'Outfit',sans-serif; font-size:2.5rem; font-weight:900;
          color:var(--bg); line-height:0.8; letter-spacing:-2px;
          transition:color 0.3s;
        }
        .wz-principle:hover .wz-principle-num { color:var(--bc); }
        .wz-principle-text h4 {
          font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:850;
          color:#0f172a; margin:0 0 0.35rem; letter-spacing:-0.3px;
        }
        .wz-principle-text p {
          font-size:0.88rem; color:#475569; line-height:1.55; margin:0; font-weight:500;
        }

        /* ── CHECKBOX ROW ── */
        .wz-check-row {
          display:flex; align-items:center; gap:0.85rem; cursor:pointer;
          padding:0.85rem 1.1rem; border-radius:12px; margin-top:0.25rem;
          border:1.5px dashed #dde3ea; transition:all 0.2s; user-select:none;
        }
        .wz-check-row:hover { border-color:#b0b8c4; background:rgba(255,255,255,0.6); }
        .wz-check-row.on { border-color:var(--bc); border-style:solid; background:#fff; box-shadow:0 0 0 1px var(--bc); }
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

        /* ── PROTOCOLO SPLIT (PASO 4) ── */
        .wz-protocol-split { display:flex; gap:2.5rem; margin-bottom:1.5rem; align-items:stretch; }
        .wz-protocol-list-container { flex:1; display:flex; flex-direction:column; gap:0.5rem; }
        
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
          padding:2.5rem 1.5rem; display:flex; flex-direction:column; align-items:center; justify-content:center;
          text-align:center; transition:all 0.3s ease; position:relative; overflow:hidden;
        }
        .wz-metric-box:hover { border-color:#cbd5e1; box-shadow:0 12px 32px -12px rgba(0,0,0,0.06); transform:translateY(-2px); }
        .wz-metric-value {
          font-family:'Outfit',sans-serif; font-size:4.8rem; font-weight:900; line-height:1;
          color:var(--bc); margin-bottom:0.75rem; letter-spacing:-2.5px;
        }
        .wz-metric-label { font-size:0.95rem; color:#475569; font-weight:700; line-height:1.4; }
        
        .wz-metric-box.danger { background:rgba(239,68,68,0.02); border-color:rgba(239,68,68,0.15); }
        .wz-metric-box.danger .wz-metric-value { color:#dc2626; font-size:4.2rem; }
        .wz-metric-box.danger .wz-metric-label { color:#991b1b; }
        .wz-metric-tag {
          position:absolute; top:1.25rem; background:rgba(239,68,68,0.1); color:#dc2626;
          font-size:0.65rem; font-weight:800; text-transform:uppercase; padding:0.35rem 0.7rem;
          border-radius:6px; letter-spacing:1px;
        }
        
        .fade-in { animation:fadeIn 0.4s ease forwards; }
        @keyframes fadeIn { from { opacity:0; transform:scale(0.98); } to { opacity:1; transform:scale(1); } }


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
        .wz-sum-row {
          display:flex; justify-content:space-between; align-items:center;
          padding:0.55rem 0; border-bottom:1px solid #f1f5f9; font-size:0.85rem;
        }
        .wz-sum-row span { color:#94a3b8; font-weight:500; }
        .wz-sum-row strong { color:#0f172a; font-weight:700; }

        .wz-footer {
          text-align:center; font-size:0.65rem; font-weight:700; color:#b0b8c4;
          margin-top:1.25rem; letter-spacing:0.5px; text-transform:uppercase;
        }

        .wz-success-icon {
          width:56px; height:56px; border-radius:50%; margin:0 auto 1rem;
          background:rgba(34,197,94,0.08); color:#22c55e;
          display:flex; align-items:center; justify-content:center;
          font-size:1.5rem; font-weight:900; border:2px solid rgba(34,197,94,0.2);
        }

        /* ── BUTTONS ── */
        .wz-nav { display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem; }
        .wz-btn-main {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:750; color:#fff;
          background:var(--bc); border:none; border-radius:10px; cursor:pointer;
          transition:all 0.2s; font-family:inherit;
        }
        .wz-btn-main:hover:not(:disabled) { filter:brightness(1.08); transform:translateY(-1px); }
        .wz-btn-main:disabled { background:#e2e8f0 !important; color:#94a3b8 !important; cursor:not-allowed; }
        .wz-btn-ghost {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:700; color:#64748b;
          background:#f1f5f9; border:none; border-radius:10px; cursor:pointer;
          transition:all 0.2s; font-family:inherit;
        }
        .wz-btn-ghost:hover { background:#e2e8f0; color:#1e293b; }
        .wz-btn-wa {
          padding:0.7rem 1.8rem; font-size:0.88rem; font-weight:750; color:#fff;
          background:linear-gradient(135deg,#25d366,#128c7e); border:none; border-radius:10px;
          cursor:pointer; transition:all 0.2s; display:inline-flex; align-items:center; gap:0.5rem;
          font-family:inherit;
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
        @keyframes modalPop { to { transform:scale(1); } }
        
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
          to { opacity:1; transform:translateY(0); }
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
        .wz-grid-2 { display:grid; gap:2rem; margin-bottom:0.5rem; }

        /* ── ELITE PROGRAM (PASO 6) ── */
        .wz-elite-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; margin-bottom:1rem; }
        .wz-elite-card { padding:1.75rem; border-radius:20px; transition:all 0.3s; }
        .wz-elite-card.benefits {
          background:#060e1a; color:#fff; border:1px solid rgba(56,189,248,0.1);
          box-shadow: 0 10px 30px -15px rgba(6,14,26,0.5);
        }
        .wz-elite-card.requirements { background:#fff; border:1px solid #e8ecf1; }
        .wz-ec-title { font-family:'Outfit',sans-serif; font-size:1.15rem; font-weight:850; margin:0 0 1.25rem; letter-spacing:-0.4px; color:#0f172a; }
        .wz-ec-title.gold { color:#f59e0b; }
        .wz-elite-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.75rem; }
        .wz-elite-list li { display:flex; align-items:flex-start; gap:0.65rem; font-size:0.85rem; line-height:1.45; font-weight:500; color:#cbd5e1; }
        .wz-elite-check {
          width:16px; height:16px; border-radius:50%; background:rgba(34,197,94,0.12); color:#22c55e;
          display:flex; align-items:center; justify-content:center; font-size:0.6rem; font-weight:900; flex-shrink:0; margin-top:2.5px;
        }
        .wz-elite-metric { display:flex; justify-content:space-between; align-items:center; padding:0.85rem 0; border-bottom:1px solid #f1f5f9; }
        .wz-em-label { font-size:0.8rem; font-weight:700; color:#64748b; }
        .wz-em-value { font-family:'Outfit',sans-serif; font-size:2rem; font-weight:900; color:var(--bc); line-height:1; letter-spacing:-1px; }
        .wz-em-value small { font-size:0.85rem; color:#64748b; font-weight:700; }
        .wz-em-tag {
          font-size:0.65rem; font-weight:800; text-transform:uppercase; color:#b45309; background:rgba(245,158,11,0.08);
          padding:0.3rem 0.65rem; border-radius:6px; letter-spacing:0.5px;
        }

        /* ── RESPONSIVE ── */
        @media (max-width:960px) {
          .wz { padding: 1rem; }
        }
        @media (max-width:860px) {
          .wz-main { padding:1.5rem 2rem; }
          .wz-protocol-split { flex-direction:column; gap:1.5rem; }
          .wz-protocol-image-container { width:100%; height:260px; min-height:260px; }
          .wz-pi-placeholder { min-height:260px; }
          .wz-metrics-grid { grid-template-columns:1fr 1fr !important; }
          .wz-metric-box.danger { grid-column:span 2; }
          .wz-elite-grid { grid-template-columns:1fr; gap:1.5rem; }
        }
        @media (max-width:680px) {
          .wz { padding: 0.5rem; }
          .wz-header { padding:0 0.65rem; height: 64px; }
          .wz-h-left, .wz-h-right { width:42px; }
          .wz-h-center { gap:0.5rem; max-width:calc(100vw - 116px); overflow:hidden; }
          .wz-logo { max-width:30vw; }
          .wz-logo.lg-ciip { height:34px !important; max-width:72px; }
          .wz-logo.lg-geo { height:22px !important; max-width:74px; transform:translateY(3px); }
          .wz-logo.lg-bio { height:29px !important; max-width:66px; }
          .wz-sep { height:20px; background:linear-gradient(to bottom,transparent,rgba(56,189,248,0.32),transparent); }
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
          .wz-stepper-premium { padding:0.65rem 1.25rem; gap:0.45rem; }
          .wz-stepper-step-name { font-size:0.78rem; }
          .wz-stepper-segments { gap:0.25rem; }
          .wz-stepper-segment { height:3px; }
          .wz-main { padding:1.25rem 1rem; overflow-y:auto; border-radius:20px; }
          
          .wz-title { font-size:1.5rem !important; margin-bottom:0.5rem; }
          .wz-sub { font-size:0.85rem !important; margin-bottom:1.25rem !important; }
          .wz-grid-2 { grid-template-columns:1fr !important; gap:1rem !important; }
          
          .wz-principle { flex-direction:column; gap:0.85rem; padding:1.25rem; }
          .wz-principle-n { font-size:1.8rem; }
          .wz-principle h3 { font-size:1.15rem; }
          
          .wz-agenda-row { flex-direction:column; gap:0.85rem; padding:1.25rem; }
          .wz-agenda-content { padding-left:0; border-left:none; padding-top:0.75rem; border-top:1px solid #e8ecf1; width:100%; }
          .wz-agenda-row.on .wz-agenda-content { border-top-color:rgba(14,165,233,0.2); }
          
          .wz-metrics-grid { grid-template-columns:1fr !important; gap:1rem; }
          .wz-metric-box.danger { grid-column:span 1; }
          .wz-metric-box { padding:1.5rem 1.25rem; border-radius:20px; }
          .wz-metric-value { font-size:3.5rem; }
          .wz-metric-box.danger .wz-metric-value { font-size:3.2rem; }

          .wz-elite-card { padding:1.5rem; border-radius:20px; }
          .wz-em-value { font-size:3.2rem; }
          .wz-em-value small { font-size:1.2rem; }
          .wz-ec-title { font-size:1.15rem; margin-bottom:1.25rem; }

          .wz-nav { flex-direction:column-reverse; gap:0.5rem; margin-top:1.5rem; }
          .wz-btn-main, .wz-btn-ghost, .wz-btn-wa { width:100%; text-align:center; justify-content:center; padding:1rem; }
          
          .wz-modal-box { width:95%; padding:1.5rem; border-radius:24px; }
          .wz-modal-title { font-size:1.8rem; }

          .wz-payment-grid { grid-template-columns:1fr 1fr !important; }
          .wz-upload-section { grid-template-columns:1fr !important; }
          .wz-upload-zone { padding:1.5rem 1rem; }
        }

        @media (max-width:380px) {
          .wz-header { padding:0 0.55rem; }
          .wz-h-left, .wz-h-right { width:38px; }
          .wz-h-center { gap:0.42rem; max-width:calc(100vw - 100px); }
          .wz-logo.lg-ciip { height:31px !important; max-width:64px; }
          .wz-logo.lg-geo { height:20px !important; max-width:66px; }
          .wz-logo.lg-bio { height:26px !important; max-width:58px; }
          .wz-sep { height:17px; }
          .wz-brand-card img {
            max-height: 34px;
            max-width: 68%;
          }
        }

        @media (max-width:340px) {
          .wz-sep { display:none; }
          .wz-h-center { gap:0.5rem; }
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
