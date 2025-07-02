import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateToUTC(dateString: string): string {
  const date = new Date(dateString);
  return `${date.toLocaleString('en-US', { month: 'long' })} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export function formatTimeToUTC(dateString: string): string {
  const date = new Date(dateString);
  return `${(date.getUTCHours() % 12 || 12).toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')} ${date.getUTCHours() < 12 ? 'AM' : 'PM'}`;
}
