'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Phone, Calendar, Award, Star, History, LogOut } from 'lucide-react';
import { useBonus, calculateLevel } from '../../hooks/useBonus';
import { useOrders } from '../../hooks/useOrders';
import { Order } from '../../types';

export default function ProfilePage() {
  const { user, logout, getTransactions, loading } = useBonus();
  const { fetchOrders, orders } = useOrders();
  const [history, setHistory] = useState<any[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      // Fetch loyalty points history
      getTransactions().then(data => setHistory(data));
      // Fetch orders history
      fetchOrders().then(data => {
        // Filter orders corresponding to this user
        const filtered = data.filter((o: Order) => o.user_id === user.id || o.customer_phone === user.phone);
        setUserOrders(filtered);
        setLoadingOrders(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary-red border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-body text-sm font-semibold text-gray-500">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-150 shadow-md text-center space-y-6">
          <div className="text-5xl">🔑</div>
          <h2 className="font-display font-bold text-2xl text-brand-dark">Доступ ограничен</h2>
          <p className="font-body text-sm text-gray-500">
            Войдите в личный кабинет на главной странице, чтобы увидеть вашу карту лояльности и историю заказов.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-red hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors text-sm w-full"
          >
            На главную страницу
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progression to next tier
  const getNextTier = () => {
    if (user.level === 'Новичок') {
      const next = 'Постоянный';
      const max = 1000;
      const target = Math.max(0, 1000 - user.total_spent);
      const percent = Math.min(100, (user.total_spent / 1000) * 100);
      return { next, target, percent, max };
    }
    if (user.level === 'Постоянный') {
      const next = 'VIP';
      const max = 5000;
      const target = Math.max(0, 5000 - user.total_spent);
      const percent = Math.min(100, ((user.total_spent - 1000) / 4000) * 100);
      return { next, target, percent, max };
    }
    return null;
  };

  const nextTier = getNextTier();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'cooking': return 'bg-amber-100 text-amber-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'done': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Принят';
      case 'cooking': return 'Готовится';
      case 'ready': return 'Готов к выдаче';
      case 'done': return 'Выдан';
      default: return status;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mini header */}
      <header className="bg-brand-dark text-white py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-brand-yellow font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться на главную</span>
          </Link>
          <span className="font-display font-black tracking-widest text-lg">ЛИЧНЫЙ КАБИНЕТ</span>
          <button
            onClick={logout}
            className="text-xs font-bold text-white/60 hover:text-primary-red transition-all flex items-center space-x-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Loyalty Card Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Loyalty details card */}
            <div className="bg-gradient-to-br from-brand-dark to-zinc-900 rounded-3xl p-6 sm:p-8 text-white border border-white/5 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-yellow/10 rounded-full blur-2xl"></div>
              
              <div className="space-y-6">
                <div>
                  <span className="bg-brand-yellow text-brand-dark text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {user.level}
                  </span>
                  <h2 className="font-display font-black text-2xl mt-4">{user.name || 'Гость'}</h2>
                  <p className="font-body text-xs text-white/50 font-medium flex items-center mt-1">
                    <Phone className="w-3.5 h-3.5 mr-1.5" /> {user.phone}
                  </p>
                  {user.birthday && (
                    <p className="font-body text-xs text-white/50 font-medium flex items-center mt-1">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" /> ДР: {new Date(user.birthday).toLocaleDateString('ru-RU')}
                    </p>
                  )}
                </div>

                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Доступные бонусы</span>
                  <div className="flex items-baseline space-x-1.5 mt-1">
                    <span className="font-display font-black text-4xl text-brand-yellow">{user.bonus_balance}</span>
                    <span className="font-display font-black text-lg text-brand-yellow">₽</span>
                  </div>
                  <span className="text-[9px] text-white/35 font-medium mt-1 block">1 бонус = 1 рубль скидки</span>
                </div>

                {/* Next Level Progression */}
                {nextTier && (
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px] font-bold text-white/60">
                      <span>До уровня {nextTier.next}</span>
                      <span>{nextTier.target} ₽</span>
                    </div>
                    <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-red h-full rounded-full transition-all"
                        style={{ width: `${nextTier.percent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-white/40 font-semibold">
                      <span>Сумма трат: {user.total_spent} ₽</span>
                      <span>Цель: {nextTier.max} ₽</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-6">
              <h2 className="font-display font-bold text-lg text-brand-dark flex items-center">
                <History className="w-5 h-5 mr-2 text-primary-red" />
                <span>История ваших заказов</span>
              </h2>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-gray-400 animate-pulse font-semibold">
                  Загрузка заказов...
                </div>
              ) : userOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <span className="text-4xl block">🌯</span>
                  <p className="font-body text-xs font-semibold text-gray-400">У вас пока нет оформленных заказов</p>
                  <Link href="/#menu" className="inline-block text-xs font-bold text-primary-red hover:underline">
                    Сделать первый заказ
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.slice(0, 10).map(order => (
                    <div key={order.id} className="p-4 border border-gray-150 rounded-2xl bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left: order details */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-display font-black text-sm text-brand-dark">
                            Заказ №{order.order_number}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        
                        {/* Items list summary */}
                        <p className="text-xs text-gray-500 font-medium">
                          {order.items.map(i => `${i.name} (${i.qty}шт)`).join(', ')}
                        </p>
                        
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.created_at).toLocaleString('ru-RU')}
                        </p>
                      </div>

                      {/* Right: pricing */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="font-display font-black text-base text-primary-red">
                          {order.total} ₽
                        </div>
                        {order.bonuses_used ? (
                          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            Бонусы: -{order.bonuses_used} ₽
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
