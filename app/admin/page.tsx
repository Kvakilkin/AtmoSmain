'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Building2,
} from 'lucide-react';

interface Booking {
  id: number;
  full_name: string;
  phone: string;
  age: number;
  date: string;
  time_slot: string;
  branch?: string;
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
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
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
      const params = new URLSearchParams({ key: adminKey });
      if (selectedDate) params.append('date', selectedDate);
      if (selectedBranch && selectedBranch !== 'all') params.append('branch', selectedBranch);

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
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
  }, [selectedDate, selectedBranch]);

  const handleDownloadExcel = () => {
    const params = new URLSearchParams({ key: adminKey });
    if (selectedDate) params.append('date', selectedDate);
    if (selectedBranch && selectedBranch !== 'all') params.append('branch', selectedBranch);
    window.location.href = `/api/admin/export?${params.toString()}`;
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
        alert('Не удалось удалить запись');
      }
    } catch (err) {
      alert('Ошибка при обращении к серверу');
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.phone.includes(searchQuery);
      return matchesSearch;
    });
  }, [bookings, searchQuery]);

  const totalMinors = useMemo(() => bookings.filter((b) => b.is_minor).length, [bookings]);
  const totalAdults = useMemo(() => bookings.filter((b) => !b.is_minor).length, [bookings]);

  return (
    <div className="min-h-screen bg-atmos-dark text-white p-4 sm:p-6 lg:p-8 selection:bg-atmos-orange selection:text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-atmos-border">
          <div className="flex items-center space-x-4">
            <a
              href="/"
              className="p-2.5 rounded-xl bg-atmos-surface hover:bg-atmos-card border border-atmos-border text-atmos-muted hover:text-white transition-colors flex items-center space-x-2 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>На сайт</span>
            </a>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
                <span>Панель администратора & Бухгалтерия</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-atmos-orange/20 text-atmos-orange font-mono">
                  «АтмоС»
                </span>
              </h1>
              <p className="text-xs text-atmos-muted mt-0.5">
                Реестр участников мастер-классов • Выгрузка отчетности в Excel (152-ФЗ)
              </p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setAdminKey('');
                  setBookings([]);
                }}
                className="px-3.5 py-2 rounded-xl bg-atmos-surface hover:bg-atmos-card border border-atmos-border text-xs text-atmos-muted hover:text-white"
              >
                Выйти
              </button>
            </div>
          )}
        </div>

        {/* Auth Box */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-16 p-6 sm:p-8 rounded-3xl bg-atmos-surface border border-atmos-border shadow-card-glow text-center">
            <div className="w-16 h-16 rounded-2xl bg-atmos-orange/10 border border-atmos-orange/30 flex items-center justify-center text-atmos-orange mx-auto mb-4">
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
                    Файл формируется моментально в формате .xlsx с колонкой филиала и разделением по слотам
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full lg:w-auto">
                <button
                  onClick={handleDownloadExcel}
                  className="w-full lg:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black text-base shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-3 group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>Скачать записи в Excel (.xlsx)</span>
                </button>
              </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-atmos-surface border border-atmos-border">
              <div className="flex flex-wrap items-center gap-3">
                {/* Branch filter */}
                <div className="flex items-center space-x-2 bg-atmos-dark border border-atmos-border rounded-xl px-3 py-2 text-xs sm:text-sm">
                  <Building2 className="w-4 h-4 text-atmos-orange" />
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="bg-transparent text-white outline-none cursor-pointer text-xs sm:text-sm"
                  >
                    <option value="all" className="bg-atmos-surface text-white">Все филиалы</option>
                    <option value="main" className="bg-atmos-surface text-white">Центральный (Ворошиловский)</option>
                    <option value="levenc" className="bg-atmos-surface text-white">Левенцовский (Жукова, 18)</option>
                  </select>
                </div>

                {/* Date filter */}
                <div className="flex items-center space-x-2 bg-atmos-dark border border-atmos-border rounded-xl px-3 py-2 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4 text-atmos-orange" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-white outline-none font-mono text-xs sm:text-sm"
                    title="Фильтр по конкретной дате"
                  />
                </div>

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
                      <th className="py-3 px-4">Филиал</th>
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
                        <td colSpan={10} className="py-8 text-center text-atmos-subtle">
                          Записей пока нет или ничего не найдено по фильтрам.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-atmos-card/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-atmos-subtle">#{b.id}</td>
                          <td className="py-3 px-4">
                            {b.branch === 'levenc' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Левенцовский
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                Центральный
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-medium text-white">{b.date}</td>
                          <td className="py-3 px-4 text-atmos-orange font-mono font-semibold">{b.time_slot}</td>
                          <td className="py-3 px-4 font-bold text-white">{b.full_name}</td>
                          <td className="py-3 px-4 font-mono text-atmos-muted">{b.phone}</td>
                          <td className="py-3 px-4">{b.age} лет</td>
                          <td className="py-3 px-4">
                            {b.is_minor ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                &lt;18 лет (с родителями)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                                18+ (взрослый)
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
