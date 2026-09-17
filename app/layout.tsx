import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'День открытых дверей: FPV Дроны | Федерация гонок дронов & Пилоты АТМОС',
  description: 'Попробуй себя в роли FPV-пилота в Ростове-на-Дону. Бесплатный мастер-класс от Федерации гонок дронов Ростовской области и компании «Атмос». Официальный спорт, профессиональные симуляторы и реальные полеты в защитной сетке.',
  keywords: [
    'гонки дронов',
    'FPV дрон рейсинг',
    'Ростов-на-Дону',
    'Федерация гонок дронов',
    'Атмос',
    'мастер-класс по дронам',
    'день открытых дверей',
    'беспилотники',
  ],
  authors: [{ name: 'Федерация гонок дронов РО & АТМОС' }],
  openGraph: {
    title: 'День открытых дверей: Стань пилотом гоночного дрона в Ростове-на-Дону',
    description: 'Мастер-класс от Федерации гонок дронов Ростовской области и пилотов компании «Атмос». Бесплатное участие, выдача экипировки.',
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
