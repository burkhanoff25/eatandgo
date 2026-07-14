'use client';

import React from 'react';
import { Star, Clock, Heart, Award, ChevronRight } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative pt-36 pb-24 md:pt-48 md:pb-36 bg-gradient-to-b from-brand-dark via-[#1a0809] to-brand-dark overflow-hidden flex items-center min-h-[90vh]"
    >
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-[-10%] w-96 h-96 bg-primary-red/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-[-10%] w-[450px] h-[450px] bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left text-white space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
              <Award className="w-4 h-4 text-brand-yellow animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase text-brand-yellow/90">
                Сысерть #1 Фастфуд кафе
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-none tracking-tight">
              Лучшая <span className="text-brand-yellow text-glow">шаурма</span> <br />
              и сочный гриль
            </h1>

            {/* Description */}
            <p className="font-body text-white/70 text-sm sm:text-base lg:text-lg max-w-xl leading-relaxed">
              Свежие ингредиенты, маринованное фермерское мясо, живой гриль и авторские соусы. Сделаем сочно, сытно и горячо всего за 5 минут. Попробуйте легендарный вкус!
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#menu"
                className="bg-primary-red hover:bg-red-750 text-white font-bold text-center px-10 py-4.5 rounded-2xl transition-all shadow-xl shadow-red-500/25 hover:scale-[1.03] active:scale-95 text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <span>📋 Смотреть меню</span>
              </a>
              <a
                href="#map"
                className="bg-white/5 hover:bg-white/10 text-white font-bold text-center px-10 py-4.5 rounded-2xl transition-all border border-white/10 text-sm uppercase tracking-wider hover:scale-[1.03] active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>📍 Как добраться</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats Card Grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-lg">
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center shadow-inner">
                <span className="flex items-center justify-center text-brand-yellow font-black text-xl md:text-2xl font-display text-glow">
                  4.8 <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow ml-1" />
                </span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-1">Рейтинг</span>
              </div>
              
              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center shadow-inner">
                <span className="text-white font-black text-xl md:text-2xl font-display block">
                  500+
                </span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-1">Отзывов</span>
              </div>

              <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-center shadow-inner">
                <span className="text-white font-black text-xl md:text-2xl font-display flex items-center justify-center uppercase">
                  24/7
                </span>
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-wider block mt-1">Режим</span>
              </div>
            </div>
          </div>

          {/* Right Graphic Column */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-76 h-76 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-primary-red/15 to-brand-yellow/5 flex items-center justify-center p-6 border border-white/5 shadow-2xl">
              {/* Spinning Dotted Rings */}
              <div className="absolute inset-0 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite] pointer-events-none"></div>
              
              {/* Graphic Mock Card */}
              <div className="relative w-full h-full rounded-full bg-brand-dark/50 overflow-hidden flex flex-col justify-center items-center text-center p-6 border border-white/10 shadow-2xl float-animation">
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">E&G SPECIAL</h3>
                
                <img
                  src="/photo_2026.jpg"
                  alt="EAT & GO Logo"
                  className="w-24 h-24 object-contain mt-3 mb-2 rounded-2xl border border-white/10 shadow-md p-2 bg-white/5"
                />

                <p className="text-[10px] text-brand-yellow font-bold uppercase tracking-widest mt-1">Свежее Мясо & Специи</p>
                
                {/* Floating Tag */}
                <div className="absolute bottom-10 bg-primary-red text-white text-[10px] font-black font-display px-5 py-2.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-950/40">
                  Готово за 5 мин ⚡
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
