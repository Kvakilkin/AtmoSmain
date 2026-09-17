'use client';

import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Consent152Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-atmos-surface border border-atmos-orange/50 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-atmos-border">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-atmos-orange" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Согласие на обработку персональных данных
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-atmos-muted hover:text-white hover:bg-atmos-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm text-atmos-muted leading-relaxed">
          <p>
            В соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных», настоящим я свободно, своей волей и в своем интересе даю согласие Организаторам открытого мастер-класса (Компания пилотов «АтмоС» и РОФСОО «Федерация гонок дронов Ростовской области», далее — «Оператор») на обработку моих персональных данных.
          </p>

          <h4 className="font-semibold text-white">1. Перечень обрабатываемых персональных данных:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Фамилия, имя, отчество (ФИО);</li>
            <li>Контактный номер телефона;</li>
            <li>Возраст (полных лет);</li>
            <li>Сведения об участии в мастер-классе и выбранном временном слоте.</li>
          </ul>

          <h4 className="font-semibold text-white">2. Цели обработки персональных данных:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Регистрация и учет участников открытого мастер-класса по гонкам дронов;</li>
            <li>Обеспечение контроля предельной вместимости слотов (до 10 участников до 14:00 и до 5 участников после 14:00);</li>
            <li>Информирование о времени, месте проведения и регламенте безопасности;</li>
            <li>Обеспечение мер безопасности при нахождении в зоне полетов.</li>
          </ul>

          <h4 className="font-semibold text-white">3. Действия с персональными данными:</h4>
          <p>
            Оператор осуществляет следующие действия: сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, обезличивание, блокирование, удаление, уничтожение персональных данных с использованием средств автоматизации. Базы данных размещены исключительно на серверах на территории Российской Федерации.
          </p>

          <h4 className="font-semibold text-white">4. Срок действия и отзыв согласия:</h4>
          <p>
            Настоящее согласие действует с момента отправки электронной заявки до достижения целей обработки или до момента отзыва согласия. Согласие может быть отозвано субъектом персональных данных путем направления письменного заявления на электронную почту Организатора.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-atmos-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-atmos-orange text-white font-medium text-sm hover:bg-atmos-orangeHover transition-colors"
          >
            Понятно и согласен
          </button>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-atmos-surface border border-atmos-border rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-atmos-border">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-atmos-orange" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Политика конфиденциальности
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-atmos-muted hover:text-white hover:bg-atmos-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-sm text-atmos-muted leading-relaxed">
          <p>
            Настоящая Политика конфиденциальности персональных данных (далее — Политика) действует в отношении всей информации, которую сайт открытого мастер-класса «АтмоС & Федерация гонок дронов РО» может получить о Пользователе во время использования сайта.
          </p>

          <h4 className="font-semibold text-white">1. Общие положения</h4>
          <p>
            1.1. Использование сервисов сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки его персональной информации.
            <br />
            1.2. В случае несогласия с этими условиями Пользователь должен воздержаться от использования сайта.
          </p>

          <h4 className="font-semibold text-white">2. Защита информации и безопасность</h4>
          <p>
            2.1. Оператор принимает необходимые организационные и технические меры для защиты персональной информации Пользователя от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования, распространения.
            <br />
            2.2. Серверная инфраструктура сайта использует шифрование HTTPS, параметризованные запросы к базе данных для исключения инъекций и размещена в центрах обработки данных на территории Российской Федерации.
          </p>

          <h4 className="font-semibold text-white">3. Использование файлов Cookie</h4>
          <p>
            3.1. Сайт использует технические cookie-файлы для обеспечения корректной работы сессий, предотвращения повторных отправок форм и защиты от ботов.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-atmos-border flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-atmos-card border border-atmos-border text-white font-medium text-sm hover:bg-atmos-cardHover transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
