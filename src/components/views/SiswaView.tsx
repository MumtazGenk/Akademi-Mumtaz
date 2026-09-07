import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { SiswaEnriched, JenisKelamin } from '../../types';
import { StudentRaporModal } from '../modals/StudentRaporModal';
import {
  Users,
  Search,
  Filter,
  Eye,
  FileText,
  Plus,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';

export const SiswaView: React.FC = () => {
  const { enrichedSiswa, kelasList, jurusanList, searchQuery, addSiswa } = useDatabase();

  const [selectedTingkat, setSelectedTingkat] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedJurusan, setSelectedJurusan] = useState<string>('Semua');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');

  const [selectedStudentForRapor, setSelectedStudentForRapor] = useState<SiswaEnriched | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);

  // New student state
  const [newNis, setNewNis] = useState('');
  const [newNama, setNewNama] = useState('');
  const [newGender, setNewGender] = useState<JenisKelamin>('L');
  const [newTglLahir, setNewTglLahir] = useState('2008-01-01');
  const [newAlamat, setNewAlamat] = useState('Magelang');
  const [newKelasId, setNewKelasId] = useState<number>(kelasList[0]?.id_kelas || 1);

  const filteredStudents = useMemo(() => {
    return enrichedSiswa.filter((item) => {
      if (selectedTingkat !== 'Semua' && item.kelas?.tingkat !== selectedTingkat) return false;
      if (selectedKelas !== 'Semua' && String(item.id_kelas) !== selectedKelas) return false;
      if (selectedJurusan !== 'Semua' && item.jurusan?.kode_jurusan !== selectedJurusan) return false;
      if (selectedGender !== 'Semua' && item.jenis_kelamin !== selectedGender) return false;

      if (selectedStatus === 'Tuntas' && (item.rataRataNilai ?? 0) < 75) return false;
      if (selectedStatus === 'Remidi' && ((item.rataRataNilai ?? 100) >= 75 || item.rataRataNilai === undefined)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.nama_siswa.toLowerCase().includes(q);
        const matchNis = item.nis.toLowerCase().includes(q);
        const matchAlamat = item.alamat.toLowerCase().includes(q);
        const matchKelas = item.kelas?.nama_kelas.toLowerCase().includes(q);
        if (!matchName && !matchNis && !matchAlamat && !matchKelas) return false;
      }
      return true;
    });
  }, [
    enrichedSiswa,
    selectedTingkat,
    selectedKelas,
    selectedJurusan,
    selectedGender,
    selectedStatus,
    searchQuery,
  ]);

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNis.trim() || !newNama.trim()) return;

    addSiswa({
      nis: newNis.trim(),
      nama_siswa: newNama.trim(),
      jenis_kelamin: newGender,
      tanggal_lahir: newTglLahir,
      alamat: newAlamat.trim(),
      no_hp_ortu: null,
      id_kelas: Number(newKelasId),
    });

    setShowAddStudentModal(false);
    setNewNis('');
    setNewNama('');
  };

  return (
    <div className="space-y-6">
      {/* Control / Filter Bar */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-zinc-700" />
              Direktori Peserta Didik & Rapor Akademik
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Data 20 siswa SMKN 2 Magelang beserta keterhubungan kelas, nilai evaluasi, dan biodata
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrasi Siswa Baru</span>
            </button>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-zinc-500 font-medium mb-1">Tingkat</label>
            <select
              value={selectedTingkat}
              onChange={(e) => setSelectedTingkat(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Tingkat</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
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
            <label className="block text-zinc-500 font-medium mb-1">Jurusan</label>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Jurusan</option>
              {jurusanList.map((j) => (
                <option key={j.id_jurusan} value={j.kode_jurusan}>
                  {j.kode_jurusan}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Jenis Kelamin</label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua L/P</option>
              <option value="L">Laki-laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Status Rerata</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Nilai</option>
              <option value="Tuntas">Tuntas (≥ 75.0)</option>
              <option value="Remidi">Perlu Remidi (&lt; 75.0)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Students */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
        <div className="px-4 py-3 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
          <span>
            Menampilkan <strong className="text-zinc-900">{filteredStudents.length}</strong> siswa
          </span>
          <span className="font-mono text-[11px] text-zinc-400">Tabel `siswa` & `kelas`</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">NIS</th>
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-3 text-center">L/P</th>
                <th className="py-3 px-4">Kelas & Konsentrasi</th>
                <th className="py-3 px-4">Tanggal Lahir</th>
                <th className="py-3 px-4">Alamat Domisili</th>
                <th className="py-3 px-4 text-right">Rerata Nilai</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-400">
                    Tidak ditemukan data siswa dengan kriteria pencarian ini.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((siswa) => {
                  const hasGrade = siswa.rataRataNilai !== undefined;
                  const isTuntas = hasGrade && (siswa.rataRataNilai ?? 0) >= 75;

                  return (
                    <tr key={siswa.nis} className="hover:bg-zinc-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                        {siswa.nis}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-950 text-xs">{siswa.nama_siswa}</div>
                        <div className="text-[11px] text-zinc-400">
                          {siswa.nilaiList?.length || 0} Mata Pelajaran Terdaftar
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            siswa.jenis_kelamin === 'L'
                              ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                              : 'bg-zinc-200/70 text-zinc-900 border border-zinc-300'
                          }`}
                        >
                          {siswa.jenis_kelamin}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">{siswa.kelas?.nama_kelas}</div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          {siswa.jurusan?.kode_jurusan}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-600">
                        {siswa.tanggal_lahir}
                      </td>
                      <td className="py-3 px-4 text-zinc-700 max-w-xs truncate" title={siswa.alamat}>
                        {siswa.alamat}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-zinc-950">
                        {hasGrade ? siswa.rataRataNilai?.toFixed(2) : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {hasGrade ? (
                          isTuntas ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-800 font-medium bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                              <CheckCircle2 className="w-3 h-3 text-zinc-900" />
                              Tuntas
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-zinc-700 font-medium bg-zinc-200/60 px-2 py-0.5 rounded border border-zinc-300">
                              <AlertCircle className="w-3 h-3 text-zinc-600" />
                              Remidi
                            </span>
                          )
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">Belum Ada</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedStudentForRapor(siswa)}
                          className="px-2.5 py-1 text-xs font-semibold bg-white text-zinc-800 hover:text-zinc-950 border border-zinc-300 hover:border-zinc-500 rounded flex items-center gap-1 mx-auto transition-colors cursor-pointer"
                          title="Lihat Lembar Rapor Siswa"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Rapor</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rapor Detail Modal */}
      {selectedStudentForRapor && (
        <StudentRaporModal
          siswa={selectedStudentForRapor}
          onClose={() => setSelectedStudentForRapor(null)}
        />
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
          <div className="bg-white border border-zinc-300 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-zinc-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">Registrasi Peserta Didik Baru</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nomor Induk Siswa (NIS)</label>
                <input
                  type="text"
                  placeholder="Contoh: 2421"
                  value={newNis}
                  onChange={(e) => setNewNis(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-1.5 font-mono text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Sesuai Akta"
                  value={newNama}
                  onChange={(e) => setNewNama(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-1.5 text-zinc-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Jenis Kelamin</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as JenisKelamin)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-900"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-600 font-medium mb-1">Rombel (Kelas)</label>
                  <select
                    value={newKelasId}
                    onChange={(e) => setNewKelasId(Number(e.target.value))}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded px-2.5 py-1.5 text-zinc-900"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>
                        {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Tanggal Lahir</label>
                <input
                  type="date"
                  value={newTglLahir}
                  onChange={(e) => setNewTglLahir(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-1.5 font-mono text-zinc-900"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  placeholder="Kelurahan / Kecamatan, Magelang"
                  value={newAlamat}
                  onChange={(e) => setNewAlamat(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded px-3 py-1.5 text-zinc-900"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3.5 py-1.5 text-zinc-600 hover:text-zinc-900"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 font-semibold bg-zinc-900 text-white rounded hover:bg-zinc-800"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
