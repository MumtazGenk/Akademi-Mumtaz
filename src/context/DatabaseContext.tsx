import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Guru,
  Jadwal,
  Jurusan,
  Kelas,
  MataPelajaran,
  Nilai,
  Siswa,
  TahunAjaran,
  SiswaEnriched,
  JadwalEnriched,
  NilaiEnriched,
  TabKey,
  AuthUser,
  UserRole,
  PageViewMode,
  Presensi,
  Remedial,
  StatusPresensi,
} from '../types';
import {
  INITIAL_GURU,
  INITIAL_JADWAL,
  INITIAL_JURUSAN,
  INITIAL_KELAS,
  INITIAL_MATA_PELAJARAN,
  INITIAL_NILAI,
  INITIAL_SISWA,
  INITIAL_TAHUN_AJARAN,
} from '../data/databaseData';

interface DatabaseContextType {
  guruList: Guru[];
  jadwalList: Jadwal[];
  jurusanList: Jurusan[];
  kelasList: Kelas[];
  mapelList: MataPelajaran[];
  nilaiList: Nilai[];
  presensiList: Presensi[];
  remedialList: Remedial[];
  siswaList: Siswa[];
  tahunAjaranList: TahunAjaran[];
  activeTahunAjaran: TahunAjaran;
  setActiveTahunAjaran: (id_tahun_ajaran: number) => Promise<void> | void;
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Page mode and Auth
  pageMode: PageViewMode;
  setPageMode: (mode: PageViewMode) => void;
  currentUser: AuthUser | null;
  login: (identifier: string, credential?: string, roleHint?: UserRole) => { success: boolean; message: string; user?: AuthUser };
  logout: () => void;
  loginAsDemo: (role: UserRole) => void;
  // Enriched views
  enrichedSiswa: SiswaEnriched[];
  enrichedJadwal: JadwalEnriched[];
  enrichedNilai: NilaiEnriched[];
  // Actions - Siswa
  addSiswa: (newSiswa: Siswa) => Promise<void> | void;
  updateSiswa: (nis: string, updates: Partial<Siswa>) => Promise<void> | void;
  deleteSiswa: (nis: string) => Promise<void> | void;
  // Actions - Guru
  addGuru: (newGuru: Omit<Guru, 'id_guru'>) => Promise<void> | void;
  updateGuru: (id_guru: number, updates: Partial<Guru>) => Promise<void> | void;
  deleteGuru: (id_guru: number) => Promise<void> | void;
  // Actions - Jurusan
  addJurusan: (newJurusan: Omit<Jurusan, 'id_jurusan'>) => Promise<void> | void;
  updateJurusan: (id_jurusan: number, updates: Partial<Jurusan>) => Promise<void> | void;
  deleteJurusan: (id_jurusan: number) => Promise<void> | void;
  // Actions - Kelas
  addKelas: (newKelas: Omit<Kelas, 'id_kelas'>) => Promise<void> | void;
  updateKelas: (id_kelas: number, updates: Partial<Kelas>) => Promise<void> | void;
  deleteKelas: (id_kelas: number) => Promise<void> | void;
  // Actions - Mata Pelajaran
  addMapel: (newMapel: Omit<MataPelajaran, 'id_mapel'>) => Promise<void> | void;
  updateMapel: (id_mapel: number, updates: Partial<MataPelajaran>) => Promise<void> | void;
  deleteMapel: (id_mapel: number) => Promise<void> | void;
  // Actions - Tahun Ajaran
  addTahunAjaran: (newTahun: Omit<TahunAjaran, 'id_tahun_ajaran'>) => Promise<void> | void;
  updateTahunAjaran: (id_tahun_ajaran: number, updates: Partial<TahunAjaran>) => Promise<void> | void;
  deleteTahunAjaran: (id_tahun_ajaran: number) => Promise<void> | void;
  // Actions - Jadwal
  addJadwal: (newJadwal: Omit<Jadwal, 'id_jadwal'>) => Promise<void> | void;
  updateJadwal: (id_jadwal: number, updates: Partial<Jadwal>) => Promise<void> | void;
  deleteJadwal: (id_jadwal: number) => Promise<void> | void;
  // Actions - Nilai
  addNilai: (newNilai: Omit<Nilai, 'id_nilai' | 'nilai_akhir'>) => Promise<void> | void;
  updateNilai: (id_nilai: number, updates: Partial<Nilai>) => Promise<void> | void;
  deleteNilai: (id_nilai: number) => Promise<void> | void;
  resetDatabase: () => void;
  // Supabase Status
  isSupabaseConfigured: boolean;
  isSupabaseConnected: boolean;
  isLoadingSupabase: boolean;
  supabaseError: string | null;
  refreshFromSupabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guruList, setGuruList] = useState<Guru[]>(INITIAL_GURU);
  const [jadwalList, setJadwalList] = useState<Jadwal[]>(INITIAL_JADWAL);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>(INITIAL_JURUSAN);
  const [kelasList, setKelasList] = useState<Kelas[]>(INITIAL_KELAS);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>(INITIAL_MATA_PELAJARAN);
  const [nilaiList, setNilaiList] = useState<Nilai[]>(INITIAL_NILAI);
    const [presensiList, setPresensiList] = useState<Presensi[]>([]);
    const [remedialList, setRemedialList] = useState<Remedial[]>([]);
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [tahunAjaranList, setTahunAjaranList] = useState<TahunAjaran[]>(INITIAL_TAHUN_AJARAN);

  const [isLoadingSupabase, setIsLoadingSupabase] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabKey>('ringkasan');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Page mode & Authentication
  const [pageMode, setPageMode] = useState<PageViewMode>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const activeTahunAjaran = useMemo(() => {
    return tahunAjaranList.find((t) => t.status === 'Aktif') || tahunAjaranList[1];
  }, [tahunAjaranList]);

  const setActiveTahunAjaran = async (id_tahun_ajaran: number) => {
    setTahunAjaranList((prev) => prev.map((item) => ({
      ...item,
      status: item.id_tahun_ajaran === id_tahun_ajaran ? 'Aktif' : 'Tidak Aktif',
    })));
    if (isSupabaseConfigured) {
      await supabase.from('tahun_ajaran').update({ status: 'Tidak Aktif' }).neq('id_tahun_ajaran', id_tahun_ajaran);
      await supabase.from('tahun_ajaran').update({ status: 'Aktif' }).eq('id_tahun_ajaran', id_tahun_ajaran);
    }
  };

  // Relational mappings
  const enrichedNilai = useMemo<NilaiEnriched[]>(() => {
    const siswaMap = new Map<string, Siswa>(siswaList.map((s) => [s.nis, s]));
    const mapelMap = new Map<number, MataPelajaran>(mapelList.map((m) => [m.id_mapel, m]));
    const guruMap = new Map<number, Guru>(guruList.map((g) => [g.id_guru, g]));
    const tahunMap = new Map<number, TahunAjaran>(tahunAjaranList.map((t) => [t.id_tahun_ajaran, t]));
    const kelasMap = new Map<number, Kelas>(kelasList.map((k) => [k.id_kelas, k]));

    return nilaiList.filter((n) => n.id_tahun_ajaran === activeTahunAjaran.id_tahun_ajaran).map((n) => {
      const siswa = siswaMap.get(n.nis);
      const kelas = siswa ? kelasMap.get(siswa.id_kelas) : undefined;
      const remedialScores = remedialList
        .filter((remedial) => remedial.id_nilai === n.id_nilai)
        .map((remedial) => remedial.nilai_remedial);
      const nilaiEfektif = remedialScores.length > 0
        ? Math.max(n.nilai_akhir, ...remedialScores)
        : n.nilai_akhir;
      return {
        ...n,
        nilai_akhir: nilaiEfektif,
        siswa,
        mapel: mapelMap.get(n.id_mapel),
        guru: guruMap.get(n.id_guru),
        tahunAjaran: tahunMap.get(n.id_tahun_ajaran),
        kelas,
      };
    });
  }, [nilaiList, remedialList, siswaList, mapelList, guruList, tahunAjaranList, kelasList, activeTahunAjaran]);

  const enrichedSiswa = useMemo<SiswaEnriched[]>(() => {
    const kelasMap = new Map<number, Kelas>(kelasList.map((k) => [k.id_kelas, k]));
    const jurusanMap = new Map<number, Jurusan>(jurusanList.map((j) => [j.id_jurusan, j]));

    return siswaList.map((s) => {
      const kelas = kelasMap.get(s.id_kelas);
      const jurusan = kelas ? jurusanMap.get(kelas.id_jurusan) : undefined;
      const sNilai = enrichedNilai.filter((n) => n.nis === s.nis);
      const rataRata = sNilai.length > 0
        ? Number((sNilai.reduce((acc, curr) => acc + curr.nilai_akhir, 0) / sNilai.length).toFixed(2))
        : undefined;

      return {
        ...s,
        kelas,
        jurusan,
        nilaiList: sNilai,
        rataRataNilai: rataRata,
      };
    });
  }, [siswaList, kelasList, jurusanList, enrichedNilai]);

  const enrichedJadwal = useMemo<JadwalEnriched[]>(() => {
    const guruMap = new Map<number, Guru>(guruList.map((g) => [g.id_guru, g]));
    const mapelMap = new Map<number, MataPelajaran>(mapelList.map((m) => [m.id_mapel, m]));
    const kelasMap = new Map<number, Kelas>(kelasList.map((k) => [k.id_kelas, k]));
    const jurusanMap = new Map<number, Jurusan>(jurusanList.map((j) => [j.id_jurusan, j]));

    return jadwalList.map((j) => {
      const kelas = kelasMap.get(j.id_kelas);
      const jurusan = kelas ? jurusanMap.get(kelas.id_jurusan) : undefined;
      return {
        ...j,
        guru: guruMap.get(j.id_guru),
        mapel: mapelMap.get(j.id_mapel),
        kelas,
        jurusan,
      };
    });
  }, [jadwalList, guruList, mapelList, kelasList, jurusanList]);

  const fetchFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      setIsLoadingSupabase(true);
      setSupabaseError(null);
      const [
        resJurusan,
        resGuru,
        resMapel,
        resTahun,
        resKelas,
        resSiswa,
        resJadwal,
        resNilai,
        resPresensi,
        resRemedial,
      ] = await Promise.all([
        supabase.from('jurusan').select('*').order('id_jurusan'),
        supabase.from('guru').select('*').order('id_guru'),
        supabase.from('mata_pelajaran').select('*').order('id_mapel'),
        supabase.from('tahun_ajaran').select('*').order('id_tahun_ajaran'),
        supabase.from('kelas').select('*').order('id_kelas'),
        supabase.from('siswa').select('*').order('nis'),
        supabase.from('jadwal').select('*').order('id_jadwal'),
        supabase.from('nilai').select('*').order('id_nilai'),
        supabase.from('presensi').select('*').order('tanggal', { ascending: false }),
        supabase.from('remedial').select('*').order('tanggal', { ascending: false }),
      ]);

      if (resJurusan.error || resGuru.error || resSiswa.error) {
        const err = resJurusan.error || resGuru.error || resSiswa.error;
        console.warn('Supabase fetch error:', err);
        setSupabaseError(err?.message || 'Gagal memuat data dari Supabase');
        return;
      }

      if (resJurusan.data && resJurusan.data.length > 0) setJurusanList(resJurusan.data as Jurusan[]);
      if (resGuru.data && resGuru.data.length > 0) setGuruList(resGuru.data as Guru[]);
      if (resMapel.data && resMapel.data.length > 0) setMapelList(resMapel.data as MataPelajaran[]);
      if (resTahun.data && resTahun.data.length > 0) setTahunAjaranList(resTahun.data as TahunAjaran[]);
      if (resKelas.data && resKelas.data.length > 0) setKelasList(resKelas.data as Kelas[]);
      if (resSiswa.data && resSiswa.data.length > 0) setSiswaList(resSiswa.data as Siswa[]);
      if (resJadwal.data && resJadwal.data.length > 0) setJadwalList(resJadwal.data as Jadwal[]);
      if (resNilai.data && resNilai.data.length > 0) setNilaiList(resNilai.data as Nilai[]);
      if (resPresensi.data && resPresensi.data.length > 0) setPresensiList(resPresensi.data as Presensi[]);
      if (resRemedial.data && resRemedial.data.length > 0) setRemedialList(resRemedial.data as Remedial[]);

      setIsSupabaseConnected(true);
    } catch (err: any) {
      console.warn('Supabase connection exception:', err);
      setSupabaseError(err?.message || 'Koneksi ke Supabase gagal');
    } finally {
      setIsLoadingSupabase(false);
    }
  }, []);

  useEffect(() => {
    if (isSupabaseConfigured) {
      fetchFromSupabase();
    }
  }, [fetchFromSupabase]);

  // === Siswa CRUD ===
  const addSiswa = async (newSiswa: Siswa) => {
    setSiswaList((prev) => [...prev, newSiswa]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('siswa').insert([newSiswa]);
      } catch (err) {
        console.error('Error inserting siswa to Supabase:', err);
      }
    }
  };

  const updateSiswa = async (nis: string, updates: Partial<Siswa>) => {
    setSiswaList((prev) =>
      prev.map((item) => (item.nis === nis ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('siswa').update(updates).eq('nis', nis);
      } catch (err) {
        console.error('Error updating siswa on Supabase:', err);
      }
    }
  };

  const deleteSiswa = async (nis: string) => {
    setSiswaList((prev) => prev.filter((item) => item.nis !== nis));
    setNilaiList((prev) => prev.filter((item) => item.nis !== nis));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('siswa').delete().eq('nis', nis);
      } catch (err) {
        console.error('Error deleting siswa on Supabase:', err);
      }
    }
  };

  // === Guru CRUD ===
  const addGuru = async (newGuru: Omit<Guru, 'id_guru'>) => {
    const nextId = Math.max(...guruList.map((g) => g.id_guru), 0) + 1;
    const record: Guru = { ...newGuru, id_guru: nextId };
    setGuruList((prev) => [...prev, record]);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('guru').insert([record]).select();
        if (!error && data && data[0]) {
          setGuruList((prev) => prev.map((g) => (g.id_guru === nextId ? (data[0] as Guru) : g)));
        }
      } catch (err) {
        console.error('Error inserting guru to Supabase:', err);
      }
    }
  };

  const updateGuru = async (id_guru: number, updates: Partial<Guru>) => {
    setGuruList((prev) =>
      prev.map((item) => (item.id_guru === id_guru ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('guru').update(updates).eq('id_guru', id_guru);
      } catch (err) {
        console.error('Error updating guru on Supabase:', err);
      }
    }
  };

  const deleteGuru = async (id_guru: number) => {
    setGuruList((prev) => prev.filter((item) => item.id_guru !== id_guru));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('guru').delete().eq('id_guru', id_guru);
      } catch (err) {
        console.error('Error deleting guru on Supabase:', err);
      }
    }
  };

  // === Jurusan CRUD ===
  const addJurusan = async (newJurusan: Omit<Jurusan, 'id_jurusan'>) => {
    const nextId = Math.max(...jurusanList.map((j) => j.id_jurusan), 0) + 1;
    const record: Jurusan = { ...newJurusan, id_jurusan: nextId };
    setJurusanList((prev) => [...prev, record]);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('jurusan').insert([record]).select();
        if (!error && data && data[0]) {
          setJurusanList((prev) => prev.map((j) => (j.id_jurusan === nextId ? (data[0] as Jurusan) : j)));
        }
      } catch (err) {
        console.error('Error inserting jurusan to Supabase:', err);
      }
    }
  };

  const updateJurusan = async (id_jurusan: number, updates: Partial<Jurusan>) => {
    setJurusanList((prev) =>
      prev.map((item) => (item.id_jurusan === id_jurusan ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('jurusan').update(updates).eq('id_jurusan', id_jurusan);
      } catch (err) {
        console.error('Error updating jurusan on Supabase:', err);
      }
    }
  };

  const deleteJurusan = async (id_jurusan: number) => {
    setJurusanList((prev) => prev.filter((item) => item.id_jurusan !== id_jurusan));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('jurusan').delete().eq('id_jurusan', id_jurusan);
      } catch (err) {
        console.error('Error deleting jurusan on Supabase:', err);
      }
    }
  };

  // === Kelas CRUD ===
  const addKelas = async (newKelas: Omit<Kelas, 'id_kelas'>) => {
    const nextId = Math.max(...kelasList.map((k) => k.id_kelas), 0) + 1;
    const record: Kelas = { ...newKelas, id_kelas: nextId };
    setKelasList((prev) => [...prev, record]);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('kelas').insert([record]).select();
        if (!error && data && data[0]) {
          setKelasList((prev) => prev.map((k) => (k.id_kelas === nextId ? (data[0] as Kelas) : k)));
        }
      } catch (err) {
        console.error('Error inserting kelas to Supabase:', err);
      }
    }
  };

  const updateKelas = async (id_kelas: number, updates: Partial<Kelas>) => {
    setKelasList((prev) =>
      prev.map((item) => (item.id_kelas === id_kelas ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('kelas').update(updates).eq('id_kelas', id_kelas);
      } catch (err) {
        console.error('Error updating kelas on Supabase:', err);
      }
    }
  };

  const deleteKelas = async (id_kelas: number) => {
    setKelasList((prev) => prev.filter((item) => item.id_kelas !== id_kelas));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('kelas').delete().eq('id_kelas', id_kelas);
      } catch (err) {
        console.error('Error deleting kelas on Supabase:', err);
      }
    }
  };

  // === Mata Pelajaran CRUD ===
  const addMapel = async (newMapel: Omit<MataPelajaran, 'id_mapel'>) => {
    const nextId = Math.max(...mapelList.map((m) => m.id_mapel), 0) + 1;
    const record: MataPelajaran = { ...newMapel, id_mapel: nextId };
    setMapelList((prev) => [...prev, record]);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('mata_pelajaran').insert([record]).select();
        if (!error && data && data[0]) {
          setMapelList((prev) => prev.map((m) => (m.id_mapel === nextId ? (data[0] as MataPelajaran) : m)));
        }
      } catch (err) {
        console.error('Error inserting mata pelajaran to Supabase:', err);
      }
    }
  };

  const updateMapel = async (id_mapel: number, updates: Partial<MataPelajaran>) => {
    setMapelList((prev) =>
      prev.map((item) => (item.id_mapel === id_mapel ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('mata_pelajaran').update(updates).eq('id_mapel', id_mapel);
      } catch (err) {
        console.error('Error updating mata pelajaran on Supabase:', err);
      }
    }
  };

  const deleteMapel = async (id_mapel: number) => {
    setMapelList((prev) => prev.filter((item) => item.id_mapel !== id_mapel));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('mata_pelajaran').delete().eq('id_mapel', id_mapel);
      } catch (err) {
        console.error('Error deleting mata pelajaran on Supabase:', err);
      }
    }
  };

  // === Tahun Ajaran CRUD ===
  const addTahunAjaran = async (newTahun: Omit<TahunAjaran, 'id_tahun_ajaran'>) => {
    const nextId = Math.max(...tahunAjaranList.map((t) => t.id_tahun_ajaran), 0) + 1;
    let list = tahunAjaranList;
    if (newTahun.status === 'Aktif') {
      list = list.map((t) => ({ ...t, status: 'Tidak Aktif' as const }));
    }
    const record: TahunAjaran = { ...newTahun, id_tahun_ajaran: nextId };
    setTahunAjaranList([...list, record]);
    if (isSupabaseConfigured) {
      try {
        if (newTahun.status === 'Aktif') {
          await supabase.from('tahun_ajaran').update({ status: 'Tidak Aktif' }).neq('id_tahun_ajaran', 0);
        }
        const { data, error } = await supabase.from('tahun_ajaran').insert([record]).select();
        if (!error && data && data[0]) {
          setTahunAjaranList((prev) => prev.map((t) => (t.id_tahun_ajaran === nextId ? (data[0] as TahunAjaran) : t)));
        }
      } catch (err) {
        console.error('Error inserting tahun ajaran to Supabase:', err);
      }
    }
  };

  const updateTahunAjaran = async (id_tahun_ajaran: number, updates: Partial<TahunAjaran>) => {
    setTahunAjaranList((prev) =>
      prev.map((item) => {
        if (item.id_tahun_ajaran === id_tahun_ajaran) {
          return { ...item, ...updates };
        }
        if (updates.status === 'Aktif') {
          return { ...item, status: 'Tidak Aktif' };
        }
        return item;
      })
    );
    if (isSupabaseConfigured) {
      try {
        if (updates.status === 'Aktif') {
          await supabase.from('tahun_ajaran').update({ status: 'Tidak Aktif' }).neq('id_tahun_ajaran', id_tahun_ajaran);
        }
        await supabase.from('tahun_ajaran').update(updates).eq('id_tahun_ajaran', id_tahun_ajaran);
      } catch (err) {
        console.error('Error updating tahun ajaran on Supabase:', err);
      }
    }
  };

  const deleteTahunAjaran = async (id_tahun_ajaran: number) => {
    setTahunAjaranList((prev) => prev.filter((item) => item.id_tahun_ajaran !== id_tahun_ajaran));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('tahun_ajaran').delete().eq('id_tahun_ajaran', id_tahun_ajaran);
      } catch (err) {
        console.error('Error deleting tahun ajaran on Supabase:', err);
      }
    }
  };

  // === Jadwal CRUD ===
  const addJadwal = async (newJadwal: Omit<Jadwal, 'id_jadwal'>) => {
    const nextId = Math.max(...jadwalList.map((j) => j.id_jadwal), 0) + 1;
    const record: Jadwal = { ...newJadwal, id_jadwal: nextId };
    setJadwalList((prev) => [...prev, record]);
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('jadwal').insert([record]).select();
        if (!error && data && data[0]) {
          setJadwalList((prev) => prev.map((j) => (j.id_jadwal === nextId ? (data[0] as Jadwal) : j)));
        }
      } catch (err) {
        console.error('Error inserting jadwal to Supabase:', err);
      }
    }
  };

  const updateJadwal = async (id_jadwal: number, updates: Partial<Jadwal>) => {
    setJadwalList((prev) =>
      prev.map((item) => (item.id_jadwal === id_jadwal ? { ...item, ...updates } : item))
    );
    if (isSupabaseConfigured) {
      try {
        await supabase.from('jadwal').update(updates).eq('id_jadwal', id_jadwal);
      } catch (err) {
        console.error('Error updating jadwal on Supabase:', err);
      }
    }
  };

  const deleteJadwal = async (id_jadwal: number) => {
    setJadwalList((prev) => prev.filter((item) => item.id_jadwal !== id_jadwal));
    if (isSupabaseConfigured) {
      try {
        await supabase.from('jadwal').delete().eq('id_jadwal', id_jadwal);
      } catch (err) {
        console.error('Error deleting jadwal on Supabase:', err);
      }
    }
  };

  // === Nilai CRUD ===
  const updateNilai = async (
    id_nilai: number,
    updates: Partial<Nilai>
  ) => {
    const values = [updates.nilai_tugas, updates.nilai_uts, updates.nilai_uas].filter((value): value is number => value !== undefined);
    if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
      throw new Error('Nilai harus berada di antara 0 dan 100.');
    }
    let calculatedAkhir = 0;
    setNilaiList((prev) =>
      prev.map((item) => {
        if (item.id_nilai === id_nilai) {
          const t = updates.nilai_tugas ?? item.nilai_tugas;
          const u = updates.nilai_uts ?? item.nilai_uts;
          const a = updates.nilai_uas ?? item.nilai_uas;
          calculatedAkhir = Number(((t * 0.3) + (u * 0.3) + (a * 0.4)).toFixed(2));
          return {
            ...item,
            ...updates,
            nilai_akhir: calculatedAkhir,
          };
        }
        return item;
      })
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('nilai')
          .update({ ...updates, ...(calculatedAkhir !== undefined ? { nilai_akhir: calculatedAkhir } : {}) })
          .eq('id_nilai', id_nilai);
      } catch (err) {
        console.error('Error updating nilai on Supabase:', err);
      }
    }
  };

  const addNilai = async (newNilai: Omit<Nilai, 'id_nilai' | 'nilai_akhir'>) => {
    const values = [newNilai.nilai_tugas, newNilai.nilai_uts, newNilai.nilai_uas];
    if (values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
      throw new Error('Nilai harus berada di antara 0 dan 100.');
    }
    if (!siswaList.some((siswa) => siswa.nis === newNilai.nis)) throw new Error('Siswa tidak ditemukan.');
    if (nilaiList.some((nilai) => nilai.nis === newNilai.nis && nilai.id_mapel === newNilai.id_mapel && nilai.id_tahun_ajaran === newNilai.id_tahun_ajaran)) {
      throw new Error('Nilai untuk siswa, mata pelajaran, dan periode ini sudah ada.');
    }
    const nextId = Math.max(...nilaiList.map((n) => n.id_nilai), 0) + 1;
    const t = newNilai.nilai_tugas;
    const u = newNilai.nilai_uts;
    const a = newNilai.nilai_uas;
    const calculatedAkhir = Number(((t * 0.3) + (u * 0.3) + (a * 0.4)).toFixed(2));

    const record: Nilai = {
      ...newNilai,
      id_nilai: nextId,
      nilai_akhir: calculatedAkhir,
    };
    setNilaiList((prev) => [record, ...prev]);

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('nilai')
          .insert([{ ...newNilai, nilai_akhir: calculatedAkhir }])
          .select();
        if (!error && data && data[0]) {
          setNilaiList((prev) => prev.map((n) => (n.id_nilai === nextId ? (data[0] as Nilai) : n)));
        }
      } catch (err) {
        console.error('Error inserting nilai to Supabase:', err);
      }
    }
  };

  const addSiswa = async (newSiswa: Siswa) => {
    if (!newSiswa.nis.trim() || !newSiswa.nama_siswa.trim()) throw new Error('NIS dan nama siswa wajib diisi.');
    if (siswaList.some((siswa) => siswa.nis === newSiswa.nis)) throw new Error('NIS sudah digunakan.');
    if (!kelasList.some((kelas) => kelas.id_kelas === newSiswa.id_kelas)) throw new Error('Kelas tidak ditemukan.');
    setSiswaList((prev) => [...prev, newSiswa]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('nilai').delete().eq('id_nilai', id_nilai);
      } catch (err) {
        console.error('Error deleting nilai on Supabase:', err);
      }
    }
  };

  const updateSiswa = async (nis: string, updates: Partial<Siswa>) => {
    if (updates.id_kelas && !kelasList.some((kelas) => kelas.id_kelas === updates.id_kelas)) throw new Error('Kelas tidak ditemukan.');
    setSiswaList((prev) => prev.map((item) => item.nis === nis ? { ...item, ...updates } : item));
    if (isSupabaseConfigured) await supabase.from('siswa').update(updates).eq('nis', nis);
  };

  const deleteSiswa = async (nis: string) => {
    if (nilaiList.some((nilai) => nilai.nis === nis) || presensiList.some((presensi) => presensi.nis === nis)) throw new Error('Siswa masih memiliki nilai atau presensi. Hapus data terkait terlebih dahulu.');
    setSiswaList((prev) => prev.filter((item) => item.nis !== nis));
    if (isSupabaseConfigured) await supabase.from('siswa').delete().eq('nis', nis);
  };

  const nextId = (items: object[], key: string) => Math.max(...items.map((item) => Number((item as Record<string, unknown>)[key]) || 0), 0) + 1;

  const addGuru = async (newGuru: Omit<Guru, 'id_guru'>) => {
    if (guruList.some((guru) => guru.nip === newGuru.nip || (newGuru.email && guru.email === newGuru.email))) throw new Error('NIP atau email guru sudah digunakan.');
    const record = { ...newGuru, id_guru: nextId(guruList, 'id_guru') };
    setGuruList((prev) => [...prev, record]);
    if (isSupabaseConfigured) await supabase.from('guru').insert([newGuru]);
  };
  const updateGuru = async (id_guru: number, updates: Partial<Guru>) => {
    setGuruList((prev) => prev.map((item) => item.id_guru === id_guru ? { ...item, ...updates } : item));
    if (isSupabaseConfigured) await supabase.from('guru').update(updates).eq('id_guru', id_guru);
  };
  const deleteGuru = async (id_guru: number) => {
    if (jadwalList.some((item) => item.id_guru === id_guru) || nilaiList.some((item) => item.id_guru === id_guru)) throw new Error('Guru masih terhubung ke jadwal atau nilai.');
    setGuruList((prev) => prev.filter((item) => item.id_guru !== id_guru));
    if (isSupabaseConfigured) await supabase.from('guru').delete().eq('id_guru', id_guru);
  };

  const validateSchedule = (candidate: Jadwal, ignoredId?: number) => {
    if (candidate.jam_mulai >= candidate.jam_selesai) throw new Error('Jam selesai harus lebih besar dari jam mulai.');
    if (!guruList.some((item) => item.id_guru === candidate.id_guru) || !mapelList.some((item) => item.id_mapel === candidate.id_mapel) || !kelasList.some((item) => item.id_kelas === candidate.id_kelas)) throw new Error('Guru, mata pelajaran, atau kelas tidak valid.');
    const overlaps = (a: Jadwal, b: Jadwal) => a.hari === b.hari && a.jam_mulai < b.jam_selesai && a.jam_selesai > b.jam_mulai;
    if (jadwalList.some((item) => item.id_jadwal !== ignoredId && overlaps(candidate, item) && (item.id_kelas === candidate.id_kelas || item.id_guru === candidate.id_guru || item.ruang === candidate.ruang))) throw new Error('Jadwal bentrok untuk kelas, guru, atau ruang yang dipilih.');
  };
  const addJadwal = async (newJadwal: Omit<Jadwal, 'id_jadwal'>) => {
    const record = { ...newJadwal, id_jadwal: nextId(jadwalList, 'id_jadwal') };
    validateSchedule(record);
    setJadwalList((prev) => [...prev, record]);
    if (isSupabaseConfigured) await supabase.from('jadwal').insert([newJadwal]);
  };
  const updateJadwal = async (id_jadwal: number, updates: Partial<Jadwal>) => {
    const current = jadwalList.find((item) => item.id_jadwal === id_jadwal);
    if (!current) throw new Error('Jadwal tidak ditemukan.');
    const record = { ...current, ...updates };
    validateSchedule(record, id_jadwal);
    setJadwalList((prev) => prev.map((item) => item.id_jadwal === id_jadwal ? record : item));
    if (isSupabaseConfigured) await supabase.from('jadwal').update(updates).eq('id_jadwal', id_jadwal);
  };
  const deleteJadwal = async (id_jadwal: number) => {
    setJadwalList((prev) => prev.filter((item) => item.id_jadwal !== id_jadwal));
    if (isSupabaseConfigured) await supabase.from('jadwal').delete().eq('id_jadwal', id_jadwal);
  };

  const addJurusan = async (newJurusan: Omit<Jurusan, 'id_jurusan'>) => { if (jurusanList.some((item) => item.kode_jurusan === newJurusan.kode_jurusan)) throw new Error('Kode jurusan sudah digunakan.'); const record = { ...newJurusan, id_jurusan: nextId(jurusanList, 'id_jurusan') }; setJurusanList((prev) => [...prev, record]); };
  const updateJurusan = async (id_jurusan: number, updates: Partial<Jurusan>) => { setJurusanList((prev) => prev.map((item) => item.id_jurusan === id_jurusan ? { ...item, ...updates } : item)); };
  const deleteJurusan = async (id_jurusan: number) => { if (kelasList.some((item) => item.id_jurusan === id_jurusan)) throw new Error('Jurusan masih memiliki kelas.'); setJurusanList((prev) => prev.filter((item) => item.id_jurusan !== id_jurusan)); };
  const addKelas = async (newKelas: Omit<Kelas, 'id_kelas'>) => { if (!jurusanList.some((item) => item.id_jurusan === newKelas.id_jurusan)) throw new Error('Jurusan tidak ditemukan.'); const record = { ...newKelas, id_kelas: nextId(kelasList, 'id_kelas') }; setKelasList((prev) => [...prev, record]); };
  const updateKelas = async (id_kelas: number, updates: Partial<Kelas>) => { setKelasList((prev) => prev.map((item) => item.id_kelas === id_kelas ? { ...item, ...updates } : item)); };
  const deleteKelas = async (id_kelas: number) => { if (siswaList.some((item) => item.id_kelas === id_kelas) || jadwalList.some((item) => item.id_kelas === id_kelas)) throw new Error('Kelas masih memiliki siswa atau jadwal.'); setKelasList((prev) => prev.filter((item) => item.id_kelas !== id_kelas)); };
  const addMapel = async (newMapel: Omit<MataPelajaran, 'id_mapel'>) => { if (mapelList.some((item) => item.kode_mapel === newMapel.kode_mapel)) throw new Error('Kode mata pelajaran sudah digunakan.'); const record = { ...newMapel, id_mapel: nextId(mapelList, 'id_mapel') }; setMapelList((prev) => [...prev, record]); };
  const updateMapel = async (id_mapel: number, updates: Partial<MataPelajaran>) => { setMapelList((prev) => prev.map((item) => item.id_mapel === id_mapel ? { ...item, ...updates } : item)); };
  const deleteMapel = async (id_mapel: number) => { if (nilaiList.some((item) => item.id_mapel === id_mapel) || jadwalList.some((item) => item.id_mapel === id_mapel)) throw new Error('Mata pelajaran masih terhubung ke jadwal atau nilai.'); setMapelList((prev) => prev.filter((item) => item.id_mapel !== id_mapel)); };
  const addTahunAjaran = async (newTahun: Omit<TahunAjaran, 'id_tahun_ajaran'>) => { const record = { ...newTahun, id_tahun_ajaran: nextId(tahunAjaranList, 'id_tahun_ajaran') }; setTahunAjaranList((prev) => [...prev, record]); };
  const updateTahunAjaran = async (id_tahun_ajaran: number, updates: Partial<TahunAjaran>) => { setTahunAjaranList((prev) => prev.map((item) => item.id_tahun_ajaran === id_tahun_ajaran ? { ...item, ...updates } : item)); };
  const deleteTahunAjaran = async (id_tahun_ajaran: number) => { if (tahunAjaranList.length <= 1 || nilaiList.some((item) => item.id_tahun_ajaran === id_tahun_ajaran)) throw new Error('Periode masih digunakan atau merupakan satu-satunya periode.'); setTahunAjaranList((prev) => prev.filter((item) => item.id_tahun_ajaran !== id_tahun_ajaran)); };
  const deleteNilai = async (id_nilai: number) => { setNilaiList((prev) => prev.filter((item) => item.id_nilai !== id_nilai)); if (isSupabaseConfigured) await supabase.from('nilai').delete().eq('id_nilai', id_nilai); };

  const addPresensi = async (newPresensi: Omit<Presensi, 'id_presensi'>) => {
    if (!siswaList.some((item) => item.nis === newPresensi.nis)) throw new Error('Siswa tidak ditemukan.');
    if (presensiList.some((item) => item.nis === newPresensi.nis && item.tanggal === newPresensi.tanggal)) throw new Error('Presensi siswa pada tanggal tersebut sudah ada.');
    const record = { ...newPresensi, id_presensi: nextId(presensiList, 'id_presensi') };
    setPresensiList((prev) => [record, ...prev]);
    if (isSupabaseConfigured) await supabase.from('presensi').insert([newPresensi]);
  };
  const updatePresensi = async (id_presensi: number, updates: Partial<Presensi>) => { setPresensiList((prev) => prev.map((item) => item.id_presensi === id_presensi ? { ...item, ...updates } : item)); if (isSupabaseConfigured) await supabase.from('presensi').update(updates).eq('id_presensi', id_presensi); };
  const deletePresensi = async (id_presensi: number) => { setPresensiList((prev) => prev.filter((item) => item.id_presensi !== id_presensi)); if (isSupabaseConfigured) await supabase.from('presensi').delete().eq('id_presensi', id_presensi); };
  const addRemedial = async (newRemedial: Omit<Remedial, 'id_remedial'>) => {
    if (newRemedial.nilai_remedial < 0 || newRemedial.nilai_remedial > 100) throw new Error('Nilai remedial harus berada di antara 0 dan 100.');
    if (!nilaiList.some((nilai) => nilai.id_nilai === newRemedial.id_nilai)) throw new Error('Data nilai awal tidak ditemukan.');
    const record = { ...newRemedial, id_remedial: nextId(remedialList, 'id_remedial') };
    setRemedialList((prev) => [record, ...prev]);
    if (isSupabaseConfigured) await supabase.from('remedial').insert([newRemedial]);
  };

  const resetDatabase = () => {
    setNilaiList(INITIAL_NILAI);
    setSiswaList(INITIAL_SISWA);
    setGuruList(INITIAL_GURU);
    setJurusanList(INITIAL_JURUSAN);
    setKelasList(INITIAL_KELAS);
    setMapelList(INITIAL_MATA_PELAJARAN);
    setTahunAjaranList(INITIAL_TAHUN_AJARAN);
    setJadwalList(INITIAL_JADWAL);
  };

  const login = (
    identifier: string,
    credential: string = '',
    roleHint?: UserRole
  ): { success: boolean; message: string; user?: AuthUser } => {
    const cleanId = identifier.trim().toLowerCase();

    // 1. Check Administrator
    if (roleHint === 'admin' || cleanId === 'admin' || cleanId === 'admin@smkn2mgl.sch.id') {
      const adminUser: AuthUser = {
        id: 'ADMIN-01',
        name: 'Administrator SIA',
        role: 'admin',
        identifier: 'admin',
        avatarInitial: 'AD',
        subtitle: 'Biro Kurikulum & Tata Usaha Akademik',
      };
      setCurrentUser(adminUser);
      setPageMode('portal');
      return { success: true, message: 'Selamat datang, Administrator SIA SMKN 2 Magelang', user: adminUser };
    }

    // 2. Check Guru (by NIP or Email)
    const matchedGuru = guruList.find(
      (g) =>
        g.nip.toLowerCase() === cleanId ||
        (g.email && g.email.toLowerCase() === cleanId) ||
        g.nama_guru.toLowerCase().includes(cleanId)
    );

    if (matchedGuru && (roleHint === 'guru' || !roleHint)) {
      const guruUser: AuthUser = {
        id: `GURU-${matchedGuru.id_guru}`,
        name: matchedGuru.nama_guru,
        role: 'guru',
        identifier: matchedGuru.nip,
        avatarInitial: matchedGuru.nama_guru.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `Dewan Pengajar (NIP. ${matchedGuru.nip})`,
        details: { guru: matchedGuru },
      };
      setCurrentUser(guruUser);
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk sebagai ${matchedGuru.nama_guru}`, user: guruUser };
    }

    // 3. Check Siswa (by NIS or Nama)
    const matchedSiswa = enrichedSiswa.find(
      (s) => s.nis.toLowerCase() === cleanId || s.nama_siswa.toLowerCase().includes(cleanId)
    );

    if (matchedSiswa && (roleHint === 'siswa' || !roleHint)) {
      const siswaUser: AuthUser = {
        id: `SISWA-${matchedSiswa.nis}`,
        name: matchedSiswa.nama_siswa,
        role: 'siswa',
        identifier: matchedSiswa.nis,
        avatarInitial: matchedSiswa.nama_siswa.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `${matchedSiswa.kelas?.nama_kelas || 'Siswa'} · NIS: ${matchedSiswa.nis}`,
        details: { siswa: matchedSiswa },
      };
      setCurrentUser(siswaUser);
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk sebagai siswa ${matchedSiswa.nama_siswa}`, user: siswaUser };
    }

    return {
      success: false,
      message: 'Identitas tidak ditemukan dalam basis data (gunakan NIP guru, NIS siswa, atau akun Admin).',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setPageMode('landing');
  };

  const loginAsDemo = (role: UserRole) => {
    if (role === 'admin') {
      login('admin', 'admin123', 'admin');
    } else if (role === 'guru') {
      const guru = guruList[0];
      login(guru.nip, 'guru123', 'guru');
    } else if (role === 'siswa') {
      const siswa = siswaList[0];
      login(siswa.nis, siswa.tanggal_lahir, 'siswa');
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        guruList,
        jadwalList,
        jurusanList,
        kelasList,
        mapelList,
        nilaiList,
        presensiList,
        remedialList,
        siswaList,
        tahunAjaranList,
        activeTahunAjaran,
        setActiveTahunAjaran,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        pageMode,
        setPageMode,
        currentUser,
        login,
        logout,
        loginAsDemo,
        enrichedSiswa,
        enrichedJadwal,
        enrichedNilai,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        addGuru,
        updateGuru,
        deleteGuru,
        addJadwal,
        updateJadwal,
        deleteJadwal,
        addJurusan,
        updateJurusan,
        deleteJurusan,
        addKelas,
        updateKelas,
        deleteKelas,
        addMapel,
        updateMapel,
        deleteMapel,
        addTahunAjaran,
        updateTahunAjaran,
        deleteTahunAjaran,
        deleteNilai,
        addPresensi,
        updatePresensi,
        deletePresensi,
        addRemedial,
        resetDatabase,
        isSupabaseConfigured,
        isSupabaseConnected,
        isLoadingSupabase,
        supabaseError,
        refreshFromSupabase: fetchFromSupabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
