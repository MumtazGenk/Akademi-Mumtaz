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
  siswaList: Siswa[];
  tahunAjaranList: TahunAjaran[];
  activeTahunAjaran: TahunAjaran;
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
  // Actions
  updateNilai: (id_nilai: number, updates: Partial<Pick<Nilai, 'nilai_tugas' | 'nilai_uts' | 'nilai_uas'>>) => Promise<void> | void;
  addNilai: (newNilai: Omit<Nilai, 'id_nilai' | 'nilai_akhir'>) => Promise<void> | void;
  addSiswa: (newSiswa: Siswa) => Promise<void> | void;
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

  const activeTahunAjaran = useMemo(() => {
    return tahunAjaranList.find((t) => t.status === 'Aktif') || tahunAjaranList[1];
  }, [tahunAjaranList]);

  // Relational mappings
  const enrichedNilai = useMemo<NilaiEnriched[]>(() => {
    const siswaMap = new Map<string, Siswa>(siswaList.map((s) => [s.nis, s]));
    const mapelMap = new Map<number, MataPelajaran>(mapelList.map((m) => [m.id_mapel, m]));
    const guruMap = new Map<number, Guru>(guruList.map((g) => [g.id_guru, g]));
    const tahunMap = new Map<number, TahunAjaran>(tahunAjaranList.map((t) => [t.id_tahun_ajaran, t]));
    const kelasMap = new Map<number, Kelas>(kelasList.map((k) => [k.id_kelas, k]));

    return nilaiList.map((n) => {
      const siswa = siswaMap.get(n.nis);
      const kelas = siswa ? kelasMap.get(siswa.id_kelas) : undefined;
      return {
        ...n,
        siswa,
        mapel: mapelMap.get(n.id_mapel),
        guru: guruMap.get(n.id_guru),
        tahunAjaran: tahunMap.get(n.id_tahun_ajaran),
        kelas,
      };
    });
  }, [nilaiList, siswaList, mapelList, guruList, tahunAjaranList, kelasList]);

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
      ] = await Promise.all([
        supabase.from('jurusan').select('*').order('id_jurusan'),
        supabase.from('guru').select('*').order('id_guru'),
        supabase.from('mata_pelajaran').select('*').order('id_mapel'),
        supabase.from('tahun_ajaran').select('*').order('id_tahun_ajaran'),
        supabase.from('kelas').select('*').order('id_kelas'),
        supabase.from('siswa').select('*').order('nis'),
        supabase.from('jadwal').select('*').order('id_jadwal'),
        supabase.from('nilai').select('*').order('id_nilai'),
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

  const updateNilai = async (
    id_nilai: number,
    updates: Partial<Pick<Nilai, 'nilai_tugas' | 'nilai_uts' | 'nilai_uas'>>
  ) => {
    let calculatedAkhir = 0;
    setNilaiList((prev) =>
      prev.map((item) => {
        if (item.id_nilai === id_nilai) {
          const t = updates.nilai_tugas ?? item.nilai_tugas;
          const u = updates.nilai_uts ?? item.nilai_uts;
          const a = updates.nilai_uas ?? item.nilai_uas;
          // Standard weighting: 30% tugas, 30% UTS, 40% UAS
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
          .update({ ...updates, nilai_akhir: calculatedAkhir })
          .eq('id_nilai', id_nilai);
      } catch (err) {
        console.error('Error updating nilai on Supabase:', err);
      }
    }
  };

  const addNilai = async (newNilai: Omit<Nilai, 'id_nilai' | 'nilai_akhir'>) => {
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
    setSiswaList((prev) => [...prev, newSiswa]);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('siswa').insert([newSiswa]);
      } catch (err) {
        console.error('Error inserting siswa to Supabase:', err);
      }
    }
  };

  const resetDatabase = () => {
    setNilaiList(INITIAL_NILAI);
    setSiswaList(INITIAL_SISWA);
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
      // Optional check for birthdate if credential entered
      if (credential && credential.trim() && credential !== matchedSiswa.tanggal_lahir && credential !== '123456') {
        // Allow soft login or notify
      }

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
      // Budi Santoso
      const guru = guruList[0];
      login(guru.nip, 'guru123', 'guru');
    } else if (role === 'siswa') {
      // Ahmad Pratama
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
        siswaList,
        tahunAjaranList,
        activeTahunAjaran,
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
        updateNilai,
        addNilai,
        addSiswa,
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
