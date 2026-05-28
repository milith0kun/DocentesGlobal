import React from 'react';

export default function Protocolos() {
  const normas = [
    {
      titulo: 'Cámara & Fondo Virtual',
      desc: 'Cámara web encendida durante toda la sesión. Uso obligatorio del fondo virtual institucional asignado a tu módulo.',
      check: true
    },
    {
      titulo: 'Identidad Visual en PPTs',
      desc: 'Todas las diapositivas y manuales deben llevar la plantilla oficial y los logos actualizados de las instituciones auspiciantes.',
      check: true
    },
    {
      titulo: 'Canales Oficiales Únicos',
      desc: 'Estrictamente prohibido crear grupos paralelos de WhatsApp, Telegram o Discord con alumnos. Toda comunicación es por el aula virtual.',
      check: false
    }
  ];

  return (
    <section id="reglas" className="protocolos-section" style={{ padding: '6.5rem 0' }}>
      <div className="container">
        <div className="protocolos-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Left Column: Rules list */}
          <div className="protocolos-left">
            <span className="section-tag" style={{
              background: 'rgba(14, 165, 233, 0.06)',
              borderColor: 'rgba(14, 165, 233, 0.15)',
              color: '#0ea5e9', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px',
              display: 'inline-block', padding: '0.35rem 1rem', borderRadius: '50px', border: '1px solid'
            }}>
              COMPROMISO PROFESIONAL
            </span>
            <h2 className="section-title" style={{ fontSize: '2.8rem', fontWeight: 850, letterSpacing: '-1.5px', marginTop: '1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Imagen & Comunicación
            </h2>
            <p className="section-desc" style={{ fontSize: '1.15rem', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
              Eres el rostro de nuestro ecosistema ante estudiantes de toda Latinoamérica. El profesionalismo digital y la disciplina de comunicación son claves para la excelencia pedagógica.
            </p>

            <div className="normas-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '2.5rem' }}>
              {normas.map((norma, idx) => (
                <div key={idx} className={`norma-item-card-premium ${norma.check ? 'allow' : 'prohibit'}`} style={{
                  background: norma.check ? 'rgba(255, 255, 255, 0.8)' : 'rgba(254, 242, 242, 0.7)',
                  border: '1px solid',
                  borderColor: norma.check ? 'rgba(224, 242, 254, 0.7)' : 'rgba(252, 165, 165, 0.45)',
                  borderRadius: '24px', padding: '1.5rem 1.75rem', display: 'flex', gap: '1.25rem',
                  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default'
                }}>
                  <div className="norma-icon-col" style={{ flexShrink: 0 }}>
                    <span className="norma-indicator-premium" style={{
                      width: '2.75rem', height: '2.75rem', borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContainer: 'center', alignContent: 'center', justifyContent: 'center',
                      background: norma.check 
                        ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(6, 182, 212, 0.06) 100%)' 
                        : 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.06) 100%)',
                      color: norma.check ? '#0ea5e9' : '#ef4444',
                      border: '1px solid',
                      borderColor: norma.check ? 'rgba(14, 165, 233, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}>
                      {norma.check ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <div className="norma-content-col">
                    <h3 className="norma-item-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>{norma.titulo}</h3>
                    <p className="norma-item-desc" style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>{norma.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Attendance Widget */}
          <div className="protocolos-right" style={{ position: 'sticky', top: '100px' }}>
            <div className="asistencia-card-premium" style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(224, 242, 254, 0.7)',
              borderRadius: '30px', padding: '3rem 2.25rem',
              boxShadow: '0 20px 48px -12px rgba(2, 132, 199, 0.08), 0 4px 16px -4px rgba(2, 132, 199, 0.03)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)'
            }}>
              <h3 className="asistencia-title" style={{ fontSize: '1.5rem', fontWeight: 850, color: '#1e293b', marginBottom: '2.25rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
                Política de Asistencia
              </h3>
              
              <div className="stats-asistencia-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div className="stat-item-premium" style={{
                  background: 'rgba(240, 249, 255, 0.45)',
                  border: '1px solid rgba(14, 165, 233, 0.1)',
                  borderRadius: '20px', padding: '1.5rem 1rem', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default'
                }}>
                  <span className="stat-number-premium" style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.8rem',
                    background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1.1, marginBottom: '0.4rem'
                  }}>0</span>
                  <span className="stat-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.3 }}>Reprogramaciones Personales</span>
                </div>
                <div className="stat-item-premium" style={{
                  background: 'rgba(240, 249, 255, 0.45)',
                  border: '1px solid rgba(14, 165, 233, 0.1)',
                  borderRadius: '20px', padding: '1.5rem 1rem', textAlign: 'center',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default'
                }}>
                  <span className="stat-number-premium" style={{
                    fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.8rem',
                    background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1.1, marginBottom: '0.4rem'
                  }}>4</span>
                  <span className="stat-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1.3 }}>Días Mínimos de Anticipación</span>
                </div>
              </div>

              {/* Progress bar simulation widget */}
              <div style={{ marginBottom: '2.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
                  <span>Tasa de Cumplimiento Requerido</span>
                  <span style={{ color: '#0ea5e9' }}>100%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #0284c7, #0ea5e9)', borderRadius: '10px' }} />
                </div>
              </div>

              <div className="penalidad-alert-premium" style={{
                background: 'rgba(239, 68, 68, 0.04)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '20px', padding: '1.5rem 1.75rem',
                transition: 'all 0.3s ease', cursor: 'default'
              }}>
                <div className="penalidad-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className="penalidad-badge-premium" style={{
                    fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1.5px',
                    padding: '0.35rem 0.9rem', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '50px',
                    border: '1px solid rgba(239, 68, 68, 0.1)'
                  }}>Penalidad Grave</span>
                  <span className="penalidad-value" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', color: '#b91c1c' }}>50% Retención</span>
                </div>
                <p className="penalidad-desc" style={{ fontSize: '0.84rem', color: '#991b1b', lineHeight: 1.6, margin: 0, fontWeight: '500' }}>
                  Aplicable sobre los honorarios del módulo si se registran más de 2 inasistencias en un ciclo de 4 clases sin sustento justificado oficial.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .norma-item-card-premium:hover {
          transform: translateX(8px);
          background: #ffffff !important;
        }

        .norma-item-card-premium.allow:hover {
          border-color: rgba(14, 165, 233, 0.28) !important;
          box-shadow: 0 16px 36px -12px rgba(2, 132, 199, 0.1) !important;
        }

        .norma-item-card-premium.prohibit:hover {
          border-color: rgba(239, 68, 68, 0.28) !important;
          box-shadow: 0 16px 36px -12px rgba(239, 68, 68, 0.1) !important;
          background: rgba(254, 242, 242, 0.9) !important;
        }

        .norma-item-card-premium:hover .norma-indicator-premium {
          transform: scale(1.08);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.04) !important;
        }

        .norma-item-card-premium.allow:hover .norma-indicator-premium {
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%) !important;
          color: #ffffff !important;
          border-color: transparent !important;
        }

        .norma-item-card-premium.prohibit:hover .norma-indicator-premium {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: #ffffff !important;
          border-color: transparent !important;
        }

        .stat-item-premium:hover {
          transform: translateY(-4px);
          background: #ffffff !important;
          border-color: rgba(14, 165, 233, 0.25) !important;
          box-shadow: 0 12px 24px -8px rgba(2, 132, 199, 0.12) !important;
        }

        .penalidad-alert-premium:hover {
          border-color: rgba(239, 68, 68, 0.3) !important;
          background: rgba(254, 242, 242, 0.5) !important;
          box-shadow: 0 8px 24px -10px rgba(239, 68, 68, 0.1) !important;
        }

        @media (max-width: 992px) {
          .protocolos-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .protocolos-right {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
}
