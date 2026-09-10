import { useState, useEffect } from 'react';
import { Order, OrderItem } from '../types';
import { supabase } from '../lib/supabase';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const submitOrder = async (
    name: string,
    phone: string,
    items: OrderItem[],
    total: number,
    comment = '',
    userId?: string | null,
    bonusesUsed = 0,
    deliveryData?: any
  ) => {
    setLoading(true);
    try {
      const orderPayload = {
        customer_name: name,
        customer_phone: phone,
        items,
        total,
        status: 'new' as const,
        comment,
        user_id: userId || null,
        bonuses_used: bonusesUsed,
        created_at: new Date().toISOString(),
        ...(deliveryData && {
          delivery_type: deliveryData.type,
          delivery_address_text: deliveryData.address_text,
          delivery_entrance: deliveryData.entrance,
          delivery_floor: deliveryData.floor,
          delivery_apartment: deliveryData.apartment,
          delivery_fee: deliveryData.fee,
        })
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (): Promise<Order[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
      return data || [];
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const assignCourier = async (orderId: string, courierName: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ courier_name: courierName })
      .eq('id', orderId);
    if (error) throw error;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courier_name: courierName } : o));
  };

  // Realtime subscription handler
  const subscribeToOrders = (onNewOrder: (order: Order) => void, onUpdateOrder?: (order: Order) => void) => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload: any) => {
          onNewOrder(payload.new as Order);
        }
      );
    
    if (onUpdateOrder) {
      channel.on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload: any) => {
          onUpdateOrder(payload.new as Order);
        }
      );
    }

    channel.subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    orders,
    loading,
    submitOrder,
    fetchOrders,
    updateOrderStatus,
    subscribeToOrders,
    assignCourier,
  };
};
