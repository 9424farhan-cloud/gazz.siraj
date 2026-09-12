import React, { useState, useEffect } from 'react';
import {
  Gamepad2,
  Sparkles,
  ChevronLeft,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Flame,
  Star,
  Shuffle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { quranService } from '../../services/quranService';
import { audioService } from '../../services/audioService';
import { quranCenterRepository } from '../../services/repositories/quranCenterRepository';
import type { JuzDefinition } from '../../data/juzData';
import type { Surah, Ayah, QuranGameRecord, QuranGameType } from '../../types';

interface QuranGamesViewProps {
  currentJuz: JuzDefinition;
  surahsInJuz: Surah[];
  onBackToHub: () => void;
  onOpenJuzModal: () => void;
}

interface GameQuestion {
  id: number;
  mode: QuranGameType;
  prompt: string;
  audioUrl: string;
  options: string[];
  correctIndex: number;
  fragments?: string[];
  correctOrder?: string[];
  explanation: string;
}

export const QuranGamesView: React.FC<QuranGamesViewProps> = ({
  currentJuz,
  surahsInJuz,
  onBackToHub,
  onOpenJuzModal
}) => {
  const [activeGameType, setActiveGameType] = useState<QuranGameType>('tebak_surah');
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [correctScore, setCorrectScore] = useState<number>(0);
  const [wrongScore, setWrongScore] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [totalXP, setTotalXP] = useState<number>(0);

  // Past Game Stats
  const [history, setHistory] = useState<QuranGameRecord[]>([]);

  useEffect(() => {
    quranCenterRepository.getAllGameRecords().then(setHistory);
    return () => {
      audioService.stop();
    };
  }, []);

  const generateGameQuestions = async (type: QuranGameType): Promise<GameQuestion[]> => {
    const list: GameQuestion[] = [];
    const poolSurahs = [...surahsInJuz].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(5, poolSurahs.length); i++) {
      const targetSurah = poolSurahs[i];
      const ayahs = await quranService.getAyahsBySurah(targetSurah.number);
      const targetAyah = ayahs[Math.floor(Math.random() * Math.min(ayahs.length, 5))];
      const audioUrl = targetAyah?.audioUrl || quranService.getAyahAudioUrl(targetSurah.number, targetAyah?.number || 1);

      if (type === 'tebak_surah') {
        // Options are Surah Latin Names
        const otherSurahs = surahsInJuz.filter(s => s.number !== targetSurah.number);
        const distractors = [...otherSurahs].sort(() => Math.random() - 0.5).slice(0, 3).map(s => s.latinName);
        const options = [targetSurah.latinName, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(targetSurah.latinName);

        list.push({
          id: i + 1,
          mode: type,
          prompt: "Dengarkan lantunan ayat berikut, lalu tebak nama Surahnya:",
          audioUrl,
          options,
          correctIndex,
          explanation: `Lantunan di atas adalah QS. ${targetSurah.latinName}: Ayat ${targetAyah.number} ("${targetAyah.text}")`
        });
      } else if (type === 'lanjutkan_ayat' || type === 'audio_murajaah') {
        const words = targetAyah.text.split(' ');
        const mid = Math.max(1, Math.floor(words.length / 2));
        const firstHalf = words.slice(0, mid).join(' ');
        const secondHalf = words.slice(mid).join(' ');

        const otherAyahs = ayahs.filter(a => a.number !== targetAyah.number);
        const distractors = otherAyahs.slice(0, 3).map(a => {
          const w = a.text.split(' ');
          return w.slice(Math.floor(w.length / 2)).join(' ');
        });

        const options = [secondHalf, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(secondHalf);

        list.push({
          id: i + 1,
          mode: type,
          prompt: `Dengarkan potongan bacaan QS. ${targetSurah.latinName}: Ayat ${targetAyah.number}, lalu pilih kelanjutannya:`,
          audioUrl,
          options,
          correctIndex,
          explanation: `Ayat lengkap: ${targetAyah.text}`
        });
      } else if (type === 'pilih_ayat') {
        const otherAyahs = ayahs.filter(a => a.number !== targetAyah.number);
        const distractors = otherAyahs.slice(0, 3).map(a => a.text);
        const options = [targetAyah.text, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(targetAyah.text);

        list.push({
          id: i + 1,
          mode: type,
          prompt: `Dengarkan bacaan qari, lalu pilih ayat Arab yang tepat:`,
          audioUrl,
          options,
          correctIndex,
          explanation: `QS. ${targetSurah.latinName} ayat ${targetAyah.number}: ${targetAyah.text}`
        });
      } else if (type === 'susun_urutan') {
        const words = targetAyah.text.split(' ').filter(Boolean);
        const shuffled = [...words].sort(() => Math.random() - 0.5);

        list.push({
          id: i + 1,
          mode: type,
          prompt: `Dengarkan ayat lalu susun potongan kata berikut secara berurutan:`,
          audioUrl,
          options: [],
          correctIndex: 0,
          fragments: shuffled,
          correctOrder: words,
          explanation: `Urutan yang tepat: ${targetAyah.text}`
        });
      }
    }

    return list;
  };

  const handleStartGame = async (type: QuranGameType) => {
    setActiveGameType(type);
    const qs = await generateGameQuestions(type);
    if (qs.length === 0) {
      alert('Sedang menyiapkan soal dari Juz...');
      return;
    }
    setQuestions(qs);
    setCurrentIdx(0);
    setSelectedOption(null);
    setUserOrder([]);
    setIsChecked(false);
    setCorrectScore(0);
    setWrongScore(0);
    setIsGameOver(false);
    setIsPlayingGame(true);

    // Auto-play first question audio
    if (qs[0]?.audioUrl) {
      setTimeout(() => {
        audioService.playQuranVerse(qs[0].audioUrl, `Tantangan Audio`, `Soal 1`);
      }, 400);
    }
  };

  const handlePlayCurrentAudio = () => {
    const q = questions[currentIdx];
    if (q?.audioUrl) {
      audioService.playQuranVerse(q.audioUrl, `Tantangan Audio`, `Soal ${currentIdx + 1}`);
    }
  };

  const handleCheckAnswer = () => {
    if (isChecked) return;
    const q = questions[currentIdx];
    let isCorrect = false;

    if (activeGameType === 'susun_urutan') {
      isCorrect = userOrder.join(' ') === (q.correctOrder || []).join(' ');
    } else {
      isCorrect = selectedOption === q.correctIndex;
    }

    if (isCorrect) setCorrectScore(prev => prev + 1);
    else setWrongScore(prev => prev + 1);

    setIsChecked(true);
  };

  const handleNextQuestion = async () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setSelectedOption(null);
      setUserOrder([]);
      setIsChecked(false);
      if (questions[nextIdx]?.audioUrl) {
        audioService.playQuranVerse(questions[nextIdx].audioUrl, `Tantangan Audio`, `Soal ${nextIdx + 1}`);
      }
    } else {
      // Game Over - stop audio immediately
      audioService.stop();
      setIsGameOver(true);
      const xp = (correctScore + (selectedOption === questions[currentIdx].correctIndex ? 1 : 0)) * 20;
      setTotalXP(xp);

      const rec: QuranGameRecord = {
        id: `game_${Date.now()}`,
        juzNumber: currentJuz.number,
        gameType: activeGameType,
        score: correctScore * 20,
        totalQuestions: questions.length,
        correctAnswers: correctScore,
        xpEarned: xp,
        timestamp: Date.now()
      };
      await quranCenterRepository.saveGameRecord(rec);
      const updated = await quranCenterRepository.getAllGameRecords();
      setHistory(updated);
    }
  };

  const GAME_MODES = [
    { id: 'tebak_surah' as QuranGameType, title: 'A. 🔊 Tebak Surah', desc: 'Dengarkan suara qari lalu tebak nama surahnya' },
    { id: 'lanjutkan_ayat' as QuranGameType, title: 'B. 🧠 Lanjutkan Ayat', desc: 'Dengarkan awal ayat lalu pilih kelanjutannya' },
    { id: 'pilih_ayat' as QuranGameType, title: 'C. 🎯 Pilih Ayat', desc: 'Dengarkan lantunan dan tentukan ayat Arab yang tepat' },
    { id: 'susun_urutan' as QuranGameType, title: 'D. 🔀 Susun Urutan', desc: 'Dengarkan audio lalu susun potongan kata yang diacak' },
    { id: 'audio_murajaah' as QuranGameType, title: 'E. 🔄 Audio Murajaah', desc: 'Kuis sambung ayat audio khusus surah Juz ini' },
  ];

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

      {!isPlayingGame ? (
        /* Game Hub & Mode Selector */
        <div className="space-y-6">
          <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#15123a] to-[#0a0c24] shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/70 text-rose-300 text-xs font-semibold border border-rose-500/30">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Audio Qur'an Challenge</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              🎮 AUDIO QUR'AN CHALLENGE ({currentJuz.name})
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-2xl">
              Uji ketajaman pendengaran dan ingatan hafalan Anda terhadap surah-surah dalam <strong>{currentJuz.name}</strong> dengan mendengarkan lantunan ayat langsung dari qari terverifikasi.
            </p>

            {/* Gamification Disclaimer Note */}
            <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Catatan Gamifikasi:</strong> Skor dan poin XP yang diperoleh semata-mata merupakan elemen interaktif untuk memotivasi semangat belajar pribadi, dan <em>bukan penentu atau pengganti pahala ibadah di sisi Allah</em>.
              </p>
            </div>
          </div>

          {/* 5 Mode Selector Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Pilih Mode Tantangan:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {GAME_MODES.map(m => (
                <div
                  key={m.id}
                  onClick={() => handleStartGame(m.id)}
                  className="cosmic-card p-5 rounded-2xl border border-[#282552]/60 hover:border-rose-500/50 hover:bg-[#18163f] transition-all cursor-pointer flex items-center justify-between group shadow-sm active:scale-98"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                      {m.title}
                    </h4>
                    <p className="text-xs text-purple-200/60 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Game Stats History */}
          {history.length > 0 && (
            <div className="cosmic-card p-5 rounded-3xl border border-[#282552]/50 space-y-3">
              <h4 className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Riwayat Latihan Terakhir</span>
              </h4>
              <div className="space-y-2">
                {history.slice(0, 4).map(h => (
                  <div key={h.id} className="p-3 rounded-xl bg-[#0e102b] border border-[#282552]/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">Juz {h.juzNumber} • {h.gameType.replace('_', ' ')}</span>
                      <span className="text-[10px] text-purple-300/50 block">{new Date(h.timestamp).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold">
                      <span className="text-emerald-400">{h.correctAnswers}/{h.totalQuestions} Benar</span>
                      <span className="text-amber-400">+{h.xpEarned} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : isGameOver ? (
        /* Game Over Screen */
        <div className="cosmic-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 text-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl font-bold">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white font-serif">
              Tantangan Selesai!
            </h3>
            <p className="text-xs text-purple-200/70">
              Hasil audio challenge untuk {currentJuz.name}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-4 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-purple-300/70 block">Benar</span>
              <span className="text-2xl font-bold text-emerald-400">{correctScore}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-purple-300/70 block">Salah</span>
              <span className="text-2xl font-bold text-rose-400">{wrongScore}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-purple-300/70 block">Skor XP</span>
              <span className="text-2xl font-bold text-amber-400">+{totalXP}</span>
            </div>
          </div>

          <p className="text-[11px] text-purple-300/50 max-w-md mx-auto italic">
            *Skor dan XP merupakan elemen penyemangat belajar mandiri.
          </p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => handleStartGame(activeGameType)}
              className="px-5 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white text-xs font-bold border border-purple-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Main Lagi</span>
            </button>
            <button
              onClick={() => setIsPlayingGame(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-purple-200 text-xs font-bold"
            >
              Kembali ke Menu Game
            </button>
          </div>
        </div>
      ) : (
        /* Active Game Play Question Screen */
        <div className="cosmic-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between text-xs text-purple-300 pb-3 border-b border-[#282552]/40">
            <span className="font-bold text-amber-300">
              Tantangan {currentIdx + 1} dari {questions.length}
            </span>
            <span className="font-mono">
              Skor: <strong className="text-emerald-400">{correctScore} Benar</strong>
            </span>
          </div>

          {/* Question Prompt */}
          {questions[currentIdx] && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0e102b] border border-[#282552]/80 space-y-3 text-center">
                <span className="text-xs text-purple-300/80 font-semibold block">
                  {questions[currentIdx].prompt}
                </span>

                {/* Big Glowing Audio Button */}
                <button
                  onClick={handlePlayCurrentAudio}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition"
                  title="Dengarkan / Ulangi Audio"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                <span className="text-[11px] text-amber-300 block font-semibold">
                  Klik untuk mendengarkan audio lantunan
                </span>
              </div>

              {/* Mode: Susun Urutan */}
              {activeGameType === 'susun_urutan' ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#141638] border border-purple-500/30 min-h-[60px] flex flex-wrap gap-2 items-center justify-center">
                    {userOrder.map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserOrder(prev => prev.filter(item => item !== w))}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-arabic text-base font-bold"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(questions[currentIdx].fragments || []).map((w, idx) => {
                      const isUsed = userOrder.includes(w);
                      return (
                        <button
                          key={idx}
                          disabled={isUsed}
                          onClick={() => setUserOrder(prev => [...prev, w])}
                          className={`px-3.5 py-2 rounded-xl text-base font-arabic font-bold border ${
                            isUsed ? 'opacity-30 bg-slate-800' : 'bg-[#15173d] text-amber-300 border-[#282552]'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Multiple Choice Options */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {questions[currentIdx].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === questions[currentIdx].correctIndex;

                    let style = 'bg-[#0f1028] hover:bg-[#16183d] border-[#282552]/70 text-purple-200';
                    if (isChecked) {
                      if (isCorrect) style = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md';
                      else if (isSelected) style = 'bg-rose-950/80 border-rose-400 text-rose-200';
                    } else if (isSelected) {
                      style = 'bg-purple-900/60 border-amber-400 text-white ring-1 ring-amber-400/40';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => { if (!isChecked) setSelectedOption(idx); }}
                        disabled={isChecked}
                        className={`p-4 rounded-2xl border text-sm font-bold transition-all flex items-center justify-between gap-3 ${style}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-purple-950/70 text-purple-300 text-xs font-mono flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className={activeGameType === 'pilih_ayat' || activeGameType === 'lanjutkan_ayat' ? 'font-arabic text-base' : ''}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation */}
              {isChecked && (
                <div className="p-3.5 rounded-2xl bg-[#0b0d22] border border-purple-500/30 text-xs text-purple-200 leading-relaxed text-left animate-fade-in">
                  <span className="font-bold text-amber-300 block mb-1">Penjelasan:</span>
                  <p>{questions[currentIdx].explanation}</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                {!isChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={activeGameType === 'susun_urutan' ? userOrder.length === 0 : selectedOption === null}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 text-white font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-40"
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
