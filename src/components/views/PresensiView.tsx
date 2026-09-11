import React, { useMemo, useState } from 'react';
import {
  ClipboardCheck,
  CalendarDays,
  Users,
  Search,
  CheckCheck,
  Filter,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { StatusPresensi } from '../../types';

const statuses: { key: StatusPresensi; label: string; code: string }[] = [
  { key: 'Hadir', label: 'Hadir', code: 'H' },
  { key: 'Sakit', label: 'Sakit', code: 'S' },
  { key: 'Izin', label: 'Izin', code: 'I' },
  { key: 'Alpa', label: 'Alpa', code: 'A' },
];

export const PresensiView: React.FC = () => {
  const { siswaList, kelasList, presensiList, addPresensi, updatePresensi } = useDatabase();
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isBatchUpdating, setIsBatchUpdating] = useState<boolean>(false);

  const filteredStudents = useMemo(() => {
    return siswaList.filter((siswa) => {
      const matchKelas = selectedKelas === 'Semua' || String(siswa.id_kelas) === selectedKelas;
      const matchQuery =
        siswa.nama_siswa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        siswa.nis.includes(searchQuery);
      return matchKelas && matchQuery;
    });
  }, [siswaList, selectedKelas, searchQuery]);

  const getRecord = (nis: string) =>
    presensiList.find((item) => item.nis === nis && item.tanggal === tanggal);

  const saveStatus = async (nis: string, status: StatusPresensi) => {
    try {
      const siswa = siswaList.find((item) => item.nis === nis);
      if (!siswa) return;
      const existing = getRecord(nis);
      if (existing) {
        await updatePresensi(existing.id_presensi, { status });
      } else {
        await addPresensi({
          nis,
          id_kelas: siswa.id_kelas,
          tanggal,
          status,
          keterangan: null,
        });
      }
      setMessage({ type: 'success', text: `Presensi ${siswa.nama_siswa} tercatat: ${status}` });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Presensi gagal disimpan.',
      });
    }
  };

  const handleMarkAllHadir = async () => {
    setIsBatchUpdating(true);
    try {
      for (const siswa of filteredStudents) {
        const existing = getRecord(siswa.nis);
        if (existing) {
          if (existing.status !== 'Hadir') {
            await updatePresensi(existing.id_presensi, { status: 'Hadir' });
          }
        } else {
          await addPresensi({
            nis: siswa.nis,
            id_kelas: siswa.id_kelas,
            tanggal,
            status: 'Hadir',
            keterangan: null,
          });
        }
      }
      setMessage({
        type: 'success',
        text: `Berhasil menandai ${filteredStudents.length} siswa sebagai Hadir pada tanggal ${tanggal}.`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Gagal memperbarui presensi massal.',
      });
    } finally {
      setIsBatchUpdating(false);
    }
  };

  const summary = statuses.map(({ key, label }) => {
    const count = filteredStudents.filter((siswa) => getRecord(siswa.nis)?.status === key).length;
    return { key, label, count };
  });

  const recordedCount = filteredStudents.filter((s) => getRecord(s.nis)?.status).length;
  const attendanceRate =
    filteredStudents.length > 0
      ? Math.round(
          ((summary.find((s) => s.key === 'Hadir')?.count || 0) / filteredStudents.length) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Control Panel Header */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Presensi Kehadiran Siswa</h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Pencatatan absensi harian berbasis card selector. Pilih status kehadiran per siswa.
            </p>
          </div>

          {/* Filters and Date */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50/60 focus-within:bg-white focus-within:border-zinc-900 transition-all">
              <CalendarDays className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="bg-transparent text-zinc-900 font-mono text-xs focus:outline-hidden cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-2 border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-50/60 focus-within:bg-white focus-within:border-zinc-900 transition-all">
              <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="bg-transparent text-zinc-900 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="Semua">Semua Rombel</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id_kelas} value={kelas.id_kelas}>
                    {kelas.nama_kelas}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              id="btn-mark-all-hadir"
              onClick={handleMarkAllHadir}
              disabled={isBatchUpdating || filteredStudents.length === 0}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              title="Set semua siswa pada daftar menjadi Hadir"
            >
              <CheckCheck className="w-4 h-4" />
              <span>{isBatchUpdating ? 'Memproses...' : 'Tandai Semua Hadir'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`mt-4 rounded-xl px-3.5 py-2.5 text-xs flex items-center gap-2 border ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {summary.map(({ key, label, count }) => (
          <div
            key={key}
            className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
          >
            <div className="text-xs text-zinc-500 font-medium">{label}</div>
            <div className="text-2xl font-mono font-bold text-zinc-950 mt-1">{count}</div>
            <div className="text-[11px] text-zinc-400 mt-1">
              {filteredStudents.length > 0
                ? `${Math.round((count / filteredStudents.length) * 100)}% dari filter`
                : '0%'}
            </div>
          </div>
        ))}

        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1 flex flex-col justify-between">
          <div className="text-xs text-zinc-500 font-medium">Tingkat Hadir</div>
          <div className="text-2xl font-mono font-bold text-zinc-950 mt-1">{attendanceRate}%</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            {recordedCount}/{filteredStudents.length} terdata
          </div>
        </div>
      </div>

      {/* Students Attendance Table with Card Selection Buttons */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/60">
          <div className="flex items-center gap-2 text-xs text-zinc-700 font-medium">
            <Users className="w-4 h-4 text-zinc-500" />
            <span>
              Menampilkan {filteredStudents.length} siswa pada tanggal{' '}
              <strong className="font-mono text-zinc-950">{tanggal}</strong>
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau NIS siswa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900 text-white font-semibold">
                <th className="px-4 py-3 font-mono">NIS</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Rombel</th>
                <th className="px-4 py-3 min-w-[320px]">Status Kehadiran (Card Selection)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredStudents.map((siswa) => {
                const currentRecord = getRecord(siswa.nis);
                const activeStatus = currentRecord?.status;
                const kelasName =
                  kelasList.find((k) => k.id_kelas === siswa.id_kelas)?.nama_kelas || '-';

                return (
                  <tr key={siswa.nis} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-mono text-zinc-600">{siswa.nis}</td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-zinc-900">{siswa.nama_siswa}</div>
                      <div className="text-[11px] text-zinc-400">
                        {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-mono text-[11px] border border-zinc-200">
                        {kelasName}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {/* Attendance Card Selection - Active Selection Color is Solid Black */}
                      <div className="grid grid-cols-4 gap-1.5 max-w-sm">
                        {statuses.map(({ key, label }) => {
                          const isSelected = activeStatus === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              id={`btn-presensi-${siswa.nis}-${key.toLowerCase()}`}
                              onClick={() => saveStatus(siswa.nis, key)}
                              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                                isSelected
                                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                                  : 'bg-zinc-50/80 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                              }`}
                            >
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-400">
                    Tidak ditemukan data siswa yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
