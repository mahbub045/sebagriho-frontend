import 'server-only';

import { cookies } from 'next/headers';
import { defaultLocale, isLocale, localeCookieName, type Locale } from './config';
import type en from './dictionaries/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  bn: () => import('./dictionaries/bn.json').then((module) => module.default),
};

/** Reads the active locale from the request cookie (server-side only). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(localeCookieName)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Loads the dictionary for a given locale, or the active cookie locale if omitted. */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const resolved = locale ?? (await getLocale());
  return dictionaries[resolved]();
}
