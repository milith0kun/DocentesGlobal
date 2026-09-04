'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminTopbar from '@/components/admin/AdminTopbar';
import AdminStats from '@/components/admin/AdminStats';
import AdminControls from '@/components/admin/AdminControls';
import DocentesTable from '@/components/admin/DocentesTable';
import DocenteModal from '@/components/admin/DocenteModal';

export default function AdminDashboard() {
  const router = useRouter();
  const abortRef = useRef(null);

  const [docentes, setDocentes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [marca, setMarca] = useState('');
  const [stats, setStats] = useState({ total: 0, ciip: 0, geomina: 0, biomedic: 0, conformidad: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  // Debounce search 400ms sin re-disparar en el montaje inicial
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch((prev) => (prev !== searchInput ? searchInput : prev));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Fetch cuando cambian los parámetros
  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const q = new URLSearchParams({ page: String(page), limit: '25', search, marca });
        const res = await fetch(`/api/admin/docentes?${q}`, {
          credentials: 'include',
          signal: controller.signal,
        });
        if (res.status === 401) { router.push('/admin'); return; }
        const data = await res.json();
        if (!res.ok) { setError(data.error || 'Error al cargar datos.'); return; }
        setDocentes(data.docentes || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setStats(data.stats || { total: data.total || 0, ciip: 0, geomina: 0, biomedic: 0, conformidad: 0 });
      } catch (err) {
        if (err.name !== 'AbortError') setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [page, search, marca, router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin');
  }

  function exportCsv() {
    const q = new URLSearchParams({ format: 'csv', search, marca });
    window.location.assign(`/api/admin/docentes?${q}`);
  }

  function handleDocenteUpdated(updated) {
    setDocentes((current) => current.map((docente) => docente.id === updated.id ? updated : docente));
    setSelected(updated);
  }

  return (
    <div className="adm-shell">
      <div className="adm-shell-bg" aria-hidden="true">
        <div className="adm-grid-pattern" />
      </div>
      <AdminTopbar onLogout={handleLogout} />

      <main className="adm-main">
        <section className="adm-dashboard-heading">
          <div>
            <span className="adm-eyebrow">DIRECTORIO ACADÉMICO OFICIAL</span>
            <h1 className="adm-dashboard-title">
              Gestión de <span>Docentes</span>
            </h1>
            <p className="adm-dashboard-desc">
              Control centralizado de registros, conformidades metodológicas y cuentas de abono CGB.
            </p>
          </div>
          <div className="adm-sync-badge">
            <span className="adm-sync-dot" />
            <span>Datos sincronizados</span>
          </div>
        </section>

        <AdminStats stats={stats} />

        <AdminControls
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          marca={marca}
          onMarcaChange={(v) => { setMarca(v); setPage(1); }}
          onExportCsv={exportCsv}
          canExport={total > 0}
        />

        {error && <div className="adm-error-banner">{error}</div>}

        <DocentesTable
          docentes={docentes}
          loading={loading}
          total={total}
          totalPages={totalPages}
          page={page}
          onRowClick={setSelected}
          onPageChange={setPage}
        />
      </main>

      {selected && (
        <DocenteModal
          docente={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleDocenteUpdated}
        />
      )}
    </div>
  );
}
