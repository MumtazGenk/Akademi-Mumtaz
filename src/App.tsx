import React from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Header } from './components/Header';
import { NavigationTabs } from './components/NavigationTabs';
import { OverviewView } from './components/views/OverviewView';
import { JadwalView } from './components/views/JadwalView';
import { SiswaView } from './components/views/SiswaView';
import { NilaiView } from './components/views/NilaiView';
import { GuruView } from './components/views/GuruView';
import { KurikulumView } from './components/views/KurikulumView';
import { DatabaseInspectorView } from './components/views/DatabaseInspectorView';
import { PresensiView } from './components/views/PresensiView';
import { RemedialView } from './components/views/RemedialView';
import { AdministrasiView } from './components/views/AdministrasiView';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { NotFoundPage } from './components/common/NotFoundPage';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, isTabAllowed, currentUser } = useDatabase();

  if (!isTabAllowed(activeTab)) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/70 p-8 text-center my-8 max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-base font-bold text-zinc-950">Akses Modul Dibatasi (RBAC Guard)</h2>
        <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
          Peran akun {currentUser ? currentUser.role : 'tamu'} tidak memiliki hak akses untuk membuka modul &quot;{activeTab}&quot;.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {activeTab === 'ringkasan' && <OverviewView />}
      {activeTab === 'jadwal' && <JadwalView />}
      {activeTab === 'siswa' && <SiswaView />}
      {activeTab === 'nilai' && <NilaiView />}
      {activeTab === 'guru' && <GuruView />}
      {activeTab === 'kurikulum' && <KurikulumView />}
      {activeTab === 'presensi' && <PresensiView />}
      {activeTab === 'remedial' && <RemedialView />}
      {activeTab === 'administrasi' && <AdministrasiView />}
      {activeTab === 'database' && <DatabaseInspectorView />}
    </main>
  );
};

const AppContent: React.FC = () => {
  const { pageMode } = useDatabase();

  return (
    <AnimatePresence mode="wait">
      {pageMode === 'landing' && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LandingPage />
        </motion.div>
      )}

      {pageMode === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <LoginPage />
        </motion.div>
      )}

      {pageMode === 'register' && (
        <motion.div
          key="register"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <RegisterPage />
        </motion.div>
      )}

      {pageMode === '404' && (
        <motion.div
          key="not-found"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <NotFoundPage />
        </motion.div>
      )}

      {pageMode === 'portal' && (
        <motion.div
          key="portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen bg-zinc-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-zinc-900 selection:bg-zinc-900 selection:text-white"
        >
          <Header />
          <NavigationTabs />
          <div className="flex-1">
            <MainContent />
          </div>

          {/* Institutional Footer */}
          <footer className="border-t border-zinc-200 bg-white py-6 mt-12 text-xs text-zinc-500">
            <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-bold text-zinc-900 tracking-tight">SMK NEGERI 2 MAGELANG</span>
                <span>&middot;</span>
                <span>SIA Portal Akademik Terpadu</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-600 font-mono text-[11px]">
                <span>20 Siswa</span>
                <span>&middot;</span>
                <span>5 Guru</span>
                <span>&middot;</span>
                <span>6 Rombel</span>
                <span>&middot;</span>
                <span>10 Mapel</span>
                <span>&middot;</span>
                <span>15 Jadwal</span>
                <span>&middot;</span>
                <span>30 Nilai</span>
              </div>

              <div className="text-zinc-400 text-[11px] font-mono">
                db_sia_smkn2_magelang &middot; MariaDB 12.3.3
              </div>
            </div>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
