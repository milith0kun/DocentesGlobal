import { useState } from 'react';

export default function Conformidad() {
  const [copied, setCopied] = useState(false);
  const mensajeText = 'Confirmo que acepto el Manual Operativo del Docente. Comprendo la metodología práctica, los horarios de entrega innegociables: Sábado y Domingo 1:00 PM y Lunes 9:00 AM, y la Política de Asistencia y Compromiso Académico. Autorizo el uso de mi firma digital para certificados.';
  const whatsappUrl = `https://wa.me/51925084564?text=${encodeURIComponent(mensajeText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mensajeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="conformidad-section">
      <div className="container">
        <div className="conformidad-card">
          <h2 className="conformidad-title">Declaración de Conformidad</h2>
          <p className="conformidad-desc">
            Lee detenidamente el texto de confirmación oficial. Puedes copiar el texto para tus registros o enviarlo directamente a través del enlace de WhatsApp para completar tu proceso académico de alta.
          </p>

          <div className="mensaje-box">
            <p className="mensaje-content">"{mensajeText}"</p>
            <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopy} title="Copiar al portapapeles">
              {copied ? '¡Copiado!' : 'Copiar Texto'}
            </button>
          </div>

          <div className="action-row">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="whatsapp-btn-large"
            >
              <span className="whatsapp-icon-bg">
                <svg className="whatsapp-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </span>
              <span className="btn-label-text">Enviar Confirmación por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .conformidad-section {
          padding: 6rem 0 3rem;
        }

        .conformidad-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid var(--card-border);
          border-radius: 36px;
          padding: 4.5rem 3.5rem;
          box-shadow: var(--shadow-md);
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
          backdrop-filter: blur(12px);
        }

        .conformidad-title {
          font-size: 2.25rem;
          font-weight: 850;
          margin-bottom: 1rem;
        }

        .conformidad-desc {
          font-size: 1rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }

        .mensaje-box {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.04) 0%, rgba(6, 182, 212, 0.03) 100%);
          border: 2px dashed rgba(14, 165, 233, 0.2);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          margin-bottom: 3rem;
          position: relative;
          transition: all var(--transition-normal);
        }

        .mensaje-box:hover {
          border-color: rgba(14, 165, 233, 0.35);
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%);
        }

        .mensaje-content {
          font-size: 1rem;
          font-weight: 500;
          color: var(--primary);
          line-height: 1.7;
          font-style: italic;
        }

        .copy-btn {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          background: #fff;
          border: 1px solid rgba(14, 165, 233, 0.25);
          color: var(--primary);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-bounce);
        }

        .copy-btn:hover {
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          color: #fff;
          border-color: transparent;
          transform: translateX(-50%) translateY(-3px);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.25);
        }

        .copy-btn.copied {
          background: var(--success);
          color: #fff;
          border-color: var(--success);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
        }

        .action-row {
          display: flex;
          justify-content: center;
        }

        .whatsapp-btn-large {
          background: linear-gradient(135deg, #25d366 0%, #1da855 50%, #128c7e 100%);
          color: #fff;
          border: none;
          font-family: var(--font-body);
          font-weight: 800;
          font-size: 1.1rem;
          padding: 0.85rem 2.5rem 0.85rem 0.85rem;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 10px 30px -5px rgba(37, 211, 102, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          transition: all var(--transition-bounce);
          position: relative;
          overflow: hidden;
        }

        .whatsapp-btn-large::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transition: left 0.5s ease;
        }

        .whatsapp-btn-large:hover::before {
          left: 100%;
        }

        .whatsapp-btn-large:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -8px rgba(37, 211, 102, 0.5);
        }

        .whatsapp-btn-large:active {
          transform: translateY(-1px);
        }

        .whatsapp-icon-bg {
          width: 3rem;
          height: 3rem;
          background: rgba(255, 255, 255, 0.95);
          color: #25d366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .whatsapp-svg-icon {
          width: 1.75rem;
          height: 1.75rem;
        }

        .btn-label-text {
          letter-spacing: -0.2px;
        }

        @media (max-width: 768px) {
          .conformidad-card {
            padding: 2.5rem 1.5rem;
          }

          .whatsapp-btn-large {
            font-size: 0.95rem;
            padding: 0.65rem 1.5rem 0.65rem 0.65rem;
          }

          .whatsapp-icon-bg {
            width: 2.5rem;
            height: 2.5rem;
          }

          .whatsapp-svg-icon {
            width: 1.4rem;
            height: 1.4rem;
          }
        }
      `}</style>
    </section>
  );
}
