import React, { useEffect, useState } from 'react';
import { infakRepository } from '../services/repositories/infakRepository';
import type { InfakRecord, InfakCategory } from '../types';
import { HeartHandshake, Plus, Trash2, Sparkles, DollarSign } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const InfakView: React.FC = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState<InfakRecord[]>([]);
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<InfakCategory>('Masjid');
  const [note, setNote] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await infakRepository.getInfakRecords();
    setRecords(data);
  };

  const handleAddInfak = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) {
      showToast('Masukkan nominal infak yang valid', 'error');
      return;
    }

    const newRecord: InfakRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: num,
      category,
      note,
      createdAt: Date.now()
    };

    await infakRepository.addInfakRecord(newRecord);
    setRecords(prev => [newRecord, ...prev]);
    setAmount('');
    setNote('');
    setIsModalOpen(false);
    showToast('Catatan infak berhasil ditambahkan', 'success');
  };

  const handleDelete = async (id: string) => {
    await infakRepository.deleteInfakRecord(id);
    setRecords(prev => prev.filter(r => r.id !== id));
    showToast('Catatan infak telah dihapus', 'info');
  };

  const totalInfak = records.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="cosmic-card-glow rounded-3xl p-6 relative overflow-hidden flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-900/60 text-amber-300 text-xs font-semibold mb-2 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pencatat Infak Pribadi</span>
          </div>
          <h2 className="text-2xl font-black text-white font-serif">Catatan Infak</h2>
          <p className="text-xs text-purple-200/80 mt-1">
            Privasi 100% terjaga dan hanya tersimpan lokal di perangkat anda
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-900/40"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Infak</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="cosmic-card p-6 rounded-3xl border border-[#282552]/50 text-center">
          <p className="text-xs font-bold text-purple-300/70 uppercase tracking-widest">Total Infak</p>
          <h3 className="text-3xl font-black text-amber-300 font-mono mt-1">
            Rp {totalInfak.toLocaleString('id-ID')}
          </h3>
        </div>

        <div className="cosmic-card p-6 rounded-3xl border border-[#282552]/50 text-center">
          <p className="text-xs font-bold text-purple-300/70 uppercase tracking-widest">Bulan Ini</p>
          <h3 className="text-3xl font-black text-emerald-400 font-mono mt-1">
            Rp {totalInfak.toLocaleString('id-ID')}
          </h3>
        </div>
      </div>

      {/* Records History */}
      <div className="cosmic-card rounded-3xl p-6 border border-[#282552]/50">
        <h3 className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-4">Riwayat Infak</h3>

        <div className="space-y-3">
          {records.length === 0 ? (
            <p className="text-center text-xs text-purple-300/50 py-8">Belum ada catatan infak</p>
          ) : (
            records.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#12132b]/80 border border-[#282552]/40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-900/40 text-amber-300 flex items-center justify-center font-bold text-base">
                    🤲
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{r.category}</h4>
                    <p className="text-xs text-purple-300/60">{r.date} {r.note ? `• ${r.note}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold font-mono text-amber-300">
                    Rp {r.amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <form onSubmit={handleAddInfak} className="cosmic-card p-6 rounded-3xl max-w-md w-full space-y-4 border border-purple-500/40">
            <h3 className="text-lg font-bold text-white">Tambah Catatan Infak</h3>

            <div>
              <label className="text-xs font-semibold text-purple-300/80 block mb-1">Nominal (Rp)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Contoh: 50000"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#12132b] border border-[#282552] text-white outline-none text-sm"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-purple-300/80 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InfakCategory)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#12132b] border border-[#282552] text-white outline-none text-sm"
              >
                <option value="Masjid">Masjid</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Sosial">Sosial</option>
                <option value="Sedekah">Sedekah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-purple-300/80 block mb-1">Catatan (Opsional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Keterangan singkat..."
                className="w-full px-4 py-2.5 rounded-2xl bg-[#12132b] border border-[#282552] text-white outline-none text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 rounded-2xl bg-[#12132b] text-purple-200 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
