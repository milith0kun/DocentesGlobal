'use client';

import { useState } from 'react';
import { isValidEmail } from '../utils/emailValidation.js';

const logobiomedic = '/assets/logobiomedic.png';
const geominaWhite = '/assets/geomina-new.png';
const biomedicWhite = '/assets/biomedic-white.png';
const camaraFondoVirtual = '/assets/camara_fondo_virtual.png';
const identidadVisualPpts = '/assets/identidad_visual_ppts.png';
const canalesExternosProhibidos = '/assets/canales_externos_prohibidos.png';
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
  const [loadingDni, setLoadingDni] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const consultarDNI = async (dniVal) => {
    if (!/^\d{8}$/.test(dniVal)) return;
    setLoadingDni(true);
    try {
      const response = await fetch('/api/reniec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni: dniVal })
      });

      const resData = await parseJsonResponse(response);
      if (!response.ok || !resData) {
        console.error('Error al consultar DNI', { status: response.status });
        return;
      }

      if (resData.success && resData.nombre) {
        setFormData(prev => ({ ...prev, nombre: resData.nombre }));
      }
    } catch (err) {
      console.error(err);
    }
    setLoadingDni(false);
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
  const correoValido = isValidEmail(formData.correo);
  const mostrarErrorCorreo = formData.correo.trim().length > 0 && !correoValido;

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

  const totalSteps = 12;

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
    12: 'Declaración de Conformidad',
  };

  const marcaConfig = {
    ciip: { nombre: 'CIIP Latam', color: '#0284c7', telefono: '51956006498', coordinador: 'Nicol', bgGlow: 'rgba(2,132,199,0.12)' },
    geomina: { nombre: 'Geomina', color: '#0ea5e9', telefono: '51925084564', coordinador: 'Fiorella', bgGlow: 'rgba(14,165,233,0.12)' },
    biomedic: { nombre: 'Biomedic', color: '#06b6d4', telefono: '51956006498', coordinador: 'Nicol', bgGlow: 'rgba(6,182,212,0.1)' },
    ambos: { nombre: 'CIIP Latam & Geomina', color: '#38bdf8', telefono: '51956006498', coordinador: 'Nicol y Fiorella', bgGlow: 'rgba(56,189,248,0.12)' },
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
    if (step === 9 && (!formData.telefono.trim() || !formData.metodoPago || !formData.numeroCuenta.trim() || !formData.direccion.trim())) return;
    if (step === 9 && formData.metodoPago === 'otro' && !formData.metodoPagoOtro.trim()) return;
    if (step === 10 && (!formData.cvFile || !formData.fotoFile)) return;
    if (step === 10) { setShowDriveAlert(true); return; } // Muestra Modal de Drive
    if (step === 11 && (!formData.softwares.trim() || !formData.cursoSonado.trim() || !formData.mejoraAdmin.trim())) return;
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
        alert('Error del servidor al enviar el formulario. Intenta nuevamente.');
        return;
      }
      
      if (resData.success) {
        setGeneratedCode(resData.code);
        const cfg = marcaConfig[formData.marca];
        const metodo = formData.metodoPago === 'otro' ? formData.metodoPagoOtro : formData.metodoPago?.toUpperCase();
        const msg = `*📋 FORMULARIO DOCENTE – CONFORMIDAD*\n\n*Código:* ${resData.code}\n*Docente:* ${formData.nombre}\n*Documento:* ${formData.documento}\n*Correo:* ${formData.correo}\n*Institución:* ${cfg.nombre}\n*Teléfono:* ${formData.telefono}\n\n💳 *Datos de Pago:*\n• Método: ${metodo}\n• Cuenta: ${formData.numeroCuenta}\n• Dirección: ${formData.direccion}\n\n💻 *Softwares:* ${formData.softwares}\n🚀 *Curso deseado:* ${formData.cursoSonado}\n🤝 *Mejora sugerida:* ${formData.mejoraAdmin}\n${formData.comentarios ? `💬 *Comentarios:* ${formData.comentarios}` : ''}\n\n✅ *Compromisos Aceptados:*\n• Metodología Doing by Learning\n• Fechas de corte innegociables\n• Protocolo de imagen\n• Política de asistencia\n• Programa Docente TOP\n\n*Fecha:* ${resData.fecha}\n*Carpeta Drive:* ${resData.driveFolder || 'Pendiente'}\n*PDF Conformidad:* ${resData.pdfUrl || 'Pendiente'}`;
        
        window.open(`https://wa.me/${cfg.telefono}?text=${encodeURIComponent(msg)}`, '_blank');
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
    setFormData({ nombre:'',correo:'',marca:'',documento:'',fechaNacimiento:'',aceptaMetodologia:false,aceptaSabado:false,aceptaDomingo:false,aceptaLunes:false,aceptaProtocolo:false,aceptaAsistencia:false,aceptaTop:false,telefono:'',metodoPago:'',metodoPagoOtro:'',numeroCuenta:'',direccion:'',cvFile:null,fotoFile:null,softwares:'',cursoSonado:'',mejoraAdmin:'',comentarios:'' });
    setStep(1); setIsFinished(false); setGeneratedCode(''); onClose();
  };

  const brandColor = formData.marca ? marcaConfig[formData.marca].color : '#0284c7';
  const brandGlow = formData.marca ? marcaConfig[formData.marca].bgGlow : 'rgba(14,165,233,0.12)';

  const stepWidths = { 1: '380px', 2: '460px', 3: '600px', 4: '620px', 5: '520px', 6: '760px', 7: '720px', 8: '740px', 9: '680px', 10: '600px', 11: '640px', 12: '580px' };

  if (!isOpen) return null;

  return (
    <div className="wz" style={{ '--bc': brandColor, '--bg': brandGlow }}>
      {`}</style>

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
