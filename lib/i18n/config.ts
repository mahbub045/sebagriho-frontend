export const locales = ['en', 'bn'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeCookieName = 'NEXT_LOCALE';

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
};

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (locales as readonly string[]).includes(value);
