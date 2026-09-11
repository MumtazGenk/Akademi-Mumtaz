import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { NilaiEnriched, Nilai } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import {
  Award,
  Filter,
  ArrowUpDown,
  Download,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Search,
  BookOpen,
  TrendingUp,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

export const NilaiView: React.FC = () => {
  const {
    enrichedNilai,
    mapelList,
    guruList,
    kelasList,
    siswaList,
    tahunAjaranList,
    searchQuery,
    updateNilai,
    addNilai,
    deleteNilai,
    currentUser,
  } = useDatabase();

  const isAdmin = currentUser?.role === 'admin';

  const [selectedMapel, setSelectedMapel] = useState<string>('Semua');
  const [selectedGuru, setSelectedGuru] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [sortField, setSortField] = useState<'nilai_akhir' | 'nilai_tugas' | 'nilai_uts' | 'nilai_uas' | 'nis'>('nilai_akhir');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Add state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newNis, setNewNis] = useState<string>(siswaList[0]?.nis || '');
  const [newMapelId, setNewMapelId] = useState<number>(mapelList[0]?.id_mapel || 1);
  const [newGuruId, setNewGuruId] = useState<number>(guruList[0]?.id_guru || 1);
  const [newTahunId, setNewTahunId] = useState<number>(tahunAjaranList[0]?.id_tahun_ajaran || 1);
  const [newTugas, setNewTugas] = useState<number>(80);
  const [newUTS, setNewUTS] = useState<number>(80);
  const [newUAS, setNewUAS] = useState<number>(80);

  // Editing state
  const [editingGrade, setEditingGrade] = useState<NilaiEnriched | null>(null);
  const [editTugas, setEditTugas] = useState<number>(0);
  const [editUTS, setEditUTS] = useState<number>(0);
  const [editUAS, setEditUAS] = useState<number>(0);

  // Deleting state
  const [deletingGrade, setDeletingGrade] = useState<NilaiEnriched | null>(null);

  const KKM = 75.0;

  const handleStartEdit = (grade: NilaiEnriched) => {
    setEditingGrade(grade);
    setEditTugas(grade.nilai_tugas);
    setEditUTS(grade.nilai_uts);
    setEditUAS(grade.nilai_uas);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;
    updateNilai(editingGrade.id_nilai, {
      nilai_tugas: Number(editTugas),
      nilai_uts: Number(editUTS),
      nilai_uas: Number(editUAS),
    });
    setEditingGrade(null);
  };

  const handleCreateNilai = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNis) return;
    addNilai({
      nis: newNis,
      id_mapel: Number(newMapelId),
      id_guru: Number(newGuruId),
      id_tahun_ajaran: Number(newTahunId),
      nilai_tugas: Number(newTugas),
      nilai_uts: Number(newUTS),
      nilai_uas: Number(newUAS),
    });
    setShowAddModal(false);
  };

  const handleDeleteNilai = () => {
    if (!deletingGrade) return;
    deleteNilai(deletingGrade.id_nilai);
    setDeletingGrade(null);
  };

  const filteredNilai = useMemo(() => {
    let result = enrichedNilai.filter((item) => {
      if (selectedMapel !== 'Semua' && String(item.id_mapel) !== selectedMapel) return false;
      if (selectedGuru !== 'Semua' && String(item.id_guru) !== selectedGuru) return false;
      if (selectedKelas !== 'Semua' && String(item.kelas?.id_kelas) !== selectedKelas) return false;

      if (selectedStatus === 'Tuntas' && item.nilai_akhir < KKM) return false;
      if (selectedStatus === 'Remidi' && item.nilai_akhir >= KKM) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSiswa = item.siswa?.nama_siswa.toLowerCase().includes(q) || item.nis.includes(q);
        const matchMapel = item.mapel?.nama_mapel.toLowerCase().includes(q);
        const matchGuru = item.guru?.nama_guru.toLowerCase().includes(q);
        if (!matchSiswa && !matchMapel && !matchGuru) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      let valA: number | string = a[sortField];
      let valB: number | string = b[sortField];
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(String(valB)) : String(valB).localeCompare(valA);
      }
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
  }, [
    enrichedNilai,
    selectedMapel,
    selectedGuru,
    selectedKelas,
    selectedStatus,
    searchQuery,
    sortField,
    sortAsc,
  ]);

  // Calculations for current filtered set
  const stats = useMemo(() => {
    if (filteredNilai.length === 0) return { avg: 0, max: 0, min: 0, passCount: 0, passPercent: 0 };
    const values = filteredNilai.map((n) => n.nilai_akhir);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = Number((sum / values.length).toFixed(2));
    const max = Math.max(...values);
    const min = Math.min(...values);
    const passCount = values.filter((v) => v >= KKM).length;
    const passPercent = Number(((passCount / values.length) * 100).toFixed(1));
    return { avg, max, min, passCount, passPercent };
  }, [filteredNilai]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getPredikat = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C';
    return 'D';
  };

  const exportCSV = () => {
    const headers = ['ID', 'NIS', 'Nama Siswa', 'Kelas', 'Mata Pelajaran', 'Guru Pengampu', 'Tugas', 'UTS', 'UAS', 'Nilai Akhir', 'Predikat', 'Status'];
    const rows = filteredNilai.map((n) => [
      n.id_nilai,
      n.nis,
      `"${n.siswa?.nama_siswa || ''}"`,
      `"${n.kelas?.nama_kelas || ''}"`,
      `"${n.mapel?.nama_mapel || ''}"`,
      `"${n.guru?.nama_guru || ''}"`,
      n.nilai_tugas,
      n.nilai_uts,
      n.nilai_uas,
      n.nilai_akhir,
      getPredikat(n.nilai_akhir),
      n.nilai_akhir >= KKM ? 'Tuntas' : 'Remidi',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_smkn2_magelang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Formula Explainer */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-zinc-700" />
              Rekapitulasi Penilaian Hasil Belajar Siswa
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Buku nilai terpadu semester ganjil · Data tabel `nilai` pada basis data
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setNewNis(siswaList[0]?.nis || '');
                  setNewMapelId(mapelList[0]?.id_mapel || 1);
                  setNewGuruId(guruList[0]?.id_guru || 1);
                  setNewTahunId(tahunAjaranList[0]?.id_tahun_ajaran || 1);
                  setNewTugas(80);
                  setNewUTS(80);
                  setNewUAS(80);
                  setShowAddModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Nilai Siswa</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-zinc-500" />
              <span>Ekspor CSV</span>
            </button>
          </div>
        </div>

        {/* Formula calculation badge */}
        <div className="mt-4 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-zinc-700">
            <Calculator className="w-4 h-4 text-zinc-500" />
            <span>
              <strong>Formula Pembobotan Nilai Akhir:</strong>{' '}
              <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[11px] text-zinc-900">
                (Tugas × 30%) + (UTS × 30%) + (UAS × 40%)
              </code>
            </span>
          </div>
          <div className="text-zinc-500 font-mono text-[11px]">
            KKM Sekolah: <span className="font-bold text-zinc-900">75.00</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-zinc-500 font-medium mb-1">Mata Pelajaran</label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Mata Pelajaran</option>
              {mapelList.map((m) => (
                <option key={m.id_mapel} value={m.id_mapel}>
                  {m.kode_mapel} - {m.nama_mapel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Guru Pengampu</label>
            <select
              value={selectedGuru}
              onChange={(e) => setSelectedGuru(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Guru</option>
              {guruList.map((g) => (
                <option key={g.id_guru} value={g.id_guru}>
                  {g.nama_guru}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Rombel (Kelas)</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Status Kelulusan</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Tuntas">Tuntas (≥ 75.00)</option>
              <option value="Remidi">Perlu Remidi (&lt; 75.00)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Numerical Stats summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white border border-zinc-200 p-3 rounded-lg">
          <div className="text-[11px] text-zinc-500">Total Baris Nilai</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">{filteredNilai.length}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-lg">
          <div className="text-[11px] text-zinc-500">Rata-Rata Nilai</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">{stats.avg}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-lg">
          <div className="text-[11px] text-zinc-500">Nilai Tertinggi (Max)</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">{stats.max}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-lg">
          <div className="text-[11px] text-zinc-500">Nilai Terendah (Min)</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">{stats.min}</div>
        </div>

        <div className="bg-white border border-zinc-200 p-3 rounded-lg col-span-2 md:col-span-1">
          <div className="text-[11px] text-zinc-500">Tingkat Ketuntasan</div>
          <div className="text-xl font-bold font-mono text-zinc-900 mt-0.5">
            {stats.passPercent}% ({stats.passCount})
          </div>
        </div>
      </div>

      {/* Gradebook Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">
                  <button onClick={() => toggleSort('nis')} className="flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                    <span>NIS & Siswa</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Tenaga Pengajar</th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => toggleSort('nilai_tugas')} className="inline-flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                    <span>Tugas (30%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => toggleSort('nilai_uts')} className="inline-flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                    <span>UTS (30%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-right">
                  <button onClick={() => toggleSort('nilai_uas')} className="inline-flex items-center gap-1 hover:text-zinc-300 cursor-pointer">
                    <span>UAS (40%)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right">
                  <button onClick={() => toggleSort('nilai_akhir')} className="inline-flex items-center gap-1 hover:text-zinc-300 cursor-pointer font-bold">
                    <span>Nilai Akhir</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-3 text-center">Predikat</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredNilai.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-zinc-400">
                    Tidak ada catatan penilaian yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredNilai.map((item) => {
                  const isTuntas = item.nilai_akhir >= KKM;
                  const predikat = getPredikat(item.nilai_akhir);

                  return (
                    <tr key={item.id_nilai} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900">{item.siswa?.nama_siswa}</div>
                        <div className="text-[11px] font-mono text-zinc-400">NIS: {item.nis}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-zinc-800">
                        {item.kelas?.nama_kelas}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900">{item.mapel?.nama_mapel}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{item.mapel?.kode_mapel}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-700">
                        {item.guru?.nama_guru}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-800">
                        {item.nilai_tugas.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-800">
                        {item.nilai_uts.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-zinc-800">
                        {item.nilai_uas.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950 text-sm">
                        {item.nilai_akhir.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800">
                          {predikat}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {isTuntas ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-800 font-medium bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                            <CheckCircle2 className="w-3 h-3 text-zinc-900" />
                            Tuntas
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700 font-medium bg-zinc-200/60 px-2 py-0.5 rounded border border-zinc-300">
                            <AlertCircle className="w-3 h-3 text-zinc-600" />
                            Remidi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-950 rounded hover:bg-zinc-100 transition-colors cursor-pointer"
                            title="Perbarui Nilai"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => setDeletingGrade(item)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus Nilai"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Grade Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Entri Nilai Siswa Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateNilai} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Pilih Siswa</label>
                <select
                  value={newNis}
                  onChange={(e) => setNewNis(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                >
                  {siswaList.map((s) => (
                    <option key={s.nis} value={s.nis}>
                      {s.nama_siswa} (NIS: {s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Mata Pelajaran</label>
                <select
                  value={newMapelId}
                  onChange={(e) => setNewMapelId(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                >
                  {mapelList.map((m) => (
                    <option key={m.id_mapel} value={m.id_mapel}>
                      {m.nama_mapel} ({m.kode_mapel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Guru Pengampu</label>
                  <select
                    value={newGuruId}
                    onChange={(e) => setNewGuruId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {guruList.map((g) => (
                      <option key={g.id_guru} value={g.id_guru}>
                        {g.nama_guru}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Tahun Ajaran</label>
                  <select
                    value={newTahunId}
                    onChange={(e) => setNewTahunId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {tahunAjaranList.map((t) => (
                      <option key={t.id_tahun_ajaran} value={t.id_tahun_ajaran}>
                        {t.tahun_ajaran} ({t.semester})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai Tugas (30%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={newTugas}
                    onChange={(e) => setNewTugas(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai UTS (30%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={newUTS}
                    onChange={(e) => setNewUTS(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai UAS (40%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={newUAS}
                    onChange={(e) => setNewUAS(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Instant calculation preview */}
              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-600 font-medium">Estimasi Nilai Akhir:</span>
                <span className="font-mono font-bold text-sm text-zinc-950">
                  {((newTugas * 0.3) + (newUTS * 0.3) + (newUAS * 0.4)).toFixed(2)}
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Perbarui Nilai Siswa</h3>
                <p className="text-xs text-zinc-400 font-mono">ID Nilai: #{editingGrade.id_nilai}</p>
              </div>
              <button
                onClick={() => setEditingGrade(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="font-bold text-zinc-950 text-sm">{editingGrade.siswa?.nama_siswa}</div>
                <div className="text-zinc-500 font-mono">NIS: {editingGrade.nis} · {editingGrade.kelas?.nama_kelas}</div>
                <div className="text-zinc-700 font-medium mt-1">{editingGrade.mapel?.nama_mapel}</div>
                <div className="text-zinc-500">Guru: {editingGrade.guru?.nama_guru}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai Tugas (30%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={editTugas}
                    onChange={(e) => setEditTugas(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai UTS (30%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={editUTS}
                    onChange={(e) => setEditUTS(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Nilai UAS (40%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    max={100}
                    value={editUAS}
                    onChange={(e) => setEditUAS(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white text-sm"
                    required
                  />
                </div>
              </div>

              {/* Instant calculation preview */}
              <div className="p-3 bg-zinc-100 rounded-lg border border-zinc-200 flex items-center justify-between">
                <span className="text-zinc-600 font-medium">Estimasi Nilai Akhir Baru:</span>
                <span className="font-mono font-bold text-base text-zinc-950">
                  {((editTugas * 0.3) + (editUTS * 0.3) + (editUAS * 0.4)).toFixed(2)}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Grade Modal */}
      {deletingGrade && (
        <ConfirmDeleteModal
          isOpen={!!deletingGrade}
          title="Hapus Catatan Nilai"
          itemType="nilai"
          itemName={`${deletingGrade.siswa?.nama_siswa} - ${deletingGrade.mapel?.nama_mapel} (Nilai Akhir: ${deletingGrade.nilai_akhir})`}
          onConfirm={handleDeleteNilai}
          onClose={() => setDeletingGrade(null)}
        />
      )}
    </div>
  );
};
