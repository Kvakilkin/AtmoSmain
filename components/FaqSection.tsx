'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Phone,
  Ticket,
  Trophy,
  Shield,
  Award,
  Bus,
  Brain,
  GraduationCap,
  ClipboardCheck,
  Users,
  Handshake,
  Zap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { FaqItem } from '@/lib/branches';

interface FaqSectionProps {
  items: FaqItem[];
  phone?: string;
  phoneRaw?: string;
  noticeText?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ticket: Ticket,
  trophy: Trophy,
  shield: Shield,
  award: Award,
  bus: Bus,
  brain: Brain,
  graduation: GraduationCap,
  clipboard: ClipboardCheck,
  users: Users,
  handshake: Handshake,
  zap: Zap,
};

export const FaqSection: React.FC<FaqSectionProps> = ({
  items,
  phone = '8 909 403 44 83',
  phoneRaw = '+79094034483',
  noticeText = '✨ Пробные только в полетной зоне на ул. Пушкинской',
}) => {
  // First item open by default
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-atmos-dark border-t border-atmos-border relative tech-grid-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-atmos-card border border-atmos-orange/30 text-atmos-orange text-xs font-bold uppercase tracking-wider mb-4 shadow-neon-orange">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Часто задаваемые вопросы</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Всё, что важно знать родителям и будущим чемпионам
          </h2>
          <p className="text-atmos-muted text-sm sm:text-base">
            Ответы на ключевые вопросы о тренировках, официальных разрядах и будущем в спорте FPV-дронов.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 sm:space-y-4 mb-12">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const IconComponent = (item.icon && iconMap[item.icon]) ? iconMap[item.icon] : HelpCircle;

            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-atmos-card border-atmos-orange/50 shadow-card-glow'
                    : 'bg-atmos-surface/80 border-atmos-border hover:border-atmos-orange/30'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className="w-full px-5 py-4 sm:px-6 sm:py-5 text-left flex items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isOpen
                          ? 'bg-atmos-orange/20 text-atmos-orange border border-atmos-orange/40 shadow-neon-orange'
                          : 'bg-atmos-card border border-atmos-border text-atmos-muted'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-white leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border transition-transform duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-atmos-orange text-white border-atmos-orange'
                        : 'bg-atmos-dark border-atmos-border text-atmos-muted'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-sm text-atmos-muted leading-relaxed border-t border-atmos-border/40 animate-fadeIn">
                    <p className="text-white/90 font-medium pl-12 sm:pl-12">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Special Notice Banner */}
        {noticeText && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-atmos-card/90 border border-atmos-orange/40 flex items-center space-x-3 shadow-neon-orange/20">
            <Sparkles className="w-5 h-5 text-atmos-orange flex-shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {noticeText}
            </span>
          </div>
        )}

        {/* Consultation & CTA Callout Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-atmos-card via-[#1e1e24] to-atmos-card border-2 border-atmos-orange/40 shadow-card-glow flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="text-xs uppercase font-bold text-atmos-orange tracking-wider">
              Остались вопросы? Мы на связи!
            </div>
            <div className="text-lg sm:text-xl font-black text-white">
              Телефон для консультации
            </div>
            <a
              href={`tel:${phoneRaw}`}
              className="inline-flex items-center space-x-2 text-atmos-orange hover:text-atmos-orangeBright font-black text-lg sm:text-xl transition-colors mt-1"
            >
              <Phone className="w-5 h-5" />
              <span>{phone}</span>
            </a>
          </div>

          <button
            onClick={scrollToBooking}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-atmos-orange to-red-600 hover:from-atmos-orangeHover hover:to-red-500 text-white font-black text-sm shadow-neon-orange hover:scale-105 active:scale-95 transition-all flex items-center justify-center space-x-2 group"
          >
            <span>Запись в 1 клик</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
