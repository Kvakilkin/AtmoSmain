'use client';

import React from 'react';
import { Shield, Zap, Users, Trophy, Flame, ChevronDown, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden tech-grid-bg">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-atmos-orange/20 via-atmos-orange/5 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center z-20">
        {/* Two Full-Sized Transparent Logos */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mb-6 sm:mb-8">
          {/* RFSOO Federation Logo */}
          <div className="flex items-center justify-center">
            <img
              src="/images/logo-rfsoo.png"
              alt="РФСОО Федерация гонок дронов Ростовской области"
              className="h-16 sm:h-24 md:h-28 w-auto object-contain drop-shadow-[0_0_25px_rgba(0,122,255,0.3)] hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Subtle glowing divider */}
          <div className="h-12 sm:h-16 w-[1px] bg-gradient-to-b from-transparent via-atmos-orange/50 to-transparent" />

          {/* Atmos Pilots Academy Logo */}
          <div className="flex items-center justify-center">
            <img
              src="/images/logo-atmos.png"
              alt="АТМОС Академия пилотов"
              className="h-10 sm:h-14 md:h-16 w-auto object-contain drop-shadow-[0_0_25px_rgba(255,85,0,0.35)] hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* H1 Main Heading - Short & Impactful */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-atmos-orange via-atmos-orangeBright to-white glow-text-orange">
            Стань пилотом гоночного дрона
          </span>
          <br />
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white/90">
            День открытых дверей в Ростове-на-Дону
          </span>
        </h1>

        {/* Subtitle - Short */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-atmos-muted leading-relaxed mb-8 font-normal">
          Открытый мастер-класс Академии пилотов «АТМОС» и Федерации гонок дронов. Бесплатный вход, экипировка выдается.
        </p>

        {/* Primary CTA and Secondary actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={scrollToBooking}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-atmos-orange to-red-600 text-white font-bold text-base shadow-neon-orange hover:shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-3 group"
          >
            <span>Записаться на мастер-класс</span>
            <Zap className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
          </button>

          <a
            href="#experience"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-atmos-surface border border-atmos-border hover:border-atmos-orange/50 text-atmos-muted hover:text-white font-medium text-sm transition-all duration-200"
          >
            Узнать подробнее
          </a>
        </div>

        {/* Branch Location & Yandex Maps Card */}
        <div className="max-w-4xl mx-auto mb-10 rounded-3xl bg-atmos-surface/90 border border-atmos-orange/30 p-4 sm:p-6 shadow-card-glow text-left backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-atmos-border/80">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-atmos-orange/15 border border-atmos-orange/40 flex items-center justify-center text-atmos-orange flex-shrink-0 shadow-neon-orange">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Дрон-арена «АТМОС» • Филиал «Центральный»
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/40">
                    Открыто для полетов
                  </span>
                </div>
                <p className="text-xs text-atmos-muted mt-0.5">
                  г. Ростов-на-Дону, Ворошиловский проспект, 32/104
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="https://yandex.ru/maps/-/CTxlu6lw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-atmos-card hover:bg-atmos-cardHover border border-atmos-border hover:border-atmos-orange/50 text-xs text-white font-medium transition-all group"
              >
                <span>Яндекс Карты</span>
                <ExternalLink className="w-3.5 h-3.5 text-atmos-orange group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Interactive Yandex Maps Embed */}
          <div className="relative w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden border border-atmos-border shadow-inner">
            <iframe
              src="https://yandex.ru/map-widget/v1/?ll=39.717867%2C47.225453&z=17&pt=39.717798,47.225475,pm2orgm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen={true}
              title="Яндекс Карта — Дрон-арена АТМОС, Ворошиловский проспект, 32/104"
              className="w-full h-full filter contrast-[1.05] brightness-[0.95]"
              loading="lazy"
            />
            {/* Overlay hint badge */}
            <div className="absolute bottom-2.5 left-2.5 bg-atmos-dark/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-atmos-border text-[11px] text-white flex items-center space-x-2 pointer-events-none shadow-lg">
              <span className="w-2 h-2 rounded-full bg-atmos-orange animate-ping" />
              <span className="font-medium">Ворошиловский проспект, 32/104</span>
            </div>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-atmos-card/80 border border-atmos-border/60 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
            <span className="text-sm font-semibold text-white">Бесплатный вход</span>
          </div>

          <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-atmos-card/80 border border-atmos-border/60 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
            <span className="text-sm font-semibold text-white">Экипировка выдается</span>
          </div>

          <div className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-atmos-card/80 border border-atmos-border/60 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
            <span className="text-sm font-semibold text-white">Ограниченное число слотов</span>
          </div>
        </div>

        {/* High-tech Specs Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-atmos-border/60 max-w-4xl mx-auto text-left">
          <div className="p-4 rounded-lg bg-atmos-surface/40">
            <div className="text-2xl font-black text-white">160+ км/ч</div>
            <div className="text-xs text-atmos-muted uppercase tracking-wider">Скорость дрона</div>
          </div>
          <div className="p-4 rounded-lg bg-atmos-surface/40">
            <div className="text-2xl font-black text-atmos-orange">15 мс</div>
            <div className="text-xs text-atmos-muted uppercase tracking-wider">Задержка видео FPV</div>
          </div>
          <div className="p-4 rounded-lg bg-atmos-surface/40">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-xs text-atmos-muted uppercase tracking-wider">Сетка безопасности</div>
          </div>
          <div className="p-4 rounded-lg bg-atmos-surface/40">
            <div className="text-2xl font-black text-atmos-cyan">10 / 5</div>
            <div className="text-xs text-atmos-muted uppercase tracking-wider">Лимит мест в слоте</div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-atmos-subtle animate-bounce hidden sm:block">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
};
