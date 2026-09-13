'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import {
  AppointmentFile,
  FilesCardProps,
} from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatDateAndTime } from '@/utils/formatters';
import { Download, Edit, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import EditAppointmentFilesDialog from '../../Dialogs/EditAppointmentFilesDialog';

const FilesCard: React.FC<FilesCardProps> = ({ appointment }) => {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  const [editAppointment] = useEditAppointmentMutation();

  const handleOpenFile = (file: AppointmentFile) => {
    window.open(file.file, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (
    event: React.MouseEvent,
    file: AppointmentFile,
  ) => {
    event.stopPropagation();
    setDeletingUid(file.uid);

    const formData = new FormData();
    formData.append('remove_files', file.uid);

    try {
      await editAppointment({
        appointmentUid: appointment.uid,
        appointmentData: formData,
      }).unwrap();

      toast.success('File removed successfully!');
    } catch {
      toast.error('Failed to remove file. Please try again.');
    } finally {
      setDeletingUid(null);
    }
  };

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
          appointment.files.map((file) => {
            const isDeleting = deletingUid === file.uid;

            return (
              <div
                key={file.uid}
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

                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='h-6 w-6'
                    onClick={() => handleOpenFile(file)}
                  >
                    <Download className='text-primary h-3.5 w-3.5' />
                  </Button>

                  <Button
                    type='button'
                    variant='destructive'
                    size='icon'
                    className='text-muted-foreground hover:text-destructive h-6 w-6'
                    onClick={(event) => handleDelete(event, file)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loading className='h-3.5 w-3.5' />
                    ) : (
                      <Trash2 className='h-3.5 w-3.5' />
                    )}
                  </Button>
                </div>
              </div>
            );
          })
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
