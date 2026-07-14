'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Utensils, Users, BarChart3, Star, Settings, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Панель приборов', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Заказы', icon: ShoppingBag },
    { href: '/admin/menu', label: 'Меню', icon: Utensils },
    { href: '/admin/clients', label: 'Клиенты', icon: Users },
    { href: '/admin/analytics', label: 'Аналитика', icon: BarChart3 }
  ];

  return (
    <div className="w-64 bg-brand-dark text-white min-h-screen flex flex-col justify-between shrink-0 shadow-lg">
      <div className="flex flex-col flex-1">
        {/* Brand Banner */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <span className="font-display font-black text-lg tracking-wider text-white">
            EAT & GO <span className="text-brand-yellow">ADMIN</span>
          </span>
        </div>

        {/* Links */}
        <nav className="p-4 flex-1 space-y-1.5 pt-6">
          {links.map(link => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-primary-red text-white shadow-md shadow-red-950/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return options */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <Link
          href="/kassa"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 transition-all justify-center uppercase tracking-wider"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Касса (Live)</span>
        </Link>
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-white/40 hover:text-white transition-all justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться на сайт</span>
        </Link>
      </div>
    </div>
  );
}
