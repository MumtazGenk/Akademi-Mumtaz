import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../../context/DatabaseContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Users,
  Calendar,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  UserCheck,
  FileSpreadsheet,
  AlertCircle,
  Layers,
  Award,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    setPageMode,
    currentUser,
    login,
    logout,
    loginAsDemo,
    siswaList,
    guruList,
    kelasList,
    mapelList,
    activeTahunAjaran,
  } = useDatabase();

  // Active role tab for the login card
  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState<string>('2401'); // Default to Ahmad Pratama NIS
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || window.pageYOffset || 0;
      setIsScrolled(scrollY > 15);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When changing role tab, set sensible default identifier for quick test
  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'siswa') {
      setIdentifier('2401'); // Ahmad Pratama
    } else if (role === 'guru') {
      setIdentifier('197501011999031001'); // Budi Santoso NIP
    } else {
      setIdentifier('admin');
    }
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMessage('Harap masukkan NIS, NIP, atau username akun.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = login(identifier, password, selectedRole);
      setIsSubmitting(false);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-zinc-900 selection:text-white">
      {/* Background Animated Liquid Glass Caustics (Light Mode) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft fluid ambient caustic gradients matching dashboard monochrome zinc */}
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

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000007_1px,transparent_1px),linear-gradient(to_bottom,#00000007_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Glass Top Navigation Bar - Always Fixed to Screen */}
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
            {/* Logo box removed per selector 4 */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-zinc-950 text-sm">SMKN 2 MAGELANG</span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200">
                  SIA v1.0
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 hidden sm:block">
                Sistem Informasi Akademik & Portal Nilai Rapor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100/80 border border-zinc-200 text-xs text-zinc-700 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
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
              <button
                id="btn-nav-guest-portal"
                onClick={() => setPageMode('portal')}
                className="group relative px-4 py-1.5 rounded-xl text-xs font-semibold text-zinc-800 overflow-hidden backdrop-blur-md bg-zinc-100/90 hover:bg-zinc-200/80 border border-zinc-200/90 transition-all cursor-pointer shadow-xs"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>Masuk Mode Tamu</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-zinc-600" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </button>
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
            {/* Status Pill with Liquid Glass Border */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl bg-white/80 border border-zinc-200 text-xs text-zinc-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-[11px] text-zinc-800">MariaDB Engine Connected</span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500 text-[11px]">SMK Negeri 2 Magelang</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15]">
              Sistem Informasi Akademik <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                Evaluasi & Rapor Terpadu
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
              Portal akademik resmi untuk pengelolaan data nilai siswa, distribusi jadwal mengajar guru, kurikulum kompetensi keahlian, dan penerbitan rapor otomatis berbasis basis data relasional.
            </p>

            {/* Quick Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kalkulasi Rapor (30:30:40)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>5 Konsentrasi Keahlian</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md bg-white/70 border border-zinc-200 text-xs text-zinc-700 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cetak Rapor Siswa PDF</span>
              </div>
            </div>

            {/* Direct Portal Access Button (Selector 3 button removed) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-enter-portal"
                onClick={() => setPageMode('portal')}
                className="group relative px-6 py-3 rounded-xl font-semibold text-sm bg-zinc-900 text-white hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-900/10 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span>Masuk Langsung ke Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Liquid Glass Login Card in Light Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            {/* The Glazed Light Container */}
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white via-zinc-200/60 to-zinc-300/40 shadow-xl shadow-zinc-900/5">
              <div className="backdrop-blur-2xl bg-white/80 rounded-[22px] p-6 sm:p-7 border border-white/80 relative overflow-hidden shadow-xs">
                {/* Liquid Glare Sheen across card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-white/80 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-zinc-800" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-950 tracking-tight">Otentikasi Pengguna</h2>
                      <p className="text-[11px] text-zinc-500">Masuk dengan identitas resmi database</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                    SIA Auth
                  </span>
                </div>

                {/* Role Tabs */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200 mb-5">
                  <button
                    type="button"
                    id="tab-login-siswa"
                    onClick={() => handleRoleTabChange('siswa')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'siswa'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Siswa</span>
                  </button>

                  <button
                    type="button"
                    id="tab-login-guru"
                    onClick={() => handleRoleTabChange('guru')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'guru'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Guru</span>
                  </button>

                  <button
                    type="button"
                    id="tab-login-admin"
                    onClick={() => handleRoleTabChange('admin')}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      selectedRole === 'admin'
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmitLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                      {selectedRole === 'siswa' && 'Nomor Induk Siswa (NIS)'}
                      {selectedRole === 'guru' && 'Nomor Induk Pegawai (NIP) / Email'}
                      {selectedRole === 'admin' && 'Username Administrator'}
                    </label>
                    <div className="relative">
                      <input
                        id="input-login-identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          selectedRole === 'siswa'
                            ? 'Contoh: 2401'
                            : selectedRole === 'guru'
                            ? 'Contoh: 197501011999031001'
                            : 'Contoh: admin'
                        }
                        className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-zinc-700">
                        {selectedRole === 'siswa' ? 'Tanggal Lahir / Password' : 'Kata Sandi'}
                      </label>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {selectedRole === 'siswa' ? 'Opsional untuk demo' : 'Default: Bebas'}
                      </span>
                    </div>
                    <input
                      id="input-login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                    />
                  </div>

                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    id="btn-submit-login"
                    disabled={isSubmitting}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-md shadow-zinc-900/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Masuk ke Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Fast Demo Logins */}
                <div className="mt-5 pt-4 border-t border-zinc-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium text-zinc-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-zinc-500" />
                      Akses Cepat 1-Klik (Demo):
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      id="btn-demo-siswa"
                      onClick={() => loginAsDemo('siswa')}
                      className="p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all cursor-pointer group"
                      title="Masuk sebagai Ahmad Pratama (Siswa)"
                    >
                      <div className="text-[11px] font-bold text-zinc-800 group-hover:text-zinc-950 truncate">
                        Ahmad P.
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">NIS 2401</div>
                    </button>

                    <button
                      type="button"
                      id="btn-demo-guru"
                      onClick={() => loginAsDemo('guru')}
                      className="p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all cursor-pointer group"
                      title="Masuk sebagai Budi Santoso (Guru)"
                    >
                      <div className="text-[11px] font-bold text-zinc-800 group-hover:text-zinc-950 truncate">
                        Budi S.
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">Guru PPLG</div>
                    </button>

                    <button
                      type="button"
                      id="btn-demo-admin"
                      onClick={() => loginAsDemo('admin')}
                      className="p-2 rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-left transition-all cursor-pointer group"
                      title="Masuk sebagai Admin Akademik"
                    >
                      <div className="text-[11px] font-bold text-zinc-800 group-hover:text-zinc-950 truncate">
                        Admin
                      </div>
                      <div className="text-[9px] text-zinc-500 font-mono">SIA Tata Usaha</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Liquid Glass Metric Counters in Light Mode */}
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

        {/* Informational Section (Selector 2) removed */}

        {/* Feature Cards Grid (Glazed Light Design) */}
        <div className="pt-4 pb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">
              Modul Fungsional Portal Akademik
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5">
              Standar pelaporan hasil belajar Kurikulum Merdeka & K-13 SMK Negeri 2 Magelang
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-white/70 hover:bg-white/95 border border-zinc-200/80 rounded-2xl p-6 transition-all shadow-xs group">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5 text-zinc-800" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">Penilaian & Kalkulasi Rapor</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Formula pembobotan nilai akhir otomatis: 30% Tugas + 30% UTS + 40% UAS. Dilengkapi status predikat dan batas ketuntasan belajar (KKM 75.00).
              </p>
              <button
                onClick={() => setPageMode('portal')}
                className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Modul Nilai</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="backdrop-blur-xl bg-white/70 hover:bg-white/95 border border-zinc-200/80 rounded-2xl p-6 transition-all shadow-xs group">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-zinc-800" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">Distribusi Jadwal KBM</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Penjadwalan harian (Senin - Jumat), alokasi ruang teori dan laboratorium (Lab Komputer, Lab Akuntansi, Lab Pemasaran) secara terstruktur.
              </p>
              <button
                onClick={() => setPageMode('portal')}
                className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Jadwal Pelajaran</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="backdrop-blur-xl bg-white/70 hover:bg-white/95 border border-zinc-200/80 rounded-2xl p-6 transition-all shadow-xs group">
              <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5 text-zinc-800" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-2">Konsentrasi Keahlian</h3>
              <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                Mendukung 5 kompetensi: PPLG (Pengembangan Perangkat Lunak & Gim), AKL (Akuntansi), MPLB (Manajemen Perkantoran), PM (Pemasaran), & DKV.
              </p>
              <button
                onClick={() => setPageMode('portal')}
                className="text-xs font-semibold text-zinc-800 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Eksplorasi Kurikulum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Liquid Glass Minimal Footer in Light Mode (3rd div removed per Selector 1) */}
      <footer className="relative z-10 border-t border-zinc-200 bg-white/80 backdrop-blur-xl py-8 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-zinc-950">SMK NEGERI 2 MAGELANG</span>
            <span>·</span>
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
