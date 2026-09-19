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

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  bn: '🇧🇩',
};

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
        <span className='text-base leading-none'>{localeFlags[locale]}</span>
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
              <span className='text-base leading-none'>
                {localeFlags[code]}
              </span>
              <span className='font-bengali'>{localeLabels[code]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
