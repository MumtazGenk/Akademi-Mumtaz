import React from 'react';
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
} from 'lucide-react';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, siswaList, guruList, jadwalList, nilaiList } = useDatabase();

  const tabs: TabItem[] = [
    { key: 'ringkasan', label: 'Ringkasan', icon: LayoutDashboard },
    { key: 'jadwal', label: 'Jadwal Pelajaran', icon: CalendarDays, badge: jadwalList.length },
    { key: 'siswa', label: 'Data Siswa', icon: Users, badge: siswaList.length },
    { key: 'nilai', label: 'Buku Nilai', icon: Award, badge: nilaiList.length },
    { key: 'guru', label: 'Tenaga Pendidik', icon: GraduationCap, badge: guruList.length },
    { key: 'kurikulum', label: 'Jurusan & Mapel', icon: Layers },
    { key: 'database', label: 'Struktur DB', icon: Database, badge: 'MariaDB' },
  ];

  return (
    <div className="border-b border-zinc-200 bg-white">
      <div className="px-4 lg:px-8 flex overflow-x-auto no-scrollbar gap-1 pt-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              id={`tab-${tab.key}`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-zinc-900 text-zinc-950 font-semibold bg-zinc-50/70'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
