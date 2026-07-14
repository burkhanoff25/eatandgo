'use client';

import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import OrderSection from '../components/OrderSection';
import ReviewsSection from '../components/ReviewsSection';
import MapSection from '../components/MapSection';
import BonusSection from '../components/BonusSection';
import LoginModal from '../components/LoginModal';

import { useCart } from '../hooks/useCart';
import { useBonus } from '../hooks/useBonus';
import { useOrders } from '../hooks/useOrders';

export default function Home() {
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart();
  const { user, sendOTP, login, logout, processOrderLoyalty, getTransactions } = useBonus();
  const { submitOrder } = useOrders();

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  const handleCheckoutOrder = async (name: string, phone: string, comment: string, bonusesUsed: number) => {
    // Standardize cart items for saving
    const itemsPayload = cart.map(i => ({
      name: i.item.name,
      price: i.item.price,
      qty: i.quantity,
    }));

    // Submit order to database (Supabase or Offline localDb)
    await submitOrder(name, phone, itemsPayload, cartTotal, comment, user?.id || null, bonusesUsed);

    // Apply loyalty reward updates if user is logged in
    if (user) {
      await processOrderLoyalty(cartTotal, bonusesUsed);
    }
  };

  if (!siteLoaded) {
    return <LoadingScreen onFinished={() => setSiteLoaded(true)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        cartCount={cartCount}
        user={user}
        onLogout={logout}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <main className="flex-1">
        <Hero />
        <MenuSection onAddToCart={handleAddToCart} />
        <OrderSection
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          user={user}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onClearCart={clearCart}
          onSubmitOrder={handleCheckoutOrder}
        />
        <ReviewsSection />
        <BonusSection
          user={user}
          onOpenLogin={() => setLoginOpen(true)}
          onLogout={logout}
          getTransactions={getTransactions}
        />
        <MapSection />
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark py-8 text-center text-xs font-semibold text-white/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} EAT & GO. Все права защищены.</p>
          <p className="text-white/30 text-[10px]">г. Сысерть, Свердловская область</p>
        </div>
      </footer>

      {/* Auth Dialog Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSendOTP={sendOTP}
        onVerifyOTP={login}
      />
    </div>
  );
}
