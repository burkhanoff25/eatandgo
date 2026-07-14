'use client';

import React from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { DollarSign, ShoppingBag, Users, Star, ArrowUpRight, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Выручка сегодня', value: '18,450 ₽', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Заказов сегодня', value: '48', change: '+8.3%', icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Новых клиентов', value: '14', change: '+18.2%', icon: Users, color: 'text-purple-600 bg-purple-50' },
    { label: 'Средний рейтинг', value: '4.8 ★', change: '+0.1%', icon: Star, color: 'text-amber-600 bg-amber-50' }
  ];

  const recentOrders = [
    { num: '#12', time: '10 минут назад', sum: '640 ₽', status: 'cooking', label: 'Готовится' },
    { num: '#11', time: '25 минут назад', sum: '320 ₽', status: 'ready', label: 'Готов' },
    { num: '#10', time: '40 минут назад', sum: '1,280 ₽', status: 'done', label: 'Выдан' }
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
              {recentOrders.map((ord, idx) => (
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
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-sm space-y-6">
            <h2 className="font-display font-bold text-lg text-brand-dark border-b border-gray-100 pb-4">
              🔥 Популярное сегодня
            </h2>

            <div className="space-y-4">
              {[
                { name: 'Шаурма Классик', sales: '24 шт', pct: '80%' },
                { name: 'Шаурма Сырная', sales: '14 шт', pct: '55%' },
                { name: 'Шашлык свинина', sales: '8 порц', pct: '35%' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-brand-dark">
                    <span>{item.name}</span>
                    <span className="text-primary-red">{item.sales}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-primary-red h-full" style={{ width: item.pct }}></div>
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
