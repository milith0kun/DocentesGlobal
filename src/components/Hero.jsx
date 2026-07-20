import { useRef, useEffect } from 'react';

export default function Hero({ onStartWizard }) {
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {
        // Autoplay catch
      });
    }
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="hero-section home-hero clean-hero"
    >
      <div className="hero-clean-bg" aria-hidden="true">
        <div className="hero-grid-pattern" />
        <div className="hero-grid-interactive" />
      </div>



      <div className="container hero-container">
        <div className="home-hero-grid">
          <div className="hero-copy">
            <span className="hero-badge">2026</span>
            <p className="hero-kicker">Bienvenido Docente</p>

            <h1 className="hero-title">
              Este es el Manual y Registro
              <br />
              <span className="hero-title-accent">para la Excelencia Academica</span>
            </h1>

            <p className="hero-subtitle">
              Guia oficial y registro integrado de estandares metodologicos, de imagen y calidad
              para el ecosistema educativo de CIIP Latam, Geomina y Biomedic.
            </p>

            <button type="button" onClick={onStartWizard} className="hero-cta">
              <span>Comenzar Registro</span>
            </button>
          </div>

          {/* Video a la derecha sin marco ni animaciones de CSS */}
          <div className="hero-visual" aria-hidden="true">
            <video 
              ref={videoRef}
              src="/videos/hero-docente-alpha.webm" 
              className="hero-mascot is-active"
              autoPlay 
              muted 
              loop
              playsInline 
              preload="auto"
              disableRemotePlayback
            />
          </div>
        </div>
      </div>

      <style>{`
        .clean-hero {
          position: relative;
          min-height: 100%;
          display: flex;
          align-items: center;
          overflow: hidden;
          text-align: left;
          padding: clamp(4.8rem, 6vw, 5.9rem) 0 clamp(0.4rem, 1vw, 0.85rem) !important;
        }

        .hero-clean-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(80% 60% at 18% 8%, rgba(77, 196, 211, 0.12) 0%, transparent 58%),
            radial-gradient(54% 44% at 88% 82%, rgba(20, 98, 135, 0.06) 0%, transparent 72%),
            #f9fafb;
          overflow: hidden;
        }

        /* Technical Grid Pattern Overlay */
        .hero-grid-pattern, .hero-grid-interactive {
          position: absolute;
          inset: 0;
          background-size: 50px 50px;
          z-index: 0;
          animation: gridScroll 40s linear infinite;
        }

        .hero-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(9, 42, 96, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(9, 42, 96, 0.05) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 80%);
        }

        .hero-grid-interactive {
          background-image: 
            linear-gradient(to right, rgba(77, 196, 211, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(77, 196, 211, 0.35) 1px, transparent 1px);
          mask-image: radial-gradient(175px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent);
          -webkit-mask-image: radial-gradient(175px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .clean-hero:hover .hero-grid-interactive {
          opacity: 1;
        }

        @keyframes gridScroll {
          from { background-position: 0 0; }
          to { background-position: 0 50px; }
        }

        .clean-hero .hero-container {
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .clean-hero .home-hero-grid {
          min-height: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(250px, 0.92fr);
          gap: clamp(1.4rem, 2.8vw, 2.4rem);
          align-items: center;
        }

        .clean-hero .hero-copy {
          max-width: 640px;
        }

        .clean-hero .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 0.38rem 0.85rem;
          border-radius: 9999px;
          border: 1.5px solid rgba(9, 42, 96, 0.15);
          background: #eef2f7;
          color: #092A60;
          font-family: var(--font-heading);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 0.88rem;
        }

        .clean-hero .hero-kicker {
          margin: -0.38rem 0 0.42rem;
          color: #146287;
          font-family: var(--font-heading);
          font-size: clamp(1.58rem, 2.3vw, 2.25rem);
          line-height: 1.12;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .clean-hero .hero-title {
          margin: 0 0 0.95rem;
          color: #092A60;
          font-family: var(--font-heading);
          font-size: clamp(2.45rem, 3.2vw, 3.25rem);
          line-height: 1.06;
          letter-spacing: -0.5px;
          font-weight: 800;
        }

        .clean-hero .hero-title-accent {
          color: #146287;
          font-weight: 800;
        }

        .clean-hero .hero-subtitle {
          margin: 0 0 1.5rem;
          max-width: 560px;
          color: rgba(9, 42, 96, 0.75);
          font-family: var(--font-body);
          font-size: 1.05rem;
          line-height: 1.6;
          font-weight: 500;
        }

        .clean-hero .hero-badge,
        .clean-hero .hero-kicker,
        .clean-hero .hero-title,
        .clean-hero .hero-subtitle,
        .clean-hero .hero-cta {
          opacity: 0;
          transform: translateY(8px);
          animation: heroFadeUp 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .clean-hero .hero-badge {
          animation-delay: 60ms;
        }

        .clean-hero .hero-title {
          animation-delay: 130ms;
        }

        .clean-hero .hero-kicker {
          animation-delay: 100ms;
        }

        .clean-hero .hero-subtitle {
          animation-delay: 200ms;
        }

        .clean-hero .hero-cta {
          animation-delay: 370ms;
        }

        /* ── BCG Academy – Brands Hierarchy ── */
        .hero-brands-block {
          margin: 0.6rem 0 1.4rem;
          opacity: 0;
          transform: translateY(8px);
          animation: heroFadeUp 520ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 280ms;
        }

        .hero-brands-parent {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 47, 82, 0.06);
          border: 1px solid rgba(15, 47, 82, 0.10);
          border-radius: 14px;
          padding: 0.8rem 1.6rem;
          margin-bottom: 0;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .hero-cgb-logo {
          height: clamp(36px, 4.5vw, 52px);
          width: auto;
          object-fit: contain;
        }

        .hero-brands-divider {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin: 0.55rem 0;
        }

        .hero-brands-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(15, 47, 82, 0.18), transparent);
        }

        .hero-brands-divider-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 1.6px;
          text-transform: uppercase;
          color: #64748b;
          white-space: nowrap;
        }

        .hero-brands-children {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.55rem;
        }

        .hero-brand-child {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 47, 82, 0.04);
          border: 1px solid rgba(15, 47, 82, 0.08);
          border-radius: 10px;
          padding: 0.55rem 0.6rem;
          transition: all 0.25s ease;
        }

        .hero-brand-child:hover {
          background: rgba(15, 47, 82, 0.08);
          border-color: rgba(15, 47, 82, 0.16);
          transform: translateY(-1px);
        }

        .hero-brand-child img {
          height: clamp(22px, 3vw, 32px);
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }

        .hero-brand-child img.hero-brand-biomedic {
          height: clamp(26px, 3.5vw, 38px);
        }

        .clean-hero .hero-cta {
          min-height: 52px;
          min-width: clamp(210px, 23vw, 250px);
          border: none;
          border-radius: 9999px;
          background: #4DC4D3;
          color: #092A60;
          font-family: var(--font-heading);
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 2.2rem;
          box-shadow: 0 4px 18px rgba(77, 196, 211, 0.4);
          transition: all 0.2s ease;
        }

        .clean-hero .hero-cta:hover {
          transform: translateY(-2px);
          background: #5ed2e1;
          box-shadow: 0 6px 24px rgba(77, 196, 211, 0.55);
        }

        .clean-hero .hero-cta:active {
          transform: translateY(0);
        }

        .clean-hero .hero-cta:focus-visible {
          outline: none;
          box-shadow:
            0 0 0 2px rgba(255, 255, 255, 0.95),
            0 0 0 4px rgba(15, 47, 82, 0.32);
        }

        .clean-hero .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: clamp(220px, 25vw, 310px);
        }

        .clean-hero .hero-mascot {
          width: 100%;
          max-width: clamp(320px, 48vw, 750px);
          height: auto;
          object-fit: contain;
          opacity: 0;
          transform: scale(1.35);
          transform-origin: center center;
          filter: drop-shadow(0 24px 40px rgba(14, 116, 144, 0.12));
          /* Hardware acceleration to prevent any sub-pixel jitter */
          will-change: opacity, transform;
          -webkit-transform: translateZ(0) scale(1.35);
          transform: translateZ(0) scale(1.35);
          transition: opacity 850ms linear;
        }

        .clean-hero .hero-mascot + .hero-mascot {
          position: absolute;
          inset: 50% auto auto 50%;
          width: 100%;
          transform: translate3d(-50%, -50%, 0) scale(1.35);
          -webkit-transform: translate3d(-50%, -50%, 0) scale(1.35);
        }

        .clean-hero .hero-mascot.is-active {
          opacity: 1;
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .clean-hero .hero-badge,
          .clean-hero .hero-kicker,
          .clean-hero .hero-title,
          .clean-hero .hero-subtitle,
          .clean-hero .hero-cta,
          .hero-brands-block {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 992px) {
          .clean-hero {
            padding: 7.2rem 0 2rem !important;
          }

          .clean-hero .home-hero-grid {
            grid-template-columns: 1fr;
            gap: 1.8rem;
            text-align: center;
          }

          .clean-hero .hero-copy {
            margin: 0 auto;
          }

          .clean-hero .hero-title {
            font-size: clamp(2.3rem, 8.4vw, 2.95rem);
          }

          .clean-hero .hero-subtitle {
            margin: 0 auto 1.2rem;
            max-width: 620px;
          }

          .hero-brands-block {
            max-width: 440px;
            margin: 0.6rem auto 1.4rem;
          }

        }

        @media (max-width: 640px) {
          .clean-hero {
            padding: 6.8rem 0 1.55rem !important;
            max-width: 100vw;
            overflow-x: clip;
          }

          .clean-hero .hero-container,
          .clean-hero .home-hero-grid,
          .clean-hero .hero-copy {
            max-width: 100%;
            min-width: 0;
          }

          .clean-hero .hero-copy {
            padding: 0 0.1rem;
          }

          .clean-hero .hero-title {
            width: 100%;
            max-width: 20rem;
            margin: 0 auto 0.78rem;
            font-size: clamp(1.85rem, 9.4vw, 2.3rem);
            line-height: 1.18;
            overflow-wrap: break-word;
          }

          .clean-hero .hero-kicker {
            margin: -0.22rem 0 0.42rem;
            font-size: clamp(1.32rem, 7vw, 1.68rem);
          }

          .clean-hero .hero-subtitle {
            max-width: 21rem;
            margin: 0 auto 1.02rem;
            font-size: 0.98rem;
            line-height: 1.55;
            overflow-wrap: break-word;
          }

          .clean-hero .hero-cta {
            width: min(100%, 19rem);
            max-width: 316px;
            min-width: 0;
            margin: 0 auto;
          }

          .hero-brands-block {
            max-width: 100%;
            margin: 0.5rem auto 1rem;
          }

          .hero-brands-parent {
            padding: 0.6rem 1rem;
          }

          .hero-cgb-logo {
            height: 30px;
          }

          .hero-brands-children {
            gap: 0.35rem;
          }

          .hero-brand-child {
            padding: 0.4rem 0.35rem;
            border-radius: 8px;
          }

          .hero-brand-child img {
            height: 18px;
          }

          .hero-brand-child img.hero-brand-biomedic {
            height: 22px;
          }

          .clean-hero .hero-visual {
            min-height: 168px;
            margin-top: 1rem;
          }

          .clean-hero .hero-mascot {
            max-width: 320px;
            transform: scale(1.15);
          }

          .clean-hero .hero-mascot + .hero-mascot {
            transform: translate3d(-50%, -50%, 0) scale(1.15);
            -webkit-transform: translate3d(-50%, -50%, 0) scale(1.15);
          }
        }
      `}</style>
    </section>
  );
}
