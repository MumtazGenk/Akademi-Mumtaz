import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Guru } from '../../types';
import {
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  X,
  Layers,
  Award,
} from 'lucide-react';

export const GuruView: React.FC = () => {
  const { guruList, mapelList, enrichedJadwal, enrichedNilai, searchQuery } = useDatabase();
  const [selectedGuruDetail, setSelectedGuruDetail] = useState<Guru | null>(null);

  const filteredGuru = guruList.filter((g) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.nama_guru.toLowerCase().includes(q);
      const matchNip = g.nip.includes(q);
      const matchEmail = g.email?.toLowerCase().includes(q);
      if (!matchName && !matchNip && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-zinc-700" />
              Direktori Tenaga Pendidik (Guru)
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Data 5 pengajar fungsional SMKN 2 Magelang beserta NIP, muatan ajar, dan jadwal tatap muka
            </p>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGuru.map((guru) => {
          // Schedules for this teacher
          const teacherSchedules = enrichedJadwal.filter((j) => j.id_guru === guru.id_guru);
          // Subjects taught
          const subjectIds = Array.from(new Set(teacherSchedules.map((j) => j.id_mapel)));
          const taughtSubjects = mapelList.filter((m) => subjectIds.includes(m.id_mapel));
          // Total grades assessed by this teacher
          const teacherGrades = enrichedNilai.filter((n) => n.id_guru === guru.id_guru);

          return (
            <div
              key={guru.id_guru}
              className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col justify-between hover:border-zinc-400 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-zinc-950 text-sm">{guru.nama_guru}</h3>
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      NIP: {guru.nip}
                    </div>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{guru.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600">
                    <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span className="font-mono text-[11px]">{guru.no_hp}</span>
                  </div>
                </div>

                {/* Taught Subjects */}
                <div className="mt-4">
                  <div className="text-[11px] font-medium text-zinc-500 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-zinc-400" />
                    Mata Pelajaran Diampu ({taughtSubjects.length}):
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {taughtSubjects.map((sub) => (
                      <span
                        key={sub.id_mapel}
                        className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 font-medium"
                      >
                        {sub.nama_mapel}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">
                  {teacherSchedules.length} Sesi KBM · {teacherGrades.length} Nilai
                </span>
                <button
                  onClick={() => setSelectedGuruDetail(guru)}
                  className="px-2.5 py-1 text-xs font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Jadwal & Tugas
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Teacher Schedule Detail Modal */}
      {selectedGuruDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden text-zinc-900">
            <div className="bg-zinc-900 text-white px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedGuruDetail.nama_guru}</h3>
                <p className="text-xs text-zinc-400 font-mono">
                  NIP: {selectedGuruDetail.nip} · {selectedGuruDetail.email}
                </p>
              </div>
              <button
                onClick={() => setSelectedGuruDetail(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider font-mono">
                Alokasi Jadwal Mengajar Mingguan
              </h4>

              <div className="border border-zinc-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-zinc-100 text-zinc-700 font-mono text-[11px] border-b border-zinc-200">
                      <th className="py-2.5 px-3">Hari & Jam</th>
                      <th className="py-2.5 px-3">Kelas</th>
                      <th className="py-2.5 px-3">Mata Pelajaran</th>
                      <th className="py-2.5 px-3">Ruang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {enrichedJadwal
                      .filter((j) => j.id_guru === selectedGuruDetail.id_guru)
                      .map((item) => (
                        <tr key={item.id_jadwal} className="hover:bg-zinc-50">
                          <td className="py-2.5 px-3 font-mono font-medium">
                            <span className="font-bold text-zinc-900">{item.hari}</span>,{' '}
                            {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-zinc-800">
                            {item.kelas?.nama_kelas}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-zinc-900">
                            {item.mapel?.nama_mapel}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-zinc-600">
                            {item.ruang}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-zinc-100 border-t border-zinc-200 px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedGuruDetail(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-white text-zinc-800 border border-zinc-300 rounded hover:bg-zinc-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
