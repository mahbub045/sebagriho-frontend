'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FilesCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatDateAndTime } from '@/utils/formatters';
import { Download, Edit, FileText } from 'lucide-react';
import { useState } from 'react';
import EditAppointmentFilesDialog from '../../Dialogs/EditAppointmentFilesDialog';

const FilesCard: React.FC<FilesCardProps> = ({ appointment }) => {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b p-4'>
        <div className='flex items-center gap-2'>
          <FileText className='text-warning h-4 w-4' />
          <h3 className='text-sm font-semibold'>
            Files ({appointment.files?.length ?? 0})
          </h3>
        </div>

        <Button
          size='sm'
          variant='default'
          onClick={() => setIsOpenEditDialog(true)}
        >
          <Edit className='h-3.5 w-3.5' />
          Edit
        </Button>
      </div>

      <div className='flex flex-col gap-2 p-4'>
        {appointment.files?.length ? (
          appointment.files.map((file) => (
            <a
              key={file.uid}
              href={file.file}
              target='_blank'
              rel='noopener noreferrer'
              className='border-border/60 hover:border-border hover:bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3 text-xs transition-colors'
            >
              <div className='flex min-w-0 items-center gap-2'>
                <FileText className='text-primary h-4 w-4 shrink-0' />
                <p className='truncate font-medium'>{file.name}</p>
              </div>

              <div className='text-muted-foreground flex shrink-0 items-center gap-2'>
                {file.uploaded_at && (
                  <span>{formatDateAndTime(file.uploaded_at)}</span>
                )}
                <Download className='text-primary h-3.5 w-3.5' />
              </div>
            </a>
          ))
        ) : (
          <p className='text-muted-foreground text-xs italic'>
            No files uploaded.
          </p>
        )}
      </div>

      <EditAppointmentFilesDialog
        isOpen={isOpenEditDialog}
        onClose={() => setIsOpenEditDialog(false)}
        appointment={appointment}
      />
    </Card>
  );
};

export default FilesCard;
