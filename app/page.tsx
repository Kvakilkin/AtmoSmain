import React from 'react';
import { Header } from '@/components/Header';
import { DroneRaceCanvas } from '@/components/DroneRaceCanvas';
import { HeroSection } from '@/components/HeroSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { SafetyBanner } from '@/components/SafetyBanner';
import { SmartBookingEngine } from '@/components/SmartBookingEngine';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { MAIN_BRANCH } from '@/lib/branches';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-atmos-dark selection:bg-atmos-orange selection:text-black">
      {/* Interactive 60 FPS Dual Racing Drones Canvas Scroll Animation */}
      <DroneRaceCanvas />

      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <HeroSection branchConfig={MAIN_BRANCH} />

      {/* Experience / Features Section */}
      <ExperienceSection />

      {/* Safety Regulations & Drone Net Banner */}
      <SafetyBanner />

      {/* Interactive Booking Module */}
      <SmartBookingEngine branchConfig={MAIN_BRANCH} />

      {/* Footer */}
      <Footer branchConfig={MAIN_BRANCH} />

      {/* Cookie Notification Banner (152-FZ Compliant) */}
      <CookieBanner />
    </main>
  );
}
