'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Truck, Check, AlertCircle, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { CartItem } from '../types';
import Link from 'next/link';

interface OrderSectionProps {
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  user: any;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onSubmitOrder: (name: string, phone: string, comment: string, bonusesUsed: number, deliveryData: any) => Promise<any>;
}

export default function OrderSection({
  cart,
  cartTotal,
  cartCount,
  user,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onSubmitOrder
}: OrderSectionProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [addressText, setAddressText] = useState('');
  const [entrance, setEntrance] = useState('');
  const [floor, setFloor] = useState('');
  const [apartment, setApartment] = useState('');
  const [consentPDN, setConsentPDN] = useState(false);
  const [useBonuses, setUseBonuses] = useState(false);
  const [bonusesToUse, setBonusesToUse] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = '';
    
    if (numbers.startsWith('7') || numbers.startsWith('8')) {
      formatted = '+7 ';
      const remains = numbers.substring(1);
      if (remains.length > 0) {
        formatted += '(' + remains.substring(0, 3);
      }
      if (remains.length >= 4) {
        formatted += ') ' + remains.substring(3, 6);
      }
      if (remains.length >= 7) {
        formatted += '-' + remains.substring(6, 8);
      }
      if (remains.length >= 9) {
        formatted += '-' + remains.substring(8, 10);
      }
    } else {
      if (numbers.length > 0) {
        formatted = '+' + numbers.substring(0, 15);
      }
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw.length < phone.length) {
      setPhone(raw);
      return;
    }
    setPhone(formatPhoneNumber(raw));
  };

  const deliveryFee = deliveryType === 'delivery' ? 200 : 0;
  const maxBonusesAvailable = user ? Math.min(user.bonus_balance, cartTotal + deliveryFee) : 0;

  const handleBonusToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseBonuses(e.target.checked);
    if (e.target.checked) {
      setBonusesToUse(maxBonusesAvailable);
    } else {
      setBonusesToUse(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartCount === 0) {
      toast.error('Ваша корзина пуста');
      return;
    }

    // Security: Regex validation for Name (only letters and spaces)
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
    if (!name.trim() || !nameRegex.test(name)) {
      toast.error('Введите корректное имя (только буквы)');
      return;
    }
    if (phone.length < 10) {
      toast.error('Введите корректный номер телефона');
      return;
    }

    if (deliveryType === 'delivery') {
      // Security: Regex validation for Address (letters, numbers, spaces, basic punctuation)
      const addressRegex = /^[A-Za-zА-Яа-яЁё0-9\s,.\-\/]+$/;
      if (!addressText.trim() || !addressRegex.test(addressText)) {
        toast.error('Введите корректный адрес');
        return;
      }
      if (!consentPDN) {
        toast.error('Необходимо согласие на обработку персональных данных');
        return;
      }
    }

    // Security: Basic XSS sanitization for comment
    const safeComment = comment.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    setIsSubmitting(true);
    try {
      const deliveryData = deliveryType === 'delivery' ? {
        type: 'delivery',
        address_text: addressText,
        entrance,
        floor,
        apartment,
        fee: deliveryFee
      } : { type: 'pickup' };

      await onSubmitOrder(name, phone, safeComment, useBonuses ? bonusesToUse : 0, deliveryData);
      // Success toast is handled in the parent page after OTP or direct submission
    } catch (error: any) {
      toast.error(error.message || 'Ошибка оформления заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalTotal = Math.max(0, cartTotal + deliveryFee - (useBonuses ? bonusesToUse : 0));

  return (
    <section id="order" className="py-24 bg-brand-dark text-white relative scroll-mt-20">
      {/* Decorative Blob */}
      <div className="absolute top-1/4 right-[10%] w-[350px] h-[350px] bg-primary-red/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Instructions Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-brand-yellow text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                Онлайн заказ
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight uppercase leading-tight">
                🌯 Закажи онлайн, <br />
                {deliveryType === 'pickup' ? 'забери без очереди' : 'доставим горячим'}
              </h2>
              <p className="font-body text-white/70 leading-relaxed text-sm sm:text-base">
                {deliveryType === 'pickup' 
                  ? 'Оформи заказ на самовывоз за пару кликов. Мы приготовим всё горячим точно к вашему приходу. Никакого ожидания в очереди!'
                  : 'Мы быстро доставим ваш заказ прямо до двери. Наслаждайтесь любимыми блюдами, не выходя из дома!'}
              </p>
            </div>

            {/* Delivery Toggles */}
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all text-center space-y-3 relative overflow-hidden cursor-pointer ${
                  deliveryType === 'pickup'
                    ? 'border-brand-yellow bg-white/5 shadow-lg shadow-brand-yellow/5'
                    : 'border-white/5 bg-transparent opacity-50 hover:opacity-85'
                }`}
              >
                {deliveryType === 'pickup' && (
                  <div className="absolute top-3 right-3 bg-brand-yellow text-brand-dark p-0.5 rounded-full">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <ShoppingBag className="w-6 h-6 text-brand-yellow" />
                <span className="text-xs font-black uppercase tracking-wider block">Самовывоз</span>
                <span className="text-[9px] text-white/50 block">Готово через 5-15 мин</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all text-center space-y-3 relative overflow-hidden cursor-pointer ${
                  deliveryType === 'delivery'
                    ? 'border-brand-yellow bg-white/5 shadow-lg shadow-brand-yellow/5'
                    : 'border-white/5 bg-transparent opacity-50 hover:opacity-85'
                }`}
              >
                {deliveryType === 'delivery' && (
                  <div className="absolute top-3 right-3 bg-brand-yellow text-brand-dark p-0.5 rounded-full">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <Truck className="w-6 h-6 text-brand-yellow" />
                <span className="text-xs font-black uppercase tracking-wider block">Доставка</span>
                <span className="text-[9px] text-white/50 block">{deliveryFee} ₽</span>
              </button>
            </div>
          </div>

          {/* Checkout Form Column */}
          <div className="lg:col-span-7 bg-white text-brand-dark rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-100">
            <h3 className="font-display font-black text-xl text-brand-dark mb-8 tracking-wide flex items-center justify-between border-b border-gray-100 pb-5">
              <span>Оформить заказ</span>
              <span className="text-xs font-body font-bold text-gray-400">
                {cartCount} поз. в корзине
              </span>
            </h3>

            {cart.length > 0 && (
              <div className="mb-6 border-b border-gray-100 pb-6 space-y-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Выбранные товары</span>
                <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  {cart.map(cartItem => (
                    <div key={cartItem.item.id} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                          {cartItem.item.image.startsWith('http') ? (
                            <img src={cartItem.item.image} alt={cartItem.item.name} loading="lazy" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">{cartItem.item.image}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-brand-dark">{cartItem.item.name}</h4>
                          <span className="text-[10px] text-gray-400">{cartItem.item.price} ₽</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="p-1 hover:bg-gray-200 text-gray-500 hover:text-brand-dark transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-display font-bold text-xs text-brand-dark">
                            {cartItem.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="p-1 hover:bg-gray-200 text-gray-500 hover:text-brand-dark transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-display font-black text-brand-dark min-w-[50px] text-right">
                          {cartItem.item.price * cartItem.quantity} ₽
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Ваше имя</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Имя"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white p-4 rounded-2xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Номер телефона</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="+7 (999) 999-99-99"
                    className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white p-4 rounded-2xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                  />
                </div>
              </div>

              {/* Delivery Address Fields */}
              {deliveryType === 'delivery' && (
                <div className="space-y-4 p-5 bg-gray-50 rounded-2xl border border-gray-150">
                  <h4 className="text-xs font-black text-brand-dark uppercase tracking-wide">Адрес доставки</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      required
                      value={addressText}
                      onChange={e => setAddressText(e.target.value)}
                      placeholder="Улица и дом (например: ул. Ленина, 15)"
                      className="w-full bg-white border border-gray-200 focus:border-primary-red p-3.5 rounded-xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={entrance}
                        onChange={e => setEntrance(e.target.value)}
                        placeholder="Подъезд"
                        className="w-full bg-white border border-gray-200 focus:border-primary-red p-3.5 rounded-xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                      />
                      <input
                        type="text"
                        value={floor}
                        onChange={e => setFloor(e.target.value)}
                        placeholder="Этаж"
                        className="w-full bg-white border border-gray-200 focus:border-primary-red p-3.5 rounded-xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                      />
                      <input
                        type="text"
                        value={apartment}
                        onChange={e => setApartment(e.target.value)}
                        placeholder="Квартира"
                        className="w-full bg-white border border-gray-200 focus:border-primary-red p-3.5 rounded-xl outline-none font-body font-semibold transition-all text-xs text-brand-dark"
                      />
                    </div>
                  </div>
                  <label className="flex items-start space-x-3 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentPDN}
                      onChange={e => setConsentPDN(e.target.checked)}
                      className="mt-1 w-4 h-4 text-primary-red rounded border-gray-300 focus:ring-primary-red focus:ring-2"
                    />
                    <span className="text-[10px] text-gray-500 leading-relaxed">
                      Я согласен на обработку персональных данных для осуществления доставки в соответствии с <Link href="/privacy" target="_blank" className="text-primary-red hover:underline">Политикой конфиденциальности</Link>.
                    </span>
                  </label>
                </div>
              )}

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Комментарий к заказу</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Например: сделать острее, без лука, позвонить за 10 мин..."
                  rows={2}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-primary-red focus:bg-white p-4 rounded-2xl outline-none font-body font-semibold transition-all text-xs text-brand-dark resize-none"
                />
              </div>

              {/* Loyalty deductions */}
              {user && user.bonus_balance > 0 && (
                <div className="bg-brand-yellow/10 border border-brand-yellow/20 p-5 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-brand-dark block uppercase tracking-wide">Списать бонусы</span>
                    <span className="text-[11px] text-gray-600 block">
                      Баланс: <strong>{user.bonus_balance} ₽</strong> (1 бонус = 1 рубль)
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useBonuses}
                      onChange={handleBonusToggle}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-red"></div>
                  </label>
                </div>
              )}

              {/* Pricing breakdown & Checkout */}
              <div className="border-t border-gray-150 pt-8 space-y-4">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                    <span>Сумма заказа:</span>
                    <span>{cartTotal} ₽</span>
                  </div>
                  {deliveryType === 'delivery' && (
                    <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                      <span>Доставка:</span>
                      <span>{deliveryFee} ₽</span>
                    </div>
                  )}
                  {useBonuses && bonusesToUse > 0 && (
                    <div className="flex justify-between items-center text-xs font-bold text-emerald-600">
                      <span>Списано бонусов:</span>
                      <span>-{bonusesToUse} ₽</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-lg font-black text-brand-dark pt-2 border-t border-dashed border-gray-150">
                    <span>К оплате:</span>
                    <span className="text-primary-red text-2xl">{finalTotal} ₽</span>
                  </div>
                </div>

                {cartCount === 0 && (
                  <p className="text-[11px] font-bold text-amber-600 bg-amber-500/10 p-4 rounded-xl flex items-center border border-amber-500/15">
                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" /> Добавьте блюда в корзину перед оформлением
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || cartCount === 0}
                  className="w-full bg-primary-red hover:bg-red-750 text-white font-bold py-4.5 px-6 rounded-2xl text-center shadow-xl shadow-red-500/10 transition-all flex items-center justify-center space-x-2 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none cursor-pointer uppercase tracking-wider text-xs"
                >
                  <span>{deliveryType === 'pickup' ? '🛍️ Оформить самовывоз' : '🚀 Оформить доставку'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
