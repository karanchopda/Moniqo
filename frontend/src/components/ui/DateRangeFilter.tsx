"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

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

const toInputValue = (d: Date | null) =>
  d ? d.toISOString().split('T')[0] : '';

const fromInputValue = (s: string) =>
  s ? new Date(s + 'T00:00:00') : null;

export default function DateRangeFilter({
  selectedFilter,
  onChange,
  className = '',
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [tempStart, setTempStart] = useState(toInputValue(selectedFilter.startDate));
  const [tempEnd, setTempEnd] = useState(toInputValue(selectedFilter.endDate));
  const [tempLabel, setTempLabel] = useState(selectedFilter.label);

  useEffect(() => {
    if (isOpen) {
      setTempStart(toInputValue(selectedFilter.startDate));
      setTempEnd(toInputValue(selectedFilter.endDate));
      setTempLabel(selectedFilter.label);
    }
  }, [isOpen, selectedFilter]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getQuickRange = (key: string) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const s = (d: Date) => { const r = new Date(d); r.setHours(0, 0, 0, 0); return r; };
    const e = (d: Date) => { const r = new Date(d); r.setHours(23, 59, 59, 999); return r; };

    switch (key) {
      case 'today': return { start: s(today), end: today, label: 'Today' };
      case 'yesterday': {
        const d = new Date(today); d.setDate(d.getDate() - 1);
        return { start: s(d), end: e(d), label: 'Yesterday' };
      }
      case 'this_week': {
        const d = new Date(today);
        d.setDate(d.getDate() - (d.getDay() === 0 ? 6 : d.getDay() - 1));
        return { start: s(d), end: today, label: 'This Week' };
      }
      case 'last_week': {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay() - 6);
        const en = new Date(d); en.setDate(en.getDate() + 6);
        return { start: s(d), end: e(en), label: 'Last Week' };
      }
      case 'this_month':
        return { start: new Date(today.getFullYear(), today.getMonth(), 1), end: today, label: 'This Month' };
      case 'last_month': {
        const st = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const en = new Date(today.getFullYear(), today.getMonth(), 0);
        return { start: st, end: e(en), label: 'Last Month' };
      }
      case 'last_7': {
        const d = new Date(today); d.setDate(d.getDate() - 6);
        return { start: s(d), end: today, label: 'Last 7 days' };
      }
      case 'last_30': {
        const d = new Date(today); d.setDate(d.getDate() - 29);
        return { start: s(d), end: today, label: 'Last 30 days' };
      }
      default:
        return { start: null, end: null, label: 'All time' };
    }
  };

  const quickOptions = [
    { label: 'Today', key: 'today' },
    { label: 'Yesterday', key: 'yesterday' },
    { label: 'This Week', key: 'this_week' },
    { label: 'Last Week', key: 'last_week' },
    { label: 'This Month', key: 'this_month' },
    { label: 'Last Month', key: 'last_month' },
    { label: 'Last 7 days', key: 'last_7' },
    { label: 'Last 30 days', key: 'last_30' },
    { label: 'All time', key: 'all_time' },
  ];

  const handleQuickSelect = (key: string) => {
    const r = getQuickRange(key);
    setTempStart(toInputValue(r.start));
    setTempEnd(toInputValue(r.end));
    setTempLabel(r.label);
  };

  const handleApply = () => {
    onChange({
      startDate: fromInputValue(tempStart),
      endDate: fromInputValue(tempEnd),
      label: tempStart && tempEnd && tempLabel === selectedFilter.label ? 'Custom' : tempLabel,
    });
    setIsOpen(false);
  };

  const displayLabel = useMemo(() => {
    if (selectedFilter.label === 'Custom' && selectedFilter.startDate && selectedFilter.endDate) {
      const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      return `${fmt(selectedFilter.startDate)} – ${fmt(selectedFilter.endDate)}`;
    }
    return selectedFilter.label;
  }, [selectedFilter]);

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className={`flex h-11 w-full sm:w-[220px] items-center justify-between rounded border bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors ${
          isOpen ? 'border-[#0a5c43] ring-2 ring-[#0a5c43]/10' : 'border-gray-200'
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="material-symbols-outlined text-[16px] text-gray-400 shrink-0">calendar_month</span>
          <span className="truncate">{displayLabel}</span>
        </span>
        <span className="material-symbols-outlined text-[16px] text-gray-400 shrink-0">expand_more</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="flex w-full max-w-2xl flex-col rounded border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-sm font-black text-gray-900">Date filter</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded text-gray-400 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-[180px_1fr] border-b border-gray-100">
              {/* Quick ranges */}
              <div className="flex flex-col border-r border-gray-100 bg-gray-50 p-2 space-y-0.5">
                {quickOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleQuickSelect(opt.key)}
                    className={`flex h-9 w-full items-center px-3 rounded text-left text-xs font-semibold transition-colors ${
                      tempLabel === opt.label
                        ? 'bg-[#e6f4ee] text-[#0a5c43]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Native date inputs — zero dependency */}
              <div className="flex flex-col gap-6 p-8 justify-center">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={tempStart}
                    max={tempEnd || undefined}
                    onChange={e => { setTempStart(e.target.value); setTempLabel('Custom'); }}
                    className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-[#0a5c43] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={tempEnd}
                    min={tempStart || undefined}
                    onChange={e => { setTempEnd(e.target.value); setTempLabel('Custom'); }}
                    className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-[#0a5c43] transition-colors"
                  />
                </div>
                {tempStart && tempEnd && (
                  <p className="text-xs font-semibold text-gray-400">
                    {Math.round((new Date(tempEnd).getTime() - new Date(tempStart).getTime()) / 86400000) + 1} days selected
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-10 rounded border border-gray-200 bg-white px-5 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="h-10 rounded bg-[#0a5c43] px-5 text-xs font-black text-white hover:bg-[#084b36]"
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
