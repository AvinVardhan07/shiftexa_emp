import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-xl' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className={`w-full ${maxWidth} bg-white border border-[#E3E3E3] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] font-sans`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#E3E3E3] flex items-center justify-between bg-[#F0F4F9]/60">
            <h3 className="text-base font-bold text-[#1F1F1F]">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-[#5F6368] hover:text-[#1F1F1F] hover:bg-[#E3E3E3]/60 transition"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
