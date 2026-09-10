'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { DollarSign, ShoppingBag, Users, Star, ArrowUpRight, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Order, UserProfile, OrderItem } from '../../types';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [ordersRes, usersRes] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*')
      ]);

      if (ordersRes.data) setOrders(ordersRes.data);
      if (usersRes.data) setUsers(usersRes.data);
      setLoading(false);
    };

    fetchData();

    // Subscribe to new orders for real-time dashboard updates
    const channel = supabase.channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Helpers to calculate today's metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaysOrders = orders.filter(o => new Date(o.created_at) >= today);
  const revenueToday = todaysOrders.reduce((sum, o) => sum + o.total, 0);
  const newClientsToday = users.filter(u => new Date(u.created_at) >= today).length;

  // Recent Orders (Top 3)
  const recentOrders = orders.slice(0, 3).map(o => {
    const diff = Math.floor((new Date().getTime() - new Date(o.created_at).getTime()) / 60000);
    const timeStr = diff === 0 ? 'Только что' : `${diff} минут назад`;
    
    let label = 'Новый';
    if (o.status === 'cooking') label = 'Готовится';
    if (o.status === 'ready') label = 'Готов';
    if (o.status === 'done') label = 'Выдан';
    
    return { num: `#${o.order_number || o.id.substring(0,4)}`, time: timeStr, sum: `${o.total} ₽`, status: o.status, label };
  });

  // Calculate Popular Today
  const itemCounts: Record<string, number> = {};
  todaysOrders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.qty;
    });
  });

  const sortedItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  const totalItemsSold = sortedItems.reduce((acc, curr) => acc + curr[1], 0);

  const popularToday = sortedItems.map(([name, count]) => ({
    name,
    sales: `${count} шт`,
    pct: totalItemsSold === 0 ? '0%' : `${Math.round((count / totalItemsSold) * 100)}%`
  }));

  const stats = [
    { label: 'Выручка сегодня', value: `${revenueToday.toLocaleString()} ₽`, change: loading ? '...' : 'Сегодня', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Заказов сегодня', value: todaysOrders.length.toString(), change: loading ? '...' : 'Сегодня', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Новых клиентов', value: newClientsToday.toString(), change: loading ? '...' : 'Сегодня', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Средний рейтинг', value: '4.8 ★', change: 'Стабильно', icon: Star, color: 'text-amber-600 bg-amber-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 sm:p-10 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight">Панель управления</h1>
            <p className="font-body text-gray-500 text-sm mt-1">Добро пожаловать в админ-панель Eat & Go Сысерть.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm flex items-center justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wide block">{stat.label}</span>
                  <h3 className="font-display font-black text-2xl text-brand-dark">{stat.value}</h3>
                  <span className="text-xs text-emerald-600 font-bold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> {stat.change}
                  </span>
                </div>
                <div className={`p-4 rounded-2xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Recent Orders List */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="font-display font-bold text-lg text-brand-dark">Последняя активность</h2>
              <span className="text-xs font-bold text-primary-red flex items-center hover:underline cursor-pointer">
                Все заказы <ArrowUpRight className="w-4 h-4 ml-1" />
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                 <div className="py-8 text-center text-gray-400 text-sm font-semibold">Пока нет заказов</div>
              ) : (
                recentOrders.map((ord, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-display font-black text-sm text-brand-dark">Заказ {ord.num}</span>
                      <span className="text-xs text-gray-400 font-medium block">{ord.time}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-display font-black text-sm text-brand-dark">{ord.sum}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        ord.status === 'cooking' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'ready' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {ord.label}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-brand-dark border-b border-gray-100 pb-4">
              🔥 Популярное сегодня
            </h2>

            <div className="space-y-4">
              {popularToday.length === 0 ? (
                <div className="py-4 text-center text-gray-400 text-sm font-semibold">Нет данных за сегодня</div>
              ) : (
                popularToday.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-brand-dark">
                      <span>{item.name}</span>
                      <span className="text-primary-red">{item.sales}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-red h-full transition-all duration-1000" style={{ width: item.pct }}></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
