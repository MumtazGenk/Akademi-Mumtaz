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
} from '../types';

export const RAW_DATABASE_NAME = 'db_sia_smkn2_magelang';
export const DATABASE_VERSION = '12.3.3-MariaDB';
export const DUMP_DATE = '2026-09-04 10:58:07';

export const INITIAL_GURU: Guru[] = [
  { id_guru: 1, nip: '198001012005011001', nama_guru: 'Budi Santoso, M.Kom.', email: 'budi.santoso@smkn2mgl.sch.id', no_hp: '081299998888' },
  { id_guru: 2, nip: '198203152006042002', nama_guru: 'Siti Rahmawati, S.Pd.', email: 'siti.rahma@smkn2mgl.sch.id', no_hp: '081234567802' },
  { id_guru: 3, nip: '197907202003121003', nama_guru: 'Agus Prasetyo, S.Kom.', email: 'agus.pras@smkn2mgl.sch.id', no_hp: '081234567803' },
  { id_guru: 4, nip: '198511102009022004', nama_guru: 'Dewi Lestari, S.E.', email: 'dewi.lestari@smkn2mgl.sch.id', no_hp: '081234567804' },
  { id_guru: 5, nip: '199005052015031005', nama_guru: 'Rizky Firmansyah, S.Pd.', email: 'rizky.firman@smkn2mgl.sch.id', no_hp: '081234567805' },
];

export const INITIAL_JURUSAN: Jurusan[] = [
  { id_jurusan: 1, kode_jurusan: 'PPLG', nama_jurusan: 'Pengembangan Perangkat Lunak dan Gim' },
  { id_jurusan: 2, kode_jurusan: 'AKL', nama_jurusan: 'Akuntansi dan Keuangan Lembaga' },
  { id_jurusan: 3, kode_jurusan: 'MPLB', nama_jurusan: 'Manajemen Perkantoran dan Layanan Bisnis' },
  { id_jurusan: 4, kode_jurusan: 'PM', nama_jurusan: 'Pemasaran' },
  { id_jurusan: 5, kode_jurusan: 'DKV', nama_jurusan: 'Desain Komunikasi Visual' },
];

export const INITIAL_KELAS: Kelas[] = [
  { id_kelas: 1, nama_kelas: 'X PPLG 1', tingkat: 'X', id_jurusan: 1 },
  { id_kelas: 2, nama_kelas: 'XI PPLG 1', tingkat: 'XI', id_jurusan: 1 },
  { id_kelas: 3, nama_kelas: 'XI PPLG 2', tingkat: 'XI', id_jurusan: 1 },
  { id_kelas: 4, nama_kelas: 'XI AKL 1', tingkat: 'XI', id_jurusan: 2 },
  { id_kelas: 5, nama_kelas: 'XII MPLB 1', tingkat: 'XII', id_jurusan: 3 },
  { id_kelas: 6, nama_kelas: 'XI PM 1', tingkat: 'XI', id_jurusan: 4 },
];

export const INITIAL_MATA_PELAJARAN: MataPelajaran[] = [
  { id_mapel: 1, kode_mapel: 'MP01', nama_mapel: 'Basis Data', kelompok: 'Kejuruan PPLG' },
  { id_mapel: 2, kode_mapel: 'MP02', nama_mapel: 'Pemrograman Web dan Perangkat Bergerak', kelompok: 'Kejuruan PPLG' },
  { id_mapel: 3, kode_mapel: 'MP03', nama_mapel: 'Pemodelan Perangkat Lunak', kelompok: 'Kejuruan PPLG' },
  { id_mapel: 4, kode_mapel: 'MP04', nama_mapel: 'Akuntansi Keuangan', kelompok: 'Kejuruan AKL' },
  { id_mapel: 5, kode_mapel: 'MP05', nama_mapel: 'Praktikum Akuntansi Lembaga', kelompok: 'Kejuruan AKL' },
  { id_mapel: 6, kode_mapel: 'MP06', nama_mapel: 'Kearsipan Digital', kelompok: 'Kejuruan MPLB' },
  { id_mapel: 7, kode_mapel: 'MP07', nama_mapel: 'Komunikasi Bisnis', kelompok: 'Kejuruan PM' },
  { id_mapel: 8, kode_mapel: 'MP08', nama_mapel: 'Bahasa Indonesia', kelompok: 'Umum' },
  { id_mapel: 9, kode_mapel: 'MP09', nama_mapel: 'Matematika', kelompok: 'Umum' },
  { id_mapel: 10, kode_mapel: 'MP10', nama_mapel: 'Bahasa Inggris', kelompok: 'Umum' },
];

