import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Riyadh',
  }).format(d);
}

/**
 * Smart date: relative for recent, full date for older articles
 * Uses Saudi Arabia timezone (Asia/Riyadh UTC+3)
 */
export function formatTimeAgo(date: string): string {
  try {
    const now = new Date();
    const past = new Date(date);
    if (isNaN(past.getTime())) return '';

    const diffMs = now.getTime() - past.getTime();
    const diffMin = Math.floor(diffMs / 1000 / 60);

    if (diffMin < 0) return 'الآن';
    if (diffMin < 1) return 'الآن';
    if (diffMin < 60) return `منذ ${diffMin} دقيقة`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays <= 3) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : diffDays === 2 ? 'يومين' : 'أيام'}`;

    // For older articles, show the actual date
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Riyadh',
    }).format(past);
  } catch {
    return '';
  }
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    politics: 'سياسة',
    economy: 'اقتصاد',
    local: 'محليات',
    sports: 'رياضة',
  };
  return labels[category] || category;
}
