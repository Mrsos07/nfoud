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
    minute: '2-digit'
  }).format(d);
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
