'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';

const AppFooter: React.FC = () => {
  const { dict } = useTranslation();

  return (
    <footer className='bg-background mt-auto border-t px-4 py-4 md:px-6'>
      <div className='text-muted-foreground flex flex-col items-center justify-between gap-2 text-xs sm:flex-row'>
        <p>
          © {new Date().getFullYear()} Sebagriho. {dict.footer.allRightsReserved}
        </p>
        <div className='flex items-center gap-4'>
          <span>{dict.footer.privacy}</span>
          <span>{dict.footer.terms}</span>
          <span>{dict.footer.support}</span>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
