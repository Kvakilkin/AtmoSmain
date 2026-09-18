'use client';

import React, { useState } from 'react';
import { Crosshair, MapPin, Phone, Mail, Shield, ExternalLink } from 'lucide-react';
import { Consent152Modal, PrivacyPolicyModal } from './LegalModals';
import { BranchConfig, MAIN_BRANCH } from '@/lib/branches';

interface FooterProps {
  branchConfig?: BranchConfig;
}

export const Footer: React.FC<FooterProps> = ({ branchConfig = MAIN_BRANCH }) => {
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  return (
    <footer id="contacts" className="bg-atmos-surface border-t border-atmos-border relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-4">
              <img
                src="/images/logo-rfsoo.png"
                alt="РФСОО Федерация гонок дронов РО"
                className="h-12 w-auto object-contain flex-shrink-0"
              />
              <div className="h-8 w-[1px] bg-white/20" />
              <img
                src="/images/logo-atmos.png"
                alt="АтмоС Академия пилотов"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="text-sm text-atmos-muted max-w-md leading-relaxed">
              Совместный открытый мастер-класс компании пилотов «АтмоС» и Федерации гонок дронов Ростовской области. Развитие технологичного спорта, подготовка будущих пилотов и знакомство с передовыми беспилотными системами.
            </p>

            <div className="pt-2 text-xs text-atmos-subtle">
              Мероприятие проводится в соответствии с правилами Всероссийского реестра видов спорта РФ.
            </div>
          </div>

          {/* Location & Contacts */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Локация и контакты
            </h4>
            <ul className="space-y-2.5 text-sm text-atmos-muted">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-atmos-orange flex-shrink-0 mt-1" />
                <span>{branchConfig.address} ({branchConfig.name})</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-atmos-orange flex-shrink-0" />
                <a href={`tel:${branchConfig.phoneRaw}`} className="hover:text-white transition-colors">
                  {branchConfig.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-atmos-orange flex-shrink-0" />
                <span>info@atmos-drones.ru</span>
              </li>
            </ul>
          </div>

          {/* Legal and Admin links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Правовая информация
            </h4>
            <ul className="space-y-2 text-sm text-atmos-muted">
              <li>
                <button
                  type="button"
                  onClick={() => setIsConsentOpen(true)}
                  className="hover:text-atmos-orange transition-colors text-left"
                >
                  Согласие по 152-ФЗ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPolicyOpen(true)}
                  className="hover:text-atmos-orange transition-colors text-left"
                >
                  Политика конфиденциальности
                </button>
              </li>
              <li>
                <a
                  href="#safety"
                  className="hover:text-atmos-orange transition-colors"
                >
                  Регламент безопасности полетов
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-atmos-border/60 flex flex-col sm:flex-row items-center justify-between text-xs text-atmos-subtle gap-4">
          <div>
            © {new Date().getFullYear()} Компания «АтмоС» & Федерация гонок дронов Ростовской области. Все права защищены.
          </div>
          <div>
            Серверы и базы данных локализованы на территории Российской Федерации (152-ФЗ РФ)
          </div>
        </div>
      </div>

      <Consent152Modal isOpen={isConsentOpen} onClose={() => setIsConsentOpen(false)} />
      <PrivacyPolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </footer>
  );
};
