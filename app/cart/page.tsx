'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useBonus } from '../../hooks/useBonus';
import { useOrders } from '../../hooks/useOrders';
import OrderSection from '../../components/OrderSection';
import LoginModal from '../../components/LoginModal';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal } = useCart();
  const { user, sendOTP, login, logout, processOrderLoyalty, getTransactions } = useBonus();
  const { submitOrder } = useOrders();
  const [loginOpen, setLoginOpen] = useState(false);

  const handleCheckoutOrder = async (name: string, phone: string, comment: string, bonusesUsed: number) => {
    const itemsPayload = cart.map(i => ({
      name: i.item.name,
      price: i.item.price,
      qty: i.quantity,
    }));

    await submitOrder(name, phone, itemsPayload, cartTotal, comment, user?.id || null, bonusesUsed);

    if (user) {
      await processOrderLoyalty(cartTotal, bonusesUsed);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-brand-dark text-white py-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2 text-white hover:text-brand-yellow font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Вернуться назад</span>
          </Link>
          <span className="font-display font-black tracking-widest text-lg">КОРЗИНА</span>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {cartCount === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-gray-150 shadow-sm space-y-6">
            <div className="text-6xl">🛒</div>
            <h2 className="font-display font-bold text-2xl text-brand-dark">Ваша корзина пуста</h2>
            <p className="font-body text-gray-500 max-w-sm mx-auto text-sm">
              Добавьте вкуснейшую шаурму, люля-кебаб или комбо-наборы, чтобы продолжить заказ.
            </p>
            <Link
              href="/#menu"
              className="inline-block bg-primary-red hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-full transition-colors text-sm"
            >
              Перейти к выбору еды
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cart list card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h2 className="font-display font-bold text-lg text-brand-dark">Выбранные блюда</h2>
                <button
                  onClick={clearCart}
                  className="text-xs font-bold text-gray-400 hover:text-primary-red transition-all flex items-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Очистить корзину</span>
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map(cartItem => (
                  <div key={cartItem.item.id} className="py-4 flex items-center justify-between gap-4">
                    {/* Item Thumbnail */}
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 select-none">
                        {cartItem.item.image.startsWith('http') ? (
                          <img
                            src={cartItem.item.image}
                            alt={cartItem.item.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">{cartItem.item.image}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-sm sm:text-base text-brand-dark">
                          {cartItem.item.name}
                        </h3>
                        <p className="text-xs text-gray-400 font-semibold">{cartItem.item.price} ₽ / шт</p>
                      </div>
                    </div>

                    {/* Quantity controls & price */}
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                          className="p-2 hover:bg-gray-250 text-gray-500 hover:text-brand-dark transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 font-display font-bold text-sm text-brand-dark">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                          className="p-2 hover:bg-gray-250 text-gray-500 hover:text-brand-dark transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-display font-black text-sm sm:text-base text-primary-red w-16 text-right shrink-0">
                        {cartItem.item.price * cartItem.quantity} ₽
                      </span>

                      <button
                        onClick={() => removeFromCart(cartItem.item.id)}
                        className="text-gray-300 hover:text-primary-red transition-colors p-1"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embed Order Section Checkout Form */}
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
          </div>
        )}
      </main>

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