export const INITIAL_TAHUN_AJARAN: TahunAjaran[] = [
  { id_tahun_ajaran: 1, tahun_ajaran: '2025/2026', semester: 'Genap', status: 'Tidak Aktif' },
  { id_tahun_ajaran: 2, tahun_ajaran: '2026/2027', semester: 'Ganjil', status: 'Aktif' },
];

export const INITIAL_SISWA: Siswa[] = [
  { nis: '2401', nama_siswa: 'Aditya Pratama', jenis_kelamin: 'L', tanggal_lahir: '2008-01-12', alamat: 'Secang Lor, Magelang', no_hp_ortu: null, id_kelas: 2 },
  { nis: '2402', nama_siswa: 'Anisa Nur Aini', jenis_kelamin: 'P', tanggal_lahir: '2008-02-15', alamat: 'Secang, Magelang', no_hp_ortu: null, id_kelas: 2 },
  { nis: '2403', nama_siswa: 'Bagus Wicaksono', jenis_kelamin: 'L', tanggal_lahir: '2008-03-22', alamat: 'Muntilan, Magelang', no_hp_ortu: null, id_kelas: 2 },
  { nis: '2404', nama_siswa: 'Cantika Dewi', jenis_kelamin: 'P', tanggal_lahir: '2008-04-05', alamat: 'Borobudur, Magelang', no_hp_ortu: null, id_kelas: 2 },
  { nis: '2405', nama_siswa: 'Dimas Arya Putra', jenis_kelamin: 'L', tanggal_lahir: '2008-05-19', alamat: 'Magelang Selatan', no_hp_ortu: null, id_kelas: 2 },
  { nis: '2406', nama_siswa: 'Eka Ramadhani', jenis_kelamin: 'P', tanggal_lahir: '2008-06-11', alamat: 'Tegalrejo, Magelang', no_hp_ortu: null, id_kelas: 3 },
  { nis: '2407', nama_siswa: 'Fajar Hidayat', jenis_kelamin: 'L', tanggal_lahir: '2008-07-29', alamat: 'Salam, Magelang', no_hp_ortu: null, id_kelas: 3 },
  { nis: '2408', nama_siswa: 'Gita Permata', jenis_kelamin: 'P', tanggal_lahir: '2008-08-14', alamat: 'Grabag, Magelang', no_hp_ortu: null, id_kelas: 3 },
  { nis: '2409', nama_siswa: 'Hendra Setiawan', jenis_kelamin: 'L', tanggal_lahir: '2008-09-03', alamat: 'Magelang Tengah', no_hp_ortu: null, id_kelas: 3 },
  { nis: '2410', nama_siswa: 'Indah Kusuma', jenis_kelamin: 'P', tanggal_lahir: '2008-10-25', alamat: 'Bandongan, Magelang', no_hp_ortu: null, id_kelas: 3 },
  { nis: '2411', nama_siswa: 'Joko Susilo', jenis_kelamin: 'L', tanggal_lahir: '2008-11-17', alamat: 'Salaman, Magelang', no_hp_ortu: null, id_kelas: 4 },
  { nis: '2412', nama_siswa: 'Kartika Sari', jenis_kelamin: 'P', tanggal_lahir: '2008-12-08', alamat: 'Magelang Utara', no_hp_ortu: null, id_kelas: 4 },
  { nis: '2413', nama_siswa: 'Lukman Hakim', jenis_kelamin: 'L', tanggal_lahir: '2008-01-30', alamat: 'Candimulyo, Magelang', no_hp_ortu: null, id_kelas: 4 },
  { nis: '2414', nama_siswa: 'Mega Utami', jenis_kelamin: 'P', tanggal_lahir: '2008-02-18', alamat: 'Mertoyudan, Magelang', no_hp_ortu: null, id_kelas: 4 },
  { nis: '2415', nama_siswa: 'Noval Saputra', jenis_kelamin: 'L', tanggal_lahir: '2007-03-14', alamat: 'Sawangan, Magelang', no_hp_ortu: null, id_kelas: 5 },
  { nis: '2416', nama_siswa: 'Octavia Putri', jenis_kelamin: 'P', tanggal_lahir: '2007-04-22', alamat: 'Muntilan, Magelang', no_hp_ortu: null, id_kelas: 5 },
  { nis: '2417', nama_siswa: 'Panji Gumilang', jenis_kelamin: 'L', tanggal_lahir: '2008-05-09', alamat: 'Secang, Magelang', no_hp_ortu: null, id_kelas: 6 },
  { nis: '2418', nama_siswa: 'Qori Amelia', jenis_kelamin: 'P', tanggal_lahir: '2008-06-16', alamat: 'Tegalrejo, Magelang', no_hp_ortu: null, id_kelas: 6 },
  { nis: '2419', nama_siswa: 'Rafi Ahmad', jenis_kelamin: 'L', tanggal_lahir: '2009-07-21', alamat: 'Magelang Selatan', no_hp_ortu: null, id_kelas: 1 },
  { nis: '2420', nama_siswa: 'Salsabila Zahra', jenis_kelamin: 'P', tanggal_lahir: '2009-08-02', alamat: 'Magelang Tengah', no_hp_ortu: null, id_kelas: 1 },
];

