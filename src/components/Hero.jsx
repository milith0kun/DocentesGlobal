import { useRef, useEffect } from 'react';

export default function Hero({ onStartWizard }) {
  const heroRef = useRef(null);
  const primaryVideoRef = useRef(null);
  const secondaryVideoRef = useRef(null);

  useEffect(() => {
    const videos = [primaryVideoRef.current, secondaryVideoRef.current].filter(Boolean);
    if (videos.length < 2) return;

    const crossfadeSeconds = 0.85;
    const restartOffsetSeconds = 0.08;
    let activeIndex = 0;
    let isCrossfading = false;
    let frameId = 0;
    let transitionTimer = 0;

    const setActiveVideo = (nextIndex) => {
      videos.forEach((item, index) => {
        item.classList.toggle('is-active', index === nextIndex);
      });
    };

    const playVideo = async (video, startTime) => {
      if (Number.isFinite(startTime)) {
        video.currentTime = startTime;
      }

      try {
        await video.play();
      } catch {
        // Autoplay can be delayed by the browser until the media is ready.
      }
    };

    const completeCrossfade = () => {
      const previousIndex = activeIndex;
      activeIndex = activeIndex === 0 ? 1 : 0;
      videos[previousIndex].pause();
      videos[previousIndex].currentTime = 0;
      isCrossfading = false;
    };

    const startCrossfade = () => {
      if (isCrossfading) return;
      const activeVideo = videos[activeIndex];
      if (!activeVideo.duration) return;

      isCrossfading = true;
      const nextIndex = activeIndex === 0 ? 1 : 0;
      const nextVideo = videos[nextIndex];
      setActiveVideo(nextIndex);
      playVideo(nextVideo, restartOffsetSeconds);
      transitionTimer = window.setTimeout(completeCrossfade, crossfadeSeconds * 1000);
    };

    const tick = () => {
      const activeVideo = videos[activeIndex];
      if (
        !isCrossfading &&
        activeVideo.duration &&
        activeVideo.currentTime >= activeVideo.duration - crossfadeSeconds
      ) {
        startCrossfade();
      }

      frameId = requestAnimationFrame(checkLoop);
    };

    const checkLoop = () => {
      tick();
    };

    const start = () => {
      videos.forEach((item) => {
        item.loop = false;
      });
      setActiveVideo(0);
      playVideo(videos[0], restartOffsetSeconds);
      frameId = requestAnimationFrame(checkLoop);
    };

    start();

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(transitionTimer);
    };
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

            <h1 className="hero-title">
              Manual Digital
              <br />
              <span className="hero-title-accent">Docente de Excelencia</span>
            </h1>

            <p className="hero-subtitle">
              Guía oficial de estándares metodológicos, de imagen y calidad para el ecosistema educativo de CIIP
              Latam, Geomina y Biomedic.
            </p>

            <button type="button" onClick={onStartWizard} className="hero-cta">
              <span>Comenzar Manual</span>
            </button>
          </div>

          {/* Video a la derecha sin marco ni animaciones de CSS */}
          <div className="hero-visual" aria-hidden="true">
            <video 
              ref={primaryVideoRef}
              src="/videos/hero-docente-alpha.webm" 
              className="hero-mascot is-active"
              autoPlay 
              muted 
              playsInline 
              preload="auto"
              disableRemotePlayback
            />
            <video 
              ref={secondaryVideoRef}
              src="/videos/hero-docente-alpha.webm" 
              className="hero-mascot"
              muted 
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
            radial-gradient(80% 60% at 18% 8%, rgba(56, 189, 248, 0.08) 0%, rgba(56, 189, 248, 0) 58%),
            radial-gradient(54% 44% at 88% 82%, rgba(14, 165, 233, 0.06) 0%, rgba(14, 165, 233, 0) 72%);
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
            linear-gradient(to right, rgba(14, 165, 233, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.08) 1px, transparent 1px);
          mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse at 50% 50%, black 50%, transparent 80%);
        }

        .hero-grid-interactive {
          background-image: 
            linear-gradient(to right, rgba(14, 165, 233, 0.45) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 165, 233, 0.45) 1px, transparent 1px);
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
          padding: 0.38rem 0.72rem;
          border-radius: 999px;
          border: 1px solid rgba(15, 47, 82, 0.14);
          background: rgba(255, 255, 255, 0.72);
          color: #0f2f52;
          font-size: 0.66rem;
          font-weight: 700;
          letter-spacing: 1.3px;
          margin-bottom: 0.88rem;
        }

        .clean-hero .hero-title {
          margin: 0 0 0.95rem;
          color: #0f172a;
          font-family: var(--font-heading);
          font-size: clamp(2.45rem, 3.2vw, 3.25rem);
          line-height: 1.04;
          letter-spacing: 0;
          font-weight: 760;
        }

        .clean-hero .hero-title-accent {
          color: #124a74;
        }

        .clean-hero .hero-subtitle {
          margin: 0 0 1.2rem;
          max-width: 560px;
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
          font-weight: 520;
        }

        .clean-hero .hero-badge,
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

        .clean-hero .hero-subtitle {
          animation-delay: 200ms;
        }

        .clean-hero .hero-cta {
          animation-delay: 270ms;
        }

        .clean-hero .hero-cta {
          min-height: 48px;
          min-width: clamp(210px, 23vw, 250px);
          border: 1px solid #0f3356;
          border-radius: 12px;
          background: #0f2f52;
          color: #f7fbff;
          font-family: var(--font-body);
          font-size: 0.92rem;
          font-weight: 700;
          letter-spacing: 0.1px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.58rem 1.05rem;
          box-shadow: 0 2px 8px rgba(15, 47, 82, 0.16);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
        }

        .clean-hero .hero-cta:hover {
          transform: translateY(-1px);
          background: #144068;
          border-color: #16466f;
        }

        .clean-hero .hero-cta:active {
          transform: translateY(0);
          background: #0d2844;
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
          transform: scale(1.35); /* Zoom to remove transparent padding */
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
          .clean-hero .hero-title,
          .clean-hero .hero-subtitle,
          .clean-hero .hero-cta {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }

        @media (max-width: 992px) {
          .clean-hero {
            padding: 6.35rem 0 2rem !important;
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
        }

        @media (max-width: 640px) {
          .clean-hero {
            padding: 6.15rem 0 1.55rem !important;
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
            overflow-wrap: break-word;
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

          .clean-hero .hero-visual {
            min-height: 168px;
            margin-top: 1rem;
          }

          .clean-hero .hero-mascot {
            max-width: 320px;
            transform: scale(1.15); /* Slightly less zoom on mobile to prevent overflow */
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
