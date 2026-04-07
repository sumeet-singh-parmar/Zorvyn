export function nowISO(): string {
  return new Date().toISOString();
}

export function formatDate(isoString: string, format: string = 'DD/MM/YYYY'): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
}

export function startOfDay(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function endOfDay(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function startOfWeek(date: Date = new Date(), firstDay: number = 1): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day < firstDay ? 7 : 0) + day - firstDay;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function startOfMonth(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  return d.toISOString();
}

export function endOfMonth(date: Date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  return d.toISOString();
}

export function daysRemaining(deadline: string): number {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoString);
}

/**
 * Format a date as "07 Apr 2026, 2:30 PM"
 */
export function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleDateString('en', { month: 'short' });
  const year = d.getFullYear();
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${day} ${month} ${year}, ${h}:${m} ${ampm}`;
}

/**
 * Format a date as "2:30 PM"
 */
export function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  return `${h}:${m} ${ampm}`;
}
