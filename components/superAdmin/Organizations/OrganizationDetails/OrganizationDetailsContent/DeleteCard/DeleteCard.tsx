'use client';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { TriangleAlert } from 'lucide-react';
import DeleteOrganizationDialog from '../Dialogs/DeleteOrganizationDialog';

type Props = {
  organizationUid: string;
  organizationName: string;
};

const DeleteCard: React.FC<Props> = ({ organizationUid, organizationName }) => {
  const { dict } = useTranslation();

  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          {dict.organizations.deleteCard.warningPrefix}{' '}
          <span className='text-foreground font-medium'>
            {organizationName}
          </span>{' '}
          {dict.organizations.deleteCard.warningSuffix}
        </p>
      </div>

      <DeleteOrganizationDialog
        organizationUid={organizationUid}
        organizationName={organizationName}
      />
    </div>
  );
};

export default DeleteCard;
