'use client';

import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  KeyRound,
  Users,
  Calendar,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Trash2,
} from 'lucide-react';

interface Booking {
  id: number;
  full_name: string;
  phone: string;
  age: number;
  date: string;
  time_slot: string;
  is_minor: number;
  created_at: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/bookings?key=${encodeURIComponent(adminKey)}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setIsAuthenticated(true);
      } else {
        setAuthError('Неверный ключ доступа. Обратитесь к администратору системы.');
      }
    } catch (err) {
      setAuthError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  const reloadData = async () => {
    setLoading(true);
    try {
      const url = selectedDate
        ? `/api/admin/bookings?key=${encodeURIComponent(adminKey)}&date=${selectedDate}`
        : `/api/admin/bookings?key=${encodeURIComponent(adminKey)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      reloadData();
    }
  }, [selectedDate]);

  const handleDownloadExcel = () => {
    const url = selectedDate
      ? `/api/admin/export?key=${encodeURIComponent(adminKey)}&date=${selectedDate}`
      : `/api/admin/export?key=${encodeURIComponent(adminKey)}`;
    window.location.href = url;
  };

  const handleDeleteBooking = async (id: number, name: string) => {
    if (!window.confirm(`Вы уверены, что хотите удалить запись участника «${name}» (ID: #${id})? Место освободится в слоте.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/bookings?key=${encodeURIComponent(adminKey)}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert('Не удалось удалить запись. Попробуйте обновить страницу.');
      }
    } catch (err) {
      alert('Ошибка соединения при удалении записи');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const q = searchQuery.toLowerCase();
    return b.full_name.toLowerCase().includes(q) || b.phone.includes(q);
  });

  const totalMinors = bookings.filter((b) => b.is_minor === 1).length;
  const totalAdults = bookings.length - totalMinors;

  return (
    <div className="min-h-screen bg-atmos-dark text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-atmos-border">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <a
              href="/"
              className="p-2.5 rounded-xl bg-atmos-surface border border-atmos-border text-atmos-muted hover:text-white transition-colors"
              title="На главную"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <img
                src="/images/logo-rfsoo.png"
                alt="РФСОО Федерация гонок дронов"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,122,255,0.3)]"
              />
              <div className="h-7 w-[1px] bg-white/20" />
              <img
                src="/images/logo-atmos.png"
                alt="АтмоС Академия пилотов"
                className="h-7 sm:h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,85,0,0.3)]"
              />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                Панель управления записями
              </h1>
              <p className="text-xs text-atmos-muted">
                РФСОО Федерация гонок дронов РО & Академия пилотов «АтмоС»
              </p>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          /* Login Screen for Accountant */
          <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-atmos-surface border border-atmos-orange/40 shadow-card-glow text-center">
            <div className="w-16 h-16 rounded-2xl bg-atmos-orange/10 border border-atmos-orange/40 flex items-center justify-center text-atmos-orange mx-auto mb-6 shadow-neon-orange">
              <KeyRound className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Вход для бухгалтера</h2>
            <p className="text-sm text-atmos-muted mb-6">
              Введите ключ доступа для просмотра реестра записей и скачивания отчетов в Excel.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Введите ключ доступа..."
                  className="w-full px-4 py-3 rounded-xl bg-atmos-dark border border-atmos-border text-white text-center font-mono focus:border-atmos-orange outline-none"
                />
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-atmos-orange text-white font-bold hover:bg-atmos-orangeHover shadow-neon-orange transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Проверка ключа...' : 'Войти в панель'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main Accountant Dashboard */
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-atmos-surface border border-atmos-border">
                <div className="flex items-center justify-between text-atmos-muted text-xs uppercase mb-2">
                  <span>Всего регистраций</span>
                  <Users className="w-4 h-4 text-atmos-orange" />
                </div>
                <div className="text-3xl font-black text-white">{bookings.length}</div>
                <div className="text-xs text-atmos-subtle mt-1">человек записано</div>
              </div>

              <div className="p-6 rounded-2xl bg-atmos-surface border border-atmos-border">
                <div className="flex items-center justify-between text-atmos-muted text-xs uppercase mb-2">
                  <span>Несовершеннолетние (&lt;18)</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-400">{totalMinors}</div>
                <div className="text-xs text-atmos-subtle mt-1">требуют присутствия родителей</div>
              </div>

              <div className="p-6 rounded-2xl bg-atmos-surface border border-atmos-border">
                <div className="flex items-center justify-between text-atmos-muted text-xs uppercase mb-2">
                  <span>Взрослые участники (18+)</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-black text-white">{totalAdults}</div>
                <div className="text-xs text-atmos-subtle mt-1">самостоятельное участие</div>
              </div>
            </div>

            {/* BIG ACTION BAR: 1-CLICK EXCEL DOWNLOAD */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-atmos-card via-[#1e1e24] to-atmos-card border-2 border-atmos-orange/50 shadow-neon-glow flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/40 flex items-center justify-center text-green-400 flex-shrink-0">
                  <FileSpreadsheet className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Экспорт реестра участников для бухгалтерии
                  </h3>
                  <p className="text-sm text-atmos-muted">
                    Файл формируется моментально в формате .xlsx с разделением по слотам и статусам
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full lg:w-auto">
                <button
                  onClick={handleDownloadExcel}
                  className="w-full lg:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-base shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-3 group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Скачать все записи в Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-atmos-surface border border-atmos-border">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-atmos-orange" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-atmos-dark border border-atmos-border rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:border-atmos-orange outline-none font-mono"
                  title="Фильтр по конкретной дате"
                />
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate('')}
                    className="text-xs text-atmos-orange underline hover:text-white"
                  >
                    Все даты
                  </button>
                )}

                <button
                  onClick={reloadData}
                  disabled={loading}
                  className="p-2 rounded-xl bg-atmos-card border border-atmos-border text-atmos-muted hover:text-white"
                  title="Обновить данные"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-atmos-orange' : ''}`} />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-atmos-subtle absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по ФИО или телефону..."
                  className="w-full sm:w-64 pl-9 pr-4 py-2 rounded-xl bg-atmos-dark border border-atmos-border text-xs text-white placeholder-atmos-subtle focus:border-atmos-orange outline-none"
                />
              </div>
            </div>

            {/* Table of Bookings */}
            <div className="rounded-2xl bg-atmos-surface border border-atmos-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-atmos-card/80 text-atmos-muted uppercase text-[10px] tracking-wider border-b border-atmos-border">
                    <tr>
                      <th className="py-3 px-4">№</th>
                      <th className="py-3 px-4">Дата</th>
                      <th className="py-3 px-4">Слот</th>
                      <th className="py-3 px-4">ФИО Участника</th>
                      <th className="py-3 px-4">Телефон</th>
                      <th className="py-3 px-4">Возраст</th>
                      <th className="py-3 px-4">Статус</th>
                      <th className="py-3 px-4">Дата записи</th>
                      <th className="py-3 px-4 text-right">Действие</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-atmos-border">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-atmos-subtle">
                          Записей пока нет или ничего не найдено по фильтрам.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-atmos-card/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-atmos-subtle">#{b.id}</td>
                          <td className="py-3 px-4 font-medium text-white">{b.date}</td>
                          <td className="py-3 px-4 text-atmos-orange font-mono">{b.time_slot}</td>
                          <td className="py-3 px-4 font-bold text-white">{b.full_name}</td>
                          <td className="py-3 px-4 font-mono text-atmos-muted">{b.phone}</td>
                          <td className="py-3 px-4">{b.age} лет</td>
                          <td className="py-3 px-4">
                            {b.is_minor ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                Несовершеннолетний (&lt;18)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                                Взрослый
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-atmos-subtle font-mono">
                            {new Date(b.created_at).toLocaleString('ru-RU')}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteBooking(b.id, b.full_name)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-colors inline-flex items-center space-x-1"
                              title="Удалить запись (освободить слот)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px] hidden sm:inline">Удалить</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
