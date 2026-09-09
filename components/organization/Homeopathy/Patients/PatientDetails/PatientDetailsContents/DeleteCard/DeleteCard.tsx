import { TriangleAlert } from 'lucide-react';

type Props = {
  patientuid: string;
  patientName: string;
};

const DeleteCard: React.FC<Props> = ({ patientuid, patientName }) => {
  return (
    <div className='border-danger/20 bg-danger/5 flex w-full flex-col gap-4 rounded-xl border p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex items-start gap-3'>
        <TriangleAlert className='text-danger mt-0.5 h-4 w-4 shrink-0' />
        <p className='text-muted-foreground text-sm leading-relaxed'>
          This permanently removes{' '}
          <span className='text-foreground font-medium'>{patientName}</span> and
          all its data. This can&apos;t be undone.
        </p>
      </div>

      {/* <DeleteOrganizationDialog
        organizationUid={organizationUid}
        organizationName={organizationName}
      /> */}
    </div>
  );
};

export default DeleteCard;
