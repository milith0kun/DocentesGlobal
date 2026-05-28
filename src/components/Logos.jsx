import logociip from '../assets/logociip.png';
import logogeomina from '../assets/logogeomina.png';
import logobiomedic from '../assets/logobiomedic.png';

const logos = [
  {
    src: logociip,
    alt: 'Logo CIIP',
    label: 'CIIP Latam',
    subtitle: 'Investigación y Profesionalización',
    color: '#0369a1',
    glowColor: 'rgba(3, 105, 161, 0.15)',
  },
  {
    src: logogeomina,
    alt: 'Logo Geomina',
    label: 'Geomina',
    subtitle: 'Capacitación Minera',
    color: '#0ea5e9',
    glowColor: 'rgba(14, 165, 233, 0.15)',
  },
  {
    src: logobiomedic,
    alt: 'Logo Biomedic',
    label: 'Biomedic',
    subtitle: 'Capacitación en Salud',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
];

export default function Logos() {
  return (
    <section className="logos-section" style={{ padding: '2.5rem 0 3.5rem', marginTop: '-3rem', position: 'relative', zIndex: 10 }}>
      <div className="container">
        <div className="logos-card" style={{
          background: 'rgba(255, 255, 255, 0.72)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(224, 242, 254, 0.7)',
          borderRadius: '32px', padding: '3rem 2.5rem',
          boxShadow: '0 20px 48px -12px rgba(2, 132, 199, 0.08), 0 4px 16px -4px rgba(2, 132, 199, 0.03)',
          maxWidth: '1020px', margin: '0 auto'
        }}>
          {/* Section micro-header */}
          <div style={{
            textAlign: 'center', marginBottom: '2.5rem'
          }}>
            <span style={{
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '3px',
              textTransform: 'uppercase', color: '#94a3b8',
              fontFamily: 'var(--font-body)'
            }}>
              NUESTRO ECOSISTEMA
            </span>
          </div>

          {/* Logo cards grid */}
          <div className="logo-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.75rem', marginBottom: '1rem'
          }}>
            {logos.map((logo, i) => (
              <div
                key={i}
                className="logo-item-premium"
                title={logo.subtitle}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '2.5rem 1.75rem 2rem',
                  borderRadius: '24px', cursor: 'default',
                  background: 'rgba(255, 255, 255, 0.45)',
                  border: '1px solid rgba(224, 242, 254, 0.5)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative', overflow: 'hidden',
                  '--brand-glow': logo.glowColor,
                  '--brand-border': logo.color
                }}
              >
                {/* Brand glow element behind logo card */}
                <div className="logo-glow-bg" style={{
                  position: 'absolute', width: '120px', height: '120px',
                  borderRadius: '50%', background: logo.color,
                  filter: 'blur(45px)', opacity: 0,
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 0, pointerEvents: 'none', top: '10%', left: '30%'
                }} />

                {/* Top dynamic bar */}
                <div style={{
                  position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                  width: '36px', height: '3px', borderRadius: '0 0 3px 3px',
                  background: `linear-gradient(90deg, ${logo.color}, ${logo.color}aa)`,
                  opacity: 0.5, transition: 'all 0.3s ease'
                }} className="logo-top-bar" />

                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="partner-logo-premium"
                  style={{
                    maxHeight: '62px', width: 'auto', objectFit: 'contain',
                    marginBottom: '1.5rem', zIndex: 1,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.03))',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
                
                <span style={{
                  fontSize: '0.95rem', fontWeight: 800,
                  color: '#1e293b', fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.3px', marginBottom: '0.25rem', zIndex: 1
                }}>
                  {logo.label}
                </span>
                
                <span style={{
                  fontSize: '0.74rem', fontWeight: 600,
                  color: '#64748b', textAlign: 'center',
                  lineHeight: 1.35, zIndex: 1
                }}>
                  {logo.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* Footer tagline */}
          <div className="logos-footer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '1.5rem', marginTop: '2.5rem'
          }}>
            <span style={{
              flexGrow: 1, maxWidth: '120px', height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(14,165,233,0.25))'
            }} />
            <p className="logos-subtitle" style={{
              fontSize: '0.72rem', fontWeight: 800, letterSpacing: '3px',
              textTransform: 'uppercase', color: '#0ea5e9', textAlign: 'center'
            }}>
              Ecosistema de Capacitación Profesional Latinoamericano
            </p>
            <span style={{
              flexGrow: 1, maxWidth: '120px', height: '1px',
              background: 'linear-gradient(to left, transparent, rgba(14,165,233,0.25))'
            }} />
          </div>
        </div>
      </div>

      {/* Styled JSX */}
      <style>{`
        .logo-item-premium:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.95) !important;
          border-color: rgba(224, 242, 254, 0.9) !important;
          box-shadow: 
            0 20px 35px -10px var(--brand-glow),
            0 4px 12px -2px rgba(2, 132, 199, 0.04) !important;
        }

        .logo-item-premium:hover .logo-glow-bg {
          opacity: 0.08 !important;
          transform: scale(1.3) translate(-10px, -10px);
        }

        .logo-item-premium:hover .logo-top-bar {
          width: 60px !important;
          opacity: 1 !important;
        }

        .logo-item-premium:hover .partner-logo-premium {
          transform: scale(1.05);
          filter: drop-shadow(0 8px 16px var(--brand-glow)) !important;
        }

        @media (max-width: 768px) {
          .logos-section {
            padding: 1.5rem 0 2rem !important;
          }
          .logos-section .logo-grid {
            grid-template-columns: 1fr !important;
            gap: 0.9rem !important;
          }
          .logos-section .logos-card {
            padding: 1.5rem 1rem !important;
            border-radius: 22px !important;
          }
          .logo-item-premium {
            min-height: 96px;
            padding: 1.15rem 1rem !important;
            border-radius: 18px !important;
          }
          .partner-logo-premium {
            max-height: 44px !important;
            max-width: min(170px, 72vw);
            margin-bottom: 0.8rem !important;
          }
          .logos-footer {
            gap: 0.75rem !important;
            margin-top: 1.5rem !important;
          }
          .logos-subtitle {
            font-size: 0.62rem !important;
            letter-spacing: 1.4px !important;
            line-height: 1.45;
          }
        }

        @media (max-width: 380px) {
          .partner-logo-premium {
            max-height: 38px !important;
            max-width: 68vw;
          }
          .logo-item-premium {
            min-height: 88px;
          }
        }

        @media (min-width: 769px) and (max-width: 992px) {
          .logos-section .logo-grid {
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
}
