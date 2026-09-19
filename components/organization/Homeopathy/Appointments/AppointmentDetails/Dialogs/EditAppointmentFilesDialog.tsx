'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEditAppointmentMutation } from '@/lib/services/endpoints/organization/Homeopathy/Appointments/AppointmentsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { EditAppointmentFilesDialogProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';

import { FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const EditAppointmentFilesDialog: React.FC<EditAppointmentFilesDialogProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  const { dict } = useTranslation();
  const [uploadFiles, { isLoading: isUploading }] =
    useEditAppointmentMutation();
  const [deleteFile] = useEditAppointmentMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deletingFileUid, setDeletingFileUid] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnyDeleting = deletingFileUid !== null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = '';
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = async (fileUid: string) => {
    setDeletingFileUid(fileUid);

    const formData = new FormData();
    formData.append('remove_files', fileUid);

    try {
      await deleteFile({
        appointmentUid: appointment.uid,
        appointmentData: formData,
      }).unwrap();
      toast.success(dict.appointments.editFilesDialog.fileRemoved);
    } catch {
      toast.error(dict.appointments.editFilesDialog.fileRemoveError);
    } finally {
      setDeletingFileUid(null);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      handleClose();
      return;
    }

    const payload = new FormData();
    selectedFiles.forEach((file) => {
      payload.append('upload_files', file);
    });

    try {
      await uploadFiles({
        appointmentUid: appointment.uid,
        appointmentData: payload,
      }).unwrap();
      toast.success(dict.appointments.editFilesDialog.uploadSuccess);
      handleClose();
    } catch {
      toast.error(dict.appointments.editFilesDialog.uploadError);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.appointments.editFilesDialog.title}
          </DialogTitle>
          <DialogDescription>
            {dict.appointments.editFilesDialog.description}
          </DialogDescription>
        </DialogHeader>

        <form
          key={appointment.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          {appointment.files && appointment.files.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>{dict.appointments.editFilesDialog.existingFiles}</Label>
              <div className='flex flex-col gap-2'>
                {appointment.files.map((file) => {
                  const isDeletingThis = deletingFileUid === file.uid;
                  return (
                    <div
                      key={file.uid}
                      className='border-border/60 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs'
                    >
                      <div className='flex min-w-0 items-center gap-2'>
                        <FileText className='text-primary h-4 w-4 shrink-0' />
                        <span className='truncate'>{file.name}</span>
                      </div>
                      <button
                        type='button'
                        onClick={() => handleDeleteExistingFile(file.uid)}
                        disabled={isAnyDeleting || isUploading}
                        className='text-muted-foreground hover:text-destructive shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
                      >
                        {isDeletingThis ? (
                          <Loading className='h-3.5 w-3.5' />
                        ) : (
                          <X className='text-danger h-3.5 w-3.5' />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='upload_files'>
              {dict.appointments.editFilesDialog.uploadFiles}
            </Label>
            <input
              ref={fileInputRef}
              id='upload_files'
              type='file'
              multiple
              className='hidden'
              onChange={handleFileChange}
            />
            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnyDeleting || isUploading}
              className='justify-center'
            >
              <Upload className='h-4 w-4' />
              {dict.appointments.editFilesDialog.chooseFiles}
            </Button>
          </div>

          {selectedFiles.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>
                {dict.appointments.editFilesDialog.selectedFiles.replace(
                  '{count}',
                  String(selectedFiles.length),
                )}
              </Label>
              <div className='flex flex-col gap-2'>
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className='border-border/60 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs'
                  >
                    <div className='flex min-w-0 items-center gap-2'>
                      <FileText className='text-muted-foreground h-4 w-4 shrink-0' />
                      <span className='truncate'>{file.name}</span>
                    </div>
                    <button
                      type='button'
                      onClick={() => handleRemoveSelectedFile(index)}
                      disabled={isAnyDeleting || isUploading}
                      className='text-muted-foreground hover:text-destructive shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
                    >
                      <X className='text-danger h-3.5 w-3.5' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isUploading || isAnyDeleting}
            >
              {dict.common.cancel}
            </Button>
            <Button type='submit' disabled={isUploading || isAnyDeleting}>
              {isUploading && <Loading className='h-4 w-4 text-white!' />}
              {dict.appointments.editFilesDialog.upload}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentFilesDialog;
