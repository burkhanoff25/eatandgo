import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from '../types';

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eg_cart');
      if (saved) {
        try {
          setCart(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eg_cart', JSON.stringify(newCart));
    }
  };

  const addToCart = (item: MenuItem, quantity = 1) => {
    const existing = cart.find(i => i.item.id === item.id);
    if (existing) {
      const newCart = cart.map(i =>
        i.item.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { item, quantity }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    saveCart(cart.filter(i => i.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    const newCart = cart.map(i =>
      i.item.id === itemId ? { ...i, quantity } : i
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };
};
