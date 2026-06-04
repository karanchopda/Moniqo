"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import DatePicker from 'react-datepicker';

export interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
  label: string;
}

interface DateRangeFilterProps {
  selectedFilter: DateFilter;
  onChange: (filter: DateFilter) => void;
  className?: string;
}

export default function DateRangeFilter({
  selectedFilter,
  onChange,
  className = '',
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Temporary state inside the modal before user clicks "Apply"
  const [tempStartDate, setTempStartDate] = useState<Date | null>(selectedFilter.startDate);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(selectedFilter.endDate);
  const [tempLabel, setTempLabel] = useState<string>(selectedFilter.label);

  // Sync temp state with parent when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempStartDate(selectedFilter.startDate);
      setTempEndDate(selectedFilter.endDate);
      setTempLabel(selectedFilter.label);
    }
  }, [isOpen, selectedFilter]);

  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getQuickRange = (key: string): { startDate: Date | null; endDate: Date | null; label: string } => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startOfDay = (d: Date) => {
      const res = new Date(d);
      res.setHours(0, 0, 0, 0);
      return res;
    };

    const endOfDay = (d: Date) => {
      const res = new Date(d);
      res.setHours(23, 59, 59, 999);
      return res;
    };

    switch (key) {
      case 'today': {
        const start = startOfDay(today);
        return { startDate: start, endDate: today, label: 'Today' };
      }
      case 'yesterday': {
        const start = new Date(today);
        start.setDate(start.getDate() - 1);
        return { startDate: startOfDay(start), endDate: endOfDay(start), label: 'Yesterday' };
      }
      case 'this_week': {
        const start = new Date(today);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when Sunday
        start.setDate(diff);
        return { startDate: startOfDay(start), endDate: today, label: 'This Week' };
      }
      case 'last_week': {
        const start = new Date(today);
        const day = start.getDay();
        const diff = start.getDate() - day - 6;
        start.setDate(diff);
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return { startDate: startOfDay(start), endDate: endOfDay(end), label: 'Last Week' };
      }
      case 'this_month': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: start, endDate: today, label: 'This Month' };
      }
      case 'last_month': {
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 0);
        return { startDate: start, endDate: endOfDay(end), label: 'Last Month' };
      }
      case 'last_7_days': {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        return { startDate: startOfDay(start), endDate: today, label: 'Last 7 days' };
      }
      case 'last_30_days': {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        return { startDate: startOfDay(start), endDate: today, label: 'Last 30 days' };
      }
      case 'all_time':
      default:
        return { startDate: null, endDate: null, label: 'All time data' };
    }
  };

  const quickOptions = [
    { label: 'Today', key: 'today' },
    { label: 'Yesterday', key: 'yesterday' },
    { label: 'This Week', key: 'this_week' },
    { label: 'Last Week', key: 'last_week' },
    { label: 'This Month', key: 'this_month' },
    { label: 'Last Month', key: 'last_month' },
    { label: 'Last 7 days', key: 'last_7_days' },
    { label: 'Last 30 days', key: 'last_30_days' },
    { label: 'All time data', key: 'all_time' },
  ];

  const handleQuickSelect = (key: string) => {
    const range = getQuickRange(key);
    setTempStartDate(range.startDate);
    setTempEndDate(range.endDate);
    setTempLabel(range.label);
  };

  const handleDatePickerChange = (update: [Date | null, Date | null]) => {
    const [start, end] = update;
    setTempStartDate(start);
    setTempEndDate(end);
    if (start && end) {
      setTempLabel('Custom');
    }
  };

  const handleApply = () => {
    onChange({
      startDate: tempStartDate,
      endDate: tempEndDate,
      label: tempLabel,
    });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const displayLabel = useMemo(() => {
    if (selectedFilter.label === 'Custom' && selectedFilter.startDate && selectedFilter.endDate) {
      const startStr = selectedFilter.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const endStr = selectedFilter.endDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
      return `${startStr} - ${endStr}`;
    }
    return selectedFilter.label;
  }, [selectedFilter]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-11 w-full sm:w-[220px] items-center justify-between rounded-md border bg-white px-4 text-sm font-semibold text-brand-text shadow-sm transition-colors ${
          isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-brand-border'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <CalendarDays className="h-4 w-4 text-brand-text-muted shrink-0" />
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown className="h-4 w-4 text-brand-text-muted shrink-0 transition-transform duration-200 group-hover:text-primary" />
      </button>

      {/* Modal / Popover dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-[2px]">
          <div
            ref={modalRef}
            className="flex w-full max-w-[960px] flex-col rounded-md border border-brand-border bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-brand-border px-6 py-4.5">
              <h2 className="text-lg font-black text-gray-900">Date filter</h2>
              <button
                type="button"
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-md text-brand-text-muted hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-[220px_1fr] border-b border-brand-border">
              {/* Left Sidebar: Quick Ranges */}
              <div className="flex flex-col border-r border-brand-border bg-brand-bg-light p-3 space-y-1">
                {quickOptions.map((opt) => {
                  const isActive = tempLabel === opt.label;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleQuickSelect(opt.key)}
                      className={`flex h-10 w-full items-center px-4 rounded-md text-left text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-brand-light text-primary'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Right: Datepicker component */}
              <div className="flex justify-center p-6 bg-white overflow-x-auto">
                <DatePicker
                  selectsRange
                  startDate={tempStartDate || undefined}
                  endDate={tempEndDate || undefined}
                  onChange={handleDatePickerChange}
                  monthsShown={2}
                  inline
                  renderCustomHeader={({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                    customHeaderCount,
                  }) => {
                    const months = [
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ];
                    const currentYear = new Date().getFullYear();
                    const years = Array.from({ length: currentYear - 2000 + 3 }, (_, i) => 2000 + i).reverse();

                    return (
                      <div className="flex items-center justify-between px-2 py-1 bg-white">
                        {customHeaderCount === 0 ? (
                          <div className="flex items-center gap-3">
                            {/* Prev month navigation */}
                            <button
                              type="button"
                              onClick={decreaseMonth}
                              disabled={prevMonthButtonDisabled}
                              className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-border bg-white text-brand-text hover:bg-brand-bg-light disabled:opacity-40"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>

                            {/* Month Select */}
                            <div className="relative">
                              <select
                                value={months[date.getMonth()]}
                                onChange={(e) => changeMonth(months.indexOf(e.target.value))}
                                className="h-10 rounded-md border border-brand-border bg-white pl-3 pr-8 text-sm font-semibold text-brand-text outline-none focus:border-primary appearance-none"
                              >
                                {months.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
                            </div>

                            {/* Year Select */}
                            <div className="relative">
                              <select
                                value={date.getFullYear()}
                                onChange={(e) => changeYear(Number(e.target.value))}
                                className="h-10 rounded-md border border-brand-border bg-white pl-3 pr-8 text-sm font-semibold text-brand-text outline-none focus:border-primary appearance-none"
                              >
                                {years.map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex w-full justify-end">
                            {/* Next month navigation */}
                            <button
                              type="button"
                              onClick={increaseMonth}
                              disabled={nextMonthButtonDisabled}
                              className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-border bg-white text-brand-text hover:bg-brand-bg-light disabled:opacity-40"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4.5 bg-brand-bg-light">
              <button
                type="button"
                onClick={handleCancel}
                className="h-11 rounded-md border border-brand-border bg-white px-6 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="h-11 rounded-md bg-primary px-6 text-sm font-black text-white shadow hover:bg-primary-light"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
