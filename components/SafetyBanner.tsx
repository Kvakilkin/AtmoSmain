'use client';

import React from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <section id="safety" className="py-16 bg-atmos-dark border-y border-atmos-border relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-atmos-card via-[#1c1c22] to-atmos-card border border-atmos-orange/30 p-8 sm:p-12 shadow-card-glow overflow-hidden">
          {/* Neon accent bar */}
          <div className="absolute top-0 left-0 bottom-0 w-2 bg-atmos-orange shadow-neon-orange" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-atmos-orange/10 border border-atmos-orange/40 text-atmos-orange text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Профессиональный уровень подготовки</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Официальный спорт и высшие стандарты подготовки
              </h3>

              <p className="text-atmos-muted text-base sm:text-lg leading-relaxed mb-6 font-medium">
                Полеты проходят на лучшей трассе Юга России под чутким руководством опытных тренеров наставников с педагогическим и тренерским образованием
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-white">
                <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-atmos-surface/60 border border-atmos-border">
                  <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span className="font-semibold">Стандарты Минспорта</span>
                </div>
                <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-atmos-surface/60 border border-atmos-border">
                  <CheckCircle2 className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span className="font-semibold">Соблюдение правил вида спорта</span>
                </div>
              </div>
            </div>

            {/* Visual badge */}
            <div className="flex-shrink-0 w-full lg:w-auto p-6 rounded-2xl bg-atmos-surface border border-atmos-border text-center flex flex-col items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-atmos-orange/10 border border-atmos-orange/50 flex items-center justify-center text-atmos-orange mb-3 shadow-neon-orange">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Стандарты Минспорта
              </div>
              <div className="text-xs text-atmos-muted mt-1">
                Соблюдение правил вида спорта
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
