'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, UserCheck, Lock } from 'lucide-react';

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
                <ShieldAlert className="w-4 h-4" />
                <span>Стандарты безопасности полетов</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Безопасность полетов гарантирована на 100%
              </h3>

              <p className="text-atmos-muted text-base leading-relaxed mb-6 font-medium">
                Полеты проводятся в <strong className="text-white">специализированной сетке безопасности</strong> под строгим контролем сертифицированных инструкторов Федерации гонок дронов.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-atmos-muted">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span>Ударопрочная барьерная сетка</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <UserCheck className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span>Режим дублирующего пульта (Тренер-Ученик)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Lock className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span>Электронный Kill-switch на каждом дроне</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-atmos-orange flex-shrink-0" />
                  <span>Сертифицированные пилоты РО</span>
                </div>
              </div>
            </div>

            {/* Visual badge */}
            <div className="flex-shrink-0 w-full lg:w-auto p-6 rounded-2xl bg-atmos-surface border border-atmos-border text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-atmos-orange/10 border border-atmos-orange/50 flex items-center justify-center text-atmos-orange mb-3 shadow-neon-orange">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="text-sm font-bold text-white uppercase tracking-wider">
                Регламент Минспорта РФ
              </div>
              <div className="text-xs text-atmos-muted mt-1">
                Соблюдение правил FPV-рейсинга
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
