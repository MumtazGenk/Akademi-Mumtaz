import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../../context/DatabaseContext';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  Award,
  ClipboardCheck,
  RefreshCcw,
  Sparkles,
  Server,
  Lock,
  ChevronRight,
  Clock,
  Laptop,
  Calculator,
  Briefcase,
  TrendingUp,
  Palette,
  LogIn,
  UserPlus,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setPageMode,
    currentUser,
    logout,
    siswaList,
    guruList,
    kelasList,
    mapelList,
    activeTahunAjaran,
  } = useDatabase();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeShowcaseTab, setActiveShowcaseTab] = useState<'formula' | 'jadwal' | 'presensi'>('formula');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setIsScrolled(scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const vocationalMajors = [
    {
      code: 'PPLG',
      name: 'Pengembangan Perangkat Lunak & Gim',
      desc: 'Pemrograman web, mobile apps, database MariaDB/Supabase, dan logika algoritma industri.',
      icon: Laptop,
      focus: 'React, Node.js, SQL, Version Control',
      lab: 'Lab Komputer RPL & Software Engineering',
    },
    {
      code: 'AKL',
      name: 'Akuntansi & Keuangan Lembaga',
      desc: 'Pencatatan siklus akuntansi, rekonsiliasi perbankan, perpajakan, dan pelaporan keuangan digital.',
      icon: Calculator,
      focus: 'Spreadsheet Akuntansi, MYOB, Pajak Digital',
      lab: 'Mini Bank & Lab Komputer Akuntansi',
    },
    {
      code: 'MPLB',
      name: 'Manajemen Perkantoran & Layanan Bisnis',
      desc: 'Manajemen korespondensi dinas, pengarsipan elektronik, kearsipan data, dan administrasi perkantoran modern.',
      icon: Briefcase,
      focus: 'Digital Archiving, Otomasi Kantor, Public Relations',
      lab: 'Lab Simulasi Perkantoran Modern',
    },
    {
      code: 'PM',
      name: 'Pemasaran & Bisnis Digital',
      desc: 'Strategi pemasaran omnichannel, pengelolaan e-commerce retail, dan riset pasar konsumen.',
      icon: TrendingUp,
      focus: 'Digital Marketing, Content Marketing, Point of Sale',
      lab: 'Business Center & Retail Mart SMKN 2',
    },
    {
      code: 'DKV',
      name: 'Desain Komunikasi Visual',
      desc: 'Desain grafis publikasi, branding identitas visual, UI/UX interface design, dan audio-visual editing.',
      icon: Palette,
      focus: 'Vector Illustration, UI Prototyping, Motion Assets',
      lab: 'Studio Multimedia & Creative Lab',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Presensi Harian Terverifikasi',
      desc: 'Pencatatan absensi peserta didik secara presisi oleh guru mata pelajaran dan wali kelas setiap jam pelajaran berlangsung.',
      icon: ClipboardCheck,
    },
    {
      step: '02',
      title: 'Penginputan Komponen Nilai',
      desc: 'Rekapitulasi komprehensif nilai tugas, ulangan harian, PTS, dan PAS dengan bobot proporsional standar kurikulum.',
      icon: FileSpreadsheet,
    },
    {
      step: '03',
      title: 'Evaluasi & Tindak Lanjut Remedial',
      desc: 'Deteksi otomatis peserta didik dengan nilai di bawah batas KKM 75.00 untuk program pembinaan dan pengulangan tes.',
      icon: RefreshCcw,
    },
    {
      step: '04',
      title: 'Penerbitan Rapor Hasil Belajar',
      desc: 'Kalkulasi nilai akhir, konversi predikat A/B/C/D, perumusan capaian kompetensi, serta cetak rapor siap serah.',
      icon: Award,
    },
  ];

  const academicCalendar = [
    {
      date: '15 - 20 September 2024',
      event: 'Penilaian Tengah Semester (PTS) Ganjil',
      status: 'Selesai',
      tag: 'KBM',
    },
    {
      date: '25 - 30 November 2024',
      event: 'Batas Akhir Penilaian & Program Remedial',
      status: 'Sedang Berjalan',
      tag: 'Evaluasi',
    },
    {
      date: '02 - 12 Desember 2024',
      event: 'Penilaian Akhir Semester (PAS) Ganjil',
      status: 'Mendatang',
      tag: 'Ujian',
    },
    {
      date: '20 Desember 2024',
      event: 'Penyerahan Buku Rapor Siswa Semester Ganjil',
      status: 'Mendatang',
      tag: 'Laporan',
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-zinc-900 selection:text-white">
      {/* Background Animated Liquid Glass Caustics */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 45, -35, 0],
            y: [0, -50, 35, 0],
            scale: [1, 1.12, 0.96, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-zinc-200/60 blur-[110px]"
        />
        <motion.div
          animate={{
            x: [0, -55, 35, 0],
            y: [0, 45, -45, 0],
            scale: [1, 0.94, 1.08, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 -right-40 w-[620px] h-[620px] rounded-full bg-zinc-200/50 blur-[130px]"
        />
        <motion.div
          animate={{
            x: [0, 35, -25, 0],
            y: [0, 35, -35, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-40 left-1/3 w-[650px] h-[650px] rounded-full bg-zinc-300/30 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000007_1px,transparent_1px),linear-gradient(to_bottom,#00000007_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Glass Navigation Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'px-0 py-0' : 'px-4 lg:px-8 py-3.5'
        }`}
      >
        <div
          className={`w-full transition-all duration-300 ease-in-out backdrop-blur-xl flex items-center justify-between ${
            isScrolled
              ? 'max-w-full rounded-none border-b border-t-0 border-x-0 border-zinc-200/90 bg-white/90 px-6 lg:px-10 py-3 shadow-xs'
              : 'max-w-7xl mx-auto rounded-2xl border border-zinc-200/80 bg-white/70 px-4 md:px-6 py-2.5 shadow-lg shadow-zinc-900/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-zinc-950 text-sm">SMKN 2 MAGELANG</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  SIA v2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Sistem Informasi Akademik & Portal Nilai Rapor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100/80 border border-zinc-200 text-xs text-zinc-700 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeTahunAjaran.tahun_ajaran} {activeTahunAjaran.semester}</span>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-zinc-900">{currentUser.name}</div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono">{currentUser.role}</div>
                </div>
                <button
                  id="btn-nav-enter-portal"
                  onClick={() => setPageMode('portal')}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800 transition-all flex items-center gap-1.5 shadow-md shadow-zinc-900/10 cursor-pointer"
                >
                  <span>Buka Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  id="btn-nav-logout"
                  onClick={logout}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/70 border border-zinc-200 text-xs text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer"
                  title="Keluar"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-register"
                  onClick={() => setPageMode('register')}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100/90 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Daftar</span>
                </button>

                <button
                  id="btn-nav-login"
                  onClick={() => setPageMode('login')}
                  className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-zinc-900/10"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-24 sm:pt-28 pb-20">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-6 lg:py-12">
          {/* Left Column: Typography & System Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/80 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-zinc-800">MariaDB Relational Engine Active</span>
              <span className="text-zinc-300">&middot;</span>
              <span className="text-zinc-500 text-[11px]">SMK Negeri 2 Magelang</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15]">
              Sistem Informasi Akademik <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                Evaluasi & Rapor Terpadu
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Portal akademik resmi untuk tata kelola nilai hasil belajar, absensi presisi, distribusi jadwal mengajar, dan penerbitan rapor otomatis berbasis basis data relasional.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kalkulasi Otomatis (30:30:40)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>5 Konsentrasi Keahlian</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Format Nilai KKM 75.00</span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-login"
                onClick={() => setPageMode('login')}
                className="group relative px-6 py-3 rounded-xl font-semibold text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/10 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </button>

              <button
                id="btn-hero-register"
                onClick={() => setPageMode('register')}
                className="px-5 py-3 rounded-xl font-semibold text-sm bg-white hover:bg-zinc-100/80 text-zinc-800 border border-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-zinc-600" />
                <span>Daftar Akun Baru</span>
              </button>

              <button
                id="btn-hero-guest"
                onClick={() => setPageMode('portal')}
                className="px-4 py-3 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Mode Tamu &rarr;
              </button>
            </div>
          </motion.div>

          {/* Right Column: Live Academic Showcase & Status Console (Creative Utilization of Space) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white via-zinc-200/70 to-zinc-300/50 shadow-xl shadow-zinc-900/5">
              <div className="backdrop-blur-2xl bg-white/85 rounded-[22px] p-6 border border-white/80 relative overflow-hidden">
                {/* Sheen effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/90 blur-2xl pointer-events-none" />

                {/* Console Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-zinc-950">Konsol Akademik Real-Time</h2>
                      <p className="text-[11px] text-zinc-500">Pratinjau modul fungsional aktif</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    ONLINE
                  </span>
                </div>

                {/* Showcase Switcher */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200 mb-4">
                  <button
                    type="button"
                    onClick={() => setActiveShowcaseTab('formula')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeShowcaseTab === 'formula'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Rapor Formula
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveShowcaseTab('jadwal')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeShowcaseTab === 'jadwal'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Jadwal KBM
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveShowcaseTab('presensi')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeShowcaseTab === 'presensi'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Presensi Card
                  </button>
                </div>

                {/* Showcase Content Panel */}
                <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 min-h-[170px] flex flex-col justify-between">
                  {activeShowcaseTab === 'formula' && (
                    <div className="space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                        <span className="text-zinc-500 font-medium">Standar KKM Sekolah</span>
                        <span className="font-mono font-bold text-zinc-950 px-2 py-0.5 rounded bg-white border border-zinc-200">
                          75.00
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-zinc-600">
                        <span>Komposisi Rapor Akhir:</span>
                        <span className="font-mono font-semibold text-zinc-800">
                          30% Tugas + 30% UTS + 40% UAS
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-zinc-500">Contoh Simulasi (Ahmad P.):</span>
                          <span className="font-mono font-bold text-emerald-700">86.50 (Predikat A)</span>
                        </div>
                        <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full w-[86.5%]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeShowcaseTab === 'jadwal' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">Senin &middot; Jam ke-1 s/d 4</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                          Ruang Lab PPLG 1
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white border border-zinc-200 text-xs">
                        <div className="font-bold text-zinc-900">Pemrograman Berorientasi Objek</div>
                        <div className="text-zinc-500 text-[11px] mt-0.5">Budi Santoso, S.Kom. &middot; XII PPLG 1</div>
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Total 15 jadwal aktif terverifikasi</span>
                      </div>
                    </div>
                  )}

                  {activeShowcaseTab === 'presensi' && (
                    <div className="space-y-2 text-xs">
                      <div className="text-zinc-600 font-medium text-[11px] mb-1">
                        Model Card Selection Presensi Baru:
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 font-mono text-[11px]">
                        <div className="py-1.5 px-2 rounded-lg bg-zinc-900 text-white font-bold text-center border border-zinc-900">
                          Hadir
                        </div>
                        <div className="py-1.5 px-2 rounded-lg bg-white text-zinc-700 text-center border border-zinc-200">
                          Sakit
                        </div>
                        <div className="py-1.5 px-2 rounded-lg bg-white text-zinc-700 text-center border border-zinc-200">
                          Izin
                        </div>
                        <div className="py-1.5 px-2 rounded-lg bg-white text-zinc-700 text-center border border-zinc-200">
                          Alpa
                        </div>
                      </div>
                      <div className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-200">
                        Seleksi aktif berwarna hitam solid dengan validasi otomatis per tanggal KBM.
                      </div>
                    </div>
                  )}

                  <div className="pt-3 mt-2 border-t border-zinc-200/70 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-500 font-mono">RBAC Security Guard</span>
                    <button
                      onClick={() => setPageMode('portal')}
                      className="text-zinc-900 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Jelajahi Portal</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Console System Footnote */}
                <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Google OAuth &amp; Hash Kripto
                  </span>
                  <span>v2.4 Production</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Liquid Glass Metric Counters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8"
        >
          <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 border border-zinc-200/80 rounded-2xl p-4 transition-all shadow-xs group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Siswa Terdata</span>
              <GraduationCap className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950">{siswaList.length}</div>
            <p className="text-[11px] text-zinc-400 mt-1">NIS resmi & identitas lengkap</p>
          </div>

          <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 border border-zinc-200/80 rounded-2xl p-4 transition-all shadow-xs group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Tenaga Pendidik</span>
              <Users className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950">{guruList.length}</div>
            <p className="text-[11px] text-zinc-400 mt-1">NIP & spesialisasi mapel</p>
          </div>

          <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 border border-zinc-200/80 rounded-2xl p-4 transition-all shadow-xs group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Rombongan Belajar</span>
              <Layers className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950">{kelasList.length}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Tingkat X, XI, & XII</p>
          </div>

          <div className="backdrop-blur-xl bg-white/70 hover:bg-white/90 border border-zinc-200/80 rounded-2xl p-4 transition-all shadow-xs group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500 font-medium">Mata Pelajaran</span>
              <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-zinc-800 transition-colors" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-950">{mapelList.length}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Normatif, adaptif, kejuruan</p>
          </div>
        </motion.div>

        {/* Section 1: Alur Terpadu SIA SMKN 2 Magelang */}
        <section className="py-12 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-medium border border-zinc-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600" />
              <span>ALUR MANAJEMEN AKADEMIK</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Siklus Evaluasi Belajar Terintegrasi
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
              Empat tahapan otomatis yang menghubungkan aktivitas guru di kelas hingga pencetakan rapor siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="backdrop-blur-xl bg-white/70 hover:bg-white/95 border border-zinc-200/80 rounded-2xl p-6 transition-all shadow-xs relative group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900 mb-2">{step.title}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
                    Otomatisasi Sistem
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: 5 Konsentrasi Keahlian Unggulan */}
        <section className="py-12 border-t border-zinc-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-medium border border-zinc-200 mb-2">
              <Layers className="w-3.5 h-3.5 text-zinc-600" />
              <span>KURIKULUM KEJURUAN</span>
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              5 Konsentrasi Keahlian Unggulan
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
              Program kejuruan berbasis standar kompetensi industri di SMK Negeri 2 Magelang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocationalMajors.map((major) => {
              const MajorIcon = major.icon;
              return (
                <div
                  key={major.code}
                  className="backdrop-blur-xl bg-white/70 hover:bg-white/95 border border-zinc-200/80 rounded-2xl p-6 transition-all shadow-xs flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800 group-hover:scale-105 transition-transform">
                        <MajorIcon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-zinc-900 text-white">
                        {major.code}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 mb-2">{major.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed mb-4">{major.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 space-y-1.5 text-[11px]">
                    <div className="text-zinc-700">
                      <span className="text-zinc-400">Fokus: </span>
                      <span className="font-medium">{major.focus}</span>
                    </div>
                    <div className="text-zinc-500 text-[10px] font-mono truncate">
                      {major.lab}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total Program Summary Card */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">
                  Akreditasi A Unggul
                </span>
                <h3 className="text-lg font-bold mt-2 mb-2">SMKN 2 Magelang</h3>
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  Mencetak lulusan siap kerja, wirausaha mandiri, dan studi lanjut ke jenjang perguruan tinggi dengan sertifikasi kompetensi nasional.
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-700 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Tertata di SIA Database</span>
                <button
                  onClick={() => setPageMode('portal')}
                  className="px-3 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                  Buka Modul
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Agenda & Kalender Akademik */}
        <section className="py-12 border-t border-zinc-200/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-medium border border-zinc-200">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                <span>KALENDER AKADEMIK</span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
                Agenda Semester Berjalan 2024/2025
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Jadwal resmi pelaksanaan evaluasi, penuntasan remedial, dan pelaporan hasil belajar peserta didik untuk menjaga ketepatan waktu distribusi rapor.
              </p>

              <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-zinc-900 font-bold">
                  <Lock className="w-4 h-4 text-zinc-700" />
                  <span>Kebijakan Batas Unggah Nilai</span>
                </div>
                <p className="text-zinc-500 leading-relaxed text-[11px]">
                  Nilai akhir terkunci otomatis setelah pleno kelulusan dan hanya dapat disunting oleh Admin Tata Usaha dengan persetujuan Kepala Sekolah.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-xl divide-y divide-zinc-200 shadow-xs">
                {academicCalendar.map((item, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-zinc-900">
                          {item.date}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-zinc-900">{item.event}</h4>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        item.status === 'Selesai'
                          ? 'bg-zinc-100 text-zinc-600'
                          : item.status === 'Sedang Berjalan'
                          ? 'bg-emerald-100 text-emerald-800 font-bold'
                          : 'bg-zinc-100 text-zinc-500'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Bottom Call to Action */}
        <section className="py-12 border-t border-zinc-200/80">
          <div className="rounded-3xl p-8 sm:p-12 bg-zinc-900 text-white relative overflow-hidden text-center max-w-4xl mx-auto shadow-xl">
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Otentikasi Kredensial &amp; Google Workspace</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Akses Portal Akademik Terpadu
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Masuk menggunakan akun NIS siswa atau NIP guru yang telah terdaftar dalam basis data resmi SMK Negeri 2 Magelang.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  id="btn-cta-login"
                  onClick={() => setPageMode('login')}
                  className="px-6 py-3 rounded-xl bg-white text-zinc-900 font-bold text-xs sm:text-sm hover:bg-zinc-100 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Akun Sekarang</span>
                </button>

                <button
                  type="button"
                  id="btn-cta-register"
                  onClick={() => setPageMode('register')}
                  className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar Akun Baru</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Liquid Glass Minimal Institutional Footer */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white/80 backdrop-blur-xl py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-950">SMK NEGERI 2 MAGELANG</span>
            <span>&middot;</span>
            <span>Portal Sistem Informasi Akademik</span>
          </div>

          <div className="text-zinc-500 text-center md:text-right">
            Jl. Perintis Kemerdekaan No.1, Kota Magelang, Jawa Tengah 56115
          </div>
        </div>
      </footer>
    </div>
  );
};
