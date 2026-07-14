'use client';

import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Animate progress bar over 1.8 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setVisible(false);
        // Delay callback for fadeOut animation
        setTimeout(onFinished, 500);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [progress, onFinished]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark transition-opacity duration-500 ease-in-out ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6 text-center">
        {/* Spinning Circular Logo */}
        <div className="relative mb-8 w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-brand-green overflow-hidden">
          <img
            src="/photo_2026.jpg"
            alt="EAT & GO Logo"
            className="w-full h-full object-contain rounded-full p-2 animate-[spin_12s_linear_infinite]"
          />
        </div>

        {/* Brand Name */}
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-wider mb-2">
          EAT & GO
        </h1>
        <p className="font-body text-brand-green font-semibold tracking-widest text-sm mb-8 uppercase">
          Сысерть
        </p>

        {/* Green Progress Bar */}
        <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-3">
          <div
            className="bg-brand-green h-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <span className="text-white/80 font-body text-xs font-medium uppercase tracking-wider">
          Загрузка... {progress}%
        </span>
      </div>
    </div>
  );
}
