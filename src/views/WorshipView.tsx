import React, { useEffect, useState } from 'react';
import { worshipRepository, DEFAULT_WORSHIP_TARGETS } from '../services/repositories/worshipRepository';
import { dateService, getLocalDateString } from '../services/dateService';
import type { WorshipLog, WorshipType } from '../types';
import { CheckSquare, Plus, Minus, Edit3, CheckCircle2, Award, Sparkles } from 'lucide-react';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

export const WorshipView: React.FC = () => {
  const { showToast } = useToast();
  const [todayStr, setTodayStr] = useState<string>(getLocalDateString());
  const [worshipLogs, setWorshipLogs] = useState<WorshipLog[]>([]);
  const [editingItem, setEditingItem] = useState<{ type: WorshipType; target: number } | null>(null);
  const [newTargetInput, setNewTargetInput] = useState<number>(5);

  const loadLogs = (date: string) => {
    setTodayStr(date);
    worshipRepository.getWorshipLogsForDate(date).then(setWorshipLogs);
  };

  useEffect(() => {
    const initialDate = getLocalDateString();
    loadLogs(initialDate);

    // Auto-reset tepat pada pukul 00:00 setiap malam
    const unsubscribeReset = dateService.subscribe((newDate) => {
      console.info(`[WorshipView] Reset harian pukul 00:00: ${newDate}`);
      loadLogs(newDate);
      showToast('Hari baru! Target ibadah sunnah telah di-reset 🌙', 'info');
    });

    return () => unsubscribeReset();
  }, []);

  const handleIncrement = async (type: WorshipType, delta: number) => {
    const updated = await worshipRepository.incrementWorship(todayStr, type, delta);
    setWorshipLogs(prev => prev.map(l => l.type === type ? updated : l));
    if (updated.completed && delta > 0) {
      showToast(`Alhamdulillah! Target ${type.toUpperCase()} tercapai 🎉`, 'success');
    }
  };

  const handleOpenEditTarget = (type: WorshipType, currentTarget: number) => {
    setEditingItem({ type, target: currentTarget });
    setNewTargetInput(currentTarget);
  };

  const handleSaveTarget = async () => {
    if (!editingItem) return;
    await worshipRepository.updateTarget(editingItem.type, newTargetInput);
    const updatedLogs = await worshipRepository.getWorshipLogsForDate(todayStr);
    setWorshipLogs(updatedLogs);
    setEditingItem(null);
    showToast(`Target ${editingItem.type} diperbarui menjadi ${newTargetInput}`, 'info');
  };

  const totalCompleted = worshipLogs.filter(w => w.completed).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="cosmic-card rounded-3xl p-6 border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Tracker Ibadah Harian</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Kelola & Pantau Amalan Sunnah
          </h2>
          <p className="text-xs text-purple-200/70 mt-1">
            "Amalan yang paling dicintai Allah adalah yang istiqamah meskipun sedikit." (HR. Bukhari & Muslim)
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-500/10 px-4 py-2.5 rounded-2xl border border-emerald-500/20 text-emerald-400">
          <Award className="w-6 h-6" />
          <div>
            <p className="text-[10px] uppercase font-bold text-purple-300/70">Pencapaian Hari Ini</p>
            <p className="text-base font-extrabold">{totalCompleted} dari {worshipLogs.length} Target Tuntas</p>
          </div>
        </div>
      </div>

      {/* Target Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {worshipLogs.map(item => {
          const config = DEFAULT_WORSHIP_TARGETS.find(t => t.type === item.type);
          const percent = Math.min(100, Math.round((item.count / item.target) * 100));

          return (
            <div
              key={item.type}
              className={`cosmic-card rounded-3xl p-5 border transition-all duration-300 ${
                item.completed
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-glow-emerald'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-2xl shadow-inner">
                    {config?.icon || '✨'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                      {config?.title || item.type}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Target: {item.target} {config?.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {item.completed && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Tuntas
                    </span>
                  )}
                  <button
                    onClick={() => handleOpenEditTarget(item.type, item.target)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Ubah Target"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 my-3">
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                  <span>Progres: {item.count} {config?.unit}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Increment & Decrement Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => handleIncrement(item.type, -1)}
                  disabled={item.count <= 0}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {item.count} <span className="text-xs font-normal text-slate-400">{config?.unit}</span>
                </div>

                <button
                  onClick={() => handleIncrement(item.type, 1)}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Edit Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        title={`Ubah Target ${editingItem?.type.toUpperCase()}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Target Jumlah Baru
            </label>
            <input
              type="number"
              min="1"
              max="1000"
              value={newTargetInput}
              onChange={(e) => setNewTargetInput(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Batal
            </button>
            <button
              onClick={handleSaveTarget}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
            >
              Simpan Target
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
