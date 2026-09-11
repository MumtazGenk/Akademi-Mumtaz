import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  Save,
  Search,
  Printer,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const RemedialView: React.FC = () => {
  const {
    enrichedNilai,
    remedialList,
    presensiList,
    activeTahunAjaran,
    addRemedial,
  } = useDatabase();

  const [values, setValues] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<'semua' | 'belum_tuntas' | 'sudah_tuntas'>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const candidates = useMemo(() => {
    return enrichedNilai.filter((nilai) => {
      const history = remedialList.filter((item) => item.id_nilai === nilai.id_nilai);
      return nilai.nilai_akhir < 75 || history.length > 0;
    });
  }, [enrichedNilai, remedialList]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((nilai) => {
      const isCompleted = nilai.nilai_akhir >= 75;
      if (statusFilter === 'belum_tuntas' && isCompleted) return false;
      if (statusFilter === 'sudah_tuntas' && !isCompleted) return false;

      const q = searchQuery.toLowerCase();
      const matchName = nilai.siswa?.nama_siswa.toLowerCase().includes(q) || false;
      const matchNis = nilai.nis.includes(q);
      const matchMapel = nilai.mapel?.nama_mapel.toLowerCase().includes(q) || false;
      return matchName || matchNis || matchMapel;
    });
  }, [candidates, statusFilter, searchQuery]);

  const attendanceFor = (nis: string) => {
    const records = presensiList.filter((item) => item.nis === nis);
    return {
      hadir: records.filter((item) => item.status === 'Hadir').length,
      izin: records.filter((item) => item.status === 'Izin').length,
      sakit: records.filter((item) => item.status === 'Sakit').length,
      alpa: records.filter((item) => item.status === 'Alpa').length,
    };
  };

  const save = async (nilaiId: number) => {
    const nilai = enrichedNilai.find((item) => item.id_nilai === nilaiId);
    const previous = remedialList.find((item) => item.id_nilai === nilaiId);
    const value = Number(values[nilaiId]);

    if (!nilai || !Number.isFinite(value)) {
      setMessage({ type: 'error', text: 'Masukkan nilai perbaikan remedial yang valid (0 - 100).' });
      return;
    }

    if (value < 0 || value > 100) {
      setMessage({ type: 'error', text: 'Rentang nilai remedial harus antara 0 hingga 100.' });
      return;
    }

    try {
      await addRemedial({
        id_nilai: nilai.id_nilai,
        nis: nilai.nis,
        id_mapel: nilai.id_mapel,
        id_tahun_ajaran: activeTahunAjaran.id_tahun_ajaran,
        nilai_awal: previous?.nilai_awal ?? nilai.nilai_akhir,
        nilai_remedial: value,
        tanggal: new Date().toISOString().slice(0, 10),
        catatan: notes[nilaiId] || null,
      });

      setMessage({
        type: 'success',
        text: `Nilai remedial untuk ${nilai.siswa?.nama_siswa} (${value.toFixed(2)}) berhasil disimpan.`,
      });
      setValues((prev) => ({ ...prev, [nilaiId]: '' }));
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Remedial gagal disimpan.',
      });
    }
  };

  const handleApplyPreset = (nilaiId: number, targetScore: number) => {
    setValues((prev) => ({ ...prev, [nilaiId]: String(targetScore) }));
  };

  const handlePrintBeritaAcara = () => {
    window.print();
  };

  // Stat calculations
  const totalCandidates = candidates.length;
  const completedCount = candidates.filter((c) => c.nilai_akhir >= 75).length;
  const pendingCount = totalCandidates - completedCount;

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                <RefreshCcw className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">
                Program Remedial &amp; Pengayaan Nilai
              </h2>
            </div>
            <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
              Peserta didik dengan nilai akhir di bawah batas KKM 75.00 wajib mengikuti pembinaan dan remedial. Nilai akhir diperbarui otomatis pasca verifikasi.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-print-remedial"
              onClick={handlePrintBeritaAcara}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-zinc-600" />
              <span>Cetak Berita Acara</span>
            </button>
          </div>
        </div>

        {/* Feedback alert */}
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

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Batas KKM Sekolah</div>
          <div className="text-2xl font-mono font-bold text-zinc-950 mt-1">75.00</div>
          <div className="text-[11px] text-zinc-400 mt-1">Standar Ketuntasan Minimal</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Total Perlu Remedial</div>
          <div className="text-2xl font-mono font-bold text-zinc-950 mt-1">{totalCandidates}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Siswa di bawah KKM 75</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Belum Tuntas</div>
          <div className="text-2xl font-mono font-bold text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Menunggu ujian perbaikan</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs">
          <div className="text-xs text-zinc-500 font-medium">Tuntas Pasca Remedial</div>
          <div className="text-2xl font-mono font-bold text-emerald-600 mt-1">{completedCount}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Nilai terangkat &ge; 75</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
        {/* Table Filters Toolbar */}
        <div className="p-4 border-b border-zinc-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-zinc-50/60">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="filter-all"
              onClick={() => setStatusFilter('semua')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'semua'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              Semua ({candidates.length})
            </button>

            <button
              type="button"
              id="filter-pending"
              onClick={() => setStatusFilter('belum_tuntas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'belum_tuntas'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              Belum Tuntas ({pendingCount})
            </button>

            <button
              type="button"
              id="filter-completed"
              onClick={() => setStatusFilter('sudah_tuntas')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'sudah_tuntas'
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200'
              }`}
            >
              Sudah Tuntas ({completedCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, NIS, atau mata pelajaran..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-900 text-white font-semibold">
                <th className="px-4 py-3">Siswa &amp; Mata Pelajaran</th>
                <th className="px-4 py-3">Nilai &amp; Selisih KKM</th>
                <th className="px-4 py-3">Konteks Kehadiran</th>
                <th className="px-4 py-3 min-w-[280px]">Input Nilai &amp; Preset Cepat</th>
                <th className="px-4 py-3 text-right">Aksi Simpan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredCandidates.map((nilai) => {
                const history = remedialList.filter((item) => item.id_nilai === nilai.id_nilai);
                const attendance = attendanceFor(nilai.nis);
                const latest = history[0];
                const completed = nilai.nilai_akhir >= 75;
                const deficit = 75 - nilai.nilai_akhir;

                return (
                  <tr key={nilai.id_nilai} className="hover:bg-zinc-50/80 transition-colors align-top">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-zinc-900">{nilai.siswa?.nama_siswa}</div>
                      <div className="text-zinc-600 font-medium">{nilai.mapel?.nama_mapel}</div>
                      <div className="font-mono text-[10px] text-zinc-400 mt-0.5">NIS: {nilai.nis}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-zinc-950">
                          {nilai.nilai_akhir.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">/ KKM 75</span>
                      </div>

                      <div className="mt-1">
                        {completed ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Tuntas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertCircle className="w-3 h-3" />
                            <span>Selisih: -{deficit.toFixed(1)} poin</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          H: {attendance.hadir}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          S: {attendance.sakit}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                          I: {attendance.izin}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded border font-semibold ${
                            attendance.alpa > 0
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}
                        >
                          A: {attendance.alpa}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-1.5">
                        Faktor evaluasi komprehensif
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            id={`input-remedial-${nilai.id_nilai}`}
                            type="number"
                            min="0"
                            max="100"
                            value={values[nilai.id_nilai] || ''}
                            onChange={(e) =>
                              setValues((prev) => ({ ...prev, [nilai.id_nilai]: e.target.value }))
                            }
                            placeholder="Nilai baru"
                            className="w-24 px-2.5 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 font-mono"
                          />
                          <input
                            id={`input-catatan-${nilai.id_nilai}`}
                            type="text"
                            value={notes[nilai.id_nilai] || ''}
                            onChange={(e) =>
                              setNotes((prev) => ({ ...prev, [nilai.id_nilai]: e.target.value }))
                            }
                            placeholder="Catatan bimbingan..."
                            className="w-40 px-2.5 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                          />
                        </div>

                        {/* Quick Presets for Teachers */}
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="text-zinc-400">Preset:</span>
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(nilai.id_nilai, 75)}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono border border-zinc-200 cursor-pointer"
                            title="Set batas tuntas KKM 75"
                          >
                            KKM (75)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(nilai.id_nilai, 78)}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono border border-zinc-200 cursor-pointer"
                          >
                            78
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyPreset(nilai.id_nilai, 80)}
                            className="px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono border border-zinc-200 cursor-pointer"
                          >
                            80
                          </button>
                        </div>

                        {latest && (
                          <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 pt-0.5">
                            <TrendingUp className="w-3 h-3 text-emerald-600" />
                            <span>
                              Riwayat terakhir: {latest.nilai_remedial.toFixed(2)} &middot; {latest.tanggal}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        id={`btn-save-remedial-${nilai.id_nilai}`}
                        onClick={() => save(nilai.id_nilai)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                      <div className="text-[10px] text-zinc-400 font-mono mt-1">
                        {history.length} riwayat tes
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    Tidak ada siswa yang memenuhi kriteria filter remedial ini.
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
