export interface FaqItem {
  question: string;
  answer: string;
  icon?: string;
}

export interface BranchConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  address: string;
  mapLink: string;
  mapWidgetUrl: string;
  phone: string;
  phoneRaw: string;
  badgeTop: string;
  titleGradient: string;
  titleMain: string;
  subtitle: string;
  statusBadge: string;
  featurePills: string[];
  noticeText?: string;
  bookingNote?: string;
  faqs?: FaqItem[];
}

export const MAIN_BRANCH: BranchConfig = {
  id: 'main',
  slug: '',
  name: 'Дрон-арена «АтмоС» • Филиал «Центральный»',
  shortName: 'Центральный (Ворошиловский)',
  address: 'г. Ростов-на-Дону, Ворошиловский проспект, 32/104',
  mapLink: 'https://yandex.ru/maps/-/CTxlu6lw',
  mapWidgetUrl: 'https://yandex.ru/map-widget/v1/?ll=39.717867%2C47.225453&z=17&pt=39.717798,47.225475,pm2orgm',
  phone: '+7 (863) 200-55-11',
  phoneRaw: '+78632005511',
  badgeTop: 'Профессиональный уровень подготовки',
  titleGradient: 'Стань пилотом гоночного дрона',
  titleMain: 'День открытых дверей в Ростове-на-Дону',
  subtitle: 'Открытый мастер-класс Академии пилотов «АтмоС» и Федерации гонок дронов. Бесплатный вход, экипировка выдается.',
  statusBadge: 'Открыто для полетов',
  featurePills: [
    'Бесплатный вход',
    'Экипировка выдается',
    'Сертифицированные тренеры',
  ],
};

export const LEVENC_BRANCH: BranchConfig = {
  id: 'levenc',
  slug: 'levenc',
  name: 'Дрон-арена «АтмоС» • Филиал «Левенцовский»',
  shortName: 'Левенцовский (Жукова, 18)',
  address: 'г. Ростов-на-Дону, ул. Маршала Жукова, 18',
  mapLink: 'https://yandex.ru/maps/39/rostov-na-donu/house/ulitsa_marshala_zhukova_18/Z0AYdAZhT0IEQFptfXp0cX5kYg==/',
  mapWidgetUrl: 'https://yandex.ru/map-widget/v1/?text=%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C+%D1%83%D0%BB%D0%B8%D1%86%D0%B0+%D0%9C%D0%B0%D1%80%D1%88%D0%B0%D0%BB%D0%B0+%D0%96%D1%83%D0%BA%D0%BE%D0%B2%D0%B0%2C+18&z=17',
  phone: '8 909 403 44 83',
  phoneRaw: '+79094034483',
  badgeTop: '🚀 Открытый набор! СТАРТ 15 октября 2026!',
  titleGradient: 'Инновационный СПОРТ — Гонки дронов!',
  titleMain: 'Новый полётный класс • Возраст 8+',
  subtitle: 'Учим формировать собственную матрицу успеха на примере гонок дронов. FPV-гонки развивают уверенность, работу в команде и скорость решений. Решаем вопрос гаджетозависимости.',
  statusBadge: 'Старт 15 октября 2026',
  featurePills: [
    'Возраст 8+',
    'Запись в 1 клик',
    'Официальный спорт РФ',
  ],
  noticeText: '✨ Пробные только в полетной зоне на ул. Пушкинской',
  bookingNote: 'Любой из дней со вторника по субботу (запись заранее по предоплате)',
  faqs: [
    {
      question: 'Есть ли абонемент на месяц?',
      answer: 'Да, в Академии пилотов «АтмоС» действует удобная система месячных абонементов для регулярных тренировок.',
      icon: 'ticket',
    },
    {
      question: 'Как быстро попадаем на соревнования?',
      answer: 'Ученики выходят на первые соревновательные старты уже через 3 месяца системных тренировок.',
      icon: 'trophy',
    },
    {
      question: 'Это официальный вид спорта?',
      answer: 'Да. Гонки дронов официально внесены во Всероссийский реестр видов спорта Министерства спорта РФ.',
      icon: 'shield',
    },
    {
      question: 'Присваиваются спортивные разряды?',
      answer: 'Да. При успешном участии в официальных соревнованиях пилоты получают официальные спортивные разряды РФ.',
      icon: 'award',
    },
    {
      question: 'Есть ли выездные соревнования?',
      answer: 'Да, сборная команда регулярно выезжает на региональные и всероссийские этапы и чемпионаты.',
      icon: 'bus',
    },
    {
      question: 'Какая польза для ребенка?',
      answer: 'FPV-гонки развивают уверенность, умение работать в команде, мелкую моторику, скорость реакции и скорость принятия решений в стрессовых ситуациях.',
      icon: 'brain',
    },
    {
      question: 'Дает ли этот спорт дополнительные баллы к ЕГЭ?',
      answer: 'Да, спортивные достижения и профильные победы учитываются при поступлении в ведущие технические вузы страны.',
      icon: 'graduation',
    },
    {
      question: 'Как проходит зачисление?',
      answer: 'Зачисление происходит после прохождения первого мастер-класса и индивидуального определения тренировочных задач.',
      icon: 'clipboard',
    },
    {
      question: 'Кто тренеры и наставники?',
      answer: 'Опытные инструкторы-педагоги с педагогическим и тренерским образованием, спортивный психолог, увлеченная и любящая свое дело команда.',
      icon: 'users',
    },
    {
      question: 'С какими учебными заведениями вы сотрудничаете?',
      answer: 'Мы сотрудничаем с ведущими СПО и ВУЗами Ростовской области и России, открывая прямую дорогу в профессию будущего.',
      icon: 'handshake',
    },
    {
      question: 'Помогает ли это решить вопрос гаджетозависимости?',
      answer: 'Безусловно. Мы перенаправляем экранное время ребенка из пассивного потребления контента в активный высокотехнологичный спорт, спорт высоких достижений и инженерию.',
      icon: 'zap',
    },
  ],
};

export const BRANCHES: Record<string, BranchConfig> = {
  main: MAIN_BRANCH,
  levenc: LEVENC_BRANCH,
};

export function getBranchConfig(slug?: string): BranchConfig {
  if (slug === 'levenc') return LEVENC_BRANCH;
  return MAIN_BRANCH;
}
