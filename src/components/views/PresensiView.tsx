import React, { useMemo, useState } from 'react';
import { ClipboardCheck, CalendarDays, Users } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { StatusPresensi } from '../../types';

const statuses: StatusPresensi[] = ['Hadir', 'Sakit', 'Izin', 'Alpa'];

export const PresensiView: React.FC = () => {
  const { siswaList, kelasList, presensiList, addPresensi, updatePresensi } = useDatabase();
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [selectedKelas, setSelectedKelas] = useState('Semua');
  const [message, setMessage] = useState('');

  const students = useMemo(() => siswaList.filter((siswa) => selectedKelas === 'Semua' || String(siswa.id_kelas) === selectedKelas), [siswaList, selectedKelas]);
  const getRecord = (nis: string) => presensiList.find((item) => item.nis === nis && item.tanggal === tanggal);

  const saveStatus = async (nis: string, status: StatusPresensi) => {
    try {
      const siswa = siswaList.find((item) => item.nis === nis);
      if (!siswa) return;
      const existing = getRecord(nis);
      if (existing) await updatePresensi(existing.id_presensi, { status });
      else await addPresensi({ nis, id_kelas: siswa.id_kelas, tanggal, status, keterangan: null });
      setMessage('Presensi berhasil disimpan.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Presensi gagal disimpan.');
    }
  };

  const summary = statuses.map((status) => ({ status, count: students.filter((siswa) => getRecord(siswa.nis)?.status === status).length }));

  return (
    <div className="space-y-6">
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2"><ClipboardCheck className="w-5 h-5" /> Presensi Siswa</h2>
            <p className="text-xs text-zinc-500 mt-1">Catat kehadiran harian per siswa dan rombongan belajar.</p>
          </div>
          <div className="flex gap-2 text-xs">
            <label className="flex items-center gap-2 border border-zinc-200 rounded-md px-2.5 py-1.5"><CalendarDays className="w-3.5 h-3.5 text-zinc-400" /><input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></label>
            <select value={selectedKelas} onChange={(e) => setSelectedKelas(e.target.value)} className="border border-zinc-200 rounded-md px-2.5 py-1.5">
              <option value="Semua">Semua Kelas</option>
              {kelasList.map((kelas) => <option key={kelas.id_kelas} value={kelas.id_kelas}>{kelas.nama_kelas}</option>)}
            </select>
          </div>
        </div>
        {message && <div className="mt-4 bg-zinc-100 border border-zinc-200 rounded-md px-3 py-2 text-xs text-zinc-700">{message}</div>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summary.map(({ status, count }) => <div key={status} className="bg-white border border-zinc-200 rounded-lg p-4"><div className="text-xs text-zinc-500">{status}</div><div className="text-2xl font-mono font-bold mt-1">{count}</div></div>)}
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-200 flex items-center gap-2 text-xs text-zinc-600"><Users className="w-4 h-4" /> {students.length} siswa pada {tanggal}</div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="bg-zinc-900 text-white"><th className="px-4 py-3">NIS</th><th className="px-4 py-3">Nama</th><th className="px-4 py-3">Kelas</th><th className="px-4 py-3">Status Kehadiran</th></tr></thead><tbody className="divide-y divide-zinc-200">
          {students.map((siswa) => <tr key={siswa.nis} className="hover:bg-zinc-50"><td className="px-4 py-3 font-mono">{siswa.nis}</td><td className="px-4 py-3 font-semibold">{siswa.nama_siswa}</td><td className="px-4 py-3">{kelasList.find((kelas) => kelas.id_kelas === siswa.id_kelas)?.nama_kelas}</td><td className="px-4 py-3"><select value={getRecord(siswa.nis)?.status || ''} onChange={(e) => saveStatus(siswa.nis, e.target.value as StatusPresensi)} className="border border-zinc-200 rounded-md px-2 py-1.5"><option value="" disabled>Pilih status</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}
        </tbody></table></div>
      </div>
    </div>
  );
};
