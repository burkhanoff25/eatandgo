import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if we should run in mock/offline mode
export const isOfflineMode = !supabaseUrl || !supabaseAnonKey;

// Real Supabase client instance (will be null or invalid if offline)
export const supabase = !isOfflineMode
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// === MOCK / OFFLINE LOCALSTORAGE DATABASE LAYER ===
// This layer simulates Supabase CRUD and Realtime triggers locally.
class LocalDatabase {
  private listeners: { [channel: string]: Array<(payload: any) => void> } = {};

  constructor() {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('eg_users')) {
        localStorage.setItem('eg_users', JSON.stringify([]));
      }
      if (!localStorage.getItem('eg_orders')) {
        localStorage.setItem('eg_orders', JSON.stringify([]));
      }
      if (!localStorage.getItem('eg_bonus_transactions')) {
        localStorage.setItem('eg_bonus_transactions', JSON.stringify([]));
      }
    }
  }

  // Generic Get All
  getAll(table: string): any[] {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem(`eg_${table}`) || '[]');
  }

  // Generic Save All
  saveAll(table: string, data: any[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`eg_${table}`, JSON.stringify(data));
  }

  // Realtime Simulation: Subscribe
  subscribe(channel: string, callback: (payload: any) => void) {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }
    this.listeners[channel].push(callback);
    return () => {
      this.listeners[channel] = this.listeners[channel].filter(cb => cb !== callback);
    };
  }

  // Realtime Simulation: Publish
  publish(channel: string, payload: any) {
    const channelListeners = this.listeners[channel] || [];
    channelListeners.forEach(cb => cb(payload));
  }
}

export const localDb = new LocalDatabase();
