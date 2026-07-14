'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import MenuSection from '../../components/MenuSection';
import { useCart } from '../../hooks/useCart';

export default function FullMenuPage() {
  const { addToCart, cartCount } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mini header */}
      <header className="bg-brand-dark text-white py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-brand-yellow font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>На главную</span>
          </Link>
          <span className="font-display font-black tracking-widest text-lg">EAT & GO МЕНЮ</span>
          
          <Link href="/cart" className="relative p-2 text-white hover:text-brand-yellow">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark font-bold text-xs w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="pt-6">
        <MenuSection onAddToCart={addToCart} />
      </main>
    </div>
  );
}
