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
        <div className="adm-login-card" style={{ minHeight: '360px', opacity: 0 }} suppressHydrationWarning />
      </div>
    );
  }

  return (
    <div className="adm-login-shell" suppressHydrationWarning>
      <div className="adm-login-card" suppressHydrationWarning>
        <div className="adm-login-header">
          <div className="adm-login-logo">
            <img src={cgbLogo} alt="CGB Academy" className="main-logo" />
            <div className="adm-login-brand-logos">
              <img src={ciipLogo} alt="CIIP" style={{ height: '22px' }} />
              <div className="adm-login-sep" />
              <img src={geominaLogo} alt="Geomina" style={{ height: '15px' }} />
              <div className="adm-login-sep" />
              <img src={biomedicLogo} alt="Biomedic" style={{ height: '18px' }} />
            </div>
          </div>
          <h1 className="adm-login-title">Panel Administrativo</h1>
          <p className="adm-login-sub">CGB Academy · Gestión de Docentes</p>
        </div>

        <form className="adm-login-form" onSubmit={handleSubmit} noValidate>
          <div className="adm-field">
            <label htmlFor="adm-username" className="adm-label">Usuario</label>
            <input
              id="adm-username"
              type="text"
              className="adm-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />
          </div>

          <div className="adm-field">
            <label htmlFor="adm-password" className="adm-label">Contraseña</label>
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
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
