'use client';

import React from 'react';
import { Eye, Cpu, Camera, Award, Sparkles } from 'lucide-react';

interface ExperienceItem {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  stats: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'fpv-flight',
    step: '01',
    title: 'Почувствуй скорость FPV',
    description:
      'Надевай профессиональный цифровой видеошлем, бери в руки аппаратуру управления и соверши свой первый полет на гоночном дроне в связке с опытным инструктором в режиме «Тренер-Ученик».',
    icon: Eye,
    tag: 'Пилотирование',
    stats: 'Цифровой FPV шлем HD',
  },
  {
    id: 'civil-tech',
    step: '02',
    title: 'Мирные беспилотные технологии',
    description:
      'Узнай, как дроны спасают жизни в поисковых операциях, мониторят стратегические объекты, картографируют местность, строят города и почему сертифицированные пилоты востребованы во всех отраслях экономики.',
    icon: Cpu,
    tag: 'Карьера и Будущее',
    stats: 'Топ-3 профессий будущего',
  },
  {
    id: 'photoshoot',
    step: '03',
    title: 'Фото с топ-пилотами на высоте птичьего полета',
    description:
      'В самом сердце дрон-спорта и в центре Ростова-на-Дону. Эксклюзивная фотозона, боевые болиды с чемпионатов России и кадры с воздуха от чемпионов области на память каждому гостю.',
    icon: Camera,
    tag: 'Медиазона',
    stats: 'Кадры 4K с дрона',
  },
  {
    id: 'federation-history',
    step: '04',
    title: 'История дрон-спорта на Дону',
    description:
      'Как зарождалось движение на Ростовской земле, наши кубки, победы на всероссийских этапах и путь FPV-гонок в официальный Всероссийский реестр видов спорта. Узнай, как получить спортивный разряд.',
    icon: Award,
    tag: 'Официальный спорт',
    stats: 'Спортивные разряды РФ',
  },
];

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-24 bg-atmos-surface/40 tech-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-atmos-card border border-atmos-orange/30 text-atmos-orange text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Программа дня открытых дверей</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Что ждет каждого участника
          </h2>
          <p className="text-atmos-muted text-base sm:text-lg">
            Полное погружение в атмосферу скорости, инженерии и спортивного азарта. Мероприятие подходит для новичков и энтузиастов любого возраста.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                className="group relative rounded-2xl bg-atmos-card/90 border border-atmos-border hover:border-atmos-orange/80 p-4 sm:p-8 transition-all duration-300 hover:shadow-card-glow hover:-translate-y-1 backdrop-blur-sm overflow-hidden"
              >
                {/* Neon top-border light sweep on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-atmos-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-start justify-between mb-5 sm:mb-6">
                  {/* Icon with glowing background */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-atmos-surface border border-atmos-border group-hover:border-atmos-orange/50 flex items-center justify-center text-atmos-orange group-hover:scale-110 group-hover:shadow-neon-orange transition-all duration-300">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>

                  {/* Step and tag badge */}
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-xs font-bold text-atmos-subtle group-hover:text-atmos-orange transition-colors">
                      {item.step}
                    </span>
                    <span className="mt-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-atmos-surface text-atmos-muted border border-atmos-border">
                      {item.tag}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-atmos-orange transition-colors text-center sm:text-left w-full">
                  {item.title}
                </h3>

                <p className="text-atmos-muted text-sm sm:text-base leading-relaxed mb-6 w-full text-justify sm:text-left [text-justify:inter-word]">
                  {item.description}
                </p>

                {/* Card footer info */}
                <div className="pt-4 border-t border-atmos-border/60 flex items-center justify-between text-xs text-atmos-subtle">
                  <span className="font-mono">{item.stats}</span>
                  <span className="text-atmos-orange opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 font-medium">
                    <span>Подробнее на месте →</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
