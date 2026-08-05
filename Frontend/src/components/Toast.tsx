import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, Heart, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'cart' | 'wishlist' | 'success' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto glass-card bg-[#3A1A2E]/95 border border-[#C9A227]/30 shadow-2xl p-4 rounded-xl flex items-start gap-3 backdrop-blur-xl"
          >
            <div className="p-2 rounded-lg bg-[#C9A227]/15 text-[#C9A227] shrink-0 mt-0.5">
              {toast.type === 'cart' && <ShoppingBag className="w-5 h-5" />}
              {toast.type === 'wishlist' && <Heart className="w-5 h-5 fill-[#C9A227]" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {(!toast.type || toast.type === 'info') && <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className="flex-1 pr-2">
              <h4 className="text-sm font-medium text-[#E8D6D2] tracking-wide">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-[#E8D6D2]/80 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-[#E8D6D2]/70 hover:text-[#E8D6D2] p-1 transition-colors rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

