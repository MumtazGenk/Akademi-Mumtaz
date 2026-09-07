import React from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Search, Calendar, Sparkles, LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTahunAjaran, searchQuery, setSearchQuery, currentUser, logout, setPageMode } = useDatabase();

  return (
    <header id="main-header" className="border-b border-zinc-200 bg-white sticky top-0 z-30">
      {/* Top utility strip */}
      <div className="border-b border-zinc-100 px-4 lg:px-8 py-1.5 text-xs text-zinc-500 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-zinc-600 font-medium">Kota Magelang, Jawa Tengah</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-nav-to-landing"
            onClick={() => setPageMode('landing')}
            className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-950 transition-colors font-medium cursor-pointer"
            title="Kembali ke Landing Page Utama"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Landing Page</span>
          </button>

          <span className="text-zinc-300">|</span>

          <span className="text-zinc-600 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            Semester {activeTahunAjaran.semester} {activeTahunAjaran.tahun_ajaran}
          </span>
          <span className="px-1.5 py-0.5 text-[11px] font-mono font-medium rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
            {activeTahunAjaran.status}
          </span>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {/* Global Search & User Account Pill */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full md:w-64">
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
              <button
                id="btn-clear-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 font-mono"
              >
                ✕
              </button>
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

              <button
                id="btn-logout-header"
                onClick={logout}
                title="Keluar / Ganti Akun"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-login-header"
              onClick={() => setPageMode('landing')}
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-zinc-900 text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login Akun</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
