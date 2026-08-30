import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Data',
  description = 'Data yang anda cari belum tersedia saat ini.',
  icon,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/50 my-4">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
