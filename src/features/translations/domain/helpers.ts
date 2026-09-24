export const isObjectRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  !!value && typeof value === 'object' && !Array.isArray(value);

export const hasOwnProperty = (value: object, key: string) =>
  Object.prototype.hasOwnProperty.call(value, key);

export const isSafeEntityId = (value: unknown): value is string =>
  typeof value === 'string' &&
  !!value &&
  !['__proto__', 'constructor', 'prototype'].includes(value);

export const normalizeKeywordForComparison = (value: string) =>
  value.trim().normalize('NFC').toLowerCase();

export const moveArrayItem = <T>(items: T[], from: number, to: number): T[] => {
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  )
    return items;
  const result = [...items];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
};
