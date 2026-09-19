'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { locales, localeLabels, type Locale } from '@/lib/i18n/config';
import { useTranslation } from '@/lib/i18n/useTranslation';

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  bn: '🇧🇩',
};

export function LanguageSwitcher() {
  const { locale, dict, changeLocale } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'cursor-pointer gap-1.5 border border-gray-200 px-2 dark:border-gray-700',
        )}
      >
        <span className='text-base leading-none'>{localeFlags[locale]}</span>
        <span className='text-xs font-medium uppercase'>{locale}</span>
        <span className='sr-only'>{dict.navbar.language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => changeLocale(value as Locale)}
        >
          {locales.map((code) => (
            <DropdownMenuRadioItem key={code} value={code} className='cursor-pointer gap-2'>
              <span className='text-base leading-none'>{localeFlags[code]}</span>
              <span className='font-bengali'>{localeLabels[code]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
