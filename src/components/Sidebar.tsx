import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDatabase } from '../context/DatabaseContext';
import { TabKey } from '../types';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Award,
  GraduationCap,
  Layers,
  Database,
  ClipboardCheck,
  RefreshCcw,
  Settings2,
  Calendar,
  X,
} from 'lucide-react';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

interface TabGroup {
  title: string;
  tabs: TabItem[];
}

export interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const {
    activeTab,
    setActiveTab,
    allowedTabs,
    activeTahunAjaran,
  } = useDatabase();

  const groups: TabGroup[] = [
    {
      title: 'Menu Utama',
      tabs: [
        { key: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
        { key: 'jadwal', label: 'Jadwal Pelajaran', icon: CalendarDays },
        { key: 'siswa', label: 'Data Siswa', icon: Users },
        { key: 'nilai', label: 'Buku Nilai', icon: Award },
        { key: 'guru', label: 'Tenaga Pendidik', icon: GraduationCap },
      ],
    },
    {
      title: 'Akademik',
      tabs: [
        { key: 'kurikulum', label: 'Jurusan & Mapel', icon: Layers },
        { key: 'presensi', label: 'Presensi', icon: ClipboardCheck },
        { key: 'remedial', label: 'Remedial', icon: RefreshCcw },
      ],
    },
    {
      title: 'Sistem',
      tabs: [
        { key: 'administrasi', label: 'Administrasi', icon: Settings2 },
        { key: 'database', label: 'Struktur DB', icon: Database },
      ],
    },
  ];

  const renderNavList = () => (
    <div className="flex flex-col h-full justify-between gap-6">
      <div className="space-y-4">
        {groups.map((group) => {
          const visibleTabs = group.tabs.filter(
            (tab) => !allowedTabs || allowedTabs.includes(tab.key)
          );
          if (visibleTabs.length === 0) return null;

          return (
            <div key={group.title} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-zinc-400 uppercase font-mono">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {visibleTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <motion.button
                      id={`tab-${tab.key}`}
                      key={tab.key}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => {
                        setActiveTab(tab.key);
                        onCloseMobile?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-900 text-white font-semibold shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isActive ? 'text-white' : 'text-zinc-400'
                          }`}
                        />
                        <span className="truncate">{tab.label}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 border-t border-zinc-100">
        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 text-[11px]">
          <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>Semester Aktif</span>
          </div>
          <div className="text-zinc-500 mt-1 font-medium truncate">
            {activeTahunAjaran.semester} {activeTahunAjaran.tahun_ajaran}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-zinc-200 bg-white">
        <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto p-3.5 flex flex-col justify-between">
          {renderNavList()}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpenMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
              onClick={onCloseMobile}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white z-50 shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-900 tracking-tight">
                    Navigasi SIA
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase bg-zinc-100 text-zinc-600 rounded border border-zinc-200">
                    v1.0
                  </span>
                </div>
                <button
                  onClick={onCloseMobile}
                  className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md cursor-pointer"
                  title="Tutup Menu"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
                {renderNavList()}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
