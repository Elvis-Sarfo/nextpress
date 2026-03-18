import type { CollectionFieldMeta } from '@/lib/collections-data';

type Doc = Record<string, unknown>;

export const IGNORED_COLUMN = '__ignore__';

export function getDisplayText(value: unknown, locale: string): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => getDisplayText(item, locale)).join(', ') || '—';
  }
  if (typeof value === 'object') {
    const item = value as Record<string, unknown>;
    if (typeof item.displayName === 'string' && item.displayName.trim()) {
      return item.displayName;
    }
    if (typeof item.name === 'string' && item.name.trim()) {
      return item.name;
    }
    const localizedName = item.name;
    if (localizedName && typeof localizedName === 'object' && !Array.isArray(localizedName)) {
      const localized = localizedName as Record<string, unknown>;
      const text = localized[locale] ?? localized.en ?? Object.values(localized).find((entry) => typeof entry === 'string');
      if (typeof text === 'string' && text.trim()) {
        return text;
      }
    }
    if (typeof item.email === 'string' && item.email.trim()) {
      return item.email;
    }
    if (typeof item.id === 'string' && item.id.trim()) {
      return item.id;
    }
    return '—';
  }
  return String(value);
}

export function labelFor(field: CollectionFieldMeta): string {
  return field.label || field.name;
}

export function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function csvEscape(input: unknown): string {
  const text = String(input ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function parseDelimited(text: string, delimiter = ','): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(value.trim());
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value.trim());
      rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.trim());
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell.length > 0));
}

export function parseExcelLikeText(text: string): string[][] {
  const parser = new DOMParser();

  if (/<table/i.test(text)) {
    const doc = parser.parseFromString(text, 'text/html');
    const rows = Array.from(doc.querySelectorAll('tr')).map((tr) =>
      Array.from(tr.querySelectorAll('th,td')).map((cell) => (cell.textContent || '').trim())
    );
    return rows.filter((r) => r.some((cell) => cell.length > 0));
  }

  if (/<Worksheet/i.test(text)) {
    const doc = parser.parseFromString(text, 'application/xml');
    const rowEls = Array.from(doc.querySelectorAll('Row'));
    const rows = rowEls.map((rowEl) =>
      Array.from(rowEl.querySelectorAll('Cell')).map((cellEl) => {
        const dataEl = cellEl.querySelector('Data');
        return (dataEl?.textContent || '').trim();
      })
    );
    return rows.filter((r) => r.some((cell) => cell.length > 0));
  }

  return parseDelimited(text, '\t');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function formatCellValue(field: CollectionFieldMeta, doc: Doc, locale: string): string {
  const val = doc[field.name];
  if (val === null || val === undefined) return '—';

  if (field.localized && typeof val === 'object' && !Array.isArray(val)) {
    const localeMap = val as Record<string, unknown>;
    const localeVal = localeMap[locale] ?? localeMap.en;
    if (localeVal === null || localeVal === undefined) return '—';
    if (typeof localeVal === 'object') return JSON.stringify(localeVal);
    return String(localeVal);
  }

  if (Array.isArray(val)) {
    return val.map((v: unknown) => getDisplayText(v, locale)).join(', ') || '—';
  }
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (field.type === 'date' || field.name.endsWith('At')) {
    const dt = new Date(String(val));
    return Number.isNaN(dt.valueOf()) ? String(val) : dt.toLocaleDateString();
  }
  if (typeof val === 'object' && val !== null) {
    return getDisplayText(val, locale);
  }
  return String(val);
}

export function convertTextToFieldValue(field: CollectionFieldMeta, raw: string, locale: string): unknown {
  if (raw === '') return null;

  if (field.localized) {
    return { [locale]: raw };
  }

  switch (field.type) {
    case 'number': {
      const n = Number(raw);
      return Number.isNaN(n) ? null : n;
    }
    case 'checkbox':
      return ['true', '1', 'yes', 'y'].includes(raw.toLowerCase());
    case 'json': {
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    }
    case 'relationship':
      return raw;
    default:
      return raw;
  }
}

export function getComparable(doc: Doc, fieldName: string, locale: string): string {
  const value = doc[fieldName];
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim().toLowerCase();
  }
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).join(',').toLowerCase();
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (obj.id) return String(obj.id).toLowerCase();
    if (obj[locale]) return String(obj[locale]).toLowerCase();
    if (obj.en) return String(obj.en).toLowerCase();
    return JSON.stringify(obj).toLowerCase();
  }
  return String(value).toLowerCase();
}

