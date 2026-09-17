'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const accepted = localStorage.getItem('atmos_cookie_accepted');
    if (!accepted) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('atmos_cookie_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Уведомление о файлах cookie"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-4 rounded-2xl bg-atmos-surface/95 border border-atmos-orange/40 shadow-2xl backdrop-blur-md text-left animate-slideUp"
    >
      <div className="flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-atmos-orange/10 text-atmos-orange flex-shrink-0 mt-0.5">
          <Cookie className="w-5 h-5" />
        </div>

        <div className="flex-1 text-xs text-atmos-muted leading-relaxed">
          <p>
            Мы используем файлы cookie и аналогичные технологии для обеспечения корректной работы сайта и безопасности в соответствии с законодательством РФ и Федеральным законом № 152-ФЗ.
          </p>

          <div className="mt-3 flex items-center justify-end space-x-2">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-lg bg-atmos-orange text-white font-semibold text-xs hover:bg-atmos-orangeHover shadow-neon-orange transition-all flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Принять и закрыть</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
