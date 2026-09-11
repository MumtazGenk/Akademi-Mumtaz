import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardCheck, RefreshCcw, Save } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';

export const RemedialView: React.FC = () => {
  const { enrichedNilai, remedialList, presensiList, activeTahunAjaran, addRemedial } = useDatabase();
  const [values, setValues] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [message, setMessage] = useState('');
  const candidates = useMemo(() => enrichedNilai.filter((nilai) => {
    const history = remedialList.filter((item) => item.id_nilai === nilai.id_nilai);
    return nilai.nilai_akhir < 75 || history.length > 0;
  }), [enrichedNilai, remedialList]);

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
    if (!nilai || !Number.isFinite(value)) return setMessage('Masukkan nilai remedial terlebih dahulu.');
    try {
      await addRemedial({ id_nilai: nilai.id_nilai, nis: nilai.nis, id_mapel: nilai.id_mapel, id_tahun_ajaran: activeTahunAjaran.id_tahun_ajaran, nilai_awal: previous?.nilai_awal ?? nilai.nilai_akhir, nilai_remedial: value, tanggal: new Date().toISOString().slice(0, 10), catatan: notes[nilaiId] || null });
      setMessage('Nilai remedial berhasil disimpan.');
      setValues((prev) => ({ ...prev, [nilaiId]: '' }));
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Remedial gagal disimpan.'); }
  };

  return <div className="space-y-6">
    <div className="bg-white border border-zinc-200 rounded-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-lg font-bold flex items-center gap-2"><RefreshCcw className="w-5 h-5" /> Program Remedial</h2><p className="text-xs text-zinc-500 mt-1 max-w-2xl">Siswa masuk daftar ini ketika nilai akhir di bawah KKM 75. Guru dapat memasukkan nilai perbaikan, melihat riwayat, dan memantau kehadiran sebagai konteks pembinaan.</p></div>
        <div className="text-right text-xs"><div className="font-mono font-bold text-zinc-900">{candidates.length}</div><div className="text-zinc-500">perlu ditinjau</div></div>
      </div>
      {message && <div className="mt-4 bg-zinc-100 border border-zinc-200 rounded-md px-3 py-2 text-xs">{message}</div>}
    </div>
    <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden"><div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="bg-zinc-900 text-white"><th className="px-4 py-3">Siswa / Mapel</th><th className="px-4 py-3">Nilai</th><th className="px-4 py-3">Ringkasan Absensi</th><th className="px-4 py-3">Input Remedial</th><th className="px-4 py-3">Aksi</th></tr></thead><tbody className="divide-y divide-zinc-200">
      {candidates.map((nilai) => {
        const history = remedialList.filter((item) => item.id_nilai === nilai.id_nilai);
        const attendance = attendanceFor(nilai.nis);
        const latest = history[0];
        const completed = nilai.nilai_akhir >= 75;
        return <tr key={nilai.id_nilai} className="hover:bg-zinc-50 align-top"><td className="px-4 py-3"><div className="font-semibold">{nilai.siswa?.nama_siswa}</div><div className="text-zinc-500">{nilai.mapel?.nama_mapel}</div><div className="font-mono text-[10px] text-zinc-400">{nilai.nis}</div></td><td className="px-4 py-3"><div className="font-mono font-bold">{nilai.nilai_akhir.toFixed(2)}</div><span className={`inline-flex items-center gap-1 mt-1 ${completed ? 'text-emerald-700' : 'text-amber-700'}`}>{completed ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}{completed ? 'Tuntas setelah remedial' : 'Belum tuntas'}</span></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1.5 text-[10px] font-mono"><span className="status-chip status-chip--present"><ClipboardCheck className="w-3 h-3" />H {attendance.hadir}</span><span className="status-chip">S {attendance.sakit}</span><span className="status-chip">I {attendance.izin}</span><span className="status-chip status-chip--absent">A {attendance.alpa}</span></div><div className="text-[10px] text-zinc-400 mt-2">Absensi menjadi bahan evaluasi, bukan pengubah nilai.</div></td><td className="px-4 py-3"><div className="flex gap-2"><input type="number" min="0" max="100" value={values[nilai.id_nilai] || ''} onChange={(e) => setValues((prev) => ({ ...prev, [nilai.id_nilai]: e.target.value }))} className="w-24 field" placeholder="0-100" /><input value={notes[nilai.id_nilai] || ''} onChange={(e) => setNotes((prev) => ({ ...prev, [nilai.id_nilai]: e.target.value }))} placeholder="Catatan" className="w-36 field" /></div>{latest && <div className="text-[10px] text-zinc-400 mt-1">Terakhir: {latest.nilai_remedial.toFixed(2)} · {latest.tanggal}</div>}</td><td className="px-4 py-3"><button onClick={() => save(nilai.id_nilai)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 text-white rounded-md font-semibold"><Save className="w-3.5 h-3.5" /> Simpan</button><div className="text-[10px] text-zinc-400 mt-1">{history.length} riwayat</div></td></tr>;
      })}
      {candidates.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-zinc-400">Tidak ada siswa yang perlu remedial.</td></tr>}
    </tbody></table></div></div>
  </div>;
};
