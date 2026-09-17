'use client';

import React, { useState, useEffect } from 'react';
import { Crosshair, ShieldCheck, ChevronRight, Menu, X, Radio } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-atmos-dark/90 backdrop-blur-md border-b border-atmos-border shadow-card-glow py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logos & Branding (Transparent, High-Res) */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <img
            src="/images/logo-rfsoo.png"
            alt="РФСОО Федерация гонок дронов Ростовской области"
            className="h-10 sm:h-12 w-auto object-contain flex-shrink-0 hover:scale-105 transition-transform"
          />

          <div className="h-6 w-[1px] bg-white/20 hidden sm:block" />

          <img
            src="/images/logo-atmos.png"
            alt="АтмоС Академия пилотов"
            className="h-6 sm:h-8 w-auto object-contain hover:scale-105 transition-transform"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="#experience"
            className="text-sm text-atmos-muted hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>Что вас ждет</span>
          </a>
          <a
            href="#safety"
            className="text-sm text-atmos-muted hover:text-atmos-orange transition-colors flex items-center space-x-1"
          >
            <ShieldCheck className="w-4 h-4 text-atmos-orange" />
            <span>Сетка безопасности</span>
          </a>
          <a
            href="#booking"
            className="text-sm text-atmos-muted hover:text-white transition-colors"
          >
            Расписание слотов
          </a>
          <a
            href="#contacts"
            className="text-sm text-atmos-muted hover:text-white transition-colors"
          >
            Локация
          </a>
        </nav>

        {/* Right Status & Action */}
        <div className="hidden lg:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-atmos-surface border border-atmos-border text-xs text-atmos-muted">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-atmos-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-atmos-orange"></span>
            </span>
            <span>Ростов-на-Дону</span>
          </div>

          <button
            onClick={scrollToBooking}
            className="relative group px-5 py-2.5 rounded-lg bg-atmos-orange text-white font-semibold text-sm transition-all duration-200 hover:bg-atmos-orangeHover hover:shadow-neon-orange flex items-center space-x-2"
          >
            <span>Записаться</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={scrollToBooking}
            className="px-3 py-1.5 rounded-md bg-atmos-orange text-white text-xs font-semibold"
          >
            Запись
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-atmos-muted hover:text-white"
            aria-label="Меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-atmos-surface/95 border-b border-atmos-border px-4 py-4 space-y-3 backdrop-blur-lg">
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-atmos-muted hover:text-white py-1"
          >
            Что ждет участников
          </a>
          <a
            href="#safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-atmos-muted hover:text-white py-1"
          >
            Безопасность полетов
          </a>
          <a
            href="#booking"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-atmos-muted hover:text-white py-1"
          >
            Выбрать слот и записаться
          </a>
          <a
            href="#contacts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm text-atmos-muted hover:text-white py-1"
          >
            Контакты и место
          </a>
        </div>
      )}
    </header>
  );
};
