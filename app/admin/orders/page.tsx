'use client';

import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import { useOrders } from '../../../hooks/useOrders';
import { Order } from '../../../types';
import toast from 'react-hot-toast';
import { Truck, ShoppingBag, MapPin } from 'lucide-react';

export default function AdminOrdersPage() {
  const { orders, fetchOrders, updateOrderStatus, assignCourier, loading } = useOrders();
  const [list, setList] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders().then(data => setList(data));
  }, []);

  const handleStatusUpdate = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      setList(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      toast.success('Статус успешно изменен');
    } catch (e) {
      toast.error('Не удалось изменить статус');
    }
  };

  const handleCourierAssign = async (orderId: string, courierName: string) => {
    try {
      await assignCourier(orderId, courierName);
      setList(prev => prev.map(o => o.id === orderId ? { ...o, courier_name: courierName } : o));
      toast.success('Курьер назначен');
    } catch (e) {
      toast.error('Ошибка назначения курьера');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новый (Принят)';
      case 'accepted': return 'Принят';
      case 'cooking':
      case 'preparing': return 'Готовится';
      case 'ready': return 'Готов к выдаче';
      case 'handed_to_courier': return 'Передан курьеру';
      case 'on_the_way': return 'В пути';
      case 'delivered': return 'Доставлен';
      case 'done': return 'Выдан';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'cooking':
      case 'preparing': return 'bg-amber-100 text-amber-800';
      case 'ready':
      case 'handed_to_courier': return 'bg-emerald-100 text-emerald-800';
      case 'on_the_way': return 'bg-purple-100 text-purple-800';
      case 'delivered':
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
                    <th className="p-4">Клиент / Адрес</th>
                    <th className="p-4">Состав</th>
                    <th className="p-4">Сумма</th>
                    <th className="p-4">Курьер</th>
                    <th className="p-4">Статус</th>
                    <th className="p-4 pr-6 text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {list.map(order => {
                    const isDelivery = order.delivery_type === 'delivery';
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="p-4 pl-6 font-display font-black text-brand-dark align-top">
                          <div className="space-y-1">
                            {isDelivery ? (
                              <span className="bg-primary-red/10 text-primary-red text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center w-max mb-1">
                                <Truck className="w-3 h-3 mr-1" /> Доставка
                              </span>
                            ) : (
                              <span className="bg-brand-yellow/20 text-brand-dark text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center w-max mb-1">
                                <ShoppingBag className="w-3 h-3 mr-1" /> Самовывоз
                              </span>
                            )}
                            <div>№{order.order_number}</div>
                            <div className="text-[10px] text-gray-400 font-normal font-body">
                              {new Date(order.created_at).toLocaleTimeString('ru-RU')}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-top max-w-[200px]">
                          <span className="text-brand-dark block font-bold">{order.customer_name}</span>
                          <span className="text-[10px] text-gray-400 block font-normal mt-0.5">{order.customer_phone}</span>
                          {isDelivery && (
                            <div className="mt-2 text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded flex items-start border border-gray-100">
                              <MapPin className="w-3 h-3 mr-1 text-blue-500 shrink-0 mt-0.5" />
                              <span>{order.delivery_address_text}, п.{order.delivery_entrance || '-'}, эт.{order.delivery_floor || '-'}, кв.{order.delivery_apartment || '-'}</span>
                            </div>
                          )}
                        </td>
                        <td className="p-4 align-top max-w-[150px]">
                          <ul className="space-y-0.5 text-[10px] text-gray-500 font-normal">
                            {order.items.map((i, idx) => <li key={idx} className="truncate">{i.name} (x{i.qty})</li>)}
                          </ul>
                        </td>
                        <td className="p-4 align-top font-display font-black text-primary-red">
                          {order.total} ₽
                        </td>
                        <td className="p-4 align-top">
                          {isDelivery ? (
                            <div className="space-y-1">
                              <input
                                type="text"
                                placeholder="Имя курьера"
                                defaultValue={order.courier_name || ''}
                                onBlur={e => {
                                  if (e.target.value !== (order.courier_name || '')) {
                                    handleCourierAssign(order.id, e.target.value);
                                  }
                                }}
                                className="w-full bg-white border border-gray-200 rounded p-1.5 text-xs text-brand-dark outline-none focus:border-brand-dark transition-colors"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-300 italic">-</span>
                          )}
                        </td>
                        <td className="p-4 align-top">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-4 pr-6 align-top text-right whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={e => handleStatusUpdate(order.id, e.target.value as any)}
                            className="bg-white border border-gray-250 p-1.5 rounded-lg text-xs font-bold outline-none text-brand-dark w-[140px]"
                          >
                            {isDelivery ? (
                              <>
                                <option value="new">Новый</option>
                                <option value="accepted">Принят</option>
                                <option value="preparing">Готовится</option>
                                <option value="handed_to_courier">У курьера</option>
                                <option value="on_the_way">В пути</option>
                                <option value="delivered">Доставлен</option>
                              </>
                            ) : (
                              <>
                                <option value="new">Принят</option>
                                <option value="cooking">Готовится</option>
                                <option value="ready">Готов к выдаче</option>
                                <option value="done">Выдан</option>
                              </>
                            )}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
