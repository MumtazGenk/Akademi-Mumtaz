import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../../context/DatabaseContext';
import { UserRole } from '../../types';
import {
  Lock,
  GraduationCap,
  UserCheck,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    setPageMode,
    login,
    loginWithGoogle,
    lockoutRemainingSeconds,
    failedLoginAttempts,
  } = useDatabase();

  const [selectedRole, setSelectedRole] = useState<UserRole>('siswa');
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemainingSeconds > 0) {
      setErrorMessage(`Sistem terkunci sementara. Tunggu ${lockoutRemainingSeconds} detik lagi.`);
      return;
    }
    if (!identifier.trim()) {
      setErrorMessage('Harap isi identitas (NIS, NIP, atau username).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await login(identifier, password, selectedRole);
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (lockoutRemainingSeconds > 0) {
      setErrorMessage(`Sistem terkunci sementara. Tunggu ${lockoutRemainingSeconds} detik lagi.`);
      return;
    }
    setIsGoogleSubmitting(true);
    setErrorMessage('');
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      {/* Liquid Glass Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-zinc-200/60 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 30, 0],
            y: [0, 40, -40, 0],
            scale: [1, 0.95, 1.08, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 -right-36 w-[560px] h-[560px] rounded-full bg-zinc-200/50 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000007_1px,transparent_1px),linear-gradient(to_bottom,#00000007_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Header bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 flex items-center justify-between">
        <button
          onClick={() => setPageMode('landing')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>SIA SMKN 2 MAGELANG</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl p-1 bg-gradient-to-b from-white via-zinc-200/70 to-zinc-300/50 shadow-xl shadow-zinc-900/5"
        >
          <div className="backdrop-blur-2xl bg-white/90 rounded-[22px] p-6 sm:p-8 border border-white/80 relative overflow-hidden">
            {/* Liquid Sheen */}
            <div className="absolute -top-24 -right-24 w-44 h-44 rounded-full bg-white blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-zinc-950 tracking-tight">Masuk Portal</h1>
                  <p className="text-xs text-zinc-500">Sistem Informasi Akademik Terpadu</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                SSL 256-bit
              </span>
            </div>

            {/* Google OAuth Action Button */}
            <button
              type="button"
              id="btn-login-google"
              onClick={handleGoogleLogin}
              disabled={isGoogleSubmitting || lockoutRemainingSeconds > 0}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleSubmitting ? 'Memproses OAuth...' : 'Masuk dengan Akun Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-2.5 text-[11px] text-zinc-400 font-mono uppercase tracking-wider relative">
                atau kredensial
              </span>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200 mb-5">
              <button
                type="button"
                id="role-tab-siswa"
                onClick={() => {
                  setSelectedRole('siswa');
                  setErrorMessage('');
                }}
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
                id="role-tab-guru"
                onClick={() => {
                  setSelectedRole('guru');
                  setErrorMessage('');
                }}
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
                id="role-tab-admin"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMessage('');
                }}
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

            {/* Lockout Warning */}
            {lockoutRemainingSeconds > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5"
              >
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Keamanan: Akun Terkunci Sementara</div>
                  <div className="mt-0.5 text-amber-800">
                    Terdeteksi percobaan berulang tidak valid. Tunggu{' '}
                    <span className="font-mono font-bold text-amber-950">{lockoutRemainingSeconds}</span> detik sebelum mencoba kembali.
                  </div>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    disabled={lockoutRemainingSeconds > 0}
                    placeholder={
                      selectedRole === 'siswa'
                        ? 'Contoh: 2401'
                        : selectedRole === 'guru'
                        ? 'Contoh: 197501011999031001 atau budi@smkn2mgl.sch.id'
                        : 'Contoh: admin'
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-zinc-700">Kata Sandi</label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {selectedRole === 'siswa' ? 'Default: Tanggal lahir / Bebas' : 'Wajib diisi'}
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="input-login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={lockoutRemainingSeconds > 0}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono disabled:opacity-50"
                  />
                </div>
              </div>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {failedLoginAttempts > 0 && failedLoginAttempts < 5 && (
                <div className="text-[11px] text-zinc-500 font-mono">
                  Percobaan gagal: {failedLoginAttempts} dari 5 toleransi maksimal.
                </div>
              )}

              <button
                type="submit"
                id="btn-login-submit"
                disabled={isSubmitting || lockoutRemainingSeconds > 0}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-md shadow-zinc-900/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Masuk ke Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom link to Register */}
            <div className="mt-6 pt-5 border-t border-zinc-200/80 text-center">
              <p className="text-xs text-zinc-600">
                Belum memiliki akun terdaftar?{' '}
                <button
                  type="button"
                  id="link-to-register"
                  onClick={() => setPageMode('register')}
                  className="font-bold text-zinc-950 hover:underline cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-zinc-400 font-mono">
        Sistem Informasi Akademik SMK Negeri 2 Magelang &middot; Keamanan RBAC Aktif
      </footer>
    </div>
  );
};
