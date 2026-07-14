import { useState, useEffect } from 'react';
import { Order, OrderItem } from '../types';
import { supabase, isOfflineMode, localDb } from '../lib/supabase';

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
    bonusesUsed = 0
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
      };

      if (isOfflineMode) {
        const localOrders = localDb.getAll('orders');
        const nextOrderNumber = localOrders.length + 1;
        const newOrder: Order = {
          id: Math.random().toString(36).substring(2, 11),
          order_number: nextOrderNumber,
          ...orderPayload,
        };
        localOrders.push(newOrder);
        localDb.saveAll('orders', localOrders);
        
        // Simulating Realtime insert trigger
        localDb.publish('orders-channel', { event: 'INSERT', new: newOrder });
        return newOrder;
      } else {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();

        if (error) throw error;
        return data as Order;
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (): Promise<Order[]> => {
    setLoading(true);
    try {
      if (isOfflineMode) {
        const localOrders = localDb.getAll('orders');
        // Sort descending by creation date
        const sorted = [...localOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setOrders(sorted);
        return sorted;
      } else {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
        return data || [];
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'new' | 'cooking' | 'ready' | 'done') => {
    if (isOfflineMode) {
      const localOrders = localDb.getAll('orders');
      const updated = localOrders.map((o: any) => {
        if (o.id === orderId) {
          const updatedOrder = { ...o, status };
          // Simulate update event
          localDb.publish('orders-channel', { event: 'UPDATE', new: updatedOrder });
          return updatedOrder;
        }
        return o;
      });
      localDb.saveAll('orders', updated);
      setOrders(updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } else {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    }
  };

  // Realtime subscription handler
  const subscribeToOrders = (onNewOrder: (order: Order) => void, onUpdateOrder?: (order: Order) => void) => {
    if (isOfflineMode) {
      return localDb.subscribe('orders-channel', (payload) => {
        if (payload.event === 'INSERT') {
          onNewOrder(payload.new);
        } else if (payload.event === 'UPDATE' && onUpdateOrder) {
          onUpdateOrder(payload.new);
        }
      });
    } else {
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
    }
  };

  return {
    orders,
    loading,
    submitOrder,
    fetchOrders,
    updateOrderStatus,
    subscribeToOrders,
  };
};
