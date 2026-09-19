'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Construction, Sparkles } from 'lucide-react';

const UnderDevelopment: React.FC = () => {
  const { dict } = useTranslation();

  return (
    <div className='flex h-full items-center justify-center px-4 py-10'>
      <div className='bg-card relative w-full max-w-2xl overflow-hidden rounded-3xl border p-8 shadow-sm sm:p-12'>
        {/* Decorative background */}
        <div className='bg-primary/10 pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full blur-3xl' />
        <div className='bg-secondary/10 pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full blur-3xl' />

        <div className='relative flex flex-col items-center text-center'>
          {/* Icon */}
          <div className='from-primary/15 to-secondary/20 ring-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br ring-1'>
            <div className='bg-primary/10 flex h-14 w-14 items-center justify-center rounded-xl'>
              <Construction className='text-primary h-7 w-7' />
            </div>
          </div>

          {/* Badge */}
          <div className='border-secondary/30 bg-secondary/10 text-secondary-foreground mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium'>
            <Sparkles className='text-secondary h-3.5 w-3.5' />
            {dict.underDevelopment.comingSoon}
          </div>

          {/* Heading */}
          <h1 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
            {dict.underDevelopment.heading}
          </h1>

          {/* Description */}
          <p className='text-muted-foreground mt-3 max-w-lg text-sm leading-6 sm:text-base'>
            {dict.underDevelopment.description}
          </p>

          {/* Progress decoration */}
          <div className='mt-8 w-full max-w-sm'>
            <div className='mb-2 flex items-center justify-between text-xs'>
              <span className='text-muted-foreground font-medium'>
                {dict.underDevelopment.developmentInProgress}
              </span>
              <span className='text-primary font-semibold'>
                {dict.underDevelopment.comingSoonShort}
              </span>
            </div>

            <div className='bg-muted h-2 overflow-hidden rounded-full'>
              <div className='from-primary to-secondary h-full w-2/3 rounded-full bg-linear-to-r' />
            </div>
          </div>

          {/* Footer */}
          <div className='text-muted-foreground mt-8 flex items-center gap-2 text-xs'>
            <span className='bg-secondary h-1.5 w-1.5 rounded-full' />
            <span>{dict.underDevelopment.thankYou}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
