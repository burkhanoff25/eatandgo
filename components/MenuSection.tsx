'use client';

import React, { useState } from 'react';
import { MenuItem } from '../types';
import { ShoppingCart, Flame, Sparkles } from 'lucide-react';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'sh1',
    name: 'Шаурма Классика',
    description: 'Курица (100г) или свинина (90г), тонкий лаваш, капуста, помидоры, огурцы, белый чесночный соус.',
    price: 280,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor3430-3663-4533-b339-633035356163/75305949.jpg',
    badge: 'ХИТ',
    available: true,
    weight: '500/490 гр'
  },
  {
    id: 'sh2',
    name: 'Шаурма МИНИ',
    description: 'Уменьшенная порция: мясо кур/свин (80г), лаваш, капуста, помидор, огурец, белый чесночный соус.',
    price: 190,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6335-3439-4363-a364-306432643462/24520059.jpg',
    available: true,
    weight: '315 гр'
  },
  {
    id: 'sh3',
    name: 'Шаурма Грибная',
    description: 'Курица (80г), шампиньоны (80г), лаваш/пита, капуста, помидор, огурец, чесночный соус.',
    price: 320,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6430-3939-4139-b430-333533633032/38191621.jpg',
    badge: 'NEW',
    available: true,
    weight: '520  гр'
  },
  {
    id: 'sh4',
    name: 'Шаурма BBQ',
    description: 'Курица/свинина (100г), лаваш, салат пекинский, помидор, огурец соленый, соус BBQ, лук фри, чесночный соус.',
    price: 350,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6430-3939-4139-b430-333533633032/38191621.jpg',
    badge: 'ХИТ',
    available: true,
    weight: '520 гр'
  },
  {
    id: 'gr1',
    name: 'Гирос с соусом сальса',
    description: 'Курица (90г), лаваш, капуста, помидор, огурец, чесночный соус, картошка фри, томатный соус.',
    price: 340,
    category: 'pita',
    image: 'https://static.tildacdn.com/stor6437-3165-4135-a134-616166353233/36207069.jpg',
    available: true,
    weight: '520 гр'
  },
  {
    id: 'sh5',
    name: 'Шаверма Eat & Go',
    description: 'Фирменный фарш (100г), лаваш, пекинская капуста, помидор, огурец, белый чесночный соус, халапеньо, соус BBQ.',
    price: 360,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6136-6437-4133-a232-643764353266/87050458.jpg',
    badge: 'ХИТ',
    available: true,
    weight: '530 гр'
  },
  {
    id: 'sh6',
    name: 'Шаверма Деревенская',
    description: 'Курица (80г), лаваш, шампиньоны (60г), помидор, огурец соленый, чесночный соус, картофель фри.',
    price: 330,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6437-3165-4135-a134-616166353233/36207069.jpg',
    available: true,
    weight: '490 гр'
  },
  {
    id: 'sh7',
    name: 'Вегетарианская шаверма',
    description: 'Капуста (100г), лаваш, шампиньоны (100г), помидор, огурец, соус сальса, соус BBQ.',
    price: 240,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor3962-3134-4032-a639-303361613835/22862889.jpg',
    available: true,
    weight: '480 гр'
  },
  {
    id: 'pt1',
    name: 'Шаверма в пите',
    description: 'Мясо курицы/свинины (100/90г), пита (160г), капуста (80г), помидор, огурец, белый чесночный соус.',
    price: 290,
    category: 'pita',
    image: 'https://static.tildacdn.com/stor6461-3534-4930-a532-623366353830/18765451.jpg',
    available: true,
    weight: '510/500 гр'
  },
  {
    id: 'sh8',
    name: 'Шаверма Фермерская',
    description: 'Курица (100г), лаваш, капуста, помидор, огурец, чесночный соус, сыр моцарелла/чеддер, соус BBQ.',
    price: 350,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6237-3638-4432-b138-353939386637/43037931.jpg',
    available: true,
    weight: '520 гр'
  },
  {
    id: 'sh9',
    name: 'Шаверма Фитнес',
    description: 'Курица (100г), лаваш, капуста, помидор, огурец, соус сальса, соус BBQ.',
    price: 310,
    category: 'shaurma',
    image: 'https://static.tildacdn.com/stor6335-3439-4363-a364-306432643462/24520059.jpg',
    available: true,
    weight: '510  гр'
  },
  {
    id: 'hd2',
    name: 'Хот-дог',
    description: 'Сосиска (70г), булка (100г), лист салата, помидор, огурец, чесночный соус, соус BBQ, горчица.',
    price: 180,
    category: 'hotdog',
    image: 'https://static.tildacdn.com/stor3430-6365-4039-b332-383131363364/18139754.jpg',
    available: true,
    weight: '350 гр'
  },
  {
    id: 'pl1',
    name: 'Плескавица',
    description: 'Говядина-свинина (170г), пита (160г), капуста (40г), помидор, огурец, соус BBQ, соус томатный, чесночный соус, лист салата.',
    price: 360,
    category: 'pita',
    image: 'https://static.tildacdn.com/stor6461-3534-4930-a532-623366353830/18765451.jpg',
    badge: 'NEW',
    available: true,
    weight: '580 гр'
  },
  {
    id: 'lk2',
    name: 'Люля в лаваше',
    description: 'Курица/говядина (170г), лаваш (110г), лук маринованный, соус сальса, чесночный соус.',
    price: 280,
    category: 'shashlyk',
    image: 'https://static.tildacdn.com/stor6436-6132-4632-b838-646464623363/87850627.jpg',
    available: true,
    weight: '390 гр'
  },
  {
    id: 'lk3',
    name: 'Люля (порция)',
    description: 'Рубленое мясо курица/говядина (170г), лаваш (30г), маринованный лук (15г).',
    price: 320,
    category: 'shashlyk',
    image: 'https://static.tildacdn.com/stor3138-3037-4537-b637-633130366562/82655646.jpg',
    available: true,
    weight: '215  гр'
  },
  {
    id: 'sk2',
    name: 'Шашлык курица/свинина',
    description: 'Сочное мясо курицы или свинины (200г) на углях, лаваш (30г), маринованный лук (15г).',
    price: 380,
    category: 'shashlyk',
    image: 'https://static.tildacdn.com/stor3965-3534-4432-a330-383562333063/95136693.jpg',
    badge: 'ХИТ',
    available: true,
    weight: '245 гр'
  },
  {
    id: 'dr1',
    name: 'Кола 0.5л',
    description: 'Классическая прохладительная газировка в бутылке.',
    price: 80,
    category: 'drinks',
    image: 'https://static.tildacdn.com/stor3565-3933-4330-b936-373163636565/61830253.webp',
    available: true,
    weight: '500 мл'
  },
  {
    id: 'cm1',
    name: 'Комбо "Сытый"',
    description: 'Комбо-набор: Шаурма Классика + Кола 0.5л. Идеальный выбор для плотного обеда с выгодой!',
    price: 320,
    category: 'combo',
    badge: 'ХИТ',
    image: '🍱',
    available: true,
    weight: '650 гр'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Все меню' },
  { id: 'shaurma', name: 'Шаурма' },
  { id: 'shashlyk', name: 'Шашлык' },
  { id: 'pita', name: 'Пита' },
  { id: 'hotdog', name: 'Хот-доги' },
  { id: 'drinks', name: 'Напитки' },
  { id: 'combo', name: 'Комбо' }
];

