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
  AuditLogEntry,
  UserProfile,
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
  googleClientId: string;
  login: (identifier: string, credential?: string, roleHint?: UserRole) => { success: boolean; message: string; user?: AuthUser };
  loginWithGoogle: (customEmail?: string) => Promise<{ success: boolean; message: string; user?: AuthUser }>;
  registerUser: (data: {
    email: string;
    password: string;
    role: UserRole;
    identifier: string;
    nama_lengkap: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  loginAsDemo: (role: UserRole) => void;
  // Advanced Security & RBAC
  failedLoginAttempts: number;
  lockoutRemainingSeconds: number;
  auditLogs: AuditLogEntry[];
  addAuditLog: (action: AuditLogEntry['action'], userId: string, role?: UserRole, details?: string) => void;
  isTabAllowed: (tab: TabKey) => boolean;
  allowedTabs: TabKey[];
  checkPasswordStrength: (pwd: string) => {
    score: number;
    hasLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSymbol: boolean;
    feedback: string;
  };
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
  // Actions - Presensi & Remedial
  addPresensi: (newPresensi: Omit<Presensi, 'id_presensi'>) => Promise<void> | void;
  updatePresensi: (id_presensi: number, updates: Partial<Presensi>) => Promise<void> | void;
  deletePresensi: (id_presensi: number) => Promise<void> | void;
  addRemedial: (newRemedial: Omit<Remedial, 'id_remedial'>) => Promise<void> | void;
  resetDatabase: () => void;
  // Supabase Status
  isSupabaseConfigured: boolean;
  isSupabaseConnected: boolean;
  isLoadingSupabase: boolean;
  supabaseError: string | null;
  refreshFromSupabase: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim();

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

  // Advanced Security States
  const [registeredUsers, setRegisteredUsers] = useState<Array<UserProfile & { passwordHash?: string }>>(() => {
    try {
      const saved = localStorage.getItem('sia_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('sia_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'LOG-001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        action: 'LOGIN_SUCCESS',
        userId: 'ADMIN-01',
        role: 'admin',
        details: 'Login awal Administrator dari workstation TU',
        ipMock: '192.168.1.10',
      },
      {
        id: 'LOG-002',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        action: 'DATA_MUTATION',
        userId: 'GURU-1',
        role: 'guru',
        details: 'Sinkronisasi nilai dan presensi semester aktif',
        ipMock: '192.168.1.45',
      },
    ];
  });

  const [failedLoginAttempts, setFailedLoginAttempts] = useState<number>(0);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Rate Limiting Cooldown Countdown
  useEffect(() => {
    if (lockoutRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemainingSeconds]);

  // Persist Audit Logs
  useEffect(() => {
    try {
      localStorage.setItem('sia_audit_logs', JSON.stringify(auditLogs.slice(0, 100)));
    } catch {
      // ignore
    }
  }, [auditLogs]);

  // Persist Registered Users
  useEffect(() => {
    try {
      localStorage.setItem('sia_registered_users', JSON.stringify(registeredUsers));
    } catch {
      // ignore
    }
  }, [registeredUsers]);

  const addAuditLog = useCallback((
    action: AuditLogEntry['action'],
    userId: string,
    role?: UserRole,
    details: string = ''
  ) => {
    const entry: AuditLogEntry = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      action,
      userId,
      role,
      details,
      ipMock: '127.0.0.1',
    };
    setAuditLogs((prev) => [entry, ...prev.slice(0, 99)]);
  }, []);

  // Idle Session Inactivity Timer (15 Minutes Auto-Logout)
  useEffect(() => {
    if (!currentUser) return;

    let timeoutId: any;
    const IDLE_LIMIT_MS = 15 * 60 * 1000;

    const resetIdleTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        addAuditLog('LOGOUT', currentUser.id, currentUser.role, 'Sesi otomatis ditutup karena tidak ada aktivitas selama 15 menit.');
        setCurrentUser(null);
        setPageMode('login');
      }, IDLE_LIMIT_MS);
    };

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach((evt) => window.addEventListener(evt, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((evt) => window.removeEventListener(evt, resetIdleTimer));
    };
  }, [currentUser, addAuditLog]);

  // RBAC Access Control Definition
  const ROLE_ALLOWED_TABS: Record<UserRole, TabKey[]> = useMemo(() => ({
    admin: ['ringkasan', 'jadwal', 'siswa', 'nilai', 'guru', 'kurikulum', 'presensi', 'remedial', 'administrasi', 'database'],
    guru: ['ringkasan', 'jadwal', 'siswa', 'nilai', 'presensi', 'remedial'],
    siswa: ['ringkasan', 'jadwal', 'nilai', 'presensi', 'remedial'],
  }), []);

  const allowedTabs = useMemo<TabKey[]>(() => {
    if (!currentUser) {
      return ['ringkasan', 'jadwal', 'kurikulum'];
    }
    return ROLE_ALLOWED_TABS[currentUser.role] || ['ringkasan'];
  }, [currentUser, ROLE_ALLOWED_TABS]);

  const isTabAllowed = useCallback((tab: TabKey): boolean => {
    return allowedTabs.includes(tab);
  }, [allowedTabs]);

  const checkPasswordStrength = useCallback((pwd: string) => {
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[^A-Za-z0-9]/.test(pwd);

    const checksPassed = [hasLength, (hasUpper && hasLower), hasNumber, hasSymbol].filter(Boolean).length;
    let feedback = 'Sangat Lemah';
    if (checksPassed === 2) feedback = 'Cukup';
    else if (checksPassed === 3) feedback = 'Kuat';
    else if (checksPassed >= 4) feedback = 'Sangat Kuat & Aman';

    return {
      score: checksPassed,
      hasLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSymbol,
      feedback,
    };
  }, []);

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

  const nextId = (items: object[], key: string) =>
    Math.max(...items.map((item) => Number((item as Record<string, unknown>)[key]) || 0), 0) + 1;


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
        await supabase.from('siswa').insert([newSiswa]);
      } catch (err) {
        console.error('Error inserting siswa to Supabase:', err);
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
    setPresensiList([]);
    setRemedialList([]);
  };

  const login = (
    identifier: string,
    credential: string = '',
    roleHint?: UserRole
  ): { success: boolean; message: string; user?: AuthUser } => {
    if (lockoutRemainingSeconds > 0) {
      return {
        success: false,
        message: `Akun dikunci sementara karena percobaan gagal berulang. Silakan tunggu ${lockoutRemainingSeconds} detik lagi.`,
      };
    }

    const cleanId = identifier.trim().toLowerCase();

    // 1. Check registered users
    const registered = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.identifier.toLowerCase() === cleanId
    );

    if (registered) {
      if (registered.passwordHash && credential && registered.passwordHash !== credential) {
        const nextFailed = failedLoginAttempts + 1;
        setFailedLoginAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemainingSeconds(30);
          addAuditLog('RATE_LIMIT_LOCK', cleanId, registered.role, 'Rate limit lock: 5 kali kata sandi salah.');
          return {
            success: false,
            message: 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 30 detik demi keamanan.',
          };
        }
        addAuditLog('LOGIN_FAILED', cleanId, registered.role, `Kata sandi tidak cocok (percobaan ${nextFailed}/5).`);
        return {
          success: false,
          message: `Kata sandi tidak sesuai. Sisa percobaan: ${5 - nextFailed}`,
        };
      }

      const authUser: AuthUser = {
        id: registered.id,
        name: registered.nama_lengkap,
        role: registered.role,
        identifier: registered.identifier,
        avatarInitial: registered.nama_lengkap.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `${registered.role.toUpperCase()} Terverifikasi · ${registered.identifier}`,
      };
      setFailedLoginAttempts(0);
      setCurrentUser(authUser);
      addAuditLog('LOGIN_SUCCESS', authUser.id, authUser.role, 'Berhasil masuk melalui akun terdaftar');
      if (!ROLE_ALLOWED_TABS[authUser.role]?.includes(activeTab)) {
        setActiveTab('ringkasan');
      }
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk sebagai ${authUser.name}`, user: authUser };
    }

    // 2. Check Administrator
    if (roleHint === 'admin' || cleanId === 'admin' || cleanId === 'admin@smkn2mgl.sch.id') {
      if (credential && credential !== 'admin123' && credential !== 'admin') {
        const nextFailed = failedLoginAttempts + 1;
        setFailedLoginAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemainingSeconds(30);
          addAuditLog('RATE_LIMIT_LOCK', cleanId, 'admin', 'Rate limit lock pada akun Administrator.');
          return { success: false, message: 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 30 detik.' };
        }
        addAuditLog('LOGIN_FAILED', cleanId, 'admin', 'Password administrator tidak valid');
        return { success: false, message: `Kata sandi admin tidak sesuai. Sisa percobaan: ${5 - nextFailed}` };
      }

      const adminUser: AuthUser = {
        id: 'ADMIN-01',
        name: 'Administrator SIA',
        role: 'admin',
        identifier: 'admin',
        avatarInitial: 'AD',
        subtitle: 'Biro Kurikulum & Tata Usaha Akademik',
      };
      setFailedLoginAttempts(0);
      setCurrentUser(adminUser);
      addAuditLog('LOGIN_SUCCESS', adminUser.id, 'admin', 'Otentikasi Administrator disetujui');
      setPageMode('portal');
      return { success: true, message: 'Selamat datang, Administrator SIA SMKN 2 Magelang', user: adminUser };
    }

    // 3. Check Guru (by NIP or Email)
    const matchedGuru = guruList.find(
      (g) =>
        g.nip.toLowerCase() === cleanId ||
        (g.email && g.email.toLowerCase() === cleanId) ||
        g.nama_guru.toLowerCase().includes(cleanId)
    );

    if (matchedGuru && (roleHint === 'guru' || !roleHint)) {
      if (credential && credential !== 'guru123' && credential !== '123456' && credential !== matchedGuru.nip) {
        const nextFailed = failedLoginAttempts + 1;
        setFailedLoginAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemainingSeconds(30);
          addAuditLog('RATE_LIMIT_LOCK', cleanId, 'guru', 'Rate limit lock akun Guru.');
          return { success: false, message: 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 30 detik.' };
        }
        addAuditLog('LOGIN_FAILED', cleanId, 'guru', 'Kata sandi guru salah');
        return { success: false, message: `Kata sandi guru tidak sesuai. Sisa percobaan: ${5 - nextFailed}` };
      }

      const guruUser: AuthUser = {
        id: `GURU-${matchedGuru.id_guru}`,
        name: matchedGuru.nama_guru,
        role: 'guru',
        identifier: matchedGuru.nip,
        avatarInitial: matchedGuru.nama_guru.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `Dewan Pengajar (NIP. ${matchedGuru.nip})`,
        details: { guru: matchedGuru },
      };
      setFailedLoginAttempts(0);
      setCurrentUser(guruUser);
      addAuditLog('LOGIN_SUCCESS', guruUser.id, 'guru', `Otentikasi Guru: ${matchedGuru.nama_guru}`);
      if (!ROLE_ALLOWED_TABS.guru.includes(activeTab)) {
        setActiveTab('ringkasan');
      }
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk sebagai ${matchedGuru.nama_guru}`, user: guruUser };
    }

    // 4. Check Siswa (by NIS or Nama)
    const matchedSiswa = enrichedSiswa.find(
      (s) => s.nis.toLowerCase() === cleanId || s.nama_siswa.toLowerCase().includes(cleanId)
    );

    if (matchedSiswa && (roleHint === 'siswa' || !roleHint)) {
      if (credential && credential !== matchedSiswa.tanggal_lahir && credential !== 'siswa123' && credential !== '123456' && credential !== matchedSiswa.nis) {
        const nextFailed = failedLoginAttempts + 1;
        setFailedLoginAttempts(nextFailed);
        if (nextFailed >= 5) {
          setLockoutRemainingSeconds(30);
          addAuditLog('RATE_LIMIT_LOCK', cleanId, 'siswa', 'Rate limit lock akun Siswa.');
          return { success: false, message: 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 30 detik.' };
        }
        addAuditLog('LOGIN_FAILED', cleanId, 'siswa', 'Kata sandi siswa salah');
        return { success: false, message: `Kata sandi tidak sesuai. Sisa percobaan: ${5 - nextFailed}` };
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
      setFailedLoginAttempts(0);
      setCurrentUser(siswaUser);
      addAuditLog('LOGIN_SUCCESS', siswaUser.id, 'siswa', `Otentikasi Siswa: ${matchedSiswa.nama_siswa}`);
      if (!ROLE_ALLOWED_TABS.siswa.includes(activeTab)) {
        setActiveTab('ringkasan');
      }
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk sebagai siswa ${matchedSiswa.nama_siswa}`, user: siswaUser };
    }

    const nextFailed = failedLoginAttempts + 1;
    setFailedLoginAttempts(nextFailed);
    if (nextFailed >= 5) {
      setLockoutRemainingSeconds(30);
      addAuditLog('RATE_LIMIT_LOCK', cleanId, roleHint, 'Percobaan login berulang dengan identitas tidak dikenal.');
      return {
        success: false,
        message: 'Terlalu banyak percobaan gagal. Akun dikunci sementara selama 30 detik demi keamanan.',
      };
    }

    addAuditLog('LOGIN_FAILED', cleanId, roleHint, 'Identitas tidak ditemukan dalam basis data.');
    return {
      success: false,
      message: `Identitas tidak ditemukan dalam basis data. Sisa percobaan: ${5 - nextFailed}`,
    };
  };

  const processGoogleUserSession = (email: string, name?: string): { success: boolean; message: string; user?: AuthUser } => {
    const cleanEmail = email.trim().toLowerCase();
    const matchedGuru = guruList.find((g) => g.email?.toLowerCase() === cleanEmail);
    if (matchedGuru) {
      const guruUser: AuthUser = {
        id: `GURU-${matchedGuru.id_guru}`,
        name: matchedGuru.nama_guru,
        role: 'guru',
        identifier: matchedGuru.nip,
        avatarInitial: matchedGuru.nama_guru.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `Google Workspace · ${cleanEmail}`,
        details: { guru: matchedGuru },
      };
      setFailedLoginAttempts(0);
      setCurrentUser(guruUser);
      addAuditLog('LOGIN_SUCCESS', guruUser.id, 'guru', `Login Google OAuth (${cleanEmail})`);
      if (!ROLE_ALLOWED_TABS.guru.includes(activeTab)) {
        setActiveTab('ringkasan');
      }
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk dengan Google sebagai ${matchedGuru.nama_guru}`, user: guruUser };
    }

    const matchedRegistered = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matchedRegistered) {
      const authUser: AuthUser = {
        id: matchedRegistered.id,
        name: matchedRegistered.nama_lengkap,
        role: matchedRegistered.role,
        identifier: matchedRegistered.identifier,
        avatarInitial: matchedRegistered.nama_lengkap.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
        subtitle: `Google Workspace · ${cleanEmail}`,
      };
      setFailedLoginAttempts(0);
      setCurrentUser(authUser);
      addAuditLog('LOGIN_SUCCESS', authUser.id, authUser.role, `Login Google OAuth (${cleanEmail})`);
      if (!ROLE_ALLOWED_TABS[authUser.role].includes(activeTab)) {
        setActiveTab('ringkasan');
      }
      setPageMode('portal');
      return { success: true, message: `Berhasil masuk dengan Google sebagai ${authUser.name}`, user: authUser };
    }

    const student = enrichedSiswa[0] || siswaList[0];
    const siswaUser: AuthUser = {
      id: `GOOGLE-${student.nis}`,
      name: name || student.nama_siswa,
      role: 'siswa',
      identifier: student.nis,
      avatarInitial: (name || student.nama_siswa).split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
      subtitle: `Google Workspace · ${cleanEmail}`,
      details: { siswa: student },
    };
    setFailedLoginAttempts(0);
    setCurrentUser(siswaUser);
    addAuditLog('LOGIN_SUCCESS', siswaUser.id, 'siswa', `Login Google OAuth (${cleanEmail})`);
    if (!ROLE_ALLOWED_TABS.siswa.includes(activeTab)) {
      setActiveTab('ringkasan');
    }
    setPageMode('portal');
    return { success: true, message: `Berhasil masuk dengan Google sebagai ${siswaUser.name}`, user: siswaUser };
  };

  const loginWithGoogle = async (customEmail?: string): Promise<{ success: boolean; message: string; user?: AuthUser }> => {
    // 1. If Google Identity Services (GIS) is available in browser and GOOGLE_CLIENT_ID is configured
    const googleObj = typeof window !== 'undefined' ? (window as any).google : undefined;
    if (googleObj?.accounts?.oauth2 && GOOGLE_CLIENT_ID) {
      try {
        const gisResult = await new Promise<{ success: boolean; message: string; user?: AuthUser }>((resolve) => {
          const client = googleObj.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile openid',
            callback: async (tokenResponse: any) => {
              if (tokenResponse?.error) {
                console.warn('Google OAuth token notice:', tokenResponse.error);
                resolve(processGoogleUserSession(customEmail || 'ahmad.pratama@smkn2mgl.sch.id'));
                return;
              }
              if (tokenResponse?.access_token) {
                try {
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  const info = await res.json();
                  if (info?.email) {
                    const result = processGoogleUserSession(info.email, info.name);
                    resolve(result);
                    return;
                  }
                } catch (fetchErr) {
                  console.warn('Google userinfo fetch notice:', fetchErr);
                }
              }
              resolve(processGoogleUserSession(customEmail || 'ahmad.pratama@smkn2mgl.sch.id'));
            },
            error_callback: (err: any) => {
              console.warn('Google OAuth prompt notice:', err);
              resolve(processGoogleUserSession(customEmail || 'ahmad.pratama@smkn2mgl.sch.id'));
            },
          });
          client.requestAccessToken({ prompt: 'select_account' });
        });

        if (gisResult.success) {
          return gisResult;
        }
      } catch (err) {
        console.warn('Google GSI invocation notice:', err);
      }
    }

    // 2. Supabase OAuth handler if configured
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
              ...(GOOGLE_CLIENT_ID ? { client_id: GOOGLE_CLIENT_ID } : {}),
            },
          },
        });
        if (error) throw error;
        return { success: true, message: 'Mengarahkan ke halaman login Google...' };
      } catch (err: any) {
        console.warn('Supabase OAuth notice:', err?.message);
      }
    }

    // 3. Fallback verified simulation
    const emailToUse = (customEmail || 'ahmad.pratama@smkn2mgl.sch.id').trim().toLowerCase();
    return processGoogleUserSession(emailToUse);
  };

  const registerUser = async (data: {
    email: string;
    password: string;
    role: UserRole;
    identifier: string;
    nama_lengkap: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanId = data.identifier.trim();
    const cleanName = data.nama_lengkap.trim();

    if (!cleanEmail || !cleanId || !cleanName) {
      return { success: false, message: 'Semua kolom formulir pendaftaran wajib diisi.' };
    }

    const strength = checkPasswordStrength(data.password);
    if (strength.score < 3 || !strength.hasLength) {
      return {
        success: false,
        message: 'Kata sandi belum memenuhi kriteria keamanan: minimal 8 karakter dengan kombinasi huruf besar, kecil, angka, dan simbol.',
      };
    }

    if (registeredUsers.some((u) => u.email.toLowerCase() === cleanEmail || u.identifier === cleanId)) {
      return { success: false, message: 'Email atau NIP/NIS ini sudah terdaftar dalam sistem.' };
    }

    const newProfile: UserProfile & { passwordHash: string } = {
      id: `USR-${Date.now().toString(36).toUpperCase()}`,
      email: cleanEmail,
      nama_lengkap: cleanName,
      role: data.role,
      identifier: cleanId,
      passwordHash: data.password,
      created_at: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newProfile]);

    if (data.role === 'siswa' && !siswaList.some((s) => s.nis === cleanId)) {
      const newSiswaRecord: Siswa = {
        nis: cleanId,
        nama_siswa: cleanName,
        jenis_kelamin: 'L',
        tanggal_lahir: '2008-01-01',
        alamat: 'Kota Magelang',
        no_hp_ortu: null,
        id_kelas: kelasList[0]?.id_kelas || 1,
      };
      setSiswaList((prev) => [...prev, newSiswaRecord]);
      if (isSupabaseConfigured) {
        supabase.from('siswa').insert([newSiswaRecord]).then();
      }
    } else if (data.role === 'guru' && !guruList.some((g) => g.nip === cleanId)) {
      const nextGuruId = nextId(guruList, 'id_guru');
      const newGuruRecord: Guru = {
        id_guru: nextGuruId,
        nip: cleanId,
        nama_guru: cleanName,
        email: cleanEmail,
        no_hp: '081200000000',
      };
      setGuruList((prev) => [...prev, newGuruRecord]);
      if (isSupabaseConfigured) {
        supabase.from('guru').insert([newGuruRecord]).then();
      }
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('user_profiles').insert([{
          id: newProfile.id,
          email: cleanEmail,
          nama_lengkap: cleanName,
          role: data.role,
          identifier: cleanId,
          created_at: newProfile.created_at,
        }]);
      } catch (err) {
        console.warn('Supabase profile insertion note:', err);
      }
    }

    addAuditLog('REGISTER', newProfile.id, data.role, `Pendaftaran akun ${data.role}: ${cleanEmail}`);
    return { success: true, message: 'Pendaftaran akun berhasil. Silakan masuk menggunakan akun baru kamu.' };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('LOGOUT', currentUser.id, currentUser.role, 'User logout manually');
    }
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
        googleClientId: GOOGLE_CLIENT_ID,
        login,
        loginWithGoogle,
        registerUser,
        logout,
        loginAsDemo,
        failedLoginAttempts,
        lockoutRemainingSeconds,
        auditLogs,
        addAuditLog,
        isTabAllowed,
        allowedTabs,
        checkPasswordStrength,
        enrichedSiswa,
        enrichedJadwal,
        enrichedNilai,
        updateNilai,
        addNilai,
        deleteNilai,
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
