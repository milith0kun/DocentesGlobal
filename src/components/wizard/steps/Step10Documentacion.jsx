'use client';

export default function Step10Documentacion({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="wz-fade">
      <h2 className="wz-title">Documentación</h2>
      <p className="wz-sub" style={{ marginBottom: '2rem' }}>
        Adjunta tu CV actualizado y una fotografía profesional.
      </p>

      <div
        className="wz-upload-section"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}
      >
        {/* CV */}
        <div>
          <div
            className="wz-upload-zone"
            onClick={() => !formData.cvFile && document.getElementById('cv-upload').click()}
            style={{
              border: formData.cvFile ? '1px solid #e2e8f0' : '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: formData.cvFile ? '1rem' : '1.25rem 1rem',
              textAlign: 'center',
              cursor: formData.cvFile ? 'default' : 'pointer',
              background: formData.cvFile ? '#ffffff' : '#f8fafc',
              boxShadow: formData.cvFile ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <input
              id="cv-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={(e) => setFormData({ ...formData, cvFile: e.target.files[0] })}
            />

            {formData.cvFile ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0', fontWeight: 800 }}>Curriculum Vitae</h4>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, cvFile: null }); }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '1.4rem', lineHeight: 1 }}
                    title="Eliminar archivo"
                  >×</button>
                </div>
                <div style={{ width: '100%', height: '220px', background: 'transparent', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formData.cvFile.type === 'application/pdf' ? (
                    <iframe
                      src={URL.createObjectURL(formData.cvFile)}
                      style={{ width: '100%', height: '100%', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      title="CV Preview"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span style={{ fontSize: '0.85rem' }}>Documento DOC/DOCX cargado</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="wz-upload-svg" style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Curriculum Vitae</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0', fontWeight: 500 }}>PDF o DOC • Máx. 10 MB</p>
              </>
            )}
          </div>

          {formData.cvFile && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', textAlign: 'center' }}>{formData.cvFile.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{(formData.cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>

        {/* FOTO */}
        <div>
          <div
            className="wz-upload-zone"
            onClick={() => !formData.fotoFile && document.getElementById('foto-upload').click()}
            style={{
              border: formData.fotoFile ? '1px solid #e2e8f0' : '2px dashed #cbd5e1',
              borderRadius: '16px',
              padding: formData.fotoFile ? '1rem' : '1.25rem 1rem',
              textAlign: 'center',
              cursor: formData.fotoFile ? 'default' : 'pointer',
              background: formData.fotoFile ? '#ffffff' : '#f8fafc',
              boxShadow: formData.fotoFile ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <input
              id="foto-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => setFormData({ ...formData, fotoFile: e.target.files[0] })}
            />

            {formData.fotoFile ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', color: '#0f172a', margin: '0', fontWeight: 800 }}>Fotografía Profesional</h4>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, fotoFile: null }); }}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold', padding: '0.2rem 0.5rem', fontSize: '1.4rem', lineHeight: 1 }}
                    title="Eliminar foto"
                  >×</button>
                </div>
                <div style={{ width: '100%', height: '220px', background: 'transparent', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={URL.createObjectURL(formData.fotoFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
              </div>
            ) : (
              <>
                <div className="wz-upload-svg" style={{ color: '#64748b', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#0f172a', margin: '0 0 0.25rem 0', fontWeight: 800 }}>Fotografía Profesional</h4>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0', fontWeight: 500 }}>JPG o PNG • Máx. 10 MB</p>
              </>
            )}
          </div>

          {formData.fotoFile && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', wordBreak: 'break-all', textAlign: 'center' }}>{formData.fotoFile.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.1rem' }}>{(formData.fotoFile.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Panel de políticas */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'rgba(56, 189, 248, 0.04)',
        border: '1px solid rgba(56, 189, 248, 0.15)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}>
        <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--bc)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Políticas de Uso y Requisitos
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.78rem', color: '#475569', lineHeight: '1.45', textAlign: 'left' }}>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Requisitos del CV:</strong>
            Debe ser su CV actualizado (preferiblemente en formato PDF) y detallar su formación, especialización técnica e historial docente pertinente.
          </div>
          <div>
            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.2rem' }}>Política de la Fotografía:</strong>
            La fotografía será utilizada para sus accesos, portales institucionales y aulas virtuales. Debe ser formal (tipo pasaporte/profesional), con fondo neutro y buena iluminación. Evitar selfies o imágenes casuales.
          </div>
        </div>
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={!formData.cvFile || !formData.fotoFile} className="wz-btn-main">Siguiente</button>
      </div>
    </div>
  );
}
