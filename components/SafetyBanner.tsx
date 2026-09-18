'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <section id="safety" className="py-12 sm:py-16 bg-atmos-dark border-y border-atmos-border relative">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-atmos-card via-[#1c1c22] to-atmos-card border border-atmos-orange/30 p-4 sm:p-12 pl-5 sm:pl-12 shadow-card-glow overflow-hidden">
          {/* Neon accent bar */}
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-atmos-orange shadow-neon-orange" />

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
            <div className="w-full lg:max-w-2xl">
              {/* Badge Centered on Mobile */}
              <div className="flex justify-center sm:justify-start mb-3 w-full">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-atmos-orange/10 border border-atmos-orange/40 text-atmos-orange text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  <span>Профессиональный уровень подготовки</span>
                </div>
              </div>

              {/* Title Strictly Centered on Mobile */}
              <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 text-center sm:text-left leading-snug w-full">
                Официальный спорт и высшие стандарты подготовки
              </h3>

              {/* Main text stretched across full width of card from edge to edge on mobile */}
              <p className="w-full text-atmos-muted text-sm sm:text-lg leading-relaxed mb-6 font-medium text-justify sm:text-left [text-justify:inter-word]">
                Полеты проходят на лучшей трассе Юга России под чутким руководством опытных тренеров наставников с педагогическим и тренерским образованием
              </p>

              {/* Sub-cards stretched edge to edge, centered on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-white w-full">
                <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 sm:p-3.5 rounded-xl bg-atmos-surface/60 border border-atmos-border w-full text-center sm:text-left">
                  <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">Стандарты Минспорта</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start space-x-3 p-3 sm:p-3.5 rounded-xl bg-atmos-surface/60 border border-atmos-border w-full text-center sm:text-left">
                  <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span className="font-semibold text-xs sm:text-sm">Соблюдение правил вида спорта</span>
                </div>
              </div>
            </div>

            {/* Visual badge card */}
            <div className="flex-shrink-0 w-full lg:w-auto p-5 sm:p-6 rounded-2xl bg-atmos-surface border border-atmos-border text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-atmos-orange/10 border border-atmos-orange/50 flex items-center justify-center text-atmos-orange mb-3 shadow-neon-orange">
                <Award className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="text-sm font-bold text-white uppercase tracking-wider text-center">
                Стандарты Минспорта
              </div>
              <div className="text-xs text-atmos-muted mt-1 text-center">
                Соблюдение правил вида спорта
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
