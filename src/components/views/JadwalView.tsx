import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Hari } from '../../types';
import {
  CalendarDays,
  Clock,
  MapPin,
  Filter,
  Grid,
  List,
  Printer,
  User,
  BookOpen,
} from 'lucide-react';

export const JadwalView: React.FC = () => {
  const { enrichedJadwal, kelasList, guruList, searchQuery } = useDatabase();

  const [selectedHari, setSelectedHari] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [selectedGuru, setSelectedGuru] = useState<string>('Semua');
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix');

  const days: Hari[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const filteredJadwal = useMemo(() => {
    return enrichedJadwal.filter((item) => {
      // Day filter
      if (selectedHari !== 'Semua' && item.hari !== selectedHari) return false;
      // Class filter
      if (selectedKelas !== 'Semua' && String(item.id_kelas) !== selectedKelas) return false;
      // Teacher filter
      if (selectedGuru !== 'Semua' && String(item.id_guru) !== selectedGuru) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchMapel = item.mapel?.nama_mapel.toLowerCase().includes(q) || item.mapel?.kode_mapel.toLowerCase().includes(q);
        const matchGuru = item.guru?.nama_guru.toLowerCase().includes(q);
        const matchKelas = item.kelas?.nama_kelas.toLowerCase().includes(q);
        const matchRuang = item.ruang.toLowerCase().includes(q);
        const matchHari = item.hari.toLowerCase().includes(q);
        if (!matchMapel && !matchGuru && !matchKelas && !matchRuang && !matchHari) return false;
      }
      return true;
    });
  }, [enrichedJadwal, selectedHari, selectedKelas, selectedGuru, searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Control & Filter Header */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-zinc-700" />
              Jadwal Pelajaran & Penggunaan Ruang
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Distribusi 15 sesi tatap muka laboratorium komputer, praktikum akuntansi, dan ruang teori
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-zinc-100 p-1 rounded-md border border-zinc-200">
              <button
                onClick={() => setViewMode('matrix')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  viewMode === 'matrix' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Tampilan Matriks Mingguan"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Matriks</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="Tampilan Daftar / Runtun"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Daftar</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-zinc-200 hover:bg-zinc-50 rounded-md text-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-500" />
              <span>Cetak Jadwal</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-zinc-500 font-medium mb-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-zinc-400" />
              Filter Hari
            </label>
            <select
              value={selectedHari}
              onChange={(e) => setSelectedHari(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Hari (Senin - Jumat)</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Rombongan Belajar (Kelas)</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-zinc-500 font-medium mb-1">Guru Pengampu</label>
            <select
              value={selectedGuru}
              onChange={(e) => setSelectedGuru(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-md px-2.5 py-1.5 text-zinc-800 focus:outline-hidden focus:border-zinc-900 focus:bg-white"
            >
              <option value="Semua">Semua Tenaga Pendidik</option>
              {guruList.map((g) => (
                <option key={g.id_guru} value={g.id_guru}>
                  {g.nama_guru}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => {
            const dayItems = filteredJadwal
              .filter((j) => j.hari === day)
              .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

            return (
              <div key={day} className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-zinc-900 text-white px-3.5 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-sm tracking-wide">{day}</span>
                  <span className="font-mono text-xs text-zinc-300 bg-zinc-800 px-1.5 py-0.2 rounded">
                    {dayItems.length} Sesi
                  </span>
                </div>

                <div className="p-3 space-y-3 flex-1 bg-zinc-50/40">
                  {dayItems.length === 0 ? (
                    <div className="py-12 text-center text-xs text-zinc-400">
                      Tidak ada jadwal
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id_jadwal}
                        className="bg-white border border-zinc-200 rounded-md p-3 shadow-2xs hover:border-zinc-400 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-1.5">
                          <span className="font-semibold text-zinc-900 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                          </span>
                          <span className="bg-zinc-100 text-zinc-800 px-1.5 py-0.2 rounded font-bold border border-zinc-200">
                            {item.kelas?.nama_kelas}
                          </span>
                        </div>

                        <div className="font-semibold text-xs text-zinc-900 leading-snug">
                          {item.mapel?.nama_mapel}
                        </div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                          {item.mapel?.kode_mapel} · {item.mapel?.kelompok}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-col gap-1 text-[11px] text-zinc-600">
                          <div className="flex items-center gap-1.5 truncate" title={item.guru?.nama_guru}>
                            <User className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="truncate">{item.guru?.nama_guru}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-zinc-700">
                            <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                            <span className="font-medium">{item.ruang}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-zinc-900 text-white font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Hari & Jam</th>
                  <th className="py-3 px-4">Kelas</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Tenaga Pengajar</th>
                  <th className="py-3 px-4">Ruang</th>
                  <th className="py-3 px-4 text-center">Kelompok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filteredJadwal.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-400">
                      Tidak ada jadwal yang cocok dengan filter kriteria.
                    </td>
                  </tr>
                ) : (
                  filteredJadwal.map((item) => (
                    <tr key={item.id_jadwal} className="hover:bg-zinc-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-zinc-900">
                        <div className="font-bold text-zinc-950">{item.hari}</div>
                        <div className="text-zinc-500 text-[11px]">
                          {item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-zinc-100 text-zinc-900 font-mono font-bold text-xs border border-zinc-200">
                          {item.kelas?.nama_kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-zinc-900 text-xs">{item.mapel?.nama_mapel}</div>
                        <div className="text-[11px] font-mono text-zinc-400">{item.mapel?.kode_mapel}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-800">
                        <div className="font-medium">{item.guru?.nama_guru}</div>
                        <div className="text-[11px] font-mono text-zinc-400">NIP: {item.guru?.nip}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-800">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" />
                          {item.ruang}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {item.mapel?.kelompok}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
