'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Phone, User, CheckCircle2, Play, Flame, PackageCheck, AlertCircle, ShieldAlert } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { Order } from '../../types';
import toast from 'react-hot-toast';

export default function KassaPage() {
  const { orders, fetchOrders, updateOrderStatus, subscribeToOrders, loading } = useOrders();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initial fetch
    fetchOrders().then(data => setActiveOrders(data));

    // Sound player
    const playNotificationSound = () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        const context = new AudioContextClass();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, context.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, context.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, context.currentTime + 0.24); // G5
        gain.gain.setValueAtTime(0.15, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + 0.4);
      } catch (e) {
        console.error('Error playing sound', e);
      }
    };

    // Request notification permission on mount
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const showDesktopNotification = (order: Order) => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`Новый заказ №${order.order_number}`, {
          body: `Имя: ${order.customer_name}\nСумма: ${order.total} ₽`,
        });
      }
    };

    // Subscribing to realtime channels
    const unsubscribe = subscribeToOrders(
      (newOrder) => {
        playNotificationSound();
        showDesktopNotification(newOrder);
        toast.success(`🛎️ Новый заказ №${newOrder.order_number}!`, { duration: 5000 });
        setActiveOrders(prev => [newOrder, ...prev]);
      },
      (updatedOrder) => {
        setActiveOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleStatusChange = async (orderId: string, status: 'new' | 'cooking' | 'ready' | 'done') => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Статус заказа изменен`);
      // Update local state directly
      setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (e) {
      toast.error('Ошибка изменения статуса');
    }
  };

  const getStatusButton = (order: Order) => {
    switch (order.status) {
      case 'new':
        return (
          <button
            onClick={() => handleStatusChange(order.id, 'cooking')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Начать готовить</span>
          </button>
        );
      case 'cooking':
        return (
          <button
            onClick={() => handleStatusChange(order.id, 'ready')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Готов к выдаче</span>
          </button>
        );
      case 'ready':
        return (
          <button
            onClick={() => handleStatusChange(order.id, 'done')}
            className="w-full bg-brand-dark hover:bg-zinc-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase transition-colors"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Выдать заказ</span>
          </button>
        );
      case 'done':
        return (
          <div className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 text-xs tracking-wider uppercase select-none border border-gray-200">
            <span>Выдан ✅</span>
          </div>
        );
      default:
        return null;
    }
  };

  const statusGroups: Array<{ id: Order['status']; name: string; color: string }> = [
    { id: 'new', name: 'Новые', color: 'border-t-blue-500 text-blue-600 bg-blue-50/50' },
    { id: 'cooking', name: 'Готовятся', color: 'border-t-amber-500 text-amber-600 bg-amber-50/50' },
    { id: 'ready', name: 'Готовы', color: 'border-t-emerald-500 text-emerald-600 bg-emerald-50/50' },
    { id: 'done', name: 'Выданы', color: 'border-t-gray-400 text-gray-500 bg-gray-50/50' }
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark text-white py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-brand-yellow font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>На сайт</span>
          </Link>
          <span className="font-display font-black tracking-widest text-lg flex items-center">
            <ShieldAlert className="w-5 h-5 text-brand-yellow mr-2 animate-pulse" />
            <span>ЭЛЕКТРОННАЯ КАССА (REALTIME)</span>
          </span>
          <Link href="/admin" className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 text-white">
            Админ Панель
          </Link>
        </div>
      </header>

      {/* Main Grid content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col space-y-6">
        
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20 text-sm font-semibold text-gray-500 animate-pulse">
            Синхронизация с базой данных...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {statusGroups.map(group => {
              const groupOrders = activeOrders.filter(o => o.status === group.id);
              
              return (
                <div key={group.id} className={`bg-white rounded-2xl border-t-4 shadow-sm flex flex-col max-h-[78vh] overflow-hidden ${group.color}`}>
                  {/* Category Header */}
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <span className="font-display font-black text-sm uppercase tracking-wider">{group.name}</span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{groupOrders.length}</span>
                  </div>

                  {/* Orders Scroll container */}
                  <div className="p-4 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
                    {groupOrders.length === 0 ? (
                      <div className="text-center py-10 text-xs text-gray-400 font-semibold italic">
                        Пусто
                      </div>
                    ) : (
                      groupOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4 space-y-4 shadow-sm hover:border-gray-300 transition-all">
                          {/* Order info */}
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-display font-black text-sm text-brand-dark">Заказ №{order.order_number}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold flex items-center mt-1">
                                <Clock className="w-3.5 h-3.5 mr-1" />
                                {new Date(order.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <span className="font-display font-black text-sm text-primary-red">{order.total} ₽</span>
                          </div>

                          {/* Customer */}
                          <div className="bg-gray-50 p-2.5 rounded-lg text-xs space-y-1 font-semibold text-gray-600">
                            <p className="flex items-center text-brand-dark"><User className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {order.customer_name}</p>
                            <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" /> {order.customer_phone}</p>
                          </div>

                          {/* Items list */}
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Состав заказа</span>
                            <ul className="text-xs divide-y divide-gray-100 bg-gray-50 rounded-lg p-2 font-semibold">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="py-1 flex justify-between">
                                  <span className="text-brand-dark truncate pr-2">{item.name}</span>
                                  <span className="text-gray-400 shrink-0">x{item.qty}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Comment */}
                          {order.comment && (
                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 flex items-start space-x-1.5">
                              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-[11px] font-semibold text-amber-800 leading-relaxed">
                                {order.comment}
                              </p>
                            </div>
                          )}

                          {/* Control Button */}
                          <div className="pt-2 border-t border-gray-100">
                            {getStatusButton(order)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
