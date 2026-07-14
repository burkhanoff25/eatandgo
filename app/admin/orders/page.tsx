'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { useOrders } from '../../../hooks/useOrders';
import { Order } from '../../../types';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus, loading } = useOrders();
  const [list, setList] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders().then(data => setList(data));
  }, []);

  const handleStatusUpdate = async (orderId: string, status: 'new' | 'cooking' | 'ready' | 'done') => {
    try {
      await updateOrderStatus(orderId, status);
      setList(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Статус успешно изменен');
    } catch (e) {
      toast.error('Не удалось изменить статус');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Принят';
      case 'cooking': return 'Готовится';
      case 'ready': return 'Готов к выдаче';
      case 'done': return 'Выдан';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'cooking': return 'bg-amber-100 text-amber-800';
      case 'ready': return 'bg-emerald-100 text-emerald-800';
      case 'done': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-10 space-y-8 overflow-y-auto">
        <div>
          <h1 className="font-display font-black text-3xl text-brand-dark uppercase tracking-tight">Заказы</h1>
          <p className="font-body text-gray-500 text-sm mt-1">Управление всеми заказами заведения.</p>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-sm font-semibold text-gray-500 animate-pulse">
              Загрузка логов заказов...
            </div>
          ) : list.length === 0 ? (
            <div className="py-20 text-center text-xs text-gray-400 font-semibold italic">
              Заказов пока нет
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-150">
                    <th className="p-4 pl-6">Заказ</th>
                    <th className="p-4">Клиент</th>
                    <th className="p-4">Состав</th>
                    <th className="p-4">Сумма</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4 pr-6 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {list.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50">
                      <td className="p-4 pl-6 font-display font-black text-brand-dark">
                        №{order.order_number}
                        <span className="text-[10px] text-gray-400 block font-normal font-body mt-0.5">
                          {new Date(order.created_at).toLocaleTimeString('ru-RU')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-brand-dark block">{order.customer_name}</span>
                        <span className="text-[10px] text-gray-400 block font-normal mt-0.5">{order.customer_phone}</span>
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        {order.items.map(i => `${i.name} (x${i.qty})`).join(', ')}
                      </td>
                      <td className="p-4 font-display font-black text-primary-red">
                        {order.total} ₽
                      </td>
                      <td className="p-4">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-1.5 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={e => handleStatusUpdate(order.id, e.target.value as any)}
                          className="bg-gray-50 border border-gray-250 p-2 rounded-lg text-xs font-bold outline-none text-brand-dark"
                        >
                          <option value="new">Принят</option>
                          <option value="cooking">Готовится</option>
                          <option value="ready">Готов</option>
                          <option value="done">Выдан</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
