import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  Layers,
  BookOpen,
  GraduationCap,
  Users,
  ChevronRight,
  School,
  Sparkles,
} from 'lucide-react';

export const KurikulumView: React.FC = () => {
  const {
    jurusanList,
    kelasList,
    mapelList,
    siswaList,
    enrichedJadwal,
    enrichedNilai,
  } = useDatabase();

  const [activeSubTab, setActiveSubTab] = useState<'jurusan' | 'kelas' | 'mapel'>('jurusan');

  return (
    <div className="space-y-6">
      {/* Header & Sub navigation */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-zinc-700" />
              Kurikulum, Konsentrasi Keahlian & Rombongan Belajar
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Struktur akademik dan katalog mata pelajaran kejuruan SMK Negeri 2 Magelang
            </p>
          </div>

          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-md border border-zinc-200 text-xs">
            <button
              onClick={() => setActiveSubTab('jurusan')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeSubTab === 'jurusan' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Kompetensi Keahlian ({jurusanList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('kelas')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeSubTab === 'kelas' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Rombel Kelas ({kelasList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('mapel')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                activeSubTab === 'mapel' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Mata Pelajaran ({mapelList.length})
            </button>
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
                    <span className="text-xs font-mono text-zinc-500 font-medium">
                      ID: #{jurusan.id_jurusan}
                    </span>
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
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      Tingkat {k.tingkat}
                    </span>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
