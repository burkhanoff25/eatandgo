'use client';

import React from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { TrendingUp, Award, Clock, Users, ArrowUpRight, DollarSign } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const chartData = [
    { label: 'Пн', value: 40, sum: '12,400' },
    { label: 'Вт', value: 55, sum: '16,200' },
    { label: 'Ср', value: 48, sum: '14,800' },
    { label: 'Чт', value: 70, sum: '21,000' },
    { label: 'Пт', value: 85, sum: '28,400' },
    { label: 'Сб', value: 95, sum: '32,500' },
    { label: 'Вс', value: 80, sum: '26,800' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight">Аналитика заведения</h1>
          <p className="font-body text-gray-500 text-sm mt-1">Финансовые показатели и статистика посещаемости.</p>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-brand-dark flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-red" /> Выручка за неделю
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Всего: 152,100 ₽</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
              +14.8% к пров. неделе
            </span>
          </div>

          {/* Graph visual representation using simple CSS grid */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-gray-100">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group cursor-pointer">
                {/* Value popup */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark text-white text-[9px] font-bold px-2 py-1 rounded shadow absolute -translate-y-8 pointer-events-none select-none">
                  {data.sum} ₽
                </div>
                {/* Bar */}
                <div
                  className="w-full bg-primary-red/80 hover:bg-primary-red rounded-t-xl transition-all duration-500"
                  style={{ height: `${data.value}%` }}
                ></div>
                {/* Label */}
                <span className="font-body text-xs font-bold text-gray-400 group-hover:text-brand-dark transition-colors">
                  {data.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Grid details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Top category breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-brand-dark border-b border-gray-100 pb-4">
              🎯 Доли категорий
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Шаурма', pct: '62%', count: '310 шт' },
                { name: 'Шашлык', pct: '18%', count: '90 шт' },
                { name: 'Хот-доги', pct: '10%', count: '50 шт' },
                { name: 'Напитки & Другое', pct: '10%', count: '50 шт' }
              ].map((category, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-brand-dark">
                    <span>{category.name} ({category.pct})</span>
                    <span className="text-gray-400 font-semibold">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-brand-yellow h-full rounded-full" style={{ width: category.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time activity breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-brand-dark border-b border-gray-100 pb-4">
              🕒 Пиковые часы активности
            </h2>
            <div className="space-y-4">
              {[
                { time: '12:00 - 15:00 (Обед)', value: 'Высокая нагрузка 🔥', pct: '100%', color: 'bg-primary-red' },
                { time: '18:00 - 21:00 (Ужин)', value: 'Максимальный пик 🚀', pct: '85%', color: 'bg-primary-red' },
                { time: '21:00 - 03:00 (Ночь)', value: 'Умеренный спрос 🌙', pct: '45%', color: 'bg-brand-yellow' }
              ].map((time, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-brand-dark">
                    <span>{time.time}</span>
                    <span className="text-gray-400 font-semibold">{time.value}</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                    <div className={`${time.color} h-full rounded-full`} style={{ width: time.pct }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
