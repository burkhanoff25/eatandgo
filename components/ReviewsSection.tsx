'use client';

import React from 'react';
import { Star, MessageSquare, ExternalLink, ThumbsUp } from 'lucide-react';
import { Review } from '../types';

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Александр М.',
    date: '12 июля 2026',
    rating: 5,
    comment: 'Самая вкусная шаурма классик в Сысерти! Мясо сочное, соус не течет, лаваш хрустит. Заказывал через сайт к определенному времени — пришел и сразу забрал горячую. Рекомендую!',
    source: 'Яндекс.Карты',
    avatar: '👨‍💻'
  },
  {
    id: 'r2',
    name: 'Елена К.',
    date: '08 июля 2026',
    rating: 5,
    comment: 'Очень сытный люля-кебаб! И сырная шаурма сыну безумно нравится. Приятный персонал и чистое помещение. Бонусная система супер, уже списала первые 100 рублей за заказ!',
    source: '2GIS',
    avatar: '👩‍💼'
  },
  {
    id: 'r3',
    name: 'Дмитрий В.',
    date: '28 июня 2026',
    rating: 4,
    comment: 'Качество еды на высоте, особенно комбо-наборы. Жаль, что пока нет доставки, но самовывоз спасает. Ждем полноценную доставку!',
    source: 'Яндекс.Карты',
    avatar: '🧔'
  }
];

export default function ReviewsSection() {
  const ratingStats = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 12 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 1 }
  ];

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (96 / 100) * circumference;

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-red text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-primary-red/10 px-4 py-2 rounded-full">
            Отзывы клиентов
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark uppercase tracking-tight">
            ⭐ Нам доверяют сотни гостей
          </h2>
          <p className="font-body text-gray-500 text-sm sm:text-base">
            Отзывы реальных людей с Яндекс Карт и 2GIS. Делимся честным мнением о нашей еде.
          </p>
        </div>

        {/* Rating Stats Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center mb-16 bg-zinc-50 p-8 sm:p-12 rounded-3xl border border-gray-150 shadow-sm">
          
          {/* Average rating value */}
          <div className="text-center space-y-4 border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0">
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest block">Средняя оценка</span>
            <h3 className="font-display font-black text-7xl text-primary-red leading-none">
              4.8
            </h3>
            <div className="flex justify-center text-brand-yellow space-x-1">
              <Star className="w-5 h-5 fill-brand-yellow stroke-brand-yellow" />
              <Star className="w-5 h-5 fill-brand-yellow stroke-brand-yellow" />
              <Star className="w-5 h-5 fill-brand-yellow stroke-brand-yellow" />
              <Star className="w-5 h-5 fill-brand-yellow stroke-brand-yellow" />
              <Star className="w-5 h-5 fill-brand-yellow stroke-brand-yellow" />
            </div>
            <p className="font-body text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              500+ оценок на Яндекс Картах
            </p>
          </div>

          {/* Progress bar list */}
          <div className="space-y-3 px-0 md:px-6">
            {ratingStats.map(stat => (
              <div key={stat.stars} className="flex items-center text-xs font-bold text-gray-600">
                <span className="w-4 text-left">{stat.stars}★</span>
                <div className="flex-1 mx-3 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand-yellow h-full rounded-full"
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-gray-400">{stat.percentage}%</span>
              </div>
            ))}
          </div>

          {/* SVG Recommended Ring */}
          <div className="flex flex-col items-center justify-center space-y-4 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-gray-250 fill-transparent"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-emerald-500 fill-transparent"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="font-display font-black text-2xl text-brand-dark">96%</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">советуют</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100/50">
              <ThumbsUp className="w-3.5 h-3.5 mr-1.5" /> Рекомендуют 96 из 100 гостей
            </span>
          </div>

        </div>

        {/* Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_REVIEWS.map(review => (
            <div
              key={review.id}
              className="bg-zinc-50 border border-gray-150 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 glow-card-yellow"
            >
              <div className="space-y-4">
                {/* Review Header info */}
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl bg-white p-2.5 rounded-xl border border-gray-150 select-none shadow-sm">
                      {review.avatar}
                    </span>
                    <div>
                      <h4 className="font-display font-bold text-sm text-brand-dark">{review.name}</h4>
                      <p className="text-[9px] text-gray-400 font-semibold">{review.date}</p>
                    </div>
                  </div>
                  <span className="bg-white px-2.5 py-1 rounded-full border border-gray-150 text-[9px] font-bold text-gray-400 uppercase tracking-wide">
                    {review.source}
                  </span>
                </div>

                {/* Rating stars */}
                <div className="flex text-brand-yellow space-x-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-brand-yellow stroke-brand-yellow' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Review text comment */}
                <p className="font-body text-gray-600 text-xs sm:text-sm leading-relaxed font-medium">
                  "{review.comment}"
                </p>
              </div>

              {/* Verified badge */}
              <div className="pt-5 border-t border-gray-200/50 mt-6 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Проверенный визит</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action link */}
        <div className="text-center mt-16">
          <a
            href="https://yandex.ru/maps"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border border-gray-200 hover:border-primary-red hover:text-primary-red transition-all px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider text-brand-dark bg-white shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Читать все отзывы на Яндекс Картах</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
}
