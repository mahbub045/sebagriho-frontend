'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  PatientDetailsCardProps,
  PatientFile,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { formatDateAndTime } from '@/utils/formatters';
import { Download, Edit, FileText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import EditPatientFilesDialog from '../../Dialogs/EditPatientFilesDialog';

const PatientFilesCard: React.FC<PatientDetailsCardProps> = ({ patient }) => {
  const { dict } = useTranslation();
  const [isOpenEditPatientDialog, setIsOpenEditPatientDialog] = useState(false);
  const [deletingUid, setDeletingUid] = useState<string | null>(null);

  const [deleteFile] = useEditPatientMutation();

  const handleOpenFile = (file: PatientFile) => {
    window.open(file.file, '_blank', 'noopener,noreferrer');
  };

  const handleDelete = async (event: React.MouseEvent, file: PatientFile) => {
    event.stopPropagation();
    setDeletingUid(file.uid);

    const payload = new FormData();
    payload.append('remove_files', file.uid);

    try {
      await deleteFile({
        patientUid: patient.uid,
        payload,
      }).unwrap();

      toast.success(dict.patients.detail.filesCard.removedSuccessToast);
    } catch {
      toast.error(dict.patients.detail.filesCard.removeErrorToast);
    } finally {
      setDeletingUid(null);
    }
  };

  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center justify-between border-b p-4'>
        <div className='flex items-center gap-2'>
          <FileText className='text-success h-4 w-4' />
          <h3 className='text-sm font-semibold'>
            {dict.patients.detail.filesCard.title.replace(
              '{count}',
              String(patient.files?.length ?? 0),
            )}
          </h3>
        </div>
        <Button
          size='sm'
          variant='default'
          onClick={() => setIsOpenEditPatientDialog(true)}
        >
          <Edit />
          {dict.common.edit}
        </Button>
      </div>
      <div className='flex flex-col gap-2 p-4'>
        {patient.files?.length ? (
          patient.files.map((file) => {
            const isDeleting = deletingUid === file.uid;

            return (
              <div
                key={file.uid}
                className='border-border/60 hover:border-border hover:bg-muted/40 flex items-center justify-between gap-3 rounded-lg border p-3 text-xs transition-colors'
              >
                <div className='flex min-w-0 items-center gap-2'>
                  <FileText className='text-primary h-4 w-4 shrink-0' />
                  <div className='min-w-0'>
                    <p className='truncate font-medium'>{file.name}</p>
                    {file.description && (
                      <p className='text-muted-foreground truncate'>
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className='flex shrink-0 items-center gap-3'>
                  <span className='text-muted-foreground'>
                    {formatDateAndTime(file.created_at)}
                  </span>

                  <div className='border-primary/60 flex items-center gap-0.5 border-l pl-2.5'>
                    <Button
                      type='button'
                      variant='default'
                      size='icon'
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOpenFile(file);
                      }}
                    >
                      <Download className='h-3.5 w-3.5' />
                    </Button>

                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
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
              </div>
            );
          })
        ) : (
          <p className='text-muted-foreground text-xs italic'>
            {dict.patients.detail.filesCard.empty}
          </p>
        )}
      </div>
      <EditPatientFilesDialog
        isOpen={isOpenEditPatientDialog}
        onClose={() => setIsOpenEditPatientDialog(false)}
        patient={patient}
      />
    </Card>
  );
};

export default PatientFilesCard;
