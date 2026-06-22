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
  const [source, setSource] = useState('mongodb');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  // Debounce search 400ms
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
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
        const q = new URLSearchParams({ source, page: String(page), limit: '25', search, marca });
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
      } catch (err) {
        if (err.name !== 'AbortError') setError('Error de conexión.');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [source, page, search, marca, router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin');
  }

  function exportCsv() {
    if (!docentes.length) return;
    const cols = ['codigo', 'nombre', 'documento', 'email', 'telefono', 'fechaNacimiento',
      'profesion', 'institucion', 'metodoPago', 'numeroCuenta', 'conformidadCompleta', 'createdAt', 'estado'];
    const csv = [
      cols.join(','),
      ...docentes.map((d) =>
        cols.map((k) => `"${String(d[k] ?? '').replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })),
      download: `docentes_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="adm-shell">
      <AdminTopbar onLogout={handleLogout} />

      <main className="adm-main">
        <AdminStats total={total} docentes={docentes} source={source} />

        <AdminControls
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          marca={marca}
          onMarcaChange={(v) => { setMarca(v); setPage(1); }}
          source={source}
          onSourceChange={(v) => { setSource(v); setPage(1); }}
          onExportCsv={exportCsv}
          canExport={docentes.length > 0}
        />

        {error && <div className="adm-error-banner">{error}</div>}

        <DocentesTable
          docentes={docentes}
          loading={loading}
          total={total}
          totalPages={totalPages}
          page={page}
          source={source}
          onRowClick={setSelected}
          onPageChange={setPage}
        />
      </main>

      {selected && <DocenteModal docente={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
