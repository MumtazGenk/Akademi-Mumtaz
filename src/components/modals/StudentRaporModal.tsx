import React, { useState } from 'react';
import { SiswaEnriched, MataPelajaran, Guru } from '../../types';
import { useDatabase } from '../../context/DatabaseContext';
import {
  X,
  Printer,
  Award,
  BookOpen,
  Calendar,
  MapPin,
  User,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface StudentRaporModalProps {
  siswa: SiswaEnriched | null;
  onClose: () => void;
}

export const StudentRaporModal: React.FC<StudentRaporModalProps> = ({ siswa, onClose }) => {
  const { activeTahunAjaran, mapelList, guruList, addNilai } = useDatabase();
  const [showAddGrade, setShowAddGrade] = useState<boolean>(false);
  const [selectedMapelId, setSelectedMapelId] = useState<number>(mapelList[0]?.id_mapel || 1);
  const [selectedGuruId, setSelectedGuruId] = useState<number>(guruList[0]?.id_guru || 1);
  const [inputTugas, setInputTugas] = useState<number>(80);
  const [inputUTS, setInputUTS] = useState<number>(80);
  const [inputUAS, setInputUAS] = useState<number>(80);

  if (!siswa) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPredikat = (score: number) => {
    if (score >= 90) return { grade: 'A', desc: 'Sangat Baik' };
    if (score >= 80) return { grade: 'B', desc: 'Baik' };
    if (score >= 75) return { grade: 'C', desc: 'Cukup (Tuntas)' };
    return { grade: 'D', desc: 'Perlu Remidi' };
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    addNilai({
      nis: siswa.nis,
      id_mapel: Number(selectedMapelId),
      id_guru: Number(selectedGuruId),
      id_tahun_ajaran: activeTahunAjaran.id_tahun_ajaran,
      nilai_tugas: Number(inputTugas),
      nilai_uts: Number(inputUTS),
      nilai_uas: Number(inputUAS),
    });
    setShowAddGrade(false);
  };

  const grades = siswa.nilaiList || [];
  const KKM = 75.0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-zinc-300 rounded-lg shadow-xl w-full max-w-3xl my-8 overflow-hidden text-zinc-900">
        {/* Modal Top Bar */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-zinc-300" />
            <div>
              <h3 className="font-bold text-sm sm:text-base tracking-wide">
                Laporan Hasil Belajar (Rapor Akademik)
              </h3>
              <p className="text-xs text-zinc-400 font-mono">SMK NEGERI 2 MAGELANG</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded border border-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Transcript Body */}
        <div className="p-6 space-y-6">
          {/* Header Identitas Siswa */}
          <div className="border border-zinc-200 rounded-lg p-4 bg-zinc-50/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">Nama Lengkap</span>
                <span className="font-bold text-zinc-950">{siswa.nama_siswa}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">NIS</span>
                <span className="font-mono font-bold text-zinc-900">{siswa.nis}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">Kelas / Rombel</span>
                <span className="font-semibold text-zinc-900">{siswa.kelas?.nama_kelas}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">Kompetensi Keahlian</span>
                <span className="font-semibold text-zinc-900">{siswa.jurusan?.nama_jurusan}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">Jenis Kelamin</span>
                <span>{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4">
                <span className="text-zinc-500 w-28">Semester / Tahun</span>
                <span className="font-mono">{activeTahunAjaran.semester} · {activeTahunAjaran.tahun_ajaran}</span>
              </div>
              <div className="flex justify-between sm:justify-start gap-4 sm:col-span-2">
                <span className="text-zinc-500 w-28">Alamat Tinggal</span>
                <span className="text-zinc-800">{siswa.alamat}</span>
              </div>
            </div>
          </div>

          {/* Transcript Grade Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-zinc-700" />
                Capaian Kompetensi Mata Pelajaran
              </h4>
              <button
                onClick={() => setShowAddGrade(!showAddGrade)}
                className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {showAddGrade ? 'Batal Tambah' : 'Tambah Nilai Mapel'}
              </button>
            </div>

            {/* Quick Add Grade Form */}
            {showAddGrade && (
              <form onSubmit={handleSaveGrade} className="mb-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50 space-y-3">
                <div className="font-semibold text-xs text-zinc-900">Form Input Nilai Mata Pelajaran</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-500 mb-1">Mata Pelajaran</label>
                    <select
                      value={selectedMapelId}
                      onChange={(e) => setSelectedMapelId(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5"
                    >
                      {mapelList.map((m) => (
                        <option key={m.id_mapel} value={m.id_mapel}>
                          {m.kode_mapel} - {m.nama_mapel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">Guru Penguji</label>
                    <select
                      value={selectedGuruId}
                      onChange={(e) => setSelectedGuruId(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5"
                    >
                      {guruList.map((g) => (
                        <option key={g.id_guru} value={g.id_guru}>
                          {g.nama_guru}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-500 mb-1">Tugas (30%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={inputTugas}
                      onChange={(e) => setInputTugas(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">UTS (30%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={inputUTS}
                      onChange={(e) => setInputUTS(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 mb-1">UAS (40%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={inputUAS}
                      onChange={(e) => setInputUAS(Number(e.target.value))}
                      className="w-full bg-white border border-zinc-200 rounded px-2 py-1.5 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGrade(false)}
                    className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800"
                  >
                    Simpan Nilai
                  </button>
                </div>
              </form>
            )}

            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-mono text-[11px] border-b border-zinc-200">
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-3">Pengampu</th>
                    <th className="py-2.5 px-2 text-center">Tugas (30%)</th>
                    <th className="py-2.5 px-2 text-center">UTS (30%)</th>
                    <th className="py-2.5 px-2 text-center">UAS (40%)</th>
                    <th className="py-2.5 px-3 text-right">Nilai Akhir</th>
                    <th className="py-2.5 px-3 text-center">Predikat</th>
                    <th className="py-2.5 px-3 text-center">Ketuntasan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {grades.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-zinc-400">
                        Belum ada catatan nilai yang terinput untuk siswa ini.
                      </td>
                    </tr>
                  ) : (
                    grades.map((grade) => {
                      const p = getPredikat(grade.nilai_akhir);
                      const isTuntas = grade.nilai_akhir >= KKM;
                      return (
                        <tr key={grade.id_nilai} className="hover:bg-zinc-50">
                          <td className="py-2.5 px-3">
                            <div className="font-semibold text-zinc-900">{grade.mapel?.nama_mapel}</div>
                            <div className="text-[10px] font-mono text-zinc-400">{grade.mapel?.kode_mapel}</div>
                          </td>
                          <td className="py-2.5 px-3 text-zinc-600">
                            {grade.guru?.nama_guru}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-zinc-700">
                            {grade.nilai_tugas.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-zinc-700">
                            {grade.nilai_uts.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-2 text-center font-mono text-zinc-700">
                            {grade.nilai_uas.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-zinc-950">
                            {grade.nilai_akhir.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 text-[11px]">
                              {p.grade}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isTuntas ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-800 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900" />
                                Tuntas
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                                <AlertCircle className="w-3.5 h-3.5 text-zinc-600" />
                                Remidi
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekapitulasi Rapor */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50">
            <div>
              <div className="text-xs text-zinc-500">Rerata Nilai Akhir Siswa:</div>
              <div className="text-2xl font-mono font-bold text-zinc-900">
                {siswa.rataRataNilai !== undefined ? siswa.rataRataNilai.toFixed(2) : '—'}
              </div>
            </div>

            <div className="text-right text-xs text-zinc-500">
              <div>Kriteria Ketuntasan Minimal (KKM): <span className="font-mono font-bold text-zinc-800">75.00</span></div>
              <div className="mt-1">
                Status: {siswa.rataRataNilai && siswa.rataRataNilai >= 75 ? (
                  <span className="font-semibold text-zinc-900">Kompeten & Tuntas Belajar</span>
                ) : (
                  <span className="font-semibold text-zinc-600">Perlu Bimbingan Tambahan</span>
                )}
              </div>
            </div>
          </div>

          {/* Official Signatures Footprint for Print */}
          <div className="hidden print:grid grid-cols-2 pt-12 text-xs text-center">
            <div>
              <div>Mengetahui,</div>
              <div>Orang Tua / Wali Murid</div>
              <div className="mt-16 font-bold">( ........................................ )</div>
            </div>
            <div>
              <div>Magelang, 04 September 2026</div>
              <div>Wali Kelas / Kepala Program</div>
              <div className="mt-16 font-bold underline">Budi Santoso, M.Kom.</div>
              <div className="font-mono text-[10px]">NIP. 198001012005011001</div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-100 border-t border-zinc-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-white text-zinc-800 border border-zinc-300 rounded hover:bg-zinc-50 cursor-pointer"
          >
            Tutup Lembar Rapor
          </button>
        </div>
      </div>
    </div>
  );
};
