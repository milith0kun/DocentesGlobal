'use client';

export default function Step11Perfil({ formData, setFormData, onNext, onBack, isSubmitting }) {
  const canContinue =
    formData.profesion.trim() &&
    formData.softwares.trim() &&
    formData.cursoSonado.trim() &&
    formData.mejoraAdmin.trim();

  return (
    <div className="wz-fade">
      <h2 className="wz-title">Perfil Profesional</h2>
      <p className="wz-sub">Queremos conocerte mejor. Tu opinión nos ayuda a crecer juntos.</p>

      <div className="wz-field" style={{ marginBottom: '1.25rem' }}>
        <span className="wz-label">Profesión o especialidad principal</span>
        <input
          type="text"
          placeholder="Ej. Ingeniero Civil, Administrador, Médico, etc."
          value={formData.profesion}
          onChange={(e) => setFormData({ ...formData, profesion: e.target.value })}
          className="wz-input"
        />
      </div>

      <div className="wz-field" style={{ marginBottom: '1.25rem' }}>
        <span className="wz-label">Softwares especializados que domina</span>
        <textarea
          placeholder="Ej. AutoCAD, SAP2000, ETABS, Civil 3D, ArcGIS..."
          value={formData.softwares}
          onChange={(e) => setFormData({ ...formData, softwares: e.target.value })}
          className="wz-textarea"
          rows={3}
        />
      </div>

      <div className="wz-field" style={{ marginBottom: '1.25rem' }}>
        <span className="wz-label">¿Qué curso o especialización le gustaría dictar como reto profesional?</span>
        <textarea
          placeholder="Cuéntenos el tema y por qué le apasionaría desarrollarlo..."
          value={formData.cursoSonado}
          onChange={(e) => setFormData({ ...formData, cursoSonado: e.target.value })}
          className="wz-textarea"
          rows={3}
        />
      </div>

      <div className="wz-field" style={{ marginBottom: '1.25rem' }}>
        <span className="wz-label">¿Qué proceso académico o administrativo optimizaría?</span>
        <textarea
          placeholder="Desde su perspectiva como docente, ¿qué mejoraría?"
          value={formData.mejoraAdmin}
          onChange={(e) => setFormData({ ...formData, mejoraAdmin: e.target.value })}
          className="wz-textarea"
          rows={3}
        />
      </div>

      <div className="wz-field">
        <span className="wz-label">
          Comentarios adicionales{' '}
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>(opcional)</span>
        </span>
        <textarea
          placeholder="¿Alguna observación, recomendación o información adicional?"
          value={formData.comentarios}
          onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
          className="wz-textarea"
          rows={2}
        />
      </div>

      <div className="wz-nav">
        <button onClick={onBack} className="wz-btn-ghost">Atrás</button>
        <button onClick={onNext} disabled={isSubmitting || !canContinue} className="wz-btn-main">
          {isSubmitting ? 'Guardando registro...' : 'Finalizar registro'}
        </button>
      </div>
    </div>
  );
}
