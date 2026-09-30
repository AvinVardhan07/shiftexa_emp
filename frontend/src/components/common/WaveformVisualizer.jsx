import React from 'react';
import { motion } from 'framer-motion';

export default function WaveformVisualizer({ isSpeaking = true }) {
  const bars = [16, 32, 48, 24, 60, 36, 52, 28, 44, 20, 56, 30];

  return (
    <div className="flex items-center justify-center gap-1.5 h-16 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          animate={{
            height: isSpeaking ? [12, height, 12] : 8,
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut"
          }}
          className="w-1.5 rounded-full bg-blue-600"
        />
      ))}
    </div>
  );
}

