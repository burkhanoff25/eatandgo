export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'shaurma' | 'shashlyk' | 'hotdog' | 'pita' | 'drinks' | 'combo';
  image: string;
  badge?: 'ХИТ' | 'NEW';
  available: boolean;
  weight?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface OrderItem {
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: 'new' | 'cooking' | 'ready' | 'done';
  comment?: string;
  user_id?: string | null;
  bonuses_used?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string | null;
  birthday: string | null;
  bonus_balance: number;
  total_spent: number;
  level: 'Новичок' | 'Постоянный' | 'VIP';
  created_at: string;
}

export interface BonusTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'earn' | 'spend';
  description: string;
  created_at: string;
}

export interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  source: 'Яндекс.Карты' | '2GIS';
  avatar?: string;
}
