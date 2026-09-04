'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const cgbLogo = '/assets/cgb-logo-clean.png';
const ciipLogo = '/assets/logociip.png';
const geominaLogo = '/assets/logogeomina.png';
const biomedicLogo = '/assets/logobiomedic.png';

export default function AdminLogin() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('cgbacademy');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión.');
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="adm-login-shell" suppressHydrationWarning>
        <div className="adm-login-card" style={{ minHeight: '440px', opacity: 0 }} suppressHydrationWarning />
      </div>
    );
  }

  return (
    <div className="adm-login-shell" suppressHydrationWarning>
      <div className="adm-login-bg" aria-hidden="true">
        <div className="adm-grid-pattern" />
      </div>

      <div className="adm-login-card" suppressHydrationWarning>
        <div className="adm-login-header">
          <span className="adm-login-badge">ACCESO ADMINISTRATIVO 2026</span>

          <div className="adm-login-cgb-wrap">
            <img src={cgbLogo} alt="CGB Academy" className="adm-login-cgb-img" />
          </div>

          <div className="adm-login-ecosystem">
            <span className="adm-login-eco-line" />
            <span className="adm-login-eco-label">ECOSISTEMA ACADÉMICO</span>
            <span className="adm-login-eco-line" />
          </div>

          <div className="adm-login-brand-grid">
            <div className="adm-login-brand-box">
              <img src={ciipLogo} alt="CIIP Latam" />
            </div>
            <div className="adm-login-brand-box">
              <img src={geominaLogo} alt="Geomina" />
            </div>
            <div className="adm-login-brand-box">
              <img src={biomedicLogo} alt="Biomedic" />
            </div>
          </div>

          <h1 className="adm-login-title">
            Panel de <span>Gestión Docente</span>
          </h1>
          <p className="adm-login-sub">Directorio centralizado de docentes, conformidades y contratos</p>
        </div>

        <form className="adm-login-form" onSubmit={handleSubmit} noValidate>
          <div className="adm-field">
            <label htmlFor="adm-username" className="adm-label">Usuario administrativo</label>
            <input
              id="adm-username"
              type="text"
              className="adm-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
              placeholder="cgbacademy"
            />
          </div>

          <div className="adm-field">
            <label htmlFor="adm-password" className="adm-label">Contraseña de acceso</label>
            <input
              id="adm-password"
              type="password"
              className="adm-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="adm-error">{error}</p>}

          <button type="submit" className="adm-login-btn" disabled={loading || !password}>
            {loading ? 'Verificando credenciales…' : 'Ingresar al Directorio'}
          </button>
        </form>
      </div>
    </div>
  );
}
