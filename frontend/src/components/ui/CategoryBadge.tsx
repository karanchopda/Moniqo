"use client";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export const getCategoryClass = (category: string): string => {
  const normalized = category.toLowerCase();
  if (normalized === 'income') return 'bg-emerald-100 text-emerald-800';
  if (normalized === 'shopping') return 'bg-green-100 text-green-800';
  if (normalized === 'food') return 'bg-emerald-100 text-emerald-800';
  if (normalized === 'travel') return 'bg-teal-100 text-teal-800';
  if (normalized === 'bills') return 'bg-amber-100 text-amber-800';
  if (normalized === 'entertainment') return 'bg-purple-100 text-purple-800';
  if (normalized === 'groceries') return 'bg-cyan-100 text-cyan-800';
  if (normalized === 'lifestyle') return 'bg-pink-100 text-pink-800';
  if (normalized === 'investment') return 'bg-blue-100 text-blue-800';
  if (normalized === 'medical') return 'bg-red-100 text-red-800';
  return 'bg-slate-100 text-slate-600';
};

export default function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-md px-3 py-1 text-sm font-semibold ${getCategoryClass(
        category
      )} ${className}`}
    >
      {category}
    </span>
  );
}
