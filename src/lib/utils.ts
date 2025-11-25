import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + "..."
}

export function capitalizeFirstLetter(text: string): string {
  if (!text) return text
  // Capitalize first letter of each word (split by space)
  return text
    .split(' ')
    .map(word => word.trim() ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
    .filter(Boolean)
    .join(' ')
}
