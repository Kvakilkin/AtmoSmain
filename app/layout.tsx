import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'День открытых дверей: FPV Дроны | Федерация гонок дронов & Пилоты АтмоС',
  description: 'Попробуй себя в роли FPV-пилота в Ростове-на-Дону. Бесплатный мастер-класс от Федерации гонок дронов Ростовской области и компании «АтмоС». Официальный спорт, профессиональные симуляторы и реальные полеты на лучшей трассе Юга России.',
  keywords: [
    'гонки дронов',
    'FPV дрон рейсинг',
    'Ростов-на-Дону',
    'Федерация гонок дронов',
    'АтмоС',
    'мастер-класс по дронам',
    'день открытых дверей',
    'беспилотники',
  ],
  authors: [{ name: 'Федерация гонок дронов РО & АтмоС' }],
  openGraph: {
    title: 'День открытых дверей: Стань пилотом гоночного дрона в Ростове-на-Дону',
    description: 'Мастер-класс от Федерации гонок дронов Ростовской области и пилотов компании «АтмоС». Бесплатное участие, выдача экипировки.',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body className="min-h-screen bg-atmos-dark text-white selection:bg-atmos-orange selection:text-black">
        {children}
      </body>
    </html>
  );
}
