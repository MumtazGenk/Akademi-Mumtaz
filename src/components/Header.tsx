import React from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../context/DatabaseContext';
import { Search, Calendar, Home, LogOut, User, Menu, X } from 'lucide-react';

export interface HeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { activeTahunAjaran, tahunAjaranList, setActiveTahunAjaran, searchQuery, setSearchQuery, currentUser, logout, setPageMode } = useDatabase();

  return (
    <header id="main-header" className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      {/* Main Branding Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <motion.button
              id="btn-toggle-sidebar"
              whileTap={{ scale: 0.92 }}
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 -ml-1 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Toggle Menu Sidebar"
              aria-label="Toggle Menu Sidebar"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 leading-tight">
                SMK NEGERI 2 MAGELANG
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono uppercase bg-zinc-100 text-zinc-700 rounded border border-zinc-200">
                SIA v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Sistem Informasi Akademik & Portal Pengelolaan Rapor Siswa
            </p>
          </div>
        </div>

        {/* Global Search & Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Button Home */}
          <motion.button
            id="btn-nav-to-landing"
            whileTap={{ scale: 0.95 }}
            onClick={() => setPageMode('landing')}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-950 transition-colors font-medium cursor-pointer"
            title="Kembali ke Landing Page Utama"
          >
            <Home className="w-3.5 h-3.5 text-zinc-400" />
            <span>Home</span>
          </motion.button>

          <span className="text-zinc-300">|</span>

          {/* Tanggalan (Semester Dropdown) */}
          <label className="text-xs text-zinc-600 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={activeTahunAjaran.id_tahun_ajaran}
              onChange={(event) => setActiveTahunAjaran(Number(event.target.value))}
              className="bg-transparent text-zinc-700 font-medium border-0 focus:outline-hidden cursor-pointer"
              aria-label="Pilih semester aktif"
            >
              {tahunAjaranList.map((tahun) => (
                <option key={tahun.id_tahun_ajaran} value={tahun.id_tahun_ajaran}>
                  {tahun.semester} {tahun.tahun_ajaran}
                </option>
              ))}
            </select>
          </label>

          {/* Search Input */}
          <div className="relative w-full sm:w-60 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari siswa, guru, mapel..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white border border-zinc-200 rounded-md focus:outline-hidden focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-400 text-zinc-800"
            />
            {searchQuery && (
              <motion.button
                id="btn-clear-search"
                whileTap={{ scale: 0.85 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-mono"
              >
                ✕
              </motion.button>
            )}
          </div>

          {/* User Auth Info Chip */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
              <div className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-lg px-2.5 py-1 transition-colors">
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {currentUser.avatarInitial}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-zinc-900 max-w-[130px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase font-mono leading-none">
                    {currentUser.role}
                  </div>
                </div>
              </div>

              <motion.button
                id="btn-logout-header"
                whileTap={{ scale: 0.92 }}
                onClick={logout}
                title="Keluar / Ganti Akun"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              id="btn-login-header"
              whileTap={{ scale: 0.96 }}
              onClick={() => setPageMode('landing')}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login Akun</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
};
