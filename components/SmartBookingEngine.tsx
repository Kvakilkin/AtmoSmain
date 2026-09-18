'use client';

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Lock,
  Sparkles,
  Ticket,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Flag,
} from 'lucide-react';
import { DEFAULT_SLOTS } from '@/lib/slots';
import { BranchConfig, MAIN_BRANCH } from '@/lib/branches';
import { Consent152Modal, PrivacyPolicyModal } from './LegalModals';

interface SlotStatus {
  slot: string;
  capacity: number;
  booked: number;
  available: number;
  isFull: boolean;
  isLow: boolean;
}

interface SmartBookingEngineProps {
  branchConfig?: BranchConfig;
}

const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

const WEEKDAY_NAMES_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function formatIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getInitialValidDate(today: Date): string {
  const d = new Date(today);
  const day = d.getDay();
  // Disallowed days: 0 (Sunday) and 1 (Monday).
  // Advance to nearest Tuesday if opened on Sunday or Monday
  if (day === 0) {
    d.setDate(d.getDate() + 2);
  } else if (day === 1) {
    d.setDate(d.getDate() + 1);
  }
  return formatIsoDate(d);
}

export const SmartBookingEngine: React.FC<SmartBookingEngineProps> = ({ branchConfig = MAIN_BRANCH }) => {
  // Today's date initialized
  const today = useMemo(() => new Date(), []);
  const todayMidnight = useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()), [today]);
  const initialDate = useMemo(() => getInitialValidDate(today), [today]);

  // Calendar State: Defaults to the exact valid date of the current opening day!
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [viewDate, setViewDate] = useState<Date>(() => {
    const d = new Date(initialDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Slot and form state
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [slotsState, setSlotsState] = useState<SlotStatus[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);

  // Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [consent152, setConsent152] = useState<boolean>(true);
  const [honeypot, setHoneypot] = useState<string>('');

  // UI state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    id: number;
    fullName: string;
    date: string;
    timeSlot: string;
    capacity: number;
  } | null>(null);

  // Legal Modals state
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Fetch slot availability from API for the selected date
  const fetchSlots = async (date: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/slots?date=${date}&branch=${branchConfig.id}`);
      if (res.ok) {
        const data = await res.json();
        setSlotsState(data.slots || []);
      } else {
        setSlotsState(
          DEFAULT_SLOTS.map((s) => ({
            slot: s.time,
            capacity: s.capacity,
            booked: 0,
            available: s.capacity,
            isFull: false,
            isLow: false,
          }))
        );
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
    setSelectedSlot('');
  }, [selectedDate, branchConfig.id]);

  // Phone input mask (+7 (999) 999-22-11)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    let formatted = '';

    if (rawDigits.length === 0) {
      setPhone('');
      return;
    }

    let clean = rawDigits;
    if (clean.startsWith('8')) clean = '7' + clean.slice(1);
    if (!clean.startsWith('7')) clean = '7' + clean;

    clean = clean.slice(0, 11);

    if (clean.length > 0) formatted = '+7';
    if (clean.length > 1) formatted += ' (' + clean.slice(1, 4);
    if (clean.length >= 4) formatted += ') ';
    if (clean.length > 4) formatted += clean.slice(4, 7);
    if (clean.length >= 7) formatted += '-' + clean.slice(7, 9);
    if (clean.length >= 9) formatted += '-' + clean.slice(9, 11);

    setPhone(formatted);
  };

  // Calendar Grid Generation (Mondays and Sundays are strictly disallowed)
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // First day of month (0 = Sunday, 1 = Monday, ...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // In Russia, week starts on Monday: Monday = 0, Sunday = 6
    const startOffset = (firstDayIndex + 6) % 7;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Empty prefix cells
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day);
      const isoString = formatIsoDate(dayDate);
      const isPast = dayDate < todayMidnight;
      const dayOfWeek = dayDate.getDay(); // 0 = Sunday, 1 = Monday
      const isDisallowed = dayOfWeek === 0 || dayOfWeek === 1;
      const isDisabled = isPast || isDisallowed;
      const isToday = isoString === formatIsoDate(today);
      const isSelected = isoString === selectedDate;

      days.push({
        day,
        isoString,
        isDisabled,
        isDisallowed,
        isToday,
        isSelected,
        dayOfWeek,
      });
    }

    return days;
  }, [viewDate, selectedDate, today, todayMidnight]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Validation Check: Button lights up only after all required fields are filled!
  const digitsOnly = phone.replace(/\D/g, '');
  const parsedAge = parseInt(age, 10);
  const isMinor = !isNaN(parsedAge) && parsedAge > 0 && parsedAge < 18;

  const isFormValid = useMemo(() => {
    return (
      selectedDate !== '' &&
      selectedSlot !== '' &&
      fullName.trim().length >= 3 &&
      digitsOnly.length === 11 &&
      !isNaN(parsedAge) &&
      parsedAge >= 7 &&
      parsedAge <= 99 &&
      consent152 === true
    );
  }, [selectedDate, selectedSlot, fullName, digitsOnly, parsedAge, consent152]);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isFormValid) {
      setErrorMessage('Пожалуйста, заполните все обязательные поля формы перед отправкой.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          age: parsedAge,
          date: selectedDate,
          timeSlot: selectedSlot,
          branch: branchConfig.id,
          consent152,
          website: honeypot,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || 'Произошла ошибка при бронировании.');
        fetchSlots(selectedDate);
      } else {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FF5500', '#FF8800', '#00E5FF', '#FFFFFF'],
        });

        setConfirmedBooking({
          id: result.bookingId,
          fullName: result.details.fullName,
          date: result.details.date,
          timeSlot: result.details.timeSlot,
          capacity: result.details.capacity,
        });
      }
    } catch (err: any) {
      setErrorMessage('Сетевая ошибка. Проверьте соединение и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-20 sm:py-24 bg-atmos-dark relative tech-grid-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-atmos-card border border-atmos-orange/30 text-atmos-orange text-xs font-bold uppercase tracking-wider mb-4 shadow-neon-orange">
            <Flag className="w-3.5 h-3.5 text-atmos-orange" />
            <span>Финишная зона гонки • Регистрация</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Онлайн-запись на мастер-класс
          </h2>

          <p className="text-atmos-muted text-sm sm:text-base max-w-2xl mx-auto">
            Выберите дату в интерактивном календаре, свободный временной слот и подтвердите участие. Количество мест лимитировано регламентом безопасности полетов.
          </p>

          {branchConfig.bookingNote && (
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-atmos-card border border-atmos-orange/40 text-xs sm:text-sm text-atmos-orange font-semibold shadow-neon-orange/15">
              <span>{branchConfig.bookingNote}</span>
            </div>
          )}
        </div>

        {/* Confirmed View */}
        {confirmedBooking ? (
          <div className="max-w-2xl mx-auto p-6 sm:p-10 rounded-3xl bg-atmos-card border-2 border-atmos-orange shadow-neon-glow text-center animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-atmos-orange/20 border-2 border-atmos-orange flex items-center justify-center text-atmos-orange mx-auto mb-5 shadow-neon-orange">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40 text-xs font-bold uppercase tracking-wider mb-3">
              Бронирование подтверждено
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Вы успешно записаны!
            </h3>

            <p className="text-atmos-muted text-xs sm:text-sm mb-6">
              Ждем вас на открытом мастер-классе пилотов «АтмоС» и Федерации гонок дронов.
            </p>

            {/* Boarding Pass */}
            <div className="rounded-2xl bg-atmos-surface border border-atmos-border p-5 sm:p-6 text-left space-y-4 mb-6">
              <div className="flex items-center justify-between pb-3 border-b border-atmos-border">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-5 h-5 text-atmos-orange" />
                  <span className="font-mono text-xs text-atmos-muted uppercase">Электронный билет</span>
                </div>
                <span className="font-mono font-bold text-sm text-atmos-orange">
                  № ATMOS-{String(confirmedBooking.id).padStart(4, '0')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <div className="text-atmos-subtle">Участник</div>
                  <div className="font-bold text-white mt-0.5">{confirmedBooking.fullName}</div>
                </div>
                <div>
                  <div className="text-atmos-subtle">Дата полетов</div>
                  <div className="font-bold text-white mt-0.5">{confirmedBooking.date}</div>
                </div>
                <div>
                  <div className="text-atmos-subtle">Временной слот</div>
                  <div className="font-bold text-atmos-orange mt-0.5">{confirmedBooking.timeSlot}</div>
                </div>
                <div>
                  <div className="text-atmos-subtle">Локация</div>
                  <div className="font-bold text-white mt-0.5">{branchConfig.address}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedBooking(null);
                setSelectedSlot('');
                setFullName('');
                setPhone('');
                setAge('');
                fetchSlots(selectedDate);
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-atmos-surface border border-atmos-border hover:border-atmos-orange/50 text-white font-semibold text-sm transition-all"
            >
              Записать еще одного участника
            </button>
          </div>
        ) : (
          /* Main Interactive Booking Engine */
          <div className="rounded-3xl bg-atmos-card/95 border border-atmos-border p-5 sm:p-8 md:p-10 shadow-card-glow backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-10 sm:space-y-12">
              {/* STEP 1: INTERACTIVE CALENDAR WITH ANY DATE SELECTION */}
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-atmos-orange text-black font-black text-xs">
                      1
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Выберите дату мастер-класса
                    </h3>
                  </div>

                  <div className="text-xs text-atmos-muted flex items-center space-x-2">
                    <span>Выбрано:</span>
                    <span className="font-bold text-atmos-orange font-mono bg-atmos-surface px-2.5 py-1 rounded-md border border-atmos-border">
                      {selectedDate}
                    </span>
                  </div>
                </div>

                {/* Calendar Widget Container */}
                <div className="max-w-md mx-auto rounded-2xl bg-atmos-surface/90 border border-atmos-border p-4 sm:p-5 shadow-inner">
                  {/* Calendar Header with Month Switcher */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-atmos-border">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-2 rounded-lg bg-atmos-card hover:bg-atmos-cardHover text-atmos-muted hover:text-white transition-colors"
                      title="Предыдущий месяц"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="font-bold text-sm sm:text-base text-white">
                      {MONTH_NAMES_RU[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-2 rounded-lg bg-atmos-card hover:bg-atmos-cardHover text-atmos-muted hover:text-white transition-colors"
                      title="Следующий месяц"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weekday Headers: Monday (idx 0) and Sunday (idx 6) are non-working days */}
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {WEEKDAY_NAMES_RU.map((w, idx) => {
                      const isDisallowed = idx === 0 || idx === 6;
                      return (
                        <div
                          key={w}
                          className={`text-[11px] font-bold uppercase py-1 ${
                            isDisallowed
                              ? 'text-zinc-600 line-through opacity-40'
                              : idx === 5
                              ? 'text-atmos-orange'
                              : 'text-atmos-subtle'
                          }`}
                          title={isDisallowed ? 'Технический день (полеты не проводятся)' : ''}
                        >
                          {w}
                        </div>
                      );
                    })}
                  </div>

                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((item, idx) => {
                      if (!item) {
                        return <div key={`empty-${idx}`} className="h-9 sm:h-10" />;
                      }

                      return (
                        <button
                          type="button"
                          key={item.isoString}
                          disabled={item.isDisabled}
                          onClick={() => setSelectedDate(item.isoString)}
                          className={`h-9 sm:h-10 rounded-xl text-xs sm:text-sm font-semibold flex flex-col items-center justify-center relative transition-all duration-150 ${
                            item.isDisabled
                              ? item.isDisallowed
                                ? 'text-zinc-600 line-through opacity-25 cursor-not-allowed bg-transparent'
                                : 'text-atmos-subtle/25 opacity-25 cursor-not-allowed bg-transparent'
                              : item.isSelected
                              ? 'bg-gradient-to-br from-atmos-orange to-red-600 text-white font-black shadow-neon-orange scale-105 z-10'
                              : item.isToday
                              ? 'bg-atmos-card border border-atmos-orange/60 text-atmos-orange hover:bg-atmos-cardHover'
                              : item.dayOfWeek === 6
                              ? 'text-white hover:bg-atmos-card'
                              : 'text-atmos-muted hover:bg-atmos-card hover:text-white'
                          }`}
                        >
                          <span>{item.day}</span>
                          {item.isToday && !item.isSelected && (
                            <span className="w-1 h-1 rounded-full bg-atmos-orange mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Schedule Note */}
                  <div className="mt-3 pt-3 border-t border-atmos-border/60 text-center text-[11px] text-atmos-subtle">
                    Дни полетов: Вторник – Суббота (Пн и Вс — дни обслуживания дронов)
                  </div>
                </div>
              </div>

              {/* STEP 2: TIME SLOTS WITH STRICT CAPACITY DIFFERENTIATION */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-atmos-orange text-black font-black text-xs">
                      2
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-white">
                      Выберите временной слот
                    </h3>
                  </div>

                  <div className="text-xs text-atmos-muted flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-atmos-orange"></span>
                      <span>До 14:00 (10 мест)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-atmos-cyan"></span>
                      <span>После 14:00 (5 мест)</span>
                    </span>
                  </div>
                </div>

                {loadingSlots ? (
                  <div className="py-10 flex items-center justify-center space-x-2 text-atmos-orange">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm font-medium">Загрузка доступных слотов на {selectedDate}...</span>
                  </div>
                ) : (
                  <div>
                    {/* Mobile swipeable bar / Desktop grid */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-3 pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
                      {slotsState.map((s) => {
                        const isSelected = selectedSlot === s.slot;
                        const isMorning = s.capacity === 10;

                        return (
                          <button
                            type="button"
                            key={s.slot}
                            disabled={s.isFull}
                            onClick={() => setSelectedSlot(s.slot)}
                            className={`flex-shrink-0 w-[230px] sm:w-auto snap-start relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 ${
                              s.isFull
                                ? 'bg-atmos-surface/30 border-atmos-border/40 opacity-40 cursor-not-allowed'
                                : isSelected
                                ? 'bg-atmos-orange/20 border-atmos-orange shadow-neon-orange scale-[1.02]'
                                : 'bg-atmos-surface/70 border-atmos-border hover:border-atmos-orange/60'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2 sm:mb-3">
                              <Clock className={`w-4 h-4 ${isSelected ? 'text-atmos-orange' : 'text-atmos-subtle'}`} />

                              {s.isFull ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/40">
                                  Мест нет
                                </span>
                              ) : s.isLow ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                                  Мало мест
                                </span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isMorning
                                      ? 'bg-atmos-orange/10 text-atmos-orange border border-atmos-orange/30'
                                      : 'bg-atmos-cyan/10 text-atmos-cyan border border-atmos-cyan/30'
                                  }`}
                                >
                                  {isMorning ? '10 мест макс.' : '5 мест макс.'}
                                </span>
                              )}
                            </div>

                            <div className="text-base sm:text-lg font-black text-white tracking-wide mb-1">
                              {s.slot}
                            </div>

                            <div className="text-xs text-atmos-muted flex items-center justify-between">
                              <span>Осталось мест:</span>
                              <span className="font-bold text-white">
                                {s.available} из {s.capacity}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Mobile hint */}
                    <div className="sm:hidden text-center text-[11px] text-atmos-subtle mt-1 flex items-center justify-center space-x-1">
                      <span>⟵ Листайте слоты вбок ⟶</span>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 3: REGISTRATION MINI-FORM */}
              <div>
                <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-atmos-orange text-black font-black text-xs">
                    3
                  </span>
                  <h3 className="text-lg sm:text-2xl font-bold text-white">
                    Данные участника
                  </h3>
                </div>

                {/* Honeypot hidden input for bots */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* Full Name */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-atmos-muted uppercase tracking-wider mb-2">
                      ФИО участника *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-atmos-subtle">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-atmos-surface border border-atmos-border focus:border-atmos-orange focus:ring-1 focus:ring-atmos-orange text-white text-base sm:text-sm placeholder-atmos-subtle transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-atmos-muted uppercase tracking-wider mb-2">
                      Номер телефона *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-atmos-subtle">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+7 (999) 999-22-11"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-atmos-surface border border-atmos-border focus:border-atmos-orange focus:ring-1 focus:ring-atmos-orange text-white text-base sm:text-sm placeholder-atmos-subtle transition-all outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-atmos-muted uppercase tracking-wider mb-2">
                      Возраст (лет) *
                    </label>
                    <input
                      type="number"
                      required
                      min={7}
                      max={99}
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Например: 16"
                      className="w-full px-4 py-3 rounded-xl bg-atmos-surface border border-atmos-border focus:border-atmos-orange focus:ring-1 focus:ring-atmos-orange text-white text-base sm:text-sm placeholder-atmos-subtle transition-all outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Dynamic Warning for Minors (<18) */}
                {isMinor && (
                  <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs sm:text-sm flex items-start space-x-3 animate-fadeIn">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block text-amber-200">Внимание: участие несовершеннолетних</strong>
                      Участие лиц младше 18 лет возможно исключительно в присутствии родителей или законных представителей.
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: LEGAL CHECKBOX (152-FZ) */}
              <div className="pt-2 border-t border-atmos-border/60">
                <label className="flex items-start space-x-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={consent152}
                    onChange={(e) => setConsent152(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-atmos-orange focus:ring-atmos-orange bg-atmos-surface border-atmos-border cursor-pointer accent-atmos-orange"
                  />
                  <span className="text-xs text-atmos-muted leading-relaxed">
                    Я даю согласие на обработку моих персональных данных в соответствии с{' '}
                    <button
                      type="button"
                      onClick={() => setIsConsentOpen(true)}
                      className="text-atmos-orange underline hover:text-atmos-orangeBright transition-colors font-medium"
                    >
                      Федеральным законом № 152-ФЗ «О персональных данных»
                    </button>{' '}
                    и принимаю условия{' '}
                    <button
                      type="button"
                      onClick={() => setIsPolicyOpen(true)}
                      className="text-atmos-orange underline hover:text-atmos-orangeBright transition-colors font-medium"
                    >
                      Политики конфиденциальности
                    </button>
                    .
                  </span>
                </label>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-300 text-sm flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 5: DYNAMIC CTA BUTTON (Gray until filled, then glows neon) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
                <div className="text-xs text-atmos-subtle flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-atmos-orange flex-shrink-0" />
                  <span>Данные защищены протоколом SSL и хранятся на серверах в РФ</span>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid || submitting}
                  className={`w-full sm:w-auto px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center space-x-2 ${
                    isFormValid
                      ? 'bg-gradient-to-r from-atmos-orange via-[#FF6A00] to-red-600 text-white shadow-neon-orange hover:shadow-neon-glow hover:scale-[1.02] active:scale-[0.98] cursor-pointer animate-pulse-slow'
                      : 'bg-[#1e1e24] text-atmos-subtle border border-[#2c2c36] cursor-not-allowed opacity-60 shadow-none'
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Оформление записи...</span>
                    </>
                  ) : (
                    <>
                      <span>Записаться в один клик</span>
                      <ChevronRight className={`w-5 h-5 ${isFormValid ? 'text-white' : 'text-atmos-subtle'}`} />
                    </>
                  )}
                </button>
              </div>

              {/* Helper indicator if not all fields are filled */}
              {!isFormValid && (
                <div className="text-center sm:text-right text-[11px] text-atmos-subtle">
                  {!selectedSlot
                    ? 'Для активации кнопки выберите временной слот'
                    : fullName.trim().length < 3
                    ? 'Укажите ФИО (от 3 символов)'
                    : digitsOnly.length !== 11
                    ? 'Заполните номер телефона (11 цифр)'
                    : isNaN(parsedAge) || parsedAge < 7
                    ? 'Укажите корректный возраст (от 7 лет)'
                    : !consent152
                    ? 'Необходимо согласие на обработку персональных данных (152-ФЗ)'
                    : ''}
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Legal Modals */}
      <Consent152Modal isOpen={isConsentOpen} onClose={() => setIsConsentOpen(false)} />
      <PrivacyPolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </section>
  );
};
