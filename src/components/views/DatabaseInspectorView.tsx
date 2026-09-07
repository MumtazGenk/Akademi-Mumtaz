import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { SQL_SCHEMA_OVERVIEW, RAW_DATABASE_NAME, DATABASE_VERSION, DUMP_DATE } from '../../data/databaseData';
import supabaseSqlScript from '../../../supabase_sia_smkn2_magelang.sql?raw';
import {
  Database,
  Table as TableIcon,
  Code2,
  Key,
  Copy,
  Check,
  Search,
  Download,
  Info,
  Layers,
  Cloud,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const DatabaseInspectorView: React.FC = () => {
  const {
    guruList,
    jadwalList,
    jurusanList,
    kelasList,
    mapelList,
    nilaiList,
    siswaList,
    tahunAjaranList,
    isSupabaseConfigured,
    isSupabaseConnected,
    isLoadingSupabase,
    supabaseError,
    refreshFromSupabase,
  } = useDatabase();

  const [copiedSupabaseSQL, setCopiedSupabaseSQL] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<string>('siswa');
  const [copiedSQL, setCopiedSQL] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');

  const tableDataMap: Record<string, any[]> = {
    guru: guruList,
    jadwal: jadwalList,
    jurusan: jurusanList,
    kelas: kelasList,
    mata_pelajaran: mapelList,
    nilai: nilaiList,
    siswa: siswaList,
    tahun_ajaran: tahunAjaranList,
  };

  const currentSchema = SQL_SCHEMA_OVERVIEW.find((s) => s.table === selectedTable);
  const rawRows = tableDataMap[selectedTable] || [];

  const filteredRows = rawRows.filter((row) => {
    if (!tableSearch.trim()) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(tableSearch.toLowerCase())
    );
  });

  const generateTableSQL = () => {
    if (!currentSchema) return '';
    let sql = `-- Table structure for table \`${currentSchema.table}\`\n`;
    sql += `DROP TABLE IF EXISTS \`${currentSchema.table}\`;\n`;
    sql += `CREATE TABLE \`${currentSchema.table}\` (\n`;
    const colDefs = currentSchema.columns.map(
      (c) => `  \`${c.name}\` ${c.type} ${c.extra}`
    );
    sql += colDefs.join(',\n');
    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;
    sql += `-- Dumping data for table \`${currentSchema.table}\`\n`;
    sql += `INSERT INTO \`${currentSchema.table}\` VALUES\n`;

    const rowStrings = rawRows.map((r) => {
      const vals = Object.values(r).map((v) => {
        if (v === null) return 'NULL';
        if (typeof v === 'number') return v;
        return `'${String(v).replace(/'/g, "\\'")}'`;
      });
      return `(${vals.join(',')})`;
    });

    sql += rowStrings.join(',\n') + ';\n';
    return sql;
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(generateTableSQL());
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleCopySupabaseSQL = () => {
    navigator.clipboard.writeText(supabaseSqlScript);
    setCopiedSupabaseSQL(true);
    setTimeout(() => setCopiedSupabaseSQL(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Supabase Cloud Connection Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-500 text-white rounded-lg shadow-xs">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-zinc-900">
                  Integrasi Supabase Cloud
                </h3>
                {isSupabaseConnected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Terhubung (Live Sync)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    {isSupabaseConfigured ? 'Menghubungkan...' : 'Mode Lokal (Belum Terkoneksi)'}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-1 max-w-2xl">
                Proyek Supabase: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-900 font-semibold">mumtaz-skul</code> (<code>https://odsujbhqocwypyjfwwvx.supabase.co</code>). Supabase menggunakan mesin <strong>PostgreSQL</strong>, sehingga skrip MariaDB awal telah dikonversi menjadi skrip siap-jalan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopySupabaseSQL}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copiedSupabaseSQL ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSupabaseSQL ? 'Skrip SQL Tersalin!' : 'Salin SQL Supabase'}</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/odsujbhqocwypyjfwwvx/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 rounded-md flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <span>Buka SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </a>
            {isSupabaseConfigured && (
              <button
                onClick={() => refreshFromSupabase()}
                disabled={isLoadingSupabase}
                className="p-1.5 text-xs text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 rounded-md cursor-pointer disabled:opacity-50"
                title="Muat ulang data dari Supabase"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSupabase ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {supabaseError && (
          <div className="mt-3 text-xs bg-red-50 text-red-700 p-2.5 rounded border border-red-200 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <span>Koneksi Supabase: {supabaseError}</span>
          </div>
        )}

        {/* Quick Steps Guide */}
        <div className="mt-3 pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-zinc-600">
          <div className="bg-white/80 rounded p-2.5 border border-emerald-100">
            <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-[10px]">1</span>
              Jalankan Skrip di Supabase
            </div>
            <p className="text-[11px] text-zinc-500">
              Buka menu <strong>SQL Editor</strong> di dashboard Supabase, paste skrip SQL (klik tombol hijau di atas), lalu klik <strong>Run</strong>.
            </p>
          </div>
          <div className="bg-white/80 rounded p-2.5 border border-emerald-100">
            <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-[10px]">2</span>
              Ambil API Key (Anon Key)
            </div>
            <p className="text-[11px] text-zinc-500">
              Klik menu <strong>Project Settings &gt; API</strong> atau tombol <strong>Connect</strong> di dashboard Supabase untuk menyalin <code>anon public</code> key.
            </p>
          </div>
          <div className="bg-white/80 rounded p-2.5 border border-emerald-100">
            <div className="font-semibold text-zinc-900 mb-1 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white inline-flex items-center justify-center text-[10px]">3</span>
              Isi ke File .env
            </div>
            <p className="text-[11px] text-zinc-500">
              Buka file <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded">.env</code> di project ini dan tempelkan key ke <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        </div>
      </div>

      {/* DB Overview Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-zinc-700" />
              <h2 className="text-lg font-bold text-zinc-900 font-mono">
                {RAW_DATABASE_NAME}
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                {DATABASE_VERSION}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Inspeksi relasi tabel, tipe data MariaDB, foreign key constraint, dan isi record dari dump {DUMP_DATE}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySQL}
              className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSQL ? 'SQL Tersalin' : 'Salin DDL & DML Tabel'}</span>
            </button>
          </div>
        </div>

        {/* Table Selector Pills */}
        <div className="pt-4 flex flex-wrap gap-1.5">
          {SQL_SCHEMA_OVERVIEW.map((s) => {
            const isSelected = selectedTable === s.table;
            const count = tableDataMap[s.table]?.length || s.count;

            return (
              <button
                key={s.table}
                onClick={() => {
                  setSelectedTable(s.table);
                  setTableSearch('');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-bold shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>{s.table}</span>
                <span
                  className={`text-[10px] px-1 py-0.1 rounded ${
                    isSelected ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Schema Specification */}
      {currentSchema && (
        <div className="bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                  Skema Kolom Tabel:
                </span>
                <span className="font-mono text-base font-bold text-zinc-950">`{currentSchema.table}`</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{currentSchema.description}</p>
            </div>
            <div className="font-mono text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded">
              Total {rawRows.length} Records
            </div>
          </div>

          <div className="mt-4 border border-zinc-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-100 text-zinc-700 font-mono text-[11px] border-b border-zinc-200">
                  <th className="py-2.5 px-3">Field</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Key</th>
                  <th className="py-2.5 px-3">Extra / Constraint</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 font-mono text-xs">
                {currentSchema.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-zinc-50">
                    <td className="py-2 px-3 font-bold text-zinc-900">{col.name}</td>
                    <td className="py-2 px-3 text-zinc-700">{col.type}</td>
                    <td className="py-2 px-3">
                      {col.key === 'PRI' && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-white font-bold text-[10px]">
                          PRI
                        </span>
                      )}
                      {col.key === 'UNI' && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-700 text-white font-bold text-[10px]">
                          UNI
                        </span>
                      )}
                      {col.key === 'MUL' && (
                        <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-bold text-[10px]">
                          MUL
                        </span>
                      )}
                      {!col.key && <span className="text-zinc-400">—</span>}
                    </td>
                    <td className="py-2 px-3 text-zinc-600 text-[11px]">{col.extra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Raw Data Rows with search */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="font-semibold text-zinc-900 flex items-center gap-2">
            <span>Isi Baris Data (`{selectedTable}`)</span>
            <span className="font-mono text-[11px] text-zinc-500 font-normal">
              ({filteredRows.length} baris ditampilkan)
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={`Filter data di tabel ${selectedTable}...`}
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-zinc-200 rounded text-xs text-zinc-800 focus:outline-hidden focus:border-zinc-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="bg-zinc-900 text-white text-[11px] uppercase tracking-wider sticky top-0 z-10">
                {currentSchema?.columns.map((c) => (
                  <th key={c.name} className="py-2.5 px-3 whitespace-nowrap">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {filteredRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentSchema?.columns.length || 5}
                    className="py-10 text-center text-zinc-400 font-sans"
                  >
                    Tidak ada baris data yang cocok.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    {currentSchema?.columns.map((c) => (
                      <td key={c.name} className="py-2 px-3 whitespace-nowrap text-zinc-800">
                        {row[c.name] !== null && row[c.name] !== undefined
                          ? String(row[c.name])
                          : <span className="text-zinc-400 italic">NULL</span>}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Script View Box */}
      <div className="bg-zinc-950 text-zinc-200 rounded-lg p-5 border border-zinc-800 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Code2 className="w-4 h-4 text-zinc-300" />
            <span className="font-semibold text-zinc-200">MariaDB Export DDL/DML Statement</span>
          </div>
          <button
            onClick={handleCopySQL}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            {copiedSQL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedSQL ? 'Disalin' : 'Salin SQL'}
          </button>
        </div>

        <pre className="overflow-x-auto text-[11px] text-zinc-300 leading-relaxed max-h-64 overflow-y-auto">
          {generateTableSQL()}
        </pre>
      </div>
    </div>
  );
};
