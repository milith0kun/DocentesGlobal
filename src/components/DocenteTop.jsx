import { useEffect, useRef, useState } from 'react';
import geominaWhite from '../assets/geomina-new.png';
import biomedicWhite from '../assets/biomedic-white.png';

export default function DocenteTop() {
  const [animatedOffset, setAnimatedOffset] = useState(157.08);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimatedOffset(15.71), 400);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const beneficios = [
    {
      title: 'Tarifa Escalonada',
      desc: 'Incremento de honorarios por hora en base a tu calificación histórica.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          <polyline points="17 6 23 6 23 12" />
        </svg>
      ),
    },
    {
      title: 'Asignación Prioritaria',
      desc: 'Acceso exclusivo y preferencial a los nuevos módulos de tu especialidad.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: 'Proyección de Marca',
      desc: 'Participación patrocinada en podcasts de la red y eventos de networking regional.',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  const containerStyle = {
    '--stagger-0': '0.1s',
    '--stagger-1': '0.25s',
    '--stagger-2': '0.4s',
  };

  return (
    <section id="top" className="docentetop-section" ref={sectionRef} style={{ padding: '6.5rem 0' }}>
      <div className="container">
        <div className="top-banner-card" style={{
          ...containerStyle,
          background: 'linear-gradient(135deg, #071220 0%, #0a213a 50%, #0d2c4c 100%)',
          color: '#fff', borderRadius: '36px', padding: '5rem 4.5rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 32px 64px -16px rgba(7, 18, 32, 0.55)', border: '1px solid rgba(251, 191, 36, 0.05)'
        }}>
          {/* Decorative elements */}
          <div className="top-banner-overlay"></div>
          <div className="top-sponsors-responsive" style={{
            position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(251,191,36,0.1) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none', zIndex: 1
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none', zIndex: 1
          }} />

          <div className="top-grid">
            {/* Left Content */}
            <div className="top-content-left">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.45rem 1.15rem 0.45rem 0.45rem',
                background: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.18)',
                borderRadius: '50px', marginBottom: '1.75rem',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '1.6rem', height: '1.6rem',
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '50%', color: '#fff'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <span className="top-tag" style={{ marginBottom: 0, display: 'inline', color: '#fbbf24', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px', border: 'none', background: 'transparent', padding: 0 }}>RECONOCIMIENTO ÉLITE</span>
              </div>

              <h2 className="top-title" style={{
                fontSize: '2.8rem', fontWeight: 850, color: '#fff', letterSpacing: '-1.5px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                fontFamily: 'var(--font-heading)'
              }}>
                Programa{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>Docente TOP</span>
              </h2>

              <p className="top-desc" style={{
                fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '3rem', fontWeight: '500',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
              }}>
                Buscamos talentos, no solo oradores. Si demuestras consistencia pedagógica y estricto cumplimiento operativo, formarás parte del círculo de excelencia académica de nuestra red internacional.
              </p>

              <div className="benefits-list" style={{
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
              }}>
                {beneficios.map((ben, index) => (
                  <div key={index} className="benefit-item-premium" style={{
                    display: 'flex', gap: '1.25rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', padding: '1.25rem 1.5rem',
                    backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'default'
                  }}>
                    <span className="benefit-icon" style={{
                      width: '2.75rem', height: '2.75rem', minWidth: '2.75rem',
                      background: 'linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.08))',
                      border: '1px solid rgba(251,191,36,0.12)',
                      borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fbbf24', fontSize: '1rem'
                    }}>{ben.icon}</span>
                    <div className="benefit-info">
                      <h4 className="benefit-title" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{ben.title}</h4>
                      <p className="benefit-subtitle" style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.55, margin: 0, fontWeight: '500' }}>{ben.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content: NPS Radial Gauge */}
            <div className="top-content-right" style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
            }}>
              <div className="nps-gauge-card-premium" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '30px', padding: '2.75rem 2.25rem',
                backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                position: 'relative', overflow: 'hidden',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* Ambient glow behind arc */}
                <div style={{
                  position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px',
                  background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
                  borderRadius: '50%', pointerEvents: 'none'
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ width: '8px', height: '8px', background: '#fbbf24', borderRadius: '50%', boxShadow: '0 0 10px rgba(251,191,36,0.6)' }} />
                  <h3 className="nps-card-title" style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.5px', color: '#fff', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    Objetivo NPS Mínimo
                  </h3>
                </div>

                <div className="nps-chart-wrapper" style={{ position: 'relative', width: '220px', height: '125px', margin: '0 auto 1.5rem' }}>
                  <svg className="nps-svg" viewBox="0 0 120 70" style={{ width: '100%', height: 'auto' }}>
                    <defs>
                      <linearGradient id="goldGradientTop" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <filter id="glowFilter">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Background track */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" strokeDasharray="157.08" strokeLinecap="round" transform="rotate(-180 60 60)" />
                    {/* Glow layer */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#goldGradientTop)" strokeWidth="12" strokeDasharray="157.08" strokeDashoffset={animatedOffset} strokeLinecap="round" transform="rotate(-180 60 60)" filter="url(#glowFilter)" opacity="0.35" style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.1, 0.8, 0.2, 1)' }} />
                    {/* Main arc */}
                    <circle cx="60" cy="60" r="50" fill="none" stroke="url(#goldGradientTop)" strokeWidth="10" strokeDasharray="157.08" strokeDashoffset={animatedOffset} strokeLinecap="round" transform="rotate(-180 60 60)" style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.1, 0.8, 0.2, 1)' }} />
                  </svg>
                  <div className="nps-score-display" style={{ position: 'absolute', bottom: 0, left: 50, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <span className="nps-value" style={{
                      background: 'linear-gradient(180deg, #fff 20%, #fbbf24 100%)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text', fontSize: '3.6rem', fontWeight: 900, fontFamily: 'var(--font-heading)'
                    }}>4.5</span>
                    <span className="nps-label" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '0.2rem' }}>NPS Objetivo</span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(251,191,36,0.2), transparent)', margin: '1.75rem 0' }} />

                <div className="nps-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left' }}>
                  <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.82rem', fontWeight: '500' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fbbf24' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span className="detail-label" style={{ color: '#94a3b8' }}>Asistencia & Puntualidad</span>
                    </div>
                    <span className="detail-status status-perfect" style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '0.25rem 0.65rem', fontWeight: 700, background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80' }}>100% Requerido</span>
                  </div>
                  <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', fontSize: '0.82rem', fontWeight: '500' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#fbbf24' }}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="detail-label" style={{ color: '#94a3b8' }}>Calificación Alumnos</span>
                    </div>
                    <span className="detail-status status-score" style={{ borderRadius: '8px', fontSize: '0.75rem', padding: '0.25rem 0.65rem', fontWeight: 700, background: 'rgba(14, 165, 233, 0.12)', color: '#38bdf8' }}>Mínimo 4.5 / 5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sponsor logos bar */}
          <div style={{
            marginTop: '4.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s'
          }}>
            <p style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Con el respaldo de
            </p>
            <div className="top-sponsors-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3.5rem', flexWrap: 'wrap' }}>
              <div className="top-sponsor-logo-wrap" style={{ opacity: 0.55, transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <img className="top-sponsor-logo top-sponsor-geomina" src={geominaWhite} alt="Geomina" style={{ height: '30px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <div className="top-sponsor-sep" style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
              <div className="top-sponsor-logo-wrap" style={{ opacity: 0.55, transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.92'; e.currentTarget.style.transform = 'scale(1.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <img className="top-sponsor-logo top-sponsor-biomedic" src={biomedicWhite} alt="Biomedic" style={{ height: '30px', width: 'auto', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .benefit-item-premium:hover {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(251, 191, 36, 0.15) !important;
          transform: translateX(6px);
        }

        .nps-gauge-card-premium:hover {
          border-color: rgba(251, 191, 36, 0.18) !important;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.38) !important;
        }

        @media (max-width: 992px) {
          .top-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .top-banner-card {
            padding: 3.5rem 2rem !important;
          }
        }

        @media (max-width: 640px) {
          .top-sponsors-responsive {
            margin-top: 2.5rem !important;
            padding-top: 1.5rem !important;
          }
          .top-sponsors-row {
            flex-wrap: nowrap !important;
            gap: 1rem !important;
            max-width: 18rem;
            margin: 0 auto;
          }
          .top-sponsor-logo-wrap {
            opacity: 0.9 !important;
            flex: 0 1 auto;
          }
          .top-sponsor-logo {
            width: auto !important;
            object-fit: contain;
            filter: brightness(1.25) contrast(1.05) drop-shadow(0 2px 8px rgba(56, 189, 248, 0.16));
          }
          .top-sponsor-geomina {
            height: 19px !important;
            max-width: 88px;
          }
          .top-sponsor-biomedic {
            height: 24px !important;
            max-width: 92px;
          }
          .top-sponsor-sep {
            height: 18px !important;
            background: rgba(255, 255, 255, 0.16) !important;
          }
        }

        @media (max-width: 360px) {
          .top-sponsors-row {
            gap: 0.7rem !important;
          }
          .top-sponsor-geomina {
            height: 17px !important;
            max-width: 78px;
          }
          .top-sponsor-biomedic {
            height: 22px !important;
            max-width: 82px;
          }
        }
      `}</style>
    </section>
  );
}
