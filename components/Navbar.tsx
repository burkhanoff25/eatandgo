'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut, Shield } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  user: any;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function Navbar({ cartCount, user, onLogout, onOpenLogin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-brand-dark/85 backdrop-blur-lg shadow-2xl py-3 border-b border-white/5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="font-display font-black text-2xl tracking-widest text-white group-hover:scale-105 transition-transform duration-300">
                EAT <span className="text-brand-yellow font-light group-hover:text-primary-red transition-colors duration-300">&</span> GO
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { href: '#hero', label: 'Главная' },
                { href: '#menu', label: 'Меню' },
                { href: '#reviews', label: 'Отзывы' },
                { href: '#map', label: 'Контакты' }
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-brand-yellow px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/5"
                >
                  {item.label}
                </a>
              ))}
              <span className="h-4 w-px bg-white/10 mx-2"></span>
              <Link href="/kassa" className="text-white/60 hover:text-brand-yellow px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center space-x-1.5 hover:bg-white/5">
                <Shield className="w-3.5 h-3.5 text-brand-yellow" />
                <span>Касса</span>
              </Link>
            </nav>

            {/* Right side actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3 bg-white/5 border border-white/5 pl-3 pr-2 py-1.5 rounded-2xl">
                  <Link
                    href="/profile"
                    className="flex items-center space-x-2 text-white hover:text-brand-yellow transition-colors font-semibold text-xs tracking-wide uppercase"
                  >
                    <User className="w-4 h-4 text-brand-yellow" />
                    <span className="max-w-[120px] truncate">{user.name || 'Профиль'}</span>
                  </Link>
                  <span className="h-3 w-px bg-white/10"></span>
                  <button
                    onClick={onLogout}
                    title="Выйти"
                    className="text-white/50 hover:text-primary-red transition-colors p-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenLogin}
                  className="bg-primary-red hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-full transition-all duration-300 flex items-center space-x-2 text-xs tracking-wider uppercase shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Войти</span>
                </button>
              )}

              {/* Cart Button */}
              <Link
                href="/cart"
                className="relative bg-white/5 hover:bg-white/10 p-3 rounded-full transition-all text-white border border-white/15 shadow-inner hover:scale-105"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark font-black text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-brand-dark animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center space-x-3">
              {/* Cart for mobile header */}
              <Link
                href="/cart"
                className="relative bg-white/5 p-2.5 rounded-full text-white border border-white/10"
              >
                <ShoppingCart className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-dark font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="text-white hover:text-brand-yellow p-2 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-all duration-500 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 bottom-0 w-72 bg-brand-dark/95 border-l border-white/5 p-8 flex flex-col justify-between transform transition-all duration-500 ease-out ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center justify-between mb-10">
              <span className="font-display font-black text-xl text-white tracking-widest">
                НАВИГАЦИЯ
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-3">
              {[
                { href: '#hero', label: 'Главная' },
                { href: '#menu', label: 'Меню' },
                { href: '#reviews', label: 'Отзывы' },
                { href: '#map', label: 'Контакты' }
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-300 hover:text-brand-yellow hover:bg-white/5 px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all"
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-white/5 my-2" />
              <Link
                href="/kassa"
                onClick={() => setMobileOpen(false)}
                className="text-white/55 hover:text-brand-yellow hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider flex items-center space-x-2"
              >
                <Shield className="w-4 h-4 text-brand-yellow" />
                <span>Касса (Admin)</span>
              </Link>
            </nav>
          </div>

          <div>
            {user ? (
              <div className="space-y-4">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center space-x-3 text-white bg-white/5 border border-white/5 p-4 rounded-2xl hover:bg-white/10 transition-all shadow-inner"
                >
                  <User className="w-5 h-5 text-brand-yellow shrink-0" />
                  <span className="font-bold text-xs uppercase tracking-wide truncate">{user.name || 'Профиль'}</span>
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-center text-white/40 hover:text-primary-red transition-colors text-xs font-bold uppercase tracking-wider py-2"
                >
                  Выйти из аккаунта
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileOpen(false);
                }}
                className="w-full bg-primary-red hover:bg-red-650 text-white font-bold p-4 rounded-2xl transition-all text-center text-xs tracking-wider uppercase shadow-lg shadow-red-500/10 cursor-pointer"
              >
                Войти в аккаунт
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
