import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  AlertCircle,
  Plus,
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';
import { quranCenterRepository } from '../../services/repositories/quranCenterRepository';
import { quranService } from '../../services/quranService';
import { audioService } from '../../services/audioService';
import { getLocalDateString } from '../../services/dateService';
import type { JuzDefinition } from '../../data/juzData';
import type {
  Surah,
  Ayah,
  MurajaahScheduleItem,
  SurahMemorizationRecord
} from '../../types';

interface QuranMurajaahViewProps {
  currentJuz: JuzDefinition;
  surahsInJuz: Surah[];
  onBackToHub: () => void;
  onOpenJuzModal: () => void;
}

export const QuranMurajaahView: React.FC<QuranMurajaahViewProps> = ({
  currentJuz,
  surahsInJuz,
  onBackToHub,
  onOpenJuzModal
}) => {
  const [schedules, setSchedules] = useState<MurajaahScheduleItem[]>([]);
  const [memorizationMap, setMemorizationMap] = useState<Record<number, SurahMemorizationRecord>>({});
  const [todayStr] = useState<string>(getLocalDateString());

  // Active Murajaah Session State
  const [activeSessionItem, setActiveSessionItem] = useState<MurajaahScheduleItem | null>(null);
  const [sessionAyahs, setSessionAyahs] = useState<Ayah[]>([]);
  const [revealedAyahs, setRevealedAyahs] = useState<Record<number, boolean>>({});
  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);

  // New Schedule Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addSurahNumber, setAddSurahNumber] = useState<number>(surahsInJuz[0]?.number || 78);
  const [addStartAyah, setAddStartAyah] = useState<number>(1);
  const [addEndAyah, setAddEndAyah] = useState<number>(10);
  const [addIntervalDays, setAddIntervalDays] = useState<number>(1);

  const loadData = async () => {
    const all = await quranCenterRepository.getAllMurajaahSchedules();
    setSchedules(all);

    const mems = await quranCenterRepository.getAllMemorizationRecords();
    const map: Record<number, SurahMemorizationRecord> = {};
    mems.forEach(m => { map[m.surahNumber] = m; });
    setMemorizationMap(map);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter schedules
  const todayItems = schedules.filter(s => !s.isCompleted && s.scheduledDate <= todayStr);
  const upcomingItems = schedules.filter(s => !s.isCompleted && s.scheduledDate > todayStr);
  const completedItems = schedules.filter(s => s.isCompleted).slice(0, 5);

  // Surahs flagged as needing murajaah
  const needReviewSurahs = surahsInJuz.filter(s => {
    const mem = memorizationMap[s.number];
    return mem && mem.status === 'perlu_murajaah';
  });

  const handleStartSession = async (item: MurajaahScheduleItem) => {
    setActiveSessionItem(item);
    setIsLoadingAyahs(true);
    setRevealedAyahs({});
    try {
      const ayahs = await quranService.getAyahRange(item.surahNumber, item.startAyah, item.endAyah);
      setSessionAyahs(ayahs);
    } catch {
      alert('Gagal memuat ayat murajaah');
    } finally {
      setIsLoadingAyahs(false);
    }
  };

  const handleCompleteSession = async (nextInterval: number = 3) => {
    if (!activeSessionItem) return;
    await quranCenterRepository.completeMurajaah(activeSessionItem.id, nextInterval);
    // Update surah status to sedang/kuat
    await quranCenterRepository.updateSurahStatus(
      activeSessionItem.surahNumber,
      nextInterval >= 7 ? 'kuat' : 'sedang',
      90,
      activeSessionItem.startAyah,
      activeSessionItem.endAyah
    );
    await loadData();
    setActiveSessionItem(null);
  };

  const handleCreateSchedule = async () => {
    const s = quranService.getSurahByNumber(addSurahNumber);
    if (!s) return;

    const d = new Date();
    d.setDate(d.getDate() + addIntervalDays);
    const dateStr = getLocalDateString(d);

    const newItem: MurajaahScheduleItem = {
      id: `mur_${addSurahNumber}_${Date.now()}`,
      surahNumber: addSurahNumber,
      surahName: s.latinName,
      startAyah: addStartAyah,
      endAyah: addEndAyah,
      scheduledDate: dateStr,
      intervalDays: addIntervalDays,
      isCompleted: false
    };

    await quranCenterRepository.saveMurajaahSchedule(newItem);
    await loadData();
    setShowAddModal(false);
  };

  const handlePlayAyahAudio = (ayah: Ayah) => {
    const url = ayah.audioUrl || quranService.getAyahAudioUrl(ayah.surahNumber, ayah.number);
    audioService.playQuranVerse(url, `Murajaah: QS. ${activeSessionItem?.surahName}`, `Ayat ${ayah.number}`);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#282552]/40">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141638] hover:bg-[#1e204a] text-purple-200 text-xs font-semibold border border-purple-500/30 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Qur'an Center</span>
        </button>

        <button
          onClick={onOpenJuzModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 transition"
        >
          <span>Ganti Juz ({currentJuz.name})</span>
        </button>
      </div>

      {!activeSessionItem ? (
        /* Main Murajaah Dashboard */
        <div className="space-y-6">
          {/* Banner */}
          <div className="cosmic-card-glow p-6 sm:p-7 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#121438] to-[#0a0b1f] shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 text-amber-300 text-xs font-semibold mb-2 border border-amber-500/30">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Spaced Repetition Hafalan</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
                🔄 MURAJAAH BERKALA
              </h2>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl">
                Jaga hafalan dengan pengulangan teratur (+1, +3, +7, +14 hari) agar hafalan tetap kuat dan mutqin di dalam ingatan.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-purple-950 font-black text-xs shadow-lg shadow-amber-400/20 transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          </div>

          {/* Alert for Surahs Needing Review */}
          {needReviewSurahs.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-rose-200">
                    Perlu Murajaah Segera ({needReviewSurahs.length} Surah)
                  </h4>
                  <p className="text-[11px] text-rose-300/70">
                    {needReviewSurahs.map(s => s.latinName).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const s = needReviewSurahs[0];
                  handleStartSession({
                    id: `temp_${s.number}`,
                    surahNumber: s.number,
                    surahName: s.latinName,
                    startAyah: 1,
                    endAyah: s.totalAyahs,
                    scheduledDate: todayStr,
                    intervalDays: 1,
                    isCompleted: false
                  });
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs shrink-0 shadow-sm"
              >
                Mulai Ulang
              </button>
            </div>
          )}

          {/* Section: Murajaah Hari Ini */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>📌 Murajaah Hari Ini ({todayItems.length})</span>
            </h3>

            {todayItems.length === 0 ? (
              <div className="cosmic-card p-8 rounded-3xl text-center border border-[#282552]/40">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <h4 className="text-sm font-bold text-white">Alhamdulillah, Murajaah Hari Ini Tuntas!</h4>
                <p className="text-xs text-purple-300/60 mt-1">
                  Tidak ada jadwal murajaah yang tertunda untuk hari ini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todayItems.map(item => (
                  <div
                    key={item.id}
                    className="cosmic-card p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-purple-950/60 to-indigo-950/40 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                        Jadwal Hari Ini
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        QS. {item.surahName}
                      </h4>
                      <p className="text-xs text-purple-200/70">
                        Ayat {item.startAyah}–{item.endAyah}
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartSession(item)}
                      className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Mulai</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Murajaah Berikutnya */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>📅 Murajaah Mendatang ({upcomingItems.length})</span>
            </h3>

            {upcomingItems.length === 0 ? (
              <p className="text-xs text-purple-300/50 italic px-1">
                Belum ada jadwal murajaah mendatang yang disimpan.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingItems.map(item => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl cosmic-card border border-[#282552]/50 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-900/40 text-purple-300 flex items-center justify-center font-bold">
                        +{item.intervalDays}h
                      </div>
                      <div>
                        <h5 className="font-bold text-white">QS. {item.surahName} ({item.startAyah}–{item.endAyah})</h5>
                        <span className="text-[11px] text-purple-300/60">Tanggal: {item.scheduledDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartSession(item)}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 font-semibold"
                    >
                      Ulang Lebih Cepat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Active Murajaah Session Screen */
        <div className="cosmic-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-6 animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#282552]/40">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase block">
                Sesi Murajaah Berlangsung
              </span>
              <h3 className="text-xl font-bold text-white font-serif">
                QS. {activeSessionItem.surahName}: Ayat {activeSessionItem.startAyah}–{activeSessionItem.endAyah}
              </h3>
            </div>

            <button
              onClick={() => setActiveSessionItem(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-purple-300 hover:text-white text-xs font-semibold"
            >
              Batal
            </button>
          </div>

          <p className="text-xs text-purple-200/80 leading-relaxed">
            Bacalah ayat dari hafalan Anda terlebih dahulu. Klik tombol <strong>"Buka Teks"</strong> untuk mencocokkan hafalan Anda dengan teks Al-Qur'an dan dengarkan audio jika ragu.
          </p>

          {/* Ayah Cards in Murajaah */}
          {isLoadingAyahs ? (
            <div className="p-10 text-center text-xs text-purple-300 animate-pulse">
              Memuat ayat Al-Qur'an...
            </div>
          ) : (
            <div className="space-y-4">
              {sessionAyahs.map((ayah) => {
                const isRevealed = !!revealedAyahs[ayah.number];
                return (
                  <div
                    key={ayah.number}
                    className="p-4 rounded-2xl bg-[#0e102b] border border-[#282552]/70 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 text-amber-300 text-xs font-bold border border-purple-500/30">
                        Ayat {ayah.number}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayAyahAudio(ayah)}
                          className="p-2 rounded-xl bg-purple-900/40 text-purple-200 hover:bg-purple-800/60 border border-purple-500/30"
                          title="Dengarkan Audio Ayat"
                        >
                          <Volume2 className="w-4 h-4 text-pink-400" />
                        </button>
                        <button
                          onClick={() => setRevealedAyahs(prev => ({ ...prev, [ayah.number]: !isRevealed }))}
                          className="px-3 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-white text-xs font-semibold border border-purple-500/30"
                        >
                          {isRevealed ? 'Tutup Teks' : 'Buka Teks'}
                        </button>
                      </div>
                    </div>

                    {/* Arabic Text (Revealed or Hidden Placeholder) */}
                    {isRevealed ? (
                      <div className="space-y-2 animate-fade-in">
                        <p className="font-arabic text-xl sm:text-2xl text-right text-white leading-loose">
                          {ayah.text}
                        </p>
                        <p className="text-xs text-purple-200/70 leading-relaxed border-t border-[#282552]/40 pt-2">
                          {ayah.translation}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#141638]/50 border border-dashed border-purple-500/30 text-center text-xs text-purple-300/50">
                        [ Teks tersembunyi — Ucapkan hafalan Anda lalu klik "Buka Teks" ]
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Completion Bar */}
          <div className="p-5 rounded-2xl bg-[#090b1e] border border-amber-500/40 space-y-3 text-center">
            <h4 className="text-sm font-bold text-white">
              Selesai Murajaah? Tentukan Jadwal Ulangan Berikutnya:
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { days: 1, label: '+1 Hari (Besok)' },
                { days: 3, label: '+3 Hari' },
                { days: 7, label: '+7 Hari (1 Minggu)' },
                { days: 14, label: '+14 Hari (2 Minggu)' }
              ].map(opt => (
                <button
                  key={opt.days}
                  onClick={() => handleCompleteSession(opt.days)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-95"
                >
                  ✓ Selesai & {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add New Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="cosmic-card p-6 rounded-3xl border border-purple-500/40 w-full max-w-md space-y-4 shadow-2xl bg-[#0c0d24]">
            <h3 className="text-lg font-bold text-white font-serif">
              Tambah Jadwal Murajaah
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-purple-300/70 font-semibold block mb-1">Pilih Surah:</label>
                <select
                  value={addSurahNumber}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10);
                    setAddSurahNumber(num);
                    const s = quranService.getSurahByNumber(num);
                    if (s) {
                      setAddStartAyah(1);
                      setAddEndAyah(Math.min(10, s.totalAyahs));
                    }
                  }}
                  className="w-full bg-[#16183d] text-white p-2.5 rounded-xl border border-purple-500/30 font-bold"
                >
                  {surahsInJuz.map(s => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.latinName} ({s.totalAyahs} Ayat)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-purple-300/70 font-semibold block mb-1">Dari Ayat:</label>
                  <input
                    type="number"
                    min={1}
                    value={addStartAyah}
                    onChange={(e) => setAddStartAyah(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#16183d] text-white p-2 rounded-xl border border-purple-500/30 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-purple-300/70 font-semibold block mb-1">Sampai Ayat:</label>
                  <input
                    type="number"
                    min={addStartAyah}
                    value={addEndAyah}
                    onChange={(e) => setAddEndAyah(parseInt(e.target.value, 10) || addStartAyah)}
                    className="w-full bg-[#16183d] text-white p-2 rounded-xl border border-purple-500/30 text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-purple-300/70 font-semibold block mb-1">Jadwal Pengulangan Pertama:</label>
                <select
                  value={addIntervalDays}
                  onChange={(e) => setAddIntervalDays(parseInt(e.target.value, 10))}
                  className="w-full bg-[#16183d] text-white p-2.5 rounded-xl border border-purple-500/30 font-bold"
                >
                  <option value={0}>Hari Ini</option>
                  <option value={1}>+1 Hari (Besok)</option>
                  <option value={3}>+3 Hari</option>
                  <option value={7}>+7 Hari (1 Minggu)</option>
                  <option value={14}>+14 Hari (2 Minggu)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-purple-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 text-xs font-bold"
              >
                Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
