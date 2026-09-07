export interface Guru {
  id_guru: number;
  nip: string;
  nama_guru: string;
  email: string | null;
  no_hp: string;
}

export type TingkatKelas = 'X' | 'XI' | 'XII';

export interface Jurusan {
  id_jurusan: number;
  kode_jurusan: string;
  nama_jurusan: string;
}

export interface Kelas {
  id_kelas: number;
  nama_kelas: string;
  tingkat: TingkatKelas;
  id_jurusan: number;
}

export interface MataPelajaran {
  id_mapel: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
}

export type Hari = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface Jadwal {
  id_jadwal: number;
  id_guru: number;
  id_mapel: number;
  id_kelas: number;
  hari: Hari;
  jam_mulai: string; // "07:00:00"
  jam_selesai: string; // "09:15:00"
  ruang: string;
}

export type JenisKelamin = 'L' | 'P';

export interface Siswa {
  nis: string;
  nama_siswa: string;
  jenis_kelamin: JenisKelamin;
  tanggal_lahir: string;
  alamat: string;
  no_hp_ortu: string | null;
  id_kelas: number;
}

export type Semester = 'Ganjil' | 'Genap';
export type StatusTahunAjaran = 'Aktif' | 'Tidak Aktif';

export interface TahunAjaran {
  id_tahun_ajaran: number;
  tahun_ajaran: string;
  semester: Semester;
  status: StatusTahunAjaran;
}

export interface Nilai {
  id_nilai: number;
  nis: string;
  id_mapel: number;
  id_guru: number;
  id_tahun_ajaran: number;
  nilai_tugas: number;
  nilai_uts: number;
  nilai_uas: number;
  nilai_akhir: number;
}

// Relational Enriched Types
export interface SiswaEnriched extends Siswa {
  kelas?: Kelas;
  jurusan?: Jurusan;
  nilaiList?: NilaiEnriched[];
  rataRataNilai?: number;
}

export interface JadwalEnriched extends Jadwal {
  guru?: Guru;
  mapel?: MataPelajaran;
  kelas?: Kelas;
  jurusan?: Jurusan;
}

export interface NilaiEnriched extends Nilai {
  siswa?: Siswa;
  mapel?: MataPelajaran;
  guru?: Guru;
  tahunAjaran?: TahunAjaran;
  kelas?: Kelas;
}

export type TabKey = 'ringkasan' | 'siswa' | 'jadwal' | 'nilai' | 'guru' | 'kurikulum' | 'database';

export type UserRole = 'admin' | 'guru' | 'siswa';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  identifier: string; // NIP, NIS, or 'admin'
  avatarInitial: string;
  subtitle?: string;
  details?: {
    guru?: Guru;
    siswa?: SiswaEnriched;
  };
}

export type PageViewMode = 'landing' | 'portal';
