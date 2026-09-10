'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { TrendingUp, Award, Clock, Users, ArrowUpRight, DollarSign } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Order } from '../../../types';

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch orders from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (data) setOrders(data);
      setLoading(false);
    };

    fetchData();

    // Subscribe to new orders for real-time analytics updates
    const channel = supabase.channel('admin-analytics')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 1. Calculate Weekly Revenue Chart
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  // Create empty bins for the last 7 days
  const chartDataBins = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      dateStr: d.toDateString(),
      label: daysOfWeek[d.getDay()],
      value: 0, // Will be percentage for height
      sum: 0,
      rawSum: 0
    };
  });

  orders.forEach(order => {
    const orderDate = new Date(order.created_at).toDateString();
    const bin = chartDataBins.find(b => b.dateStr === orderDate);
    if (bin) {
      bin.rawSum += order.total;
    }
  });

  const maxDailyRevenue = Math.max(...chartDataBins.map(b => b.rawSum), 1); // prevent division by zero
  const totalWeeklyRevenue = chartDataBins.reduce((acc, curr) => acc + curr.rawSum, 0);

  const chartData = chartDataBins.map(bin => ({
    label: bin.label,
    value: (bin.rawSum / maxDailyRevenue) * 100, // percentage for height
    sum: bin.rawSum.toLocaleString()
  }));

  // 2. Calculate Category Breakdown
  const categoryCounts: Record<string, number> = {
    'shaurma': 0,
    'shashlyk': 0,
    'hotdog': 0,
    'pita': 0,
    'drinks': 0,
    'combo': 0
  };

  const categoryNames: Record<string, string> = {
    'shaurma': 'Шаурма',
    'shashlyk': 'Шашлык',
    'hotdog': 'Хот-доги',
    'pita': 'Пита',
    'drinks': 'Напитки & Другое',
    'combo': 'Комбо'
  };

  let totalItemsCount = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      // We don't save category in orderItem natively, so we might need a fallback.
      // But typically, we can guess by name if category wasn't saved, or ideally it should be saved.
      // Assuming item might have category if we extended it, otherwise fallback parsing.
      const cat = (item as any).category || 
                  (item.name.toLowerCase().includes('шаурма') ? 'shaurma' : 
                   item.name.toLowerCase().includes('шашлык') ? 'shashlyk' : 
                   item.name.toLowerCase().includes('хот-дог') ? 'hotdog' : 'drinks');
      
      if (categoryCounts[cat] !== undefined) {
         categoryCounts[cat] += item.qty;
      } else {
         categoryCounts['drinks'] += item.qty;
      }
      totalItemsCount += item.qty;
    });
  });

  const categoryBreakdown = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({
      name: categoryNames[key] || key,
      pct: totalItemsCount === 0 ? '0%' : `${Math.round((count / totalItemsCount) * 100)}%`,
      count: `${count} шт`
    }));

  // 3. Peak Hours Breakdown
  let lunchCount = 0; // 12-15
  let dinnerCount = 0; // 18-21
  let nightCount = 0; // 21-03
  let otherCount = 0;

  orders.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    if (hour >= 12 && hour < 15) lunchCount++;
    else if (hour >= 18 && hour < 21) dinnerCount++;
    else if ((hour >= 21 && hour <= 23) || (hour >= 0 && hour < 3)) nightCount++;
    else otherCount++;
  });

  const maxPeak = Math.max(lunchCount, dinnerCount, nightCount, 1);

  const peakHours = [
    { time: '12:00 - 15:00 (Обед)', value: 'Высокая нагрузка 🔥', pct: `${(lunchCount / maxPeak) * 100}%`, color: 'bg-primary-red' },
    { time: '18:00 - 21:00 (Ужин)', value: 'Максимальный пик 🚀', pct: `${(dinnerCount / maxPeak) * 100}%`, color: 'bg-primary-red' },
    { time: '21:00 - 03:00 (Ночь)', value: 'Умеренный спрос 🌙', pct: `${(nightCount / maxPeak) * 100}%`, color: 'bg-brand-yellow' }
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
                <TrendingUp className="w-5 h-5 mr-2 text-primary-red" /> Выручка за 7 дней
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Всего: {totalWeeklyRevenue.toLocaleString()} ₽</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.5 rounded-full flex items-center">
              Обновлено
            </span>
          </div>

          {/* Graph visual representation */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-4 border-b border-gray-100">
            {chartData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center space-y-2 group cursor-pointer h-full justify-end">
                {/* Value popup */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-brand-dark text-white text-[9px] font-bold px-2 py-1 rounded shadow absolute -translate-y-8 pointer-events-none select-none z-10">
                  {data.sum} ₽
                </div>
                {/* Bar */}
                <div
                  className="w-full bg-primary-red/80 hover:bg-primary-red rounded-t-xl transition-all duration-500 min-h-[4px]"
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
              {categoryBreakdown.length === 0 ? (
                <div className="py-4 text-center text-gray-400 text-sm font-semibold">Нет продаж за период</div>
              ) : (
                categoryBreakdown.map((category, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-brand-dark">
                      <span>{category.name} ({category.pct})</span>
                      <span className="text-gray-400 font-semibold">{category.count}</span>
                    </div>
                    <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-yellow h-full rounded-full transition-all duration-1000" style={{ width: category.pct }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Time activity breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-brand-dark border-b border-gray-100 pb-4">
              🕒 Пиковые часы активности
            </h2>
            <div className="space-y-4">
              {peakHours.map((time, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-brand-dark">
                    <span>{time.time}</span>
                    <span className="text-gray-400 font-semibold">{orders.length > 0 ? time.value : 'Нет данных'}</span>
                  </div>
                  <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                    <div className={`${time.color} h-full rounded-full transition-all duration-1000`} style={{ width: orders.length > 0 ? time.pct : '0%' }}></div>
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
