import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Jadwal, Hari, JadwalEnriched } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import {
  CalendarDays,
  Clock,
  MapPin,
  Filter,
  Grid,
  List,
  Printer,
  User,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';

export const JadwalView: React.FC = () => {
  const {
    enrichedJadwal,
    kelasList,
    guruList,
    mapelList,
    searchQuery,
    addJadwal,
    updateJadwal,
    deleteJadwal,
    currentUser,
  } = useDatabase();

  const isAdmin = currentUser?.role === 'admin';

  const [selectedHari, setSelectedHari] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedGuru, setSelectedGuru] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingJadwal, setEditingJadwal] = useState<Jadwal | null>(null);
  const [deletingJadwal, setDeletingJadwal] = useState<JadwalEnriched | null>(null);

  // Form states
  const [formGuruId, setFormGuruId] = useState<number>(guruList[0]?.id_guru || 1);
  const [formMapelId, setFormMapelId] = useState<number>(mapelList[0]?.id_mapel || 1);
  const [formKelasId, setFormKelasId] = useState<number>(kelasList[0]?.id_kelas || 1);
  const [formHari, setFormHari] = useState<Hari>('Senin');
  const [formJamMulai, setFormJamMulai] = useState('07:00');
  const [formJamSelesai, setFormJamSelesai] = useState('08:30');
  const [formRuang, setFormRuang] = useState('Teori 1');

  const days: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const filteredJadwal = useMemo(() => {
    return enrichedJadwal.filter((item) => {
      if (selectedHari !== 'Semua' && item.hari !== selectedHari) return false;
      if (selectedKelas !== 'Semua' && String(item.id_kelas) !== selectedKelas) return false;
      if (selectedGuru !== 'Semua' && String(item.id_guru) !== selectedGuru) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMapel = item.mapel?.nama_mapel.toLowerCase().includes(q) || item.mapel?.kode_mapel.toLowerCase().includes(q);
        const matchGuru = item.guru?.nama_guru.toLowerCase().includes(q);
        const matchKelas = item.kelas?.nama_kelas.toLowerCase().includes(q);
        const matchRuang = item.ruang.toLowerCase().includes(q);
        const matchHari = item.hari.toLowerCase().includes(q);
        if (!matchMapel && !matchGuru && !matchKelas && !matchRuang && !matchHari) return false;
      }
      return true;
    });
  }, [enrichedJadwal, selectedHari, selectedKelas, selectedGuru, searchQuery]);

  const handleCreateJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    addJadwal({
      id_guru: Number(formGuruId),
      id_mapel: Number(formMapelId),
      id_kelas: Number(formKelasId),
      hari: formHari,
      jam_mulai: formJamMulai.length === 5 ? `${formJamMulai}:00` : formJamMulai,
      jam_selesai: formJamSelesai.length === 5 ? `${formJamSelesai}:00` : formJamSelesai,
      ruang: formRuang.trim(),
    });
    setShowAddModal(false);
  };

  const startEditJadwal = (jadwal: Jadwal) => {
    setEditingJadwal(jadwal);
    setFormGuruId(jadwal.id_guru);
    setFormMapelId(jadwal.id_mapel);
    setFormKelasId(jadwal.id_kelas);
    setFormHari(jadwal.hari);
    setFormJamMulai(jadwal.jam_mulai.substring(0, 5));
    setFormJamSelesai(jadwal.jam_selesai.substring(0, 5));
    setFormRuang(jadwal.ruang);
  };

  const handleUpdateJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJadwal) return;
    updateJadwal(editingJadwal.id_jadwal, {
      id_guru: Number(formGuruId),
      id_mapel: Number(formMapelId),
      id_kelas: Number(formKelasId),
      hari: formHari,
      jam_mulai: formJamMulai.length === 5 ? `${formJamMulai}:00` : formJamMulai,
      jam_selesai: formJamSelesai.length === 5 ? `${formJamSelesai}:00` : formJamSelesai,
      ruang: formRuang.trim(),
    });
    setEditingJadwal(null);
  };

  const handleDeleteJadwal = () => {
    if (!deletingJadwal) return;
    deleteJadwal(deletingJadwal.id_jadwal);
    setDeletingJadwal(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control & Filter Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-zinc-700" />
              Jadwal Pelajaran & Penggunaan Ruang
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Distribusi sesi tatap muka laboratorium komputer, praktikum akuntansi, dan ruang teori
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setFormGuruId(guruList[0]?.id_guru || 1);
                  setFormMapelId(mapelList[0]?.id_mapel || 1);
                  setFormKelasId(kelasList[0]?.id_kelas || 1);
                  setFormHari('Senin');
                  setFormJamMulai('07:00');
                  setFormJamSelesai('08:30');
                  setFormRuang('Lab Komputer 1');
                  setShowAddModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Jadwal</span>
              </button>
            )}

            <div className="flex items-center bg-zinc-100 p-1 rounded-md border border-zinc-200">
              <button
                onClick={() => setViewMode('matrix')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  viewMode === 'matrix' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Tampilan Matriks Mingguan"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matriks</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Tampilan Daftar / Runtun"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 rounded-md text-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cetak Jadwal</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-zinc-500 font-medium mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-zinc-400" />
              Filter Hari
            </label>
            <select
              value={selectedHari}
              onChange={(e) => setSelectedHari(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Hari (Senin - Jumat)</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Rombongan Belajar (Kelas)</label>
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
            <label className="block text-zinc-500 font-medium mb-1">Guru Pengampu</label>
            <select
              value={selectedGuru}
              onChange={(e) => setSelectedGuru(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Tenaga Pendidik</option>
              {guruList.map((g) => (
                <option key={g.id_guru} value={g.id_guru}>
                  {g.nama_guru}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => {
            const dayItems = filteredJadwal
              .filter((j) => j.hari === day)
              .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

            return (
              <div key={day} className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-zinc-900 text-white px-3.5 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wide">{day}</span>
                  <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-1.5 py-0.2 rounded">
                    {dayItems.length} Sesi
                  </span>
                </div>

                <div className="p-3 space-y-3 flex-1 bg-zinc-50/40">
                  {dayItems.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-400">
                      Tidak ada jadwal
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id_jadwal}
                        className="bg-white border border-zinc-200 rounded-md p-3 shadow-2xs hover:border-zinc-400 transition-colors relative group"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                          <span className="font-semibold text-zinc-900 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                          </span>
                          <span className="bg-zinc-100 text-zinc-800 px-1.5 py-0.2 rounded font-bold border border-zinc-200">
                            {item.kelas?.nama_kelas}
                          </span>
                        </div>

                        <div className="font-semibold text-xs text-zinc-900 leading-snug">
                          {item.mapel?.nama_mapel}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {item.mapel?.kode_mapel} · {item.mapel?.kelompok}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-col gap-1 text-[11px] text-zinc-600">
                          <div className="flex items-center gap-1.5 truncate" title={item.guru?.nama_guru}>
                            <User className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate">{item.guru?.nama_guru}</span>
                          </div>
                          <div className="flex items-center justify-between font-mono text-zinc-700">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                              {item.ruang}
                            </span>
                            {isAdmin && (
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditJadwal(item)}
                                  className="p-1 text-zinc-400 hover:text-zinc-800 rounded hover:bg-zinc-100 cursor-pointer"
                                  title="Edit Jadwal"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => setDeletingJadwal(item)}
                                  className="p-1 text-rose-400 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                                  title="Hapus Jadwal"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Hari & Jam</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Tenaga Pengajar</th>
                  <th className="py-3 px-4">Ruang</th>
                  <th className="py-3 px-4 text-center">Kelompok</th>
                  {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredJadwal.length === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-zinc-400">
                      Tidak ada jadwal yang cocok dengan filter kriteria.
                    </td>
                  </tr>
                ) : (
                  filteredJadwal.map((item) => (
                    <tr key={item.id_jadwal} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                        <div className="font-bold text-zinc-950">{item.hari}</div>
                        <div className="text-zinc-500 text-[11px]">
                          {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 font-mono font-bold text-xs border border-zinc-200">
                          {item.kelas?.nama_kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 text-xs">{item.mapel?.nama_mapel}</div>
                        <div className="text-[11px] font-mono text-zinc-400">{item.mapel?.kode_mapel}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-800">
                        <div className="font-medium">{item.guru?.nama_guru}</div>
                        <div className="text-[11px] font-mono text-zinc-400">NIP: {item.guru?.nip}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {item.ruang}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {item.mapel?.kelompok}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => startEditJadwal(item)}
                              className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                              title="Edit Jadwal"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingJadwal(item)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                              title="Hapus Jadwal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Jadwal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Alokasi Jadwal Pelajaran</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateJadwal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Mata Pelajaran</label>
                <select
                  value={formMapelId}
                  onChange={(e) => setFormMapelId(Number(e.target.value))}
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
                    value={formGuruId}
                    onChange={(e) => setFormGuruId(Number(e.target.value))}
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
                  <label className="block text-zinc-600 font-medium mb-1">Rombel (Kelas)</label>
                  <select
                    value={formKelasId}
                    onChange={(e) => setFormKelasId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>
                        {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Hari</label>
                  <select
                    value={formHari}
                    onChange={(e) => setFormHari(e.target.value as Hari)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={formJamMulai}
                    onChange={(e) => setFormJamMulai(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={formJamSelesai}
                    onChange={(e) => setFormJamSelesai(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Ruangan / Lab</label>
                <input
                  type="text"
                  placeholder="Contoh: Lab Komputer 1, Teori 2"
                  value={formRuang}
                  onChange={(e) => setFormRuang(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Jadwal Modal */}
      {editingJadwal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Edit Alokasi Jadwal</h3>
                <p className="text-[11px] text-zinc-400 font-mono">ID: #{editingJadwal.id_jadwal}</p>
              </div>
              <button
                onClick={() => setEditingJadwal(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateJadwal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Mata Pelajaran</label>
                <select
                  value={formMapelId}
                  onChange={(e) => setFormMapelId(Number(e.target.value))}
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
                    value={formGuruId}
                    onChange={(e) => setFormGuruId(Number(e.target.value))}
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
                  <label className="block text-zinc-600 font-medium mb-1">Rombel (Kelas)</label>
                  <select
                    value={formKelasId}
                    onChange={(e) => setFormKelasId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>
                        {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Hari</label>
                  <select
                    value={formHari}
                    onChange={(e) => setFormHari(e.target.value as Hari)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={formJamMulai}
                    onChange={(e) => setFormJamMulai(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={formJamSelesai}
                    onChange={(e) => setFormJamSelesai(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Ruangan / Lab</label>
                <input
                  type="text"
                  value={formRuang}
                  onChange={(e) => setFormRuang(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingJadwal(null)}
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

      {/* Delete Jadwal Modal */}
      {deletingJadwal && (
        <ConfirmDeleteModal
          isOpen={!!deletingJadwal}
          title="Hapus Alokasi Jadwal"
          itemType="jadwal"
          itemName={`${deletingJadwal.mapel?.nama_mapel} (${deletingJadwal.kelas?.nama_kelas} - ${deletingJadwal.hari} ${deletingJadwal.jam_mulai.substring(0, 5)})`}
          onConfirm={handleDeleteJadwal}
          onClose={() => setDeletingJadwal(null)}
        />
      )}
    </div>
  );
};
