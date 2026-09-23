export const normalizeLanguageCode = (value: string): string | null => {
  try {
    return Intl.getCanonicalLocales(value.trim())[0] ?? null;
  } catch {
    return null;
  }
};
