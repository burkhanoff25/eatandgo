'use client';

import React, { useState, useEffect } from 'react';
import { Gift, Award, HelpCircle, History, Sparkles, LogOut, ArrowRight, User } from 'lucide-react';
import { BonusTransaction } from '../types';

interface BonusSectionProps {
  user: any;
  onOpenLogin: () => void;
  onLogout: () => void;
  getTransactions: () => Promise<BonusTransaction[]>;
}

export default function BonusSection({
  user,
  onOpenLogin,
  onLogout,
  getTransactions
}: BonusSectionProps) {
  const [history, setHistory] = useState<BonusTransaction[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      setLoadingHistory(true);
      getTransactions()
        .then(data => setHistory(data))
        .catch(err => console.error(err))
        .finally(() => setLoadingHistory(false));
    } else {
      setHistory([]);
    }
  }, [user, getTransactions]);

  const getNextLevelTarget = () => {
    if (!user) return { target: 1000, needed: 1000, pct: 0, next: 'Постоянный' };
    if (user.level === 'Новичок') {
      const needed = Math.max(0, 1000 - user.total_spent);
      const pct = Math.min(100, (user.total_spent / 1000) * 100);
      return { target: 1000, needed, pct, next: 'Постоянный' };
    }
    if (user.level === 'Постоянный') {
      const needed = Math.max(0, 5000 - user.total_spent);
      const pct = Math.min(100, ((user.total_spent - 1000) / 4000) * 100);
      return { target: 5000, needed, pct, next: 'VIP' };
    }
    return { target: 5000, needed: 0, pct: 100, next: 'Максимальный уровень' };
  };

  const nextLevel = getNextLevelTarget();

  return (
    <section id="bonus" className="py-24 bg-brand-yellow text-brand-dark relative overflow-hidden scroll-mt-20">
      {/* Background design accents */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Info Side */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-brand-dark/10 border border-brand-dark/15 px-4 py-2 rounded-full">
                <Gift className="w-4.5 h-4.5 text-brand-dark" />
                <span className="text-[10px] font-black tracking-widest uppercase text-brand-dark">
                  Бонусная система E&G
                </span>
              </div>

              <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark uppercase tracking-tight leading-tight">
                🎁 Копи бонусы — <br />
                ешь бесплатно!
              </h2>
            </div>

            <div className="space-y-5 font-body text-sm sm:text-base font-semibold text-brand-dark">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-dark text-brand-yellow p-1.5 rounded-full shrink-0 mt-0.5 shadow-md">
                  <Sparkles className="w-4 h-4 fill-brand-yellow" />
                </div>
                <div>
                  <p className="text-brand-dark font-black uppercase text-xs tracking-wider">5% кэшбек бонусами</p>
                  <p className="text-brand-dark/70 text-xs mt-1 font-medium">Копите баллы с каждого оформленного самовывоза на сайте.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-dark text-brand-yellow p-1.5 rounded-full shrink-0 mt-0.5 shadow-md">
                  <Sparkles className="w-4 h-4 fill-brand-yellow" />
                </div>
                <div>
                  <p className="text-brand-dark font-black uppercase text-xs tracking-wider">Двойные бонусы в день рождения 🎉</p>
                  <p className="text-brand-dark/70 text-xs mt-1 font-medium">Получайте 10% бонусов на все заказы в праздничные дни.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-brand-dark text-brand-yellow p-1.5 rounded-full shrink-0 mt-0.5 shadow-md">
                  <Sparkles className="w-4 h-4 fill-brand-yellow" />
                </div>
                <div>
                  <p className="text-brand-dark font-black uppercase text-xs tracking-wider">Уровни лояльности</p>
                  <p className="text-brand-dark/70 text-xs mt-1 font-medium">
                    Новичок (5%) → Постоянный (1000₽ spent) → VIP (5000₽ spent).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card/Dashboard Side */}
          <div className="lg:col-span-6">
            {user ? (
              /* User Card Dashboard Panel */
              <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 border border-white/20">
                {/* Header card details */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                  <div className="flex items-center space-x-3.5">
                    <div className="bg-brand-yellow/30 p-3 rounded-2xl">
                      <User className="w-5 h-5 text-brand-dark" />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-base text-brand-dark truncate max-w-[180px]">
                        {user.name || 'Гость'}
                      </h4>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <Award className="w-3.5 h-3.5 text-primary-red" />
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          Уровень: <strong className="text-primary-red">{user.level}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-xs font-bold text-gray-400 hover:text-primary-red transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти</span>
                  </button>
                </div>

                {/* Simulated physical gold membership card */}
                <div className="bg-gradient-to-br from-brand-dark to-zinc-900 rounded-3xl p-6 text-white border border-white/5 shadow-xl relative overflow-hidden flex flex-col justify-between h-44 shadow-brand-dark/30">
                  {/* Card design details */}
                  <div className="absolute top-[-10%] right-[-10%] w-36 h-36 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="font-display font-black text-sm tracking-widest text-white/90">E&G CLUB</span>
                    {/* Simulated card chip */}
                    <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-md border border-white/10 opacity-80"></div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest block">Баланс кэшбека</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="font-display font-black text-3xl text-brand-yellow">{user.bonus_balance}</span>
                      <span className="font-display font-black text-base text-brand-yellow">₽</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-white/50 font-semibold tracking-wider">
                    <span>{user.phone}</span>
                    <span className="uppercase text-brand-yellow font-bold">{user.level} CARD</span>
                  </div>
                </div>

                {/* Progress bar to next tier */}
                {user.level !== 'VIP' && (
                  <div className="space-y-3 bg-gray-50 p-4.5 rounded-2xl border border-gray-100">
                    <div className="flex justify-between text-xs font-bold text-gray-500">
                      <span>До уровня {nextLevel.next}</span>
                      <span className="text-brand-dark">{nextLevel.needed} ₽</span>
                    </div>
                    <div className="w-full bg-gray-250 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary-red h-full rounded-full transition-all duration-500"
                        style={{ width: `${nextLevel.pct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                      <span>Накоплено трат: {user.total_spent} ₽</span>
                      <span>Порог: {nextLevel.target} ₽</span>
                    </div>
                  </div>
                )}

                {/* Loyalty History List */}
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                    <History className="w-4 h-4 mr-1.5" /> История бонусных операций
                  </h5>
                  
                  {loadingHistory ? (
                    <p className="text-xs text-gray-400 animate-pulse py-2">Синхронизация истории...</p>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-gray-400 py-2">Операций пока нет</p>
                  ) : (
                    <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                      {history.slice(0, 3).map(tx => (
                        <div key={tx.id} className="flex justify-between items-center text-xs font-semibold p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                          <div>
                            <p className="text-brand-dark text-[11px] font-bold">{tx.description}</p>
                            <p className="text-[9px] text-gray-400 mt-1">{new Date(tx.created_at).toLocaleDateString('ru-RU')}</p>
                          </div>
                          <span className={`font-display font-black text-sm ${tx.type === 'earn' ? 'text-emerald-600' : 'text-primary-red'}`}>
                            {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Invitation Promo Card */
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-8 flex flex-col items-center border border-white/20">
                <div className="bg-brand-yellow/20 p-5 rounded-full">
                  <Gift className="w-8 h-8 text-brand-dark animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-display font-black text-xl text-brand-dark uppercase tracking-wide">
                    Зарегистрируйтесь прямо сейчас
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
                    Введите номер телефона, получайте 5% кэшбек с каждого заказа и оплачивайте баллами до 100% от стоимости еды.
                  </p>
                </div>

                <button
                  onClick={onOpenLogin}
                  className="w-full bg-primary-red hover:bg-red-750 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>🔑 Войти по номеру телефона</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
