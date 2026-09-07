import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Hari } from '../../types';
import {
  Users,
  GraduationCap,
  CalendarDays,
  Award,
  Layers,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    siswaList,
    guruList,
    kelasList,
    jurusanList,
    mapelList,
    jadwalList,
    nilaiList,
    enrichedSiswa,
    enrichedJadwal,
    setActiveTab,
  } = useDatabase();

  const [selectedDayPreview, setSelectedDayPreview] = useState<Hari>('Senin');

  // Gender breakdown
  const lakiCount = siswaList.filter((s) => s.jenis_kelamin === 'L').length;
  const perempuanCount = siswaList.filter((s) => s.jenis_kelamin === 'P').length;

  // Grade averages and KKM
  const KKM = 75.0;
  const allFinalGrades = nilaiList.map((n) => n.nilai_akhir);
  const avgSchoolGrade = (
    allFinalGrades.reduce((a, b) => a + b, 0) / (allFinalGrades.length || 1)
  ).toFixed(2);
  const passedCount = allFinalGrades.filter((g) => g >= KKM).length;
  const passRate = ((passedCount / (allFinalGrades.length || 1)) * 100).toFixed(1);

  // Top performing students
  const studentsWithAvg = enrichedSiswa
    .filter((s) => s.rataRataNilai !== undefined)
    .sort((a, b) => (b.rataRataNilai ?? 0) - (a.rataRataNilai ?? 0));
  const topStudents = studentsWithAvg.slice(0, 5);

  // Students with values needing attention (< KKM)
  const studentsNeedingAttention = enrichedSiswa
    .filter((s) => (s.rataRataNilai ?? 100) < KKM)
    .slice(0, 4);

  // Filtered schedule preview
  const daySchedule = enrichedJadwal
    .filter((j) => j.hari === selectedDayPreview)
    .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

  // Department counts
  const departmentCounts = jurusanList.map((j) => {
    const classIds = kelasList.filter((k) => k.id_jurusan === j.id_jurusan).map((k) => k.id_kelas);
    const count = siswaList.filter((s) => classIds.includes(s.id_kelas)).length;
    return {
      ...j,
      studentCount: count,
      percentage: ((count / (siswaList.length || 1)) * 100).toFixed(0),
    };
  });

  const daysList: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  return (
    <div className="space-y-6">
      {/* Editorial Welcome / Institution Intro */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 lg:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-xs font-medium mb-3 border border-zinc-200">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
              Pusat Data Akademik Terpadu
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-zinc-900">
              Dasbor Akademik SMK Negeri 2 Magelang
            </h2>
            <p className="text-sm text-zinc-600 mt-1 leading-relaxed">
              Memantau ketercapaian kompetensi kejuruan, jadwal ruang laboratorium, data 20 peserta didik aktif, serta rekapitulasi penilaian kurikulum berbasis basis data MariaDB.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('nilai')}
              className="px-4 py-2 text-xs font-semibold bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              Kelola Buku Nilai
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className="px-4 py-2 text-xs font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 rounded-md hover:bg-zinc-200/70 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Lihat Jadwal
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Siswa</span>
            <Users className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{siswaList.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1 font-mono">
            <span>{lakiCount}L</span>
            <span>·</span>
            <span>{perempuanCount}P</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Guru</span>
            <GraduationCap className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{guruList.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Tenaga pendidik</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Kelas</span>
            <Layers className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{kelasList.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Tingkat X, XI, XII</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Mapel</span>
            <BookOpen className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{mapelList.length}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Kejuruan & Umum</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Rata Nilai</span>
            <TrendingUp className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{avgSchoolGrade}</div>
          <div className="text-[11px] text-zinc-500 mt-1">Skala 100.00</div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium text-zinc-600 uppercase tracking-wider">Ketuntasan</span>
            <CheckCircle2 className="w-4 h-4 text-zinc-700" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 font-mono">{passRate}%</div>
          <div className="text-[11px] text-zinc-500 mt-1 font-mono">KKM {KKM.toFixed(1)}</div>
        </div>
      </div>

      {/* Two-column layout: Schedule Preview vs Top Performing Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Schedule quick viewer */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
            <div>
              <h3 className="font-bold text-zinc-900 text-base">Alokasi Jadwal Pembelajaran</h3>
              <p className="text-xs text-zinc-500">Sesi KBM per hari berdasarkan jadwal aktif</p>
            </div>

            {/* Day picker buttons */}
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-md border border-zinc-200/80">
              {daysList.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDayPreview(day)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    selectedDayPreview === day
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 divide-y divide-zinc-100">
            {daySchedule.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                Tidak ada agenda pembelajaran pada hari {selectedDayPreview}.
              </div>
            ) : (
              daySchedule.map((item) => (
                <div key={item.id_jadwal} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="font-mono text-xs font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2 py-1 rounded shrink-0">
                      {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900">
                          {item.mapel?.nama_mapel}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {item.kelas?.nama_kelas}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5 flex items-center gap-2">
                        <span>{item.guru?.nama_guru}</span>
                        <span>·</span>
                        <span className="text-zinc-400">{item.mapel?.kode_mapel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded shrink-0">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{item.ruang}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 mt-2 border-t border-zinc-100 text-right">
            <button
              onClick={() => setActiveTab('jadwal')}
              className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 inline-flex items-center gap-1 cursor-pointer"
            >
              Buka Seluruh Matriks Jadwal
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right column: Student Academic Standings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Students */}
          <div className="bg-white border border-zinc-200 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h3 className="font-bold text-zinc-900 text-base">Peringkat Nilai Tertinggi</h3>
                <p className="text-xs text-zinc-500">Rerata nilai akhir seluruh mapel terdaftar</p>
              </div>
              <Award className="w-4 h-4 text-zinc-700" />
            </div>

            <div className="mt-3 divide-y divide-zinc-100">
              {topStudents.map((siswa, idx) => (
                <div key={siswa.nis} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-[11px] font-mono font-bold text-zinc-700">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">{siswa.nama_siswa}</div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        NIS: {siswa.nis} · {siswa.kelas?.nama_kelas}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                      {siswa.rataRataNilai?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-zinc-100 text-right">
              <button
                onClick={() => setActiveTab('siswa')}
                className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 inline-flex items-center gap-1 cursor-pointer"
              >
                Lihat Semua Siswa & Rapor
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Remedial / Attention Alert */}
          {studentsNeedingAttention.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-xs mb-2">
                <AlertCircle className="w-4 h-4 text-zinc-600" />
                <span>Perlu Program Remedial (Nilai Akhir &lt; {KKM.toFixed(1)})</span>
              </div>
              <div className="space-y-1.5">
                {studentsNeedingAttention.map((s) => (
                  <div
                    key={s.nis}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-50 border border-zinc-100"
                  >
                    <span className="font-medium text-zinc-800">{s.nama_siswa} ({s.kelas?.nama_kelas})</span>
                    <span className="font-mono font-bold text-zinc-700">
                      {s.rataRataNilai?.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Department Breakdown Section */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
          <div>
            <h3 className="font-bold text-zinc-900 text-base">Distribusi Siswa Berdasarkan Konsentrasi Keahlian</h3>
            <p className="text-xs text-zinc-500">Struktur rombongan belajar SMKN 2 Magelang</p>
          </div>
          <button
            onClick={() => setActiveTab('kurikulum')}
            className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 inline-flex items-center gap-1 cursor-pointer"
          >
            Struktur Lengkap
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {departmentCounts.map((dept) => (
            <div key={dept.id_jurusan} className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                  {dept.kode_jurusan}
                </span>
                <span className="text-xs font-mono text-zinc-600 font-semibold">
                  {dept.studentCount} Siswa
                </span>
              </div>
              <div className="text-xs font-medium text-zinc-900 line-clamp-1" title={dept.nama_jurusan}>
                {dept.nama_jurusan}
              </div>
              {/* Minimalist monochrome progress indicator */}
              <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-zinc-800 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(Number(dept.percentage), 4)}%` }}
                ></div>
              </div>
              <div className="text-[10px] text-zinc-400 font-mono mt-1 text-right">
                {dept.percentage}% dari total siswa
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
