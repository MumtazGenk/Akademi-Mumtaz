import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Jurusan, Kelas, MataPelajaran, TahunAjaran, TingkatKelas, Semester, StatusTahunAjaran } from '../../types';
import { ConfirmDeleteModal } from '../modals/ConfirmDeleteModal';
import {
  Layers,
  BookOpen,
  GraduationCap,
  Users,
  ChevronRight,
  School,
  Sparkles,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';

export const KurikulumView: React.FC = () => {
  const {
    jurusanList,
    kelasList,
    mapelList,
    tahunAjaranList,
    siswaList,
    enrichedJadwal,
    addJurusan,
    updateJurusan,
    deleteJurusan,
    addKelas,
    updateKelas,
    deleteKelas,
    addMapel,
    updateMapel,
    deleteMapel,
    addTahunAjaran,
    updateTahunAjaran,
    deleteTahunAjaran,
    currentUser,
  } = useDatabase();

  const isAdmin = currentUser?.role === 'admin';

  const [activeSubTab, setActiveSubTab] = useState<'jurusan' | 'kelas' | 'mapel' | 'tahun_ajaran'>('jurusan');

  // Jurusan State
  const [showAddJurusanModal, setShowAddJurusanModal] = useState(false);
  const [editingJurusan, setEditingJurusan] = useState<Jurusan | null>(null);
  const [deletingJurusan, setDeletingJurusan] = useState<Jurusan | null>(null);
  const [jurusanKode, setJurusanKode] = useState('');
  const [jurusanNama, setJurusanNama] = useState('');

  // Kelas State
  const [showAddKelasModal, setShowAddKelasModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
  const [deletingKelas, setDeletingKelas] = useState<Kelas | null>(null);
  const [kelasNama, setKelasNama] = useState('');
  const [kelasTingkat, setKelasTingkat] = useState<TingkatKelas>('X');
  const [kelasJurusanId, setKelasJurusanId] = useState<number>(jurusanList[0]?.id_jurusan || 1);

  // Mapel State
  const [showAddMapelModal, setShowAddMapelModal] = useState(false);
  const [editingMapel, setEditingMapel] = useState<MataPelajaran | null>(null);
  const [deletingMapel, setDeletingMapel] = useState<MataPelajaran | null>(null);
  const [mapelKode, setMapelKode] = useState('');
  const [mapelNama, setMapelNama] = useState('');
  const [mapelKelompok, setMapelKelompok] = useState('Muatan Nasional');

  // Tahun Ajaran State
  const [showAddTahunModal, setShowAddTahunModal] = useState(false);
  const [editingTahun, setEditingTahun] = useState<TahunAjaran | null>(null);
  const [deletingTahun, setDeletingTahun] = useState<TahunAjaran | null>(null);
  const [tahunTahun, setTahunTahun] = useState('2024/2025');
  const [tahunSemester, setTahunSemester] = useState<Semester>('Ganjil');
  const [tahunStatus, setTahunStatus] = useState<StatusTahunAjaran>('Tidak Aktif');

  // --- Handlers: Jurusan ---
  const handleCreateJurusan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jurusanKode.trim() || !jurusanNama.trim()) return;
    addJurusan({
      kode_jurusan: jurusanKode.trim().toUpperCase(),
      nama_jurusan: jurusanNama.trim(),
    });
    setShowAddJurusanModal(false);
    setJurusanKode('');
    setJurusanNama('');
  };

  const handleUpdateJurusan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJurusan || !jurusanNama.trim() || !jurusanKode.trim()) return;
    updateJurusan(editingJurusan.id_jurusan, {
      kode_jurusan: jurusanKode.trim().toUpperCase(),
      nama_jurusan: jurusanNama.trim(),
    });
    setEditingJurusan(null);
  };

  const handleDeleteJurusan = () => {
    if (!deletingJurusan) return;
    deleteJurusan(deletingJurusan.id_jurusan);
    setDeletingJurusan(null);
  };

  // --- Handlers: Kelas ---
  const handleCreateKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kelasNama.trim()) return;
    addKelas({
      nama_kelas: kelasNama.trim(),
      tingkat: kelasTingkat,
      id_jurusan: Number(kelasJurusanId),
    });
    setShowAddKelasModal(false);
    setKelasNama('');
  };

  const handleUpdateKelas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKelas || !kelasNama.trim()) return;
    updateKelas(editingKelas.id_kelas, {
      nama_kelas: kelasNama.trim(),
      tingkat: kelasTingkat,
      id_jurusan: Number(kelasJurusanId),
    });
    setEditingKelas(null);
  };

  const handleDeleteKelas = () => {
    if (!deletingKelas) return;
    deleteKelas(deletingKelas.id_kelas);
    setDeletingKelas(null);
  };

  // --- Handlers: Mapel ---
  const handleCreateMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapelKode.trim() || !mapelNama.trim()) return;
    addMapel({
      kode_mapel: mapelKode.trim().toUpperCase(),
      nama_mapel: mapelNama.trim(),
      kelompok: mapelKelompok.trim(),
    });
    setShowAddMapelModal(false);
    setMapelKode('');
    setMapelNama('');
  };

  const handleUpdateMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMapel || !mapelKode.trim() || !mapelNama.trim()) return;
    updateMapel(editingMapel.id_mapel, {
      kode_mapel: mapelKode.trim().toUpperCase(),
      nama_mapel: mapelNama.trim(),
      kelompok: mapelKelompok.trim(),
    });
    setEditingMapel(null);
  };

  const handleDeleteMapel = () => {
    if (!deletingMapel) return;
    deleteMapel(deletingMapel.id_mapel);
    setDeletingMapel(null);
  };

  // --- Handlers: Tahun Ajaran ---
  const handleCreateTahun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tahunTahun.trim()) return;
    addTahunAjaran({
      tahun_ajaran: tahunTahun.trim(),
      semester: tahunSemester,
      status: tahunStatus,
    });
    setShowAddTahunModal(false);
    setTahunTahun('2024/2025');
  };

  const handleUpdateTahun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTahun || !tahunTahun.trim()) return;
    updateTahunAjaran(editingTahun.id_tahun_ajaran, {
      tahun_ajaran: tahunTahun.trim(),
      semester: tahunSemester,
      status: tahunStatus,
    });
    setEditingTahun(null);
  };

  const handleDeleteTahun = () => {
    if (!deletingTahun) return;
    deleteTahunAjaran(deletingTahun.id_tahun_ajaran);
    setDeletingTahun(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub navigation */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-700" />
              Kurikulum, Konsentrasi Keahlian & Rombongan Belajar
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Struktur akademik, rombel, katalog mapel, dan periode tahun ajaran SMK Negeri 2 Magelang
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-md border border-zinc-200 text-xs">
              <button
                onClick={() => setActiveSubTab('jurusan')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  activeSubTab === 'jurusan' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Keahlian ({jurusanList.length})
              </button>
              <button
                onClick={() => setActiveSubTab('kelas')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  activeSubTab === 'kelas' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Rombel ({kelasList.length})
              </button>
              <button
                onClick={() => setActiveSubTab('mapel')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  activeSubTab === 'mapel' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Mapel ({mapelList.length})
              </button>
              <button
                onClick={() => setActiveSubTab('tahun_ajaran')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  activeSubTab === 'tahun_ajaran' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Tahun Ajaran ({tahunAjaranList.length})
              </button>
            </div>

            {isAdmin && (
              <div>
                {activeSubTab === 'jurusan' && (
                  <button
                    onClick={() => {
                      setJurusanKode('');
                      setJurusanNama('');
                      setShowAddJurusanModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Jurusan</span>
                  </button>
                )}
                {activeSubTab === 'kelas' && (
                  <button
                    onClick={() => {
                      setKelasNama('');
                      setKelasTingkat('X');
                      setKelasJurusanId(jurusanList[0]?.id_jurusan || 1);
                      setShowAddKelasModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Rombel Kelas</span>
                  </button>
                )}
                {activeSubTab === 'mapel' && (
                  <button
                    onClick={() => {
                      setMapelKode('');
                      setMapelNama('');
                      setMapelKelompok('Muatan Nasional');
                      setShowAddMapelModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Mata Pelajaran</span>
                  </button>
                )}
                {activeSubTab === 'tahun_ajaran' && (
                  <button
                    onClick={() => {
                      setTahunTahun('2024/2025');
                      setTahunSemester('Ganjil');
                      setTahunStatus('Tidak Aktif');
                      setShowAddTahunModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Tahun Ajaran</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. JURUSAN SUBTAB */}
      {activeSubTab === 'jurusan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jurusanList.map((jurusan) => {
            const classesInJurusan = kelasList.filter((k) => k.id_jurusan === jurusan.id_jurusan);
            const classIds = classesInJurusan.map((k) => k.id_kelas);
            const studentsInJurusan = siswaList.filter((s) => classIds.includes(s.id_kelas));
            const subjectsRelated = mapelList.filter((m) => m.kelompok.includes(jurusan.kode_jurusan));

            return (
              <div
                key={jurusan.id_jurusan}
                className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-white">
                      {jurusan.kode_jurusan}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-zinc-500 font-medium">
                        ID: #{jurusan.id_jurusan}
                      </span>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setEditingJurusan(jurusan);
                              setJurusanKode(jurusan.kode_jurusan);
                              setJurusanNama(jurusan.nama_jurusan);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                            title="Edit Jurusan"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeletingJurusan(jurusan)}
                            className="p-1 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Jurusan"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-zinc-950 text-sm mt-3 leading-snug">
                    {jurusan.nama_jurusan}
                  </h3>

                  {/* Classes */}
                  <div className="mt-4 pt-3 border-t border-zinc-100">
                    <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center justify-between">
                      <span>Rombongan Belajar Terbuka:</span>
                      <span className="font-mono text-zinc-800">{classesInJurusan.length} Kelas</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {classesInJurusan.length === 0 ? (
                        <span className="text-[11px] text-zinc-400 italic">Belum dibuka rombel</span>
                      ) : (
                        classesInJurusan.map((k) => (
                          <span
                            key={k.id_kelas}
                            className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200"
                          >
                            {k.nama_kelas}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Kejuruan Subjects */}
                  <div className="mt-3">
                    <div className="text-[11px] font-medium text-zinc-500 mb-1.5">
                      Muatan Kejuruan Terdaftar:
                    </div>
                    <div className="space-y-1">
                      {subjectsRelated.length === 0 ? (
                        <span className="text-[11px] text-zinc-400 italic">Muatan produktif standar</span>
                      ) : (
                        subjectsRelated.map((sub) => (
                          <div
                            key={sub.id_mapel}
                            className="text-[11px] text-zinc-700 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded flex items-center justify-between"
                          >
                            <span className="font-medium">{sub.nama_mapel}</span>
                            <span className="font-mono text-[10px] text-zinc-400">{sub.kode_mapel}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-600">
                  <span>Total Siswa:</span>
                  <span className="font-bold text-zinc-950">{studentsInJurusan.length} Siswa</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. KELAS SUBTAB */}
      {activeSubTab === 'kelas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kelasList.map((k) => {
            const jurusan = jurusanList.find((j) => j.id_jurusan === k.id_jurusan);
            const studentsInClass = siswaList.filter((s) => s.id_kelas === k.id_kelas);
            const classSchedules = enrichedJadwal.filter((j) => j.id_kelas === k.id_kelas);

            return (
              <div
                key={k.id_kelas}
                className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-base font-bold text-zinc-950 font-mono">
                      {k.nama_kelas}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                        Tingkat {k.tingkat}
                      </span>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setEditingKelas(k);
                              setKelasNama(k.nama_kelas);
                              setKelasTingkat(k.tingkat);
                              setKelasJurusanId(k.id_jurusan);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                            title="Edit Kelas"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeletingKelas(k)}
                            className="p-1 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500 mt-1">
                    {jurusan?.nama_jurusan} ({jurusan?.kode_jurusan})
                  </div>

                  {/* Student list preview */}
                  <div className="mt-4 pt-3 border-t border-zinc-100">
                    <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center justify-between">
                      <span>Daftar Siswa Rombel ({studentsInClass.length}):</span>
                    </div>
                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {studentsInClass.map((s) => (
                        <div
                          key={s.nis}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-50 border border-zinc-100"
                        >
                          <span className="font-medium text-zinc-800 truncate">{s.nama_siswa}</span>
                          <span className="font-mono text-[11px] text-zinc-400 shrink-0">{s.nis}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span>Jadwal Mingguan:</span>
                  <span className="font-bold text-zinc-900">{classSchedules.length} Sesi Mapel</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. MAPEL SUBTAB */}
      {activeSubTab === 'mapel' && (
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Mata Pelajaran</th>
                  <th className="py-3 px-4">Kelompok Kurikulum</th>
                  <th className="py-3 px-4">Alokasi KBM Mingguan</th>
                  <th className="py-3 px-4">Tenaga Pengajar Terkait</th>
                  {isAdmin && <th className="py-3 px-4 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {mapelList.map((m) => {
                  const schedules = enrichedJadwal.filter((j) => j.id_mapel === m.id_mapel);
                  const teacherNames = Array.from(
                    new Set(schedules.map((j) => j.guru?.nama_guru).filter(Boolean))
                  );

                  return (
                    <tr key={m.id_mapel} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                        {m.kode_mapel}
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-900 text-sm">
                        {m.nama_mapel}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {m.kelompok}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-700">
                        {schedules.length} Sesi Terjadwal
                      </td>
                      <td className="py-3 px-4 text-zinc-800">
                        {teacherNames.length === 0 ? (
                          <span className="text-zinc-400 italic">Belum terjadwal</span>
                        ) : (
                          teacherNames.join(', ')
                        )}
                      </td>
                      {isAdmin && (
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingMapel(m);
                                setMapelKode(m.kode_mapel);
                                setMapelNama(m.nama_mapel);
                                setMapelKelompok(m.kelompok);
                              }}
                              className="p-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                              title="Edit Mapel"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingMapel(m)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                              title="Hapus Mapel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAHUN AJARAN SUBTAB */}
      {activeSubTab === 'tahun_ajaran' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tahunAjaranList.map((tahun) => {
            const isAktif = tahun.status === 'Aktif';
            return (
              <div
                key={tahun.id_tahun_ajaran}
                className={`bg-white border rounded-lg p-5 flex flex-col justify-between transition-colors shadow-2xs ${
                  isAktif ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-900 text-white">
                      ID: #{tahun.id_tahun_ajaran}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                          isAktif
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                        }`}
                      >
                        {isAktif && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {tahun.status}
                      </span>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => {
                              setEditingTahun(tahun);
                              setTahunTahun(tahun.tahun_ajaran);
                              setTahunSemester(tahun.semester);
                              setTahunStatus(tahun.status);
                            }}
                            className="p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded border border-zinc-200 transition-colors cursor-pointer"
                            title="Edit Tahun Ajaran"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setDeletingTahun(tahun)}
                            className="p-1 text-rose-400 hover:text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                            title="Hapus Tahun Ajaran"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-zinc-950 text-lg mt-3 leading-snug font-mono">
                    Tahun {tahun.tahun_ajaran}
                  </h3>

                  <div className="mt-2 text-xs text-zinc-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Semester <strong>{tahun.semester}</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-500">Status Operasional:</span>
                  <span className={isAktif ? 'font-bold text-emerald-600' : 'text-zinc-500'}>
                    {isAktif ? 'Aktif Berjalan' : 'Arsip / Non-aktif'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- JURUSAN MODALS --- */}
      {showAddJurusanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Kompetensi Keahlian (Jurusan)</h3>
              <button
                onClick={() => setShowAddJurusanModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateJurusan} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kode Jurusan (Singkatan)</label>
                <input
                  type="text"
                  placeholder="Contoh: RPL, AKL, OTKP"
                  value={jurusanKode}
                  onChange={(e) => setJurusanKode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Lengkap Jurusan</label>
                <input
                  type="text"
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  value={jurusanNama}
                  onChange={(e) => setJurusanNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddJurusanModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Jurusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingJurusan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Edit Data Jurusan</h3>
                <p className="text-[11px] text-zinc-400 font-mono">ID: #{editingJurusan.id_jurusan}</p>
              </div>
              <button
                onClick={() => setEditingJurusan(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateJurusan} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kode Jurusan</label>
                <input
                  type="text"
                  value={jurusanKode}
                  onChange={(e) => setJurusanKode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Lengkap Jurusan</label>
                <input
                  type="text"
                  value={jurusanNama}
                  onChange={(e) => setJurusanNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingJurusan(null)}
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

      {deletingJurusan && (
        <ConfirmDeleteModal
          isOpen={!!deletingJurusan}
          title="Hapus Data Jurusan"
          itemType="jurusan"
          itemName={`${jurusanNama} (${deletingJurusan.kode_jurusan})`}
          onConfirm={handleDeleteJurusan}
          onClose={() => setDeletingJurusan(null)}
        />
      )}

      {/* --- KELAS MODALS --- */}
      {showAddKelasModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Rombel Kelas</h3>
              <button
                onClick={() => setShowAddKelasModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateKelas} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Rombel Kelas</label>
                <input
                  type="text"
                  placeholder="Contoh: X RPL 1, XI AKL 2"
                  value={kelasNama}
                  onChange={(e) => setKelasNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Tingkat</label>
                  <select
                    value={kelasTingkat}
                    onChange={(e) => setKelasTingkat(e.target.value as TingkatKelas)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jurusan</label>
                  <select
                    value={kelasJurusanId}
                    onChange={(e) => setKelasJurusanId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {jurusanList.map((j) => (
                      <option key={j.id_jurusan} value={j.id_jurusan}>
                        {j.kode_jurusan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddKelasModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Edit Rombel Kelas</h3>
                <p className="text-[11px] text-zinc-400 font-mono">ID: #{editingKelas.id_kelas}</p>
              </div>
              <button
                onClick={() => setEditingKelas(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateKelas} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Rombel Kelas</label>
                <input
                  type="text"
                  value={kelasNama}
                  onChange={(e) => setKelasNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Tingkat</label>
                  <select
                    value={kelasTingkat}
                    onChange={(e) => setKelasTingkat(e.target.value as TingkatKelas)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jurusan</label>
                  <select
                    value={kelasJurusanId}
                    onChange={(e) => setKelasJurusanId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    {jurusanList.map((j) => (
                      <option key={j.id_jurusan} value={j.id_jurusan}>
                        {j.kode_jurusan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingKelas(null)}
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

      {deletingKelas && (
        <ConfirmDeleteModal
          isOpen={!!deletingKelas}
          title="Hapus Data Rombel Kelas"
          itemType="kelas"
          itemName={`${deletingKelas.nama_kelas} (Tingkat ${deletingKelas.tingkat})`}
          onConfirm={handleDeleteKelas}
          onClose={() => setDeletingKelas(null)}
        />
      )}

      {/* --- MAPEL MODALS --- */}
      {showAddMapelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Mata Pelajaran</h3>
              <button
                onClick={() => setShowAddMapelModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateMapel} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kode Mapel</label>
                <input
                  type="text"
                  placeholder="Contoh: MP-RPL-01"
                  value={mapelKode}
                  onChange={(e) => setMapelKode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Basis Data Relasional"
                  value={mapelNama}
                  onChange={(e) => setMapelNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kelompok Kurikulum</label>
                <input
                  type="text"
                  placeholder="Contoh: C3 - Kompetensi Keahlian RPL / Muatan Nasional"
                  value={mapelKelompok}
                  onChange={(e) => setMapelKelompok(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddMapelModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingMapel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Edit Mata Pelajaran</h3>
                <p className="text-[11px] text-zinc-400 font-mono">ID: #{editingMapel.id_mapel}</p>
              </div>
              <button
                onClick={() => setEditingMapel(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateMapel} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kode Mapel</label>
                <input
                  type="text"
                  value={mapelKode}
                  onChange={(e) => setMapelKode(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white uppercase"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Mata Pelajaran</label>
                <input
                  type="text"
                  value={mapelNama}
                  onChange={(e) => setMapelNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Kelompok Kurikulum</label>
                <input
                  type="text"
                  value={mapelKelompok}
                  onChange={(e) => setMapelKelompok(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingMapel(null)}
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

      {deletingMapel && (
        <ConfirmDeleteModal
          isOpen={!!deletingMapel}
          title="Hapus Mata Pelajaran"
          itemType="mata pelajaran"
          itemName={`${deletingMapel.nama_mapel} (${deletingMapel.kode_mapel})`}
          onConfirm={handleDeleteMapel}
          onClose={() => setDeletingMapel(null)}
        />
      )}

      {/* --- TAHUN AJARAN MODALS --- */}
      {showAddTahunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Periode Tahun Ajaran</h3>
              <button
                onClick={() => setShowAddTahunModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTahun} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: 2025/2026"
                  value={tahunTahun}
                  onChange={(e) => setTahunTahun(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Semester</label>
                  <select
                    value={tahunSemester}
                    onChange={(e) => setTahunSemester(e.target.value as Semester)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Status Operasional</label>
                  <select
                    value={tahunStatus}
                    onChange={(e) => setTahunStatus(e.target.value as StatusTahunAjaran)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddTahunModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900 rounded-md border border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 cursor-pointer shadow-xs"
                >
                  Simpan Periode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTahun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-zinc-300 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Edit Periode Tahun Ajaran</h3>
                <p className="text-[11px] text-zinc-400 font-mono">ID: #{editingTahun.id_tahun_ajaran}</p>
              </div>
              <button
                onClick={() => setEditingTahun(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateTahun} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={tahunTahun}
                  onChange={(e) => setTahunTahun(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-3 py-1.5 font-mono text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Semester</label>
                  <select
                    value={tahunSemester}
                    onChange={(e) => setTahunSemester(e.target.value as Semester)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Status Operasional</label>
                  <select
                    value={tahunStatus}
                    onChange={(e) => setTahunStatus(e.target.value as StatusTahunAjaran)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-900 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setEditingTahun(null)}
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

      {deletingTahun && (
        <ConfirmDeleteModal
          isOpen={!!deletingTahun}
          title="Hapus Periode Tahun Ajaran"
          itemType="tahun ajaran"
          itemName={`Tahun ${deletingTahun.tahun_ajaran} (${deletingTahun.semester})`}
          onConfirm={handleDeleteTahun}
          onClose={() => setDeletingTahun(null)}
        />
      )}
    </div>
  );
};
