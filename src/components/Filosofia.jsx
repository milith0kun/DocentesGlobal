export default function Filosofia() {
  const pilares = [
    {
      num: '01',
      title: '100% Práctico',
      desc: 'Prohibido el relleno teórico. Cada concepto debe ser demostrado resolviendo casos reales directamente en software.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      )
    },
    {
      num: '02',
      title: 'Cero Relleno',
      desc: 'Nada de videos extensos ni PPTs saturados de texto. Acción pura sobre las herramientas digitales.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    },
    {
      num: '03',
      title: 'Control de Ritmo',
      desc: 'El docente domina el tiempo en aula. Los incidentes técnicos individuales no detienen el avance grupal.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    }
  ];

  return (
    <section id="filosofia" className="filosofia-section" style={{ padding: '6.5rem 0' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '4.5rem' }}>
          <span className="section-tag" style={{
            background: 'rgba(14, 165, 233, 0.06)',
            borderColor: 'rgba(14, 165, 233, 0.15)',
            color: '#0ea5e9', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '2.5px'
          }}>
            NUESTRA ESENCIA
          </span>
          <h2 className="section-title" style={{
            fontSize: '2.8rem', fontWeight: 850, letterSpacing: '-1.5px', marginTop: '1rem',
            fontFamily: 'var(--font-heading)'
          }}>
            Nuestra Filosofía: <span className="highlight-text-premium">Doing by Learning</span>
          </h2>
          <p className="section-desc" style={{ fontSize: '1.15rem', color: '#64748b', maxWidth: '680px', margin: '1.25rem auto 0', lineHeight: 1.7 }}>
            Transformamos carreras mediante habilidades prácticas. Este manual establece el estándar de calidad educativa que nos posiciona como referentes en Latinoamérica.
          </p>
        </div>

        <div className="pilares-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem'
        }}>
          {pilares.map((pilar, index) => (
            <div key={index} className="pilar-card-premium" style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(224, 242, 254, 0.7)',
              borderRadius: '28px', padding: '3rem 2.25rem',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 10px 30px -15px rgba(2, 132, 199, 0.06)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'default'
            }}>
              {/* Dynamic light hover effect */}
              <div className="pilar-hover-light" />
              
              <div className="pilar-header" style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '2.25rem', position: 'relative', zIndex: 2
              }}>
                <span className="pilar-number-premium" style={{
                  fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '3rem',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(6, 182, 212, 0.06) 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', lineHeight: 1, transition: 'all 0.4s ease'
                }}>
                  {pilar.num}
                </span>
                
                <span className="pilar-icon-premium" style={{
                  width: '3.5rem', height: '3.5rem',
                  background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)',
                  borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0ea5e9', border: '1px solid rgba(14, 165, 233, 0.1)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                  {pilar.icon}
                </span>
              </div>
              
              <h3 className="pilar-title" style={{
                fontSize: '1.45rem', fontWeight: 800, color: '#1e293b',
                marginBottom: '1rem', position: 'relative', zIndex: 2,
                fontFamily: 'var(--font-heading)'
              }}>
                {pilar.title}
              </h3>
              
              <p className="pilar-desc" style={{
                fontSize: '0.95rem', color: '#64748b', lineHeight: 1.65,
                position: 'relative', zIndex: 2, margin: 0, fontWeight: '500'
              }}>
                {pilar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .highlight-text-premium {
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 850;
        }

        .pilar-card-premium:hover {
          transform: translateY(-8px);
          border-color: rgba(14, 165, 233, 0.28) !important;
          box-shadow: 
            0 24px 48px -12px rgba(2, 132, 199, 0.12), 
            0 8px 20px -4px rgba(2, 132, 199, 0.06) !important;
          background: #ffffff !important;
        }

        .pilar-hover-light {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top left, rgba(14, 165, 233, 0.04) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 1;
        }

        .pilar-card-premium:hover .pilar-hover-light {
          opacity: 1;
        }

        .pilar-card-premium:hover .pilar-number-premium {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.35) 0%, rgba(6, 182, 212, 0.2) 100%) !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          transform: scale(1.05);
        }

        .pilar-card-premium:hover .pilar-icon-premium {
          color: #ffffff !important;
          background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%) !important;
          border-color: transparent !important;
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25) !important;
          transform: scale(1.08) rotate(-4deg);
        }

        @media (max-width: 992px) {
          .pilares-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .pilar-card-premium {
            padding: 2.5rem 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
