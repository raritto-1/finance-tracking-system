const DISPLAY_FORMAT = /^(\d{2})-(\d{2})-(\d{4})$/;

export function parseDisplayDate(dateStr: string): Date {
  const match = dateStr.match(DISPLAY_FORMAT);
  if (!match) throw new Error(`Invalid date format: ${dateStr}. Use dd-mm-yyyy.`);
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function formatDisplayDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function toInputDate(dateStr: string): string {
  const match = dateStr.match(DISPLAY_FORMAT);
  if (!match) return dateStr;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function fromInputDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}-${month}-${year}`;
}

export function todayDisplayDate(): string {
  return formatDisplayDate(new Date());
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatCurrency(amount: number, symbol = '$'): string {
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