export const INITIAL_JADWAL: Jadwal[] = [
  { id_jadwal: 1, id_guru: 1, id_mapel: 1, id_kelas: 2, hari: 'Senin', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Komputer 1' },
  { id_jadwal: 2, id_guru: 3, id_mapel: 2, id_kelas: 2, hari: 'Senin', jam_mulai: '09:30:00', jam_selesai: '11:45:00', ruang: 'Lab Komputer 2' },
  { id_jadwal: 3, id_guru: 5, id_mapel: 8, id_kelas: 2, hari: 'Selasa', jam_mulai: '07:00:00', jam_selesai: '08:30:00', ruang: 'Ruang Teori 11' },
  { id_jadwal: 4, id_guru: 1, id_mapel: 1, id_kelas: 3, hari: 'Selasa', jam_mulai: '08:45:00', jam_selesai: '11:00:00', ruang: 'Lab Komputer 1' },
  { id_jadwal: 5, id_guru: 3, id_mapel: 3, id_kelas: 3, hari: 'Rabu', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Komputer 3' },
  { id_jadwal: 6, id_guru: 4, id_mapel: 4, id_kelas: 4, hari: 'Senin', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Akuntansi' },
  { id_jadwal: 7, id_guru: 4, id_mapel: 5, id_kelas: 4, hari: 'Selasa', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Akuntansi' },
  { id_jadwal: 8, id_guru: 5, id_mapel: 9, id_kelas: 4, hari: 'Rabu', jam_mulai: '09:30:00', jam_selesai: '11:00:00', ruang: 'Ruang Teori 05' },
  { id_jadwal: 9, id_guru: 2, id_mapel: 6, id_kelas: 5, hari: 'Kamis', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Perkantoran' },
  { id_jadwal: 10, id_guru: 2, id_mapel: 10, id_kelas: 5, hari: 'Jumat', jam_mulai: '07:00:00', jam_selesai: '08:30:00', ruang: 'Ruang Teori 08' },
  { id_jadwal: 11, id_guru: 4, id_mapel: 7, id_kelas: 6, hari: 'Senin', jam_mulai: '09:30:00', jam_selesai: '11:45:00', ruang: 'Ruang Teori 03' },
  { id_jadwal: 12, id_guru: 5, id_mapel: 8, id_kelas: 6, hari: 'Kamis', jam_mulai: '07:00:00', jam_selesai: '08:30:00', ruang: 'Ruang Teori 03' },
  { id_jadwal: 13, id_guru: 1, id_mapel: 1, id_kelas: 1, hari: 'Rabu', jam_mulai: '07:00:00', jam_selesai: '09:15:00', ruang: 'Lab Komputer 1' },
  { id_jadwal: 14, id_guru: 3, id_mapel: 2, id_kelas: 1, hari: 'Kamis', jam_mulai: '09:30:00', jam_selesai: '11:45:00', ruang: 'Lab Komputer 2' },
  { id_jadwal: 15, id_guru: 5, id_mapel: 9, id_kelas: 2, hari: 'Jumat', jam_mulai: '07:00:00', jam_selesai: '08:30:00', ruang: 'Ruang Teori 11' },
];

export const INITIAL_NILAI: Nilai[] = [
  { id_nilai: 1, nis: '2401', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 85.00, nilai_uts: 88.00, nilai_uas: 90.00, nilai_akhir: 87.90 },
  { id_nilai: 2, nis: '2401', id_mapel: 2, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 80.00, nilai_uts: 82.00, nilai_uas: 85.00, nilai_akhir: 82.60 },
  { id_nilai: 3, nis: '2401', id_mapel: 8, id_guru: 5, id_tahun_ajaran: 2, nilai_tugas: 75.00, nilai_uts: 78.00, nilai_uas: 80.00, nilai_akhir: 77.90 },
  { id_nilai: 4, nis: '2402', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 90.00, nilai_uts: 92.00, nilai_uas: 95.00, nilai_akhir: 92.60 },
  { id_nilai: 5, nis: '2402', id_mapel: 2, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 88.00, nilai_uts: 85.00, nilai_uas: 90.00, nilai_akhir: 87.90 },
  { id_nilai: 6, nis: '2403', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 78.00, nilai_uts: 65.00, nilai_uas: 68.00, nilai_akhir: 76.50 },
  { id_nilai: 7, nis: '2403', id_mapel: 2, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 72.00, nilai_uts: 70.00, nilai_uas: 70.00, nilai_akhir: 70.60 },
  { id_nilai: 8, nis: '2404', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 82.00, nilai_uts: 80.00, nilai_uas: 85.00, nilai_akhir: 82.60 },
  { id_nilai: 9, nis: '2405', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 65.00, nilai_uts: 60.00, nilai_uas: 62.00, nilai_akhir: 62.30 },
  { id_nilai: 10, nis: '2406', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 88.00, nilai_uts: 90.00, nilai_uas: 92.00, nilai_akhir: 90.20 },
  { id_nilai: 11, nis: '2406', id_mapel: 3, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 85.00, nilai_uts: 88.00, nilai_uas: 86.00, nilai_akhir: 86.30 },
  { id_nilai: 12, nis: '2407', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 75.00, nilai_uts: 76.00, nilai_uas: 80.00, nilai_akhir: 77.30 },
  { id_nilai: 13, nis: '2407', id_mapel: 3, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 80.00, nilai_uts: 82.00, nilai_uas: 84.00, nilai_akhir: 82.20 },
  { id_nilai: 14, nis: '2408', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 95.00, nilai_uts: 94.00, nilai_uas: 96.00, nilai_akhir: 95.10 },
  { id_nilai: 15, nis: '2409', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 70.00, nilai_uts: 72.00, nilai_uas: 68.00, nilai_akhir: 69.80 },
  { id_nilai: 16, nis: '2410', id_mapel: 3, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 86.00, nilai_uts: 85.00, nilai_uas: 88.00, nilai_akhir: 86.50 },
  { id_nilai: 17, nis: '2411', id_mapel: 4, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 84.00, nilai_uts: 86.00, nilai_uas: 88.00, nilai_akhir: 86.20 },
  { id_nilai: 18, nis: '2411', id_mapel: 5, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 80.00, nilai_uts: 82.00, nilai_uas: 85.00, nilai_akhir: 82.60 },
  { id_nilai: 19, nis: '2412', id_mapel: 4, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 92.00, nilai_uts: 90.00, nilai_uas: 94.00, nilai_akhir: 92.20 },
  { id_nilai: 20, nis: '2412', id_mapel: 5, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 88.00, nilai_uts: 85.00, nilai_uas: 89.00, nilai_akhir: 87.50 },
  { id_nilai: 21, nis: '2413', id_mapel: 4, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 68.00, nilai_uts: 65.00, nilai_uas: 70.00, nilai_akhir: 67.90 },
  { id_nilai: 22, nis: '2414', id_mapel: 9, id_guru: 5, id_tahun_ajaran: 2, nilai_tugas: 78.00, nilai_uts: 80.00, nilai_uas: 82.00, nilai_akhir: 80.20 },
  { id_nilai: 23, nis: '2415', id_mapel: 6, id_guru: 2, id_tahun_ajaran: 2, nilai_tugas: 85.00, nilai_uts: 87.00, nilai_uas: 89.00, nilai_akhir: 87.20 },
  { id_nilai: 24, nis: '2416', id_mapel: 6, id_guru: 2, id_tahun_ajaran: 2, nilai_tugas: 90.00, nilai_uts: 88.00, nilai_uas: 92.00, nilai_akhir: 90.20 },
  { id_nilai: 25, nis: '2416', id_mapel: 10, id_guru: 2, id_tahun_ajaran: 2, nilai_tugas: 82.00, nilai_uts: 84.00, nilai_uas: 86.00, nilai_akhir: 84.20 },
  { id_nilai: 26, nis: '2417', id_mapel: 7, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 74.00, nilai_uts: 72.00, nilai_uas: 75.00, nilai_akhir: 73.80 },
  { id_nilai: 27, nis: '2418', id_mapel: 7, id_guru: 4, id_tahun_ajaran: 2, nilai_tugas: 88.00, nilai_uts: 85.00, nilai_uas: 90.00, nilai_akhir: 87.90 },
  { id_nilai: 28, nis: '2419', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 80.00, nilai_uts: 78.00, nilai_uas: 82.00, nilai_akhir: 80.20 },
  { id_nilai: 29, nis: '2420', id_mapel: 1, id_guru: 1, id_tahun_ajaran: 2, nilai_tugas: 91.00, nilai_uts: 89.00, nilai_uas: 93.00, nilai_akhir: 91.20 },
  { id_nilai: 30, nis: '2405', id_mapel: 2, id_guru: 3, id_tahun_ajaran: 2, nilai_tugas: 60.00, nilai_uts: 65.00, nilai_uas: 68.00, nilai_akhir: 64.70 },
];

export const SQL_SCHEMA_OVERVIEW = [
  {
    table: 'guru',
    description: 'Data tenaga pendidik / pengajar resmi SMK Negeri 2 Magelang beserta NIP dan kontak',
    columns: [
      { name: 'id_guru', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'nip', type: 'varchar(25)', key: 'UNI', extra: 'NOT NULL' },
      { name: 'nama_guru', type: 'varchar(100)', key: '', extra: 'NOT NULL' },
      { name: 'email', type: 'varchar(100)', key: 'UNI', extra: 'DEFAULT NULL' },
      { name: 'no_hp', type: 'varchar(20)', key: '', extra: 'NOT NULL' },
    ],
    count: 5,
  },
  {
    table: 'jurusan',
    description: 'Kompetensi keahlian kejuruan yang diselenggarakan di sekolah',
    columns: [
      { name: 'id_jurusan', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'kode_jurusan', type: 'varchar(10)', key: 'UNI', extra: 'NOT NULL' },
      { name: 'nama_jurusan', type: 'varchar(100)', key: '', extra: 'NOT NULL' },
    ],
    count: 5,
  },
  {
    table: 'kelas',
    description: 'Rombongan belajar siswa berdasarkan tingkatan (X, XI, XII) dan jurusan',
    columns: [
      { name: 'id_kelas', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'nama_kelas', type: 'varchar(50)', key: '', extra: 'NOT NULL' },
      { name: 'tingkat', type: "enum('X','XI','XII')", key: '', extra: 'NOT NULL' },
      { name: 'id_jurusan', type: 'int(11)', key: 'MUL', extra: 'FK -> jurusan(id_jurusan)' },
    ],
    count: 6,
  },
  {
    table: 'mata_pelajaran',
    description: 'Katalog mata pelajaran kejuruan dan muatan umum',
    columns: [
      { name: 'id_mapel', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'kode_mapel', type: 'varchar(15)', key: 'UNI', extra: 'NOT NULL' },
      { name: 'nama_mapel', type: 'varchar(150)', key: '', extra: 'NOT NULL' },
      { name: 'kelompok', type: 'varchar(50)', key: '', extra: 'NOT NULL' },
    ],
    count: 10,
  },
  {
    table: 'jadwal',
    description: 'Alokasi waktu, guru, mata pelajaran, rombel kelas, dan ruangan',
    columns: [
      { name: 'id_jadwal', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'id_guru', type: 'int(11)', key: 'MUL', extra: 'FK -> guru(id_guru)' },
      { name: 'id_mapel', type: 'int(11)', key: 'MUL', extra: 'FK -> mata_pelajaran(id_mapel)' },
      { name: 'id_kelas', type: 'int(11)', key: 'MUL', extra: 'FK -> kelas(id_kelas)' },
      { name: 'hari', type: "enum('Senin'..'Sabtu')", key: '', extra: 'NOT NULL' },
      { name: 'jam_mulai', type: 'time', key: '', extra: 'NOT NULL' },
      { name: 'jam_selesai', type: 'time', key: '', extra: 'NOT NULL' },
      { name: 'ruang', type: 'varchar(30)', key: '', extra: "DEFAULT 'Ruang Teori'" },
    ],
    count: 15,
  },
  {
    table: 'siswa',
    description: 'Biodata peserta didik terdaftar pada rombel kelas',
    columns: [
      { name: 'nis', type: 'varchar(20)', key: 'PRI', extra: 'NOT NULL' },
      { name: 'nama_siswa', type: 'varchar(100)', key: '', extra: 'NOT NULL' },
      { name: 'jenis_kelamin', type: "enum('L','P')", key: '', extra: 'NOT NULL' },
      { name: 'tanggal_lahir', type: 'date', key: '', extra: 'NOT NULL' },
      { name: 'alamat', type: 'text', key: '', extra: 'NOT NULL' },
      { name: 'no_hp_ortu', type: 'varchar(20)', key: '', extra: 'DEFAULT NULL' },
      { name: 'id_kelas', type: 'int(11)', key: 'MUL', extra: 'FK -> kelas(id_kelas)' },
    ],
    count: 20,
  },
  {
    table: 'tahun_ajaran',
    description: 'Periode kalender akademik dan semester aktif',
    columns: [
      { name: 'id_tahun_ajaran', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'tahun_ajaran', type: 'varchar(10)', key: '', extra: 'NOT NULL' },
      { name: 'semester', type: "enum('Ganjil','Genap')", key: '', extra: 'NOT NULL' },
      { name: 'status', type: "enum('Aktif','Tidak Aktif')", key: '', extra: "DEFAULT 'Aktif'" },
    ],
    count: 2,
  },
  {
    table: 'nilai',
    description: 'Rekapitulasi evaluasi akademik siswa: Tugas (30%), UTS (30%), UAS (40%)',
    columns: [
      { name: 'id_nilai', type: 'int(11)', key: 'PRI', extra: 'AUTO_INCREMENT' },
      { name: 'nis', type: 'varchar(20)', key: 'MUL', extra: 'FK -> siswa(nis)' },
      { name: 'id_mapel', type: 'int(11)', key: 'MUL', extra: 'FK -> mata_pelajaran(id_mapel)' },
      { name: 'id_guru', type: 'int(11)', key: 'MUL', extra: 'FK -> guru(id_guru)' },
      { name: 'id_tahun_ajaran', type: 'int(11)', key: 'MUL', extra: 'FK -> tahun_ajaran(id_tahun_ajaran)' },
      { name: 'nilai_tugas', type: 'decimal(5,2)', key: '', extra: 'DEFAULT 0.00' },
      { name: 'nilai_uts', type: 'decimal(5,2)', key: '', extra: 'DEFAULT 0.00' },
      { name: 'nilai_uas', type: 'decimal(5,2)', key: '', extra: 'DEFAULT 0.00' },
      { name: 'nilai_akhir', type: 'decimal(5,2)', key: '', extra: 'DEFAULT 0.00' },
    ],
    count: 30,
  },
];
