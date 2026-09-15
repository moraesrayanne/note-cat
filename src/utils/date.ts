const MONTHS_FULL = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

const MONTHS_SHORT = [
  'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
  'jul', 'ago', 'set', 'out', 'nov', 'dez',
];

const WEEKDAYS = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado',
];

export function getTodayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function formatTime(time: string): string {
  return time.substring(0, 5);
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function getDateStr(): string {
  const now = new Date();
  return `${now.getDate()} de ${MONTHS_FULL[now.getMonth()]}`;
}

export function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const toYMD = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  if (dateStr === toYMD(today)) return 'Hoje';
  if (dateStr === toYMD(yesterday)) return 'Ontem';

  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS_SHORT[date.getMonth()]}`;
}

export function formatTimeFromISO(isoStr: string): string {
  const d = new Date(isoStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function formatTimeInput(prev: string, raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);

  if (digits.length >= 1) {
    const d0 = parseInt(digits[0]);
    if (d0 > 2) return prev;
  }
  if (digits.length >= 2) {
    const hh = parseInt(digits.slice(0, 2));
    if (hh > 23) return prev;
  }
  if (digits.length >= 3) {
    const d2 = parseInt(digits[2]);
    if (d2 > 5) return prev;
  }
  if (digits.length >= 4) {
    const mm = parseInt(digits.slice(2, 4));
    if (mm > 59) return prev;
  }

  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + ':' + digits.slice(2);
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}
