import React from 'react';

export default function Horarios() {
  const hitos = [
    {
      dia: 'Sábado',
      hora: 'Límite 1:00 PM',
      titulo: 'Material Sesión 1',
      desc: 'Diapositivas, guías de práctica y recursos del sábado. Deben subirse en la carpeta correspondiente.',
      badge: 'Fase 1'
    },
    {
      dia: 'Domingo',
      hora: 'Límite 1:00 PM',
      titulo: 'Material Sesión 2',
      desc: 'Diapositivas y guías de la clase dominical. Sin excepciones de plazo por motivos operativos.',
      badge: 'Fase 2'
    },
    {
      dia: 'Lunes',
      hora: 'Corte Final 9:00 AM',
      titulo: 'Examen Final & Caso',
      desc: 'Sube el examen final que consta de 3 documentos indispensables:',
      detalles: [
        'Documento 1: 10 Preguntas Opción Múltiple',
        'Documento 2: Caso Práctico en PDF',
        'Documento 3: Resolución Exacta del Caso'
      ],
      badge: 'Evaluación',
      critical: true
    }
  ];

  return (
    <section id="horarios" className="horarios-section" style={{ padding: '6.5rem 0' }}>
      <div className="container">
        <div className="horarios-card" style={{
          background: 'linear-gradient(135deg, #070e17 0%, #0c1a2e 50%, #0f2542 100%)',
          color: '#fff', border: '1px solid rgba(56, 189, 248, 0.08)',
          borderRadius: '36px', padding: '5rem 4rem',
          boxShadow: '0 32px 64px -16px rgba(7, 14, 23, 0.55)',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* Subtle atmospheric glow */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'radial-gradient(circle at 80% 15%, rgba(14, 165, 233, 0.05) 0%, transparent 60%)',
            pointerEvents: 'none', zIndex: 1
          }} />

          <div className="horarios-header" style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 2 }}>
            <h2 className="horarios-title" style={{ fontSize: '2.8rem', fontWeight: 850, color: '#fff', letterSpacing: '-1.5px', fontFamily: 'var(--font-heading)' }}>
              Fechas de Corte <span className="highlight-sky-premium">Innegociables</span>
            </h2>
            <p className="horarios-subtitle" style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '640px', margin: '1.25rem auto 0', lineHeight: 1.7 }}>
              La proactividad es tu mayor activo operativo. No esperes recordatorios; la puntualidad en las entregas garantiza el correcto flujo académico regional.
            </p>
          </div>

          <div className="timeline-container" style={{ position: 'relative', marginBottom: '4.5rem', zIndex: 2 }}>
            <div className="timeline-bar" style={{
              position: 'absolute', top: '35px', left: 0, width: '100%', height: '2px',
              background: 'linear-gradient(to right, rgba(14, 165, 233, 0.02), rgba(14, 165, 233, 0.35), rgba(14, 165, 233, 0.02))',
              zIndex: 1
            }} />
            <div className="timeline-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', position: 'relative', zIndex: 2 }}>
              {hitos.map((hito, index) => (
                <div key={index} className={`timeline-step-card-premium ${hito.critical ? 'critical' : ''}`} style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '24px', padding: '2.5rem 2rem',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}>
                  <div className="step-badge-day" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                    <span className="day-name" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.45rem', color: '#fff' }}>{hito.dia}</span>
                    <span className="step-phase-premium" style={{
                      fontSize: '0.72rem', fontWeight: 700, padding: '0.35rem 0.9rem',
                      borderRadius: '50px', border: '1px solid rgba(14, 165, 233, 0.15)'
                    }}>{hito.badge}</span>
                  </div>
                  <div className="step-content">
                    <span className="step-time-premium" style={{
                      display: 'block', fontSize: '0.74rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem'
                    }}>{hito.hora}</span>
                    <h3 className="step-title" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.9rem', fontFamily: 'var(--font-heading)' }}>{hito.titulo}</h3>
                    <p className="step-desc" style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>{hito.desc}</p>
                    {hito.detalles && (
                      <ul className="step-details-list" style={{ listStyle: 'none', marginTop: '1.25rem', paddingLeft: 0 }}>
                        {hito.detalles.map((det, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '0.5rem', fontWeight: '500' }}>
                            <span className="bullet-premium" style={{ width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0 }} />
                            {det}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Drive Bar */}
          <div className="drive-integration-bar" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '20px', padding: '1.5rem 2rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.75rem', position: 'relative', zIndex: 2
          }}>
            <div className="drive-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="drive-icon-wrapper" style={{
                width: '2.75rem', height: '2.75rem', background: 'rgba(14, 165, 233, 0.08)',
                color: '#38bdf8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(14, 165, 233, 0.12)'
              }}>
                <svg className="drive-svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.35rem', height: '1.35rem' }}>
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" />
                </svg>
              </div>
              <div className="drive-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '0.98rem', color: '#fff', fontWeight: '750' }}>Drive institucional</strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '500' }}>Notificación automatizada activa al cargar recursos.</span>
              </div>
            </div>
            <p className="drive-status" style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0, fontWeight: '500' }}>
              <span className="pulse-dot-premium" style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
              Recibirás un aviso cuando las carpetas de tu módulo sean habilitadas.
            </p>
          </div>

          {/* Warning box without emoji */}
          <div className="critical-warning-box-premium" style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '20px', padding: '1.5rem 2rem',
            display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 2
          }}>
            <div className="warning-icon-wrapper-premium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <p className="warning-text-premium" style={{ fontSize: '0.88rem', color: '#fca5a5', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>
              <strong style={{ fontWeight: '750' }}>Recordatorio:</strong> Si la Dirección Académica debe solicitarte el material de manera extraordinaria ante un retraso no justificado, se registrará una penalidad en tu reporte trimestral de cumplimiento.
            </p>
          </div>
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .highlight-sky-premium {
          color: #38bdf8;
          font-weight: 850;
        }

        .timeline-step-card-premium:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(56, 189, 248, 0.25) !important;
          box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.4) !important;
        }

        .timeline-step-card-premium.critical .step-time-premium {
          color: #fbbf24;
        }

        .timeline-step-card-premium.critical .step-phase-premium {
          background: rgba(251, 191, 36, 0.08) !important;
          color: #fbbf24 !important;
          border-color: rgba(251, 191, 36, 0.2) !important;
        }

        .timeline-step-card-premium.critical:hover {
          border-color: rgba(251, 191, 36, 0.35) !important;
        }

        .timeline-step-card-premium .step-phase-premium {
          background: rgba(14, 165, 233, 0.08);
          color: #38bdf8;
          transition: all 0.3s ease;
        }

        .timeline-step-card-premium .step-time-premium {
          color: #38bdf8;
          transition: all 0.3s ease;
        }

        .timeline-step-card-premium .bullet-premium {
          background: #38bdf8;
          transition: all 0.3s ease;
        }

        .timeline-step-card-premium.critical .bullet-premium {
          background: #fbbf24;
        }

        .timeline-step-card-premium:hover .step-time-premium {
          letter-spacing: 2px !important;
        }

        .pulse-dot-premium {
          animation: pulseGreen 2.5s infinite;
        }

        @keyframes pulseGreen {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        @media (max-width: 992px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .timeline-bar {
            display: none !important;
          }
          .horarios-card {
            padding: 3.5rem 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
