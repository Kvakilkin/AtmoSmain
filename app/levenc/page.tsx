import React from 'react';
import { Header } from '@/components/Header';
import { DroneRaceCanvas } from '@/components/DroneRaceCanvas';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { SafetyBanner } from '@/components/SafetyBanner';
import { FaqSection } from '@/components/FaqSection';
import { SmartBookingEngine } from '@/components/SmartBookingEngine';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { LEVENC_BRANCH } from '@/lib/branches';

export const metadata = {
  title: 'Открытый набор пилотов дронов • «АтмоС» Ростов-на-Дону (ул. Маршала Жукова, 18)',
  description:
    'Инновационный спорт — гонки дронов! Новый полётный класс в Ростове-на-Дону для детей от 8 лет. Старт 15 октября 2026. Запись в 1 клик на ул. Маршала Жукова, 18.',
};

export default function LevencPage() {
  return (
    <main className="relative min-h-screen bg-atmos-dark selection:bg-atmos-orange selection:text-black">
      {/* Interactive 60 FPS Dual Racing Drones Canvas Scroll Animation */}
      <DroneRaceCanvas />

      {/* Navigation Bar */}
      <Header />

      {/* Hero Section with Levenc branch specifics */}
      <HeroSection branchConfig={LEVENC_BRANCH} />

      {/* Experience / Features Section */}
      <ExperienceSection />

      {/* Safety Regulations & Drone Net Banner (Mobile adapted: centered title, full-width text) */}
      <SafetyBanner />

      {/* Interactive Booking Module for Levenc branch */}
      <SmartBookingEngine branchConfig={LEVENC_BRANCH} />

      {/* Interactive FAQ Section with 11 questions & answers */}
      {LEVENC_BRANCH.faqs && (
        <FaqSection
          items={LEVENC_BRANCH.faqs}
          phone={LEVENC_BRANCH.phone}
          phoneRaw={LEVENC_BRANCH.phoneRaw}
          noticeText={LEVENC_BRANCH.noticeText}
        />
      )}

      {/* Footer with Levenc branch address & phone */}
      <Footer branchConfig={LEVENC_BRANCH} />

      {/* Cookie Notification Banner (152-FZ Compliant) */}
      <CookieBanner />
    </main>
  );
}
