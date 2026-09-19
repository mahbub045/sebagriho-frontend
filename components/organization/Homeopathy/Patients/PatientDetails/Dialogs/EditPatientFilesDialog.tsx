import Loading from '@/components/common/CustomLoader/Loading';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  EditPatientFilesDialogProps,
  FieldErrorMap,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const EditPatientFilesDialog: React.FC<EditPatientFilesDialogProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const { dict } = useTranslation();
  const [uploadFiles, { isLoading: isUploading, error: uploadError }] =
    useEditPatientMutation();
  const [deleteFile] = useEditPatientMutation();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [deletingFileUid, setDeletingFileUid] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnyDeleting = deletingFileUid !== null;

  const fieldErrors: FieldErrorMap =
    (uploadError as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const value = fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

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

    const payload = new FormData();
    payload.append('remove_files', fileUid);

    try {
      await deleteFile({
        patientUid: patient.uid,
        payload,
      }).unwrap();
      toast.success(dict.patients.dialogs.editFiles.fileRemovedToast);
    } catch {
      toast.error(dict.patients.dialogs.editFiles.fileRemoveErrorToast);
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
        patientUid: patient.uid,
        payload,
      }).unwrap();
      toast.success(dict.patients.dialogs.editFiles.filesUploadedToast);
      handleClose();
    } catch {
      toast.error(dict.patients.dialogs.editFiles.filesUploadErrorToast);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.patients.dialogs.editFiles.title}
          </DialogTitle>
          <DialogDescription>
            {dict.patients.dialogs.editFiles.description}
          </DialogDescription>
        </DialogHeader>
        <form
          key={patient.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          {patient.files && patient.files.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>{dict.patients.dialogs.editFiles.existingFiles}</Label>
              <div className='flex flex-col gap-2'>
                {patient.files.map((file) => {
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
              {dict.patients.dialogs.editFiles.uploadFiles}
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
              {dict.patients.dialogs.editFiles.chooseFiles}
            </Button>
            {getFieldError('upload_files') && (
              <p className='text-destructive text-xs'>
                {getFieldError('upload_files')}
              </p>
            )}
          </div>

          {selectedFiles.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>
                {dict.patients.dialogs.editFiles.selectedFiles.replace(
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
              {dict.patients.dialogs.editFiles.upload}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientFilesDialog;
