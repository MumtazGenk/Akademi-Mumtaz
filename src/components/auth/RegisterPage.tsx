import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../../context/DatabaseContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  UserCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  UserPlus,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const {
    setPageMode,
    registerUser,
    loginWithGoogle,
    checkPasswordStrength,
    googleClientId,
  } = useDatabase();

  const [role, setRole] = useState<'siswa' | 'guru'>('siswa');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const strength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!namaLengkap.trim() || !identifier.trim() || !email.trim() || !password) {
      setErrorMessage('Semua kolom formulir pendaftaran wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreedToPolicy) {
      setErrorMessage('Harap setujui pakta integritas dan kebijakan akses data.');
      return;
    }

    if (strength.score < 3 || !strength.hasLength) {
      setErrorMessage('Kekuatan kata sandi belum memenuhi kriteria keamanan (minimal 8 karakter dan kombinasi karakter).');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await registerUser({
        email,
        password,
        role: role as UserRole,
        identifier,
        nama_lengkap: namaLengkap,
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          setPageMode('login');
        }, 1500);
      } else {
        setErrorMessage(result.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
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

  const getStrengthBarColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-amber-500';
    if (score === 3) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-zinc-900 selection:text-white flex flex-col justify-between">
      {/* Liquid Glass Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -35, 35, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-zinc-200/60 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 35, -35, 0],
            scale: [1, 0.94, 1.06, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-10 -left-32 w-[520px] h-[520px] rounded-full bg-zinc-200/50 blur-[120px]"
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
          <span>SIA REGISTRASI AKUN</span>
        </div>
      </header>

      {/* Center Register Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-4 py-6">
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
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-zinc-950 tracking-tight">Daftar Akun Baru</h1>
                  <p className="text-xs text-zinc-500">Pendaftaran akun resmi SMKN 2 Magelang</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                SIA Access
              </span>
            </div>

            {/* Google OAuth Quick Sign-up */}
            <button
              type="button"
              id="btn-register-google"
              onClick={handleGoogleSignUp}
              disabled={isGoogleSubmitting}
              className="w-full py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mb-5"
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
              <span>{isGoogleSubmitting ? 'Mengarahkan...' : 'Daftar Cepat dengan Google'}</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-2.5 text-[11px] text-zinc-400 font-mono uppercase tracking-wider relative">
                atau isi data formulir
              </span>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-zinc-100/90 border border-zinc-200 mb-5">
              <button
                type="button"
                id="reg-role-siswa"
                onClick={() => setRole('siswa')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'siswa'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Akun Siswa</span>
              </button>

              <button
                type="button"
                id="reg-role-guru"
                onClick={() => setRole('guru')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === 'guru'
                    ? 'bg-white text-zinc-950 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Akun Guru</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  id="reg-nama"
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Contoh: Muhammad Rizki"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    {role === 'siswa' ? 'Nomor Induk Siswa (NIS)' : 'Nomor Induk Pegawai (NIP)'}
                  </label>
                  <input
                    id="reg-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'siswa' ? 'Contoh: 2421' : 'Contoh: 19800101...'}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Alamat Email
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@smkn2mgl.sch.id"
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Kata Sandi
                </label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter kombinasi"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                />

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-medium">Kekuatan Kata Sandi:</span>
                      <span className="font-semibold text-zinc-800">
                        {strength.score <= 1 && 'Sangat Lemah'}
                        {strength.score === 2 && 'Cukup'}
                        {strength.score === 3 && 'Kuat'}
                        {strength.score === 4 && 'Sangat Kuat'}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthBarColor(strength.score)}`}
                        style={{ width: `${(strength.score / 4) * 100}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-zinc-600 pt-1">
                      <span className="flex items-center gap-1">
                        {strength.hasLength ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-zinc-400" />
                        )}
                        Min. 8 karakter
                      </span>
                      <span className="flex items-center gap-1">
                        {strength.hasUpper ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-zinc-400" />
                        )}
                        Huruf besar (A-Z)
                      </span>
                      <span className="flex items-center gap-1">
                        {strength.hasLower ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-zinc-400" />
                        )}
                        Huruf kecil (a-z)
                      </span>
                      <span className="flex items-center gap-1">
                        {strength.hasNumber || strength.hasSymbol ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-zinc-400" />
                        )}
                        Angka atau simbol
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Ulangi Kata Sandi
                </label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi kamu"
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 hover:bg-zinc-100/60 focus:bg-white border border-zinc-200 rounded-xl text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all font-mono"
                />
              </div>

              {/* Integrity Agreement */}
              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToPolicy}
                  onChange={(e) => setAgreedToPolicy(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-[11px] text-zinc-600 leading-snug">
                  Saya menyatakan data pendaftaran ini valid dan menyetujui kebijakan privasi serta pakta integritas akademik SMK Negeri 2 Magelang.
                </span>
              </label>

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

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}

              <button
                type="submit"
                id="btn-submit-register"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm shadow-md shadow-zinc-900/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Daftarkan Akun</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link back to login */}
            <div className="mt-5 pt-4 border-t border-zinc-200/80 text-center">
              <p className="text-xs text-zinc-600">
                Sudah memiliki akun resmi?{' '}
                <button
                  type="button"
                  id="link-to-login"
                  onClick={() => setPageMode('login')}
                  className="font-bold text-zinc-950 hover:underline cursor-pointer"
                >
                  Masuk di Sini
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-zinc-400 font-mono">
        Sistem Informasi Akademik SMK Negeri 2 Magelang &middot; Pendaftaran Terpadu
      </footer>
    </div>
  );
};
