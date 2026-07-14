'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, ParkingCircle, ShoppingBag, Truck } from 'lucide-react';

export default function MapSection() {
  const [mapType, setMapType] = useState<'yandex' | '2gis'>('yandex');

  // Coords for Sysert: 56.506980 N, 60.816223 E
  const lat = 56.506980;
  const lon = 60.816223;

  // Embedded map URLs
  const yandexEmbedUrl = `https://yandex.ru/map-widget/v1/?text=Сысерть%20улица%20Коммуны%2038&z=16`;
  const doubleGisEmbedUrl = `https://maps.google.com/maps?q=Сысерть%20улица%20Коммуны%2038&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  const routeUrl = `https://yandex.ru/maps/?rtext=~${lat}%2C${lon}`;

  return (
    <section id="map" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark mb-4 uppercase tracking-tight">
            📍 Где мы находимся
          </h2>
          <p className="font-body text-gray-600 text-base sm:text-lg">
            Ждем вас в гости круглосуточно. Постройте маршрут или свяжитесь с нами для заказа.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Map Area */}
          <div className="lg:col-span-2 flex flex-col h-[550px] bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
            {/* Header controls for map type */}
            <div className="bg-brand-dark p-4 flex items-center justify-between">
              <span className="text-white font-display font-bold text-sm tracking-wide flex items-center">
                <MapPin className="w-4 h-4 text-brand-yellow mr-2 animate-bounce" />
                Интерактивная карта
              </span>
              <div className="bg-white/10 p-1 rounded-full flex items-center border border-white/10">
                <button
                  onClick={() => setMapType('yandex')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mapType === 'yandex'
                      ? 'bg-primary-red text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Яндекс.Карты
                </button>
                <button
                  onClick={() => setMapType('2gis')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    mapType === '2gis'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  2GIS
                </button>
              </div>
            </div>

            {/* Map Frame Container */}
            <div className="flex-1 w-full relative">
              {mapType === 'yandex' ? (
                <iframe
                  src={yandexEmbedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full grayscale-[10%] contrast-[110%]"
                  title="Yandex Maps Eat & Go Sysert"
                ></iframe>
              ) : (
                <iframe
                  src={doubleGisEmbedUrl}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                  title="Google/2GIS Map Fallback"
                ></iframe>
              )}
            </div>
          </div>

          {/* Info Card Panel */}
          <div className="bg-brand-dark rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl border border-white/5 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary-red/10 rounded-full blur-2xl"></div>

            <div className="space-y-6">
              <div>
                <span className="bg-primary-red text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                  Кафе фастфуда
                </span>
                <h3 className="font-display font-black text-3xl text-white mt-3 tracking-wide">
                  EAT & GO
                </h3>
                <div className="flex items-center space-x-1 mt-2 text-brand-yellow">
                  <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                  <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                  <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                  <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                  <Star className="w-4 h-4 fill-brand-yellow stroke-brand-yellow" />
                  <span className="text-white/80 text-xs font-semibold ml-2">4.8 (500+ отзывов)</span>
                </div>
              </div>

              <hr className="border-white/10" />

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Адрес</p>
                    <p className="text-sm font-semibold text-white/90">г. Сысерть, ул. Коммуны, 38</p>
                  </div>
                </div>

                {/* Work hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Часы работы</p>
                    <p className="text-sm font-semibold text-white/90">Круглосуточно (24/7)</p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Телефон</p>
                    <a href="tel:+79920156060" className="text-sm font-semibold text-white hover:text-brand-yellow transition-colors">
                      +7 (992) 015-60-60
                    </a>
                  </div>
                </div>
              </div>

              <hr className="border-white/10" />

              {/* Badges / Features list */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center space-x-2">
                  <ParkingCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold">Парковка ✅</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-bold">Самовывоз ✅</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-3 col-span-2 rounded-2xl flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold">Доставка</span>
                  </span>
                  <span className="bg-amber-500/20 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Скоро 🔜
                  </span>
                </div>
              </div>
            </div>

            {/* Build Route CTA */}
            <div className="mt-8 space-y-3">
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-red hover:bg-red-750 text-white font-bold py-4 px-6 rounded-2xl text-center flex items-center justify-center space-x-2 shadow-lg transition-all text-sm uppercase tracking-wider"
              >
                <Navigation className="w-5 h-5 fill-white" />
                <span>Построить маршрут</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://yandex.ru/maps/?text=Сысерть%20Коммуны%2038%20Eat%20%26%20Go`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-center text-[10px] border border-white/10 transition-all flex items-center justify-center uppercase tracking-wide cursor-pointer"
                >
                  🌐 Яндекс.Карты
                </a>
                <a
                  href={`https://2gis.ru/search/Сысерть%20Коммуны%2038%20Eat%20%26%20Go`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-center text-[10px] border border-white/10 transition-all flex items-center justify-center uppercase tracking-wide cursor-pointer"
                >
                  💚 2GIS
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
