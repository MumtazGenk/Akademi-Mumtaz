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
import { LandingPage } from './components/landing/LandingPage';
import { AnimatePresence, motion } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeTab } = useDatabase();

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {activeTab === 'ringkasan' && <OverviewView />}
      {activeTab === 'jadwal' && <JadwalView />}
      {activeTab === 'siswa' && <SiswaView />}
      {activeTab === 'nilai' && <NilaiView />}
      {activeTab === 'guru' && <GuruView />}
      {activeTab === 'kurikulum' && <KurikulumView />}
      {activeTab === 'database' && <DatabaseInspectorView />}
    </main>
  );
};

const AppContent: React.FC = () => {
  const { pageMode } = useDatabase();

  return (
    <AnimatePresence mode="wait">
      {pageMode === 'landing' ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <LandingPage />
        </motion.div>
      ) : (
        <motion.div
          key="portal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
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
                <span>·</span>
                <span>SIA Portal Akademik Terpadu</span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-zinc-600 font-mono text-[11px]">
                <span>20 Siswa</span>
                <span>·</span>
                <span>5 Guru</span>
                <span>·</span>
                <span>6 Rombel</span>
                <span>·</span>
                <span>10 Mapel</span>
                <span>·</span>
                <span>15 Jadwal</span>
                <span>·</span>
                <span>30 Nilai</span>
              </div>

              <div className="text-zinc-400 text-[11px] font-mono">
                db_sia_smkn2_magelang · MariaDB 12.3.3
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