interface MenuSectionProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [activeTab, setActiveTab] = useState('all');

  const filteredItems = activeTab === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === activeTab);

  return (
    <section id="menu" className="pt-12 pb-24 bg-[#141414] text-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-brand-green text-[10px] font-black uppercase tracking-widest bg-brand-green/10 border border-brand-green/20 px-4 py-2 rounded-full">
            Наше меню
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
            🔥 ПОЗИЦИИ ДОСТУПНЫЕ ДЛЯ ДОСТАВКИ
          </h2>
          <p className="font-body text-zinc-400 text-sm sm:text-base">
            Только свежие ингредиенты и наши фирменные соусы. Вкус в каждом шаге!
          </p>
        </div>

        {/* Categories navigation */}
        <div className="flex overflow-x-auto pb-4 mb-12 -mx-4 px-4 scrollbar-hide justify-start md:justify-center gap-3">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap shrink-0 border cursor-pointer ${
                activeTab === category.id
                  ? 'bg-brand-green text-brand-dark border-brand-green shadow-lg shadow-brand-green/15 scale-105'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border-zinc-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-transparent border-0 flex flex-col group transition-all duration-300"
            >
              {/* Product Thumbnail wrapper */}
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative select-none mb-4 bg-zinc-900 border border-zinc-800/50 flex items-center justify-center shadow-lg">
                {item.image.startsWith('http') ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500 ease-out select-none drop-shadow-md">
                    {item.image}
                  </span>
                )}

                {/* Badge indicator */}
                {item.badge && (
                  <span className={`absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center shadow-md ${
                    item.badge === 'ХИТ'
                      ? 'bg-brand-yellow text-brand-dark'
                      : 'bg-primary-red text-white'
                  }`}>
                    {item.badge === 'ХИТ' ? (
                      <Flame className="w-3 h-3 mr-1 fill-brand-dark stroke-brand-dark" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Product body */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-brand-green uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="font-body text-zinc-400 text-xs sm:text-sm leading-relaxed font-medium">
                    {item.description}
                  </p>
                  {item.weight && (
                    <p className="font-body text-zinc-500 text-[11px] sm:text-xs font-semibold">
                      Общий вес: {item.weight}
                    </p>
                  )}
                </div>

                <div className="space-y-3 mt-4">
                  <span className="font-display font-black text-xl sm:text-2xl text-brand-green block">
                    {item.price} <span className="text-sm font-semibold">₽</span>
                  </span>
                  
                  <button
                    onClick={() => onAddToCart(item)}
                    className="w-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-brand-dark py-2.5 rounded-xl font-display text-[10px] font-black uppercase tracking-widest text-center cursor-pointer transition-all duration-300"
                    title="Добавить в корзину"
                  >
                    В КОРЗИНУ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
