import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: 'bg-[#0F382C]',
      border: 'border-emerald-500',
      icon: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
    },
    error: {
      bg: 'bg-slate-900',
      border: 'border-rose-500',
      icon: <AlertCircle size={18} className="text-rose-400 shrink-0" />
    },
    info: {
      bg: 'bg-slate-900',
      border: 'border-amber-500',
      icon: <Info size={18} className="text-amber-400 shrink-0" />
    }
  };

  const current = styles[type] || styles.success;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-slide-up max-w-sm w-full px-4">
      <div className={`${current.bg} text-white border-l-4 ${current.border} rounded-xl shadow-2xl p-4 flex items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          {current.icon}
          <p className="text-sm font-semibold leading-snug">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
