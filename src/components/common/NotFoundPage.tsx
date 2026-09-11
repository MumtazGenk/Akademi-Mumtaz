import React from 'react';
import { motion } from 'motion/react';
import { useDatabase } from '../../context/DatabaseContext';
import { ArrowLeft, LayoutDashboard, SearchX } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { setPageMode } = useDatabase();

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-900 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-zinc-900 selection:text-white flex flex-col justify-between items-center p-6">
      {/* Liquid Glass Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            x: [0, 30, -25, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-zinc-200/60 blur-[110px]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000007_1px,transparent_1px),linear-gradient(to_bottom,#00000007_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-4">
        <div className="text-xs font-bold text-zinc-950 tracking-tight">
          SMKN 2 MAGELANG
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          STATUS 404 NOT FOUND
        </div>
      </header>

      <main className="relative z-10 max-w-md w-full text-center my-auto">
        <div className="relative rounded-3xl p-1 bg-gradient-to-b from-white via-zinc-200/70 to-zinc-300/50 shadow-xl shadow-zinc-900/5">
          <div className="backdrop-blur-2xl bg-white/90 rounded-[22px] p-8 border border-white/80">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-5 text-zinc-800">
              <SearchX className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-mono font-semibold border border-zinc-200 mb-3">
              ERROR CODE 404
            </div>

            <h1 className="text-2xl font-bold text-zinc-950 tracking-tight mb-2">
              Halaman Tidak Ditemukan
            </h1>

            <p className="text-xs text-zinc-600 leading-relaxed mb-6">
              Rute atau berkas modul akademik yang kamu akses tidak tersedia, telah dipindahkan, atau hak akses kamu belum mencukupi.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                id="btn-404-home"
                onClick={() => setPageMode('landing')}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Beranda</span>
              </button>

              <button
                type="button"
                id="btn-404-portal"
                onClick={() => setPageMode('portal')}
                className="flex-1 py-2.5 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Portal Akademik</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-xs text-zinc-400 font-mono py-4">
        Sistem Informasi Akademik &middot; SMKN 2 Magelang
      </footer>
    </div>
  );
};
