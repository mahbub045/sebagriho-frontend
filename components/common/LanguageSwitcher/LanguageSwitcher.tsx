'use client';

import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { localeLabels, locales, type Locale } from '@/lib/i18n/config';
import bn from '@/lib/i18n/dictionaries/bn.json';
import en from '@/lib/i18n/dictionaries/en.json';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useUpdateProfileInfoMutation } from '@/lib/services/endpoints/common/ProfileInfoApi';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const dictionaries: Record<Locale, typeof en> = { en, bn };

// Inline SVG flags — Windows has no glyphs for regional-indicator flag
// emoji (🇬🇧 renders as "GB"), so emoji can't be used here.
// Both flags are drawn at 4:3 so they share one box without cropping.
function UkFlag({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 640 480' className={className} aria-hidden='true'>
      <path fill='#012169' d='M0 0h640v480H0z' />
      <path
        fill='#fff'
        d='m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z'
      />
      <path
        fill='#C8102E'
        d='m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z'
      />
      <path fill='#fff' d='M241 0v480h160V0zM0 160v160h640V160z' />
      <path fill='#C8102E' d='M0 193v96h640v-96zM273 0v480h96V0z' />
    </svg>
  );
}

function BdFlag({ className }: { className?: string }) {
  return (
    <svg viewBox='0 0 640 480' className={className} aria-hidden='true'>
      <path fill='#006A4E' d='M0 0h640v480H0z' />
      <circle cx='320' cy='240' r='160' fill='#F42A41' />
    </svg>
  );
}

const localeFlags: Record<Locale, typeof UkFlag> = {
  en: UkFlag,
  bn: BdFlag,
};

function LocaleFlag({ locale }: { locale: Locale }) {
  const Flag = localeFlags[locale];
  return <Flag className='h-3.75 w-5 shrink-0 overflow-hidden rounded-xs' />;
}

export function LanguageSwitcher() {
  const { locale, dict, changeLocale } = useTranslation();
  const { status } = useSession();
  const [updateProfileInfo] = useUpdateProfileInfoMutation();

  const handleLocaleChange = async (value: Locale) => {
    changeLocale(value);

    // No session yet (e.g. signin page) — nothing to persist server-side,
    // and /auth/me would just fail unauthenticated.
    if (status !== 'authenticated') return;

    const payload = new FormData();
    payload.append('language', value.toUpperCase());
    try {
      await updateProfileInfo(payload).unwrap();
      toast.success(dictionaries[value].navbar.languageUpdateSuccess);
    } catch (error) {
      console.error('Error updating profile info:', error);
      toast.error(dictionaries[value].navbar.languageUpdateError);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'cursor-pointer gap-1.5 border border-gray-200 px-2 dark:border-gray-700',
        )}
      >
        <LocaleFlag locale={locale} />
        <span className='text-xs font-medium uppercase'>{locale}</span>
        <span className='sr-only'>{dict.navbar.language}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => handleLocaleChange(value as Locale)}
        >
          {locales.map((code) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              className='cursor-pointer gap-2'
            >
              <LocaleFlag locale={code} />
              <span className='font-bengali'>{localeLabels[code]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
