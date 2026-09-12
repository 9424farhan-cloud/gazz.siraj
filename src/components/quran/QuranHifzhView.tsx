import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  ChevronLeft,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Shuffle,
  Volume2,
  FileEdit,
  Sliders,
  Award
} from 'lucide-react';
import { quranService } from '../../services/quranService';
import { audioService } from '../../services/audioService';
import { quranCenterRepository } from '../../services/repositories/quranCenterRepository';
import type { JuzDefinition } from '../../data/juzData';
import type { Surah, Ayah, MemorizationStatus } from '../../types';

interface QuranHifzhViewProps {
  currentJuz: JuzDefinition;
  surahsInJuz: Surah[];
  preselectedSurah?: Surah | null;
  onBackToHub: () => void;
  onOpenJuzModal: () => void;
}

type HifzhMode =
  | 'lanjutkan_ayat'
  | 'tebak_ayat'
  | 'ayat_acak'
  | 'susun_ayat'
  | 'audio_lanjutkan';

interface QuizQuestion {
  id: number;
  promptText: string;
  promptSubtext?: string;
  audioUrl?: string;
  options: string[];
  correctIndex: number;
  fragments?: string[]; // for susun_ayat
  correctFragmentOrder?: string[];
  explanation?: string;
}

export const QuranHifzhView: React.FC<QuranHifzhViewProps> = ({
  currentJuz,
  surahsInJuz,
  preselectedSurah,
  onBackToHub,
  onOpenJuzModal
}) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(preselectedSurah || surahsInJuz[0] || quranService.getSurahByNumber(112)!);
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(Math.min(5, selectedSurah.totalAyahs));
  const [activeMode, setActiveMode] = useState<HifzhMode>('lanjutkan_ayat');

  const [isLoadingAyahs, setIsLoadingAyahs] = useState<boolean>(false);
  const [loadedAyahs, setLoadedAyahs] = useState<Ayah[]>([]);

  // Practice state
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userFragmentOrder, setUserFragmentOrder] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [finalStatus, setFinalStatus] = useState<MemorizationStatus>('sedang');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedSurah) {
      setSelectedSurah(preselectedSurah);
      setStartAyah(1);
      setEndAyah(Math.min(5, preselectedSurah.totalAyahs));
    }
  }, [preselectedSurah]);

  useEffect(() => {
    setEndAyah(Math.min(startAyah + 4, selectedSurah.totalAyahs));
  }, [selectedSurah, startAyah]);

  // Load ayahs when surah changes
  useEffect(() => {
    let isMounted = true;
    setIsLoadingAyahs(true);
    quranService.getAyahsBySurah(selectedSurah.number).then((ayahs) => {
      if (isMounted) {
        setLoadedAyahs(ayahs);
        setIsLoadingAyahs(false);
      }
    }).catch(() => {
      if (isMounted) setIsLoadingAyahs(false);
    });
    return () => { isMounted = false; };
  }, [selectedSurah]);

  const generateQuizQuestions = (): QuizQuestion[] => {
    const rangeAyahs = loadedAyahs.filter(a => a.number >= startAyah && a.number <= endAyah);
    if (rangeAyahs.length === 0) return [];

    const qs: QuizQuestion[] = [];

    rangeAyahs.forEach((ayah, idx) => {
      const qId = idx + 1;
      const audioUrl = ayah.audioUrl || quranService.getAyahAudioUrl(selectedSurah.number, ayah.number);

      if (activeMode === 'susun_ayat') {
        // Break Arabic text into words/fragments
        const words = ayah.text.split(' ').filter(Boolean);
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        qs.push({
          id: qId,
          promptText: `Susun kata-kata berikut agar menjadi bacaan ayat ke-${ayah.number} yang benar:`,
          promptSubtext: `QS. ${selectedSurah.latinName}: Ayat ${ayah.number}`,
          audioUrl,
          options: [],
          correctIndex: 0,
          fragments: shuffled,
          correctFragmentOrder: words,
          explanation: ayah.text
        });
      } else if (activeMode === 'tebak_ayat') {
        // Prompt: translation, choose correct Arabic
        const distractors = loadedAyahs
          .filter(a => a.number !== ayah.number)
          .slice(0, 3)
          .map(a => a.text);

        const options = [ayah.text, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(ayah.text);

        qs.push({
          id: qId,
          promptText: `Manakah lafaz Arab yang sesuai dengan terjemahan ini?`,
          promptSubtext: `"${ayah.translation}"`,
          audioUrl,
          options,
          correctIndex,
          explanation: `Ayat ${ayah.number}: ${ayah.text}`
        });
      } else {
        // lanjutkan_ayat, audio_lanjutkan, ayat_acak
        const words = ayah.text.split(' ');
        const mid = Math.max(1, Math.floor(words.length / 2));
        const prefix = words.slice(0, mid).join(' ');
        const correctContinuation = words.slice(mid).join(' ');

        const otherAyahs = loadedAyahs.filter(a => a.number !== ayah.number);
        const distractors = otherAyahs.slice(0, 3).map(a => {
          const w = a.text.split(' ');
          return w.slice(Math.floor(w.length / 2)).join(' ');
        });

        const options = [correctContinuation, ...distractors].sort(() => Math.random() - 0.5);
        const correctIndex = options.indexOf(correctContinuation);

        const isAudioPrompt = activeMode === 'audio_lanjutkan';

        qs.push({
          id: qId,
          promptText: isAudioPrompt
            ? `Dengarkan awal bacaan ayat ${ayah.number}, lalu pilih kelanjutannya:`
            : `Lanjutkan bacaan ayat berikut:`,
          promptSubtext: isAudioPrompt ? `QS. ${selectedSurah.latinName}: Ayat ${ayah.number}` : `"${prefix} ..."`,
          audioUrl,
          options,
          correctIndex,
          explanation: `Ayat ${ayah.number} lengkap: ${ayah.text}`
        });
      }
    });

    if (activeMode === 'ayat_acak') {
      return qs.sort(() => Math.random() - 0.5);
    }
    return qs;
  };

  const handleStartPractice = () => {
    const generated = generateQuizQuestions();
    if (generated.length === 0) {
      alert('Data ayat sedang dimuat atau rentang tidak valid.');
      return;
    }
    setQuestions(generated);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setUserFragmentOrder([]);
    setIsAnswerChecked(false);
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
    setSavedSuccess(false);
    setIsPracticing(true);
  };

  const handlePlayPromptAudio = (url?: string) => {
    if (!url) return;
    audioService.playQuranVerse(url, `Latihan Hifzh QS. ${selectedSurah.latinName}`, `Ayat ke-${currentQuestionIndex + 1}`);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
  };

  const handleToggleFragment = (word: string, isFromSelected: boolean) => {
    if (isAnswerChecked) return;
    if (isFromSelected) {
      setUserFragmentOrder(prev => prev.filter(w => w !== word));
    } else {
      setUserFragmentOrder(prev => [...prev, word]);
    }
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) return;

    const currentQ = questions[currentQuestionIndex];
    let isCorrect = false;

    if (activeMode === 'susun_ayat') {
      const userStr = userFragmentOrder.join(' ');
      const targetStr = (currentQ.correctFragmentOrder || []).join(' ');
      isCorrect = userStr === targetStr;
    } else {
      isCorrect = selectedOption === currentQ.correctIndex;
    }

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    setIsAnswerChecked(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setUserFragmentOrder([]);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
      const pct = Math.round((correctCount / questions.length) * 100);
      if (pct >= 85) setFinalStatus('kuat');
      else if (pct >= 60) setFinalStatus('sedang');
      else setFinalStatus('perlu_murajaah');
    }
  };

  const handleSaveEvaluation = async () => {
    const pct = Math.round((correctCount / questions.length) * 100);
    await quranCenterRepository.updateSurahStatus(
      selectedSurah.number,
      finalStatus,
      pct,
      startAyah,
      endAyah
    );
    setSavedSuccess(true);
  };

  const MODES_LIST: { id: HifzhMode; title: string; desc: string; icon: any }[] = [
    { id: 'lanjutkan_ayat', title: '1. Lanjutkan Ayat', desc: 'Pilih sambungan potongan ayat yang tepat', icon: ArrowRight },
    { id: 'tebak_ayat', title: '2. Tebak Ayat', desc: 'Tebak lafaz Arab berdasarkan arti ayat', icon: HelpCircle },
    { id: 'ayat_acak', title: '3. Ayat Acak', desc: 'Latihan dengan urutan acak untuk menguji daya ingat', icon: Shuffle },
    { id: 'susun_ayat', title: '4. Susun Ayat', desc: 'Susun kata-kata yang diacak menjadi urutan benar', icon: FileEdit },
    { id: 'audio_lanjutkan', title: '5. Dengarkan → Lanjutkan', desc: 'Dengarkan suara qari lalu pilih kelanjutannya', icon: Volume2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header Bar */}
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

      {!isPracticing ? (
        /* Configuration Screen */
        <div className="space-y-6">
          <div className="cosmic-card-glow p-6 sm:p-8 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#121438] to-[#0a0b1f] shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Brain className="w-3.5 h-3.5" />
              <span>Program Tahfizh Mandiri</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-serif">
              🧠 HIFZH (Latihan Hafalan)
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-2xl">
              Tentukan Juz, Surah, dan rentang ayat yang ingin Anda hafalkan. Pilih mode latihan interaktif untuk mengasah kelancaran hafalan secara mandiri.
            </p>

            {/* Selection Grid: Juz, Surah, Ayat Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#282552]/40">
              {/* Juz Indicator */}
              <div className="p-4 rounded-2xl bg-[#0e102b] border border-[#282552]/70">
                <span className="text-[11px] text-purple-300/70 font-semibold block mb-1">
                  1. Juz Dipilih
                </span>
                <span className="text-base font-bold text-white block">
                  {currentJuz.name}
                </span>
                <span className="text-[11px] text-amber-300/80">
                  {currentJuz.surahRangeText}
                </span>
              </div>

              {/* Surah Selector */}
              <div className="p-4 rounded-2xl bg-[#0e102b] border border-[#282552]/70">
                <span className="text-[11px] text-purple-300/70 font-semibold block mb-1">
                  2. Pilih Surah
                </span>
                <select
                  value={selectedSurah.number}
                  onChange={(e) => {
                    const found = surahsInJuz.find(s => s.number === parseInt(e.target.value, 10)) || selectedSurah;
                    setSelectedSurah(found);
                    setStartAyah(1);
                  }}
                  className="w-full bg-[#16183d] text-white text-xs rounded-xl p-2 border border-purple-500/30 outline-none focus:border-amber-400 font-bold"
                >
                  {surahsInJuz.map(s => (
                    <option key={s.number} value={s.number}>
                      {s.number}. {s.latinName} ({s.totalAyahs} Ayat)
                    </option>
                  ))}
                </select>
              </div>

              {/* Ayah Range */}
              <div className="p-4 rounded-2xl bg-[#0e102b] border border-[#282552]/70">
                <span className="text-[11px] text-purple-300/70 font-semibold block mb-1">
                  3. Rentang Ayat
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={selectedSurah.totalAyahs}
                    value={startAyah}
                    onChange={(e) => setStartAyah(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 bg-[#16183d] text-white text-xs rounded-xl p-2 border border-purple-500/30 outline-none text-center font-bold"
                  />
                  <span className="text-purple-300/60 text-xs">s/d</span>
                  <input
                    type="number"
                    min={startAyah}
                    max={selectedSurah.totalAyahs}
                    value={endAyah}
                    onChange={(e) => setEndAyah(Math.min(selectedSurah.totalAyahs, parseInt(e.target.value, 10) || startAyah))}
                    className="w-16 bg-[#16183d] text-white text-xs rounded-xl p-2 border border-purple-500/30 outline-none text-center font-bold"
                  />
                </div>
                <span className="text-[10px] text-purple-300/50 mt-1 block">
                  Total {Math.max(0, endAyah - startAyah + 1)} ayat dilatih
                </span>
              </div>
            </div>
          </div>

          {/* Mode Selector Cards */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Pilih Mode Latihan Hifzh</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MODES_LIST.map(m => {
                const isSelected = activeMode === m.id;
                const Icon = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMode(m.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-emerald-900/60 to-purple-950/80 border-emerald-400 shadow-md ring-1 ring-emerald-400/30'
                        : 'cosmic-card border-[#282552]/60 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        isSelected ? 'bg-emerald-400 text-purple-950' : 'bg-purple-900/40 text-emerald-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">
                          {m.title}
                        </h4>
                        <p className="text-[11px] text-purple-200/60 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Practice Action Button */}
          <div className="pt-2">
            <button
              onClick={handleStartPractice}
              disabled={isLoadingAyahs}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 transition active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Brain className="w-5 h-5" />
              <span>Mulai Latihan Hifzh: {selectedSurah.latinName} (Ayat {startAyah}–{endAyah})</span>
            </button>
          </div>
        </div>
      ) : isFinished ? (
        /* Results & Self-Confirmation Screen */
        <div className="cosmic-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-purple-950 flex items-center justify-center mx-auto shadow-xl font-bold text-2xl">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white font-serif">
              Hasil Latihan Selesai!
            </h3>
            <p className="text-xs text-purple-200/70">
              Latihan hafalan QS. {selectedSurah.latinName} (Ayat {startAyah}–{endAyah})
            </p>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-purple-300/70 block">Total Soal</span>
              <span className="text-xl font-bold text-white">{questions.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-emerald-400/80 block">Benar</span>
              <span className="text-xl font-bold text-emerald-400">{correctCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-rose-400/80 block">Salah</span>
              <span className="text-xl font-bold text-rose-400">{wrongCount}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#141638] border border-[#282552]">
              <span className="text-[10px] text-amber-300/80 block">Akurasi</span>
              <span className="text-xl font-bold text-amber-300">
                {Math.round((correctCount / questions.length) * 100)}%
              </span>
            </div>
          </div>

          {/* User Confirmation of Memorization Status */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#0e102b] border border-[#282552]/80 text-left space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">
                Konfirmasi Status Hafalan Anda:
              </span>
              <p className="text-[11px] text-purple-300/60 leading-relaxed">
                Status hafalan ditentukan dan dikonfirmasi langsung oleh Anda sendiri.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { status: 'kuat' as MemorizationStatus, label: '🟢 Kuat' },
                { status: 'sedang' as MemorizationStatus, label: '🟡 Sedang' },
                { status: 'perlu_murajaah' as MemorizationStatus, label: '🔴 Perlu Ulang' },
              ].map(s => (
                <button
                  key={s.status}
                  onClick={() => setFinalStatus(s.status)}
                  className={`p-2.5 rounded-xl text-xs font-bold border transition ${
                    finalStatus === s.status
                      ? 'bg-purple-700/50 text-white border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-[#141638] text-purple-200 border-[#282552] hover:bg-[#1a1c48]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Personal Notes */}
            <div className="space-y-1 pt-2">
              <span className="text-[11px] text-purple-300/70 font-semibold block">
                Catatan Pribadi (Opsional):
              </span>
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Contoh: Perlu hati-hati di ayat 3 saat wakaf..."
                className="w-full h-16 bg-[#16183d] text-white text-xs rounded-xl p-2.5 border border-purple-500/30 outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={handleSaveEvaluation}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                savedSuccess
                  ? 'bg-emerald-500 text-purple-950'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedSuccess ? 'Status Berhasil Disimpan ✓' : 'Simpan Status Hafalan'}</span>
            </button>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={handleStartPractice}
              className="px-5 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs font-bold border border-purple-500/30 flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Latihan Lagi</span>
            </button>
            <button
              onClick={() => setIsPracticing(false)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-200 text-xs font-bold"
            >
              Ganti Pengaturan
            </button>
          </div>
        </div>
      ) : (
        /* Active Practice Questions Screen */
        <div className="cosmic-card p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-6 animate-fade-in">
          {/* Progress Strip */}
          <div className="flex items-center justify-between text-xs text-purple-300/80 pb-3 border-b border-[#282552]/40">
            <span className="font-bold text-amber-300">
              Soal {currentQuestionIndex + 1} dari {questions.length}
            </span>
            <span className="text-xs font-mono">
              Benar: <strong className="text-emerald-400">{correctCount}</strong> • Salah: <strong className="text-rose-400">{wrongCount}</strong>
            </span>
          </div>

          {/* Question Prompt */}
          {questions[currentQuestionIndex] && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0e102b] border border-[#282552]/80 space-y-3">
                <span className="text-xs text-purple-300/70 font-semibold block">
                  {questions[currentQuestionIndex].promptText}
                </span>

                {questions[currentQuestionIndex].promptSubtext && (
                  <p className="text-lg sm:text-xl font-bold text-white font-arabic text-right leading-relaxed">
                    {questions[currentQuestionIndex].promptSubtext}
                  </p>
                )}

                {/* Audio Button if applicable */}
                {questions[currentQuestionIndex].audioUrl && (
                  <button
                    onClick={() => handlePlayPromptAudio(questions[currentQuestionIndex].audioUrl)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-amber-300 text-xs font-bold border border-purple-500/30 transition active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Dengarkan Bacaan Ayat</span>
                  </button>
                )}
              </div>

              {/* Mode: Susun Ayat */}
              {activeMode === 'susun_ayat' ? (
                <div className="space-y-4">
                  {/* Selected Words Area */}
                  <div className="p-4 rounded-2xl bg-[#141638] border border-purple-500/30 min-h-[70px] flex flex-wrap gap-2 items-center justify-center">
                    {userFragmentOrder.length === 0 ? (
                      <span className="text-xs text-purple-300/50">
                        Klik potongan kata di bawah untuk menyusun ayat di sini
                      </span>
                    ) : (
                      userFragmentOrder.map((w, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleToggleFragment(w, true)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-arabic text-base font-bold shadow-md hover:bg-purple-500 active:scale-95 transition"
                        >
                          {w}
                        </button>
                      ))
                    )}
                  </div>

                  {/* Available Fragments */}
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {(questions[currentQuestionIndex].fragments || []).map((w, idx) => {
                      const isUsed = userFragmentOrder.includes(w);
                      return (
                        <button
                          key={idx}
                          disabled={isUsed}
                          onClick={() => handleToggleFragment(w, false)}
                          className={`px-3.5 py-2 rounded-xl text-base font-arabic font-bold border transition ${
                            isUsed
                              ? 'opacity-30 bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                              : 'bg-[#15173d] hover:bg-[#202354] text-amber-300 border-[#282552] active:scale-95 shadow-sm'
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
                <div className="space-y-2.5">
                  {questions[currentQuestionIndex].options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === questions[currentQuestionIndex].correctIndex;

                    let style = 'bg-[#0f1028] hover:bg-[#16183d] border-[#282552]/70 text-purple-200';
                    if (isAnswerChecked) {
                      if (isCorrect) style = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-md';
                      else if (isSelected) style = 'bg-rose-950/80 border-rose-400 text-rose-200';
                    } else if (isSelected) {
                      style = 'bg-purple-900/60 border-amber-400 text-white ring-1 ring-amber-400/40 shadow-md';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerChecked}
                        className={`w-full p-4 rounded-2xl border text-right font-arabic text-base sm:text-lg transition-all flex items-center justify-between gap-3 ${style}`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-purple-950/70 text-purple-300 text-xs font-mono flex items-center justify-center shrink-0 border border-purple-500/20">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation & Feedback */}
              {isAnswerChecked && questions[currentQuestionIndex].explanation && (
                <div className="p-4 rounded-2xl bg-[#0a0c20] border border-purple-500/30 text-xs text-purple-200/90 leading-relaxed space-y-1 animate-fade-in text-left">
                  <span className="font-bold text-amber-300 block">Kunci Jawaban:</span>
                  <p className="font-arabic text-base text-right">{questions[currentQuestionIndex].explanation}</p>
                </div>
              )}

              {/* Bottom Action Button */}
              <div className="pt-4 flex justify-end">
                {!isAnswerChecked ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={activeMode === 'susun_ayat' ? userFragmentOrder.length === 0 : selectedOption === null}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition active:scale-95 disabled:opacity-40"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2"
                  >
                    <span>{currentQuestionIndex < questions.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}</span>
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
