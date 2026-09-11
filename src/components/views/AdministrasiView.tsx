import React, { useState } from 'react';
import { Settings2, Trash2, Plus } from 'lucide-react';
import { useDatabase } from '../../context/DatabaseContext';
import { TingkatKelas } from '../../types';

type Entity = 'guru' | 'mapel' | 'kelas' | 'jadwal' | 'periode';

export const AdministrasiView: React.FC = () => {
  const db = useDatabase();
  const [entity, setEntity] = useState<Entity>('guru');
  const [message, setMessage] = useState('');
  const [guru, setGuru] = useState({ nip: '', nama_guru: '', email: '', no_hp: '' });
  const [mapel, setMapel] = useState({ kode_mapel: '', nama_mapel: '', kelompok: 'Umum' });
  const [kelas, setKelas] = useState({ nama_kelas: '', tingkat: 'X' as TingkatKelas, id_jurusan: db.jurusanList[0]?.id_jurusan || 1 });
  const [jadwal, setJadwal] = useState({ id_guru: db.guruList[0]?.id_guru || 1, id_mapel: db.mapelList[0]?.id_mapel || 1, id_kelas: db.kelasList[0]?.id_kelas || 1, hari: 'Senin' as const, jam_mulai: '07:00:00', jam_selesai: '08:30:00', ruang: 'Ruang Teori' });
  const [periode, setPeriode] = useState<{ tahun_ajaran: string; semester: 'Ganjil' | 'Genap' }>({ tahun_ajaran: '2027/2028', semester: 'Ganjil' });

  const run = async (action: () => Promise<void> | void) => { try { await action(); setMessage('Data berhasil disimpan.'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Operasi gagal.'); } };
  const add = () => {
    if (entity === 'guru') return run(() => db.addGuru(guru));
    if (entity === 'mapel') return run(() => db.addMapel(mapel));
    if (entity === 'kelas') return run(() => db.addKelas(kelas));
    if (entity === 'jadwal') return run(() => db.addJadwal(jadwal));
    return run(() => db.addTahunAjaran({ ...periode, status: 'Tidak Aktif' }));
  };

  return <div className="space-y-6">
    <div className="bg-white border border-zinc-200 rounded-lg p-5"><h2 className="text-lg font-bold flex items-center gap-2"><Settings2 className="w-5 h-5" /> Administrasi Data Akademik</h2><p className="text-xs text-zinc-500 mt-1">Tambah dan hapus data master dengan validasi relasi. Perubahan edit tersedia melalui operasi context dan akan diperluas pada form berikutnya.</p>{message && <div className="mt-4 bg-zinc-100 border border-zinc-200 rounded-md px-3 py-2 text-xs">{message}</div>}</div>
    <div className="flex gap-1 overflow-x-auto bg-white border border-zinc-200 rounded-lg p-1">{(['guru', 'mapel', 'kelas', 'jadwal', 'periode'] as Entity[]).map((item) => <button key={item} onClick={() => { setEntity(item); setMessage(''); }} className={`px-3 py-2 text-xs rounded-md capitalize ${entity === item ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:bg-zinc-100'}`}>{item === 'mapel' ? 'Mata Pelajaran' : item === 'periode' ? 'Tahun Ajaran' : item}</button>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3 text-xs">
        <h3 className="font-bold text-sm">Tambah {entity === 'mapel' ? 'Mata Pelajaran' : entity === 'periode' ? 'Tahun Ajaran' : entity}</h3>
        {entity === 'guru' && <><input placeholder="NIP" value={guru.nip} onChange={(e) => setGuru({ ...guru, nip: e.target.value })} className="field" /><input placeholder="Nama guru" value={guru.nama_guru} onChange={(e) => setGuru({ ...guru, nama_guru: e.target.value })} className="field" /><input placeholder="Email" value={guru.email} onChange={(e) => setGuru({ ...guru, email: e.target.value })} className="field" /><input placeholder="No. HP" value={guru.no_hp} onChange={(e) => setGuru({ ...guru, no_hp: e.target.value })} className="field" /></>}
        {entity === 'mapel' && <><input placeholder="Kode mapel" value={mapel.kode_mapel} onChange={(e) => setMapel({ ...mapel, kode_mapel: e.target.value })} className="field" /><input placeholder="Nama mata pelajaran" value={mapel.nama_mapel} onChange={(e) => setMapel({ ...mapel, nama_mapel: e.target.value })} className="field" /><input placeholder="Kelompok kurikulum" value={mapel.kelompok} onChange={(e) => setMapel({ ...mapel, kelompok: e.target.value })} className="field" /></>}
        {entity === 'kelas' && <><input placeholder="Nama kelas" value={kelas.nama_kelas} onChange={(e) => setKelas({ ...kelas, nama_kelas: e.target.value })} className="field" /><select value={kelas.tingkat} onChange={(e) => setKelas({ ...kelas, tingkat: e.target.value as TingkatKelas })} className="field"><option>X</option><option>XI</option><option>XII</option></select><select value={kelas.id_jurusan} onChange={(e) => setKelas({ ...kelas, id_jurusan: Number(e.target.value) })} className="field">{db.jurusanList.map((item) => <option key={item.id_jurusan} value={item.id_jurusan}>{item.kode_jurusan}</option>)}</select></>}
        {entity === 'jadwal' && <><select value={jadwal.id_guru} onChange={(e) => setJadwal({ ...jadwal, id_guru: Number(e.target.value) })} className="field">{db.guruList.map((item) => <option key={item.id_guru} value={item.id_guru}>{item.nama_guru}</option>)}</select><select value={jadwal.id_mapel} onChange={(e) => setJadwal({ ...jadwal, id_mapel: Number(e.target.value) })} className="field">{db.mapelList.map((item) => <option key={item.id_mapel} value={item.id_mapel}>{item.nama_mapel}</option>)}</select><select value={jadwal.id_kelas} onChange={(e) => setJadwal({ ...jadwal, id_kelas: Number(e.target.value) })} className="field">{db.kelasList.map((item) => <option key={item.id_kelas} value={item.id_kelas}>{item.nama_kelas}</option>)}</select><div className="grid grid-cols-2 gap-2"><input type="time" value={jadwal.jam_mulai.slice(0, 5)} onChange={(e) => setJadwal({ ...jadwal, jam_mulai: `${e.target.value}:00` })} className="field" /><input type="time" value={jadwal.jam_selesai.slice(0, 5)} onChange={(e) => setJadwal({ ...jadwal, jam_selesai: `${e.target.value}:00` })} className="field" /></div><input placeholder="Ruang" value={jadwal.ruang} onChange={(e) => setJadwal({ ...jadwal, ruang: e.target.value })} className="field" /></>}
        {entity === 'periode' && <><input value={periode.tahun_ajaran} onChange={(e) => setPeriode({ ...periode, tahun_ajaran: e.target.value })} className="field" /><select value={periode.semester} onChange={(e) => setPeriode({ ...periode, semester: e.target.value as 'Ganjil' | 'Genap' })} className="field"><option>Ganjil</option><option>Genap</option></select></>}
        <button onClick={add} className="inline-flex items-center gap-1.5 px-3 py-2 bg-zinc-900 text-white rounded-md font-semibold"><Plus className="w-3.5 h-3.5" /> Simpan Data</button>
      </div>
      <div className="bg-white border border-zinc-200 rounded-lg p-5"><h3 className="font-bold text-sm mb-3">Data {entity}</h3><div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-100">{entity === 'guru' && db.guruList.map((item) => <Row key={item.id_guru} label={item.nama_guru} detail={item.nip} onDelete={() => run(() => db.deleteGuru(item.id_guru))} />)}{entity === 'mapel' && db.mapelList.map((item) => <Row key={item.id_mapel} label={item.nama_mapel} detail={item.kode_mapel} onDelete={() => run(() => db.deleteMapel(item.id_mapel))} />)}{entity === 'kelas' && db.kelasList.map((item) => <Row key={item.id_kelas} label={item.nama_kelas} detail={db.jurusanList.find((j) => j.id_jurusan === item.id_jurusan)?.kode_jurusan || ''} onDelete={() => run(() => db.deleteKelas(item.id_kelas))} />)}{entity === 'jadwal' && db.enrichedJadwal.map((item) => <Row key={item.id_jadwal} label={`${item.hari} ${item.jam_mulai.slice(0, 5)} · ${item.kelas?.nama_kelas}`} detail={item.mapel?.nama_mapel || ''} onDelete={() => run(() => db.deleteJadwal(item.id_jadwal))} />)}{entity === 'periode' && db.tahunAjaranList.map((item) => <Row key={item.id_tahun_ajaran} label={`${item.semester} ${item.tahun_ajaran}`} detail={item.status} onDelete={() => run(() => db.deleteTahunAjaran(item.id_tahun_ajaran))} />)}</div></div>
    </div>
  </div>;
};

const Row: React.FC<{ label: string; detail: string; onDelete: () => void }> = ({ label, detail, onDelete }) => <div className="py-2.5 flex items-center justify-between gap-3 text-xs"><div><div className="font-semibold text-zinc-900">{label}</div><div className="font-mono text-zinc-400">{detail}</div></div><button onClick={onDelete} title="Hapus" className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5" /></button></div>;
