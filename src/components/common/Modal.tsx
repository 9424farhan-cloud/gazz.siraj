import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidthClasses} rounded-3xl shadow-2xl border border-purple-500/30 p-6 z-10 overflow-hidden`}
        style={{ background: 'linear-gradient(135deg, #0d0e24, #12132b)', boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.2)' }}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#282552]/50">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          <button
            onClick={onClose}
            className="p-2 text-purple-300/60 hover:text-white rounded-full hover:bg-purple-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
