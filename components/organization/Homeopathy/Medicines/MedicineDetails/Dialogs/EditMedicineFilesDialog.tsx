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
import { useEditMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  ApiValidationError,
  EditMedicineOverviewDialogProps,
  MedicineFilesFormData,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { FileText, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const EditMedicineFilesDialog: React.FC<EditMedicineOverviewDialogProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  const [editMedicine, { isLoading, error }] = useEditMedicineMutation();

  const [formData, setFormData] = useState<MedicineFilesFormData>({
    files: [],
  });

  const [deletingFileUid, setDeletingFileUid] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAnyDeleting = deletingFileUid !== null;

  const apiError = error as ApiValidationError | undefined;

  const getFieldError = (field: string) => {
    const value = apiError?.data?.[field];

    if (!value) {
      return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...Array.from(files)],
    }));

    // Allow selecting the same file again
    event.target.value = '';
  };

  const handleRemoveSelectedFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  const handleDeleteExistingFile = async (fileUid: string) => {
    if (!medicine.uid) {
      return;
    }

    setDeletingFileUid(fileUid);

    const payload = new FormData();
    payload.append('remove_files', fileUid);

    try {
      await editMedicine({
        medicineUid: medicine.uid,
        payload,
      }).unwrap();

      toast.success('File removed successfully');
    } catch (error) {
      console.error('Failed to remove medicine file:', error);

      toast.error('Failed to remove file. Please try again.');
    } finally {
      setDeletingFileUid(null);
    }
  };

  const handleClose = () => {
    setFormData({
      files: [],
    });

    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!medicine.uid) {
      return;
    }

    if (formData.files.length === 0) {
      handleClose();
      return;
    }

    const payload = new FormData();

    formData.files.forEach((file) => {
      payload.append('upload_files', file);
    });

    try {
      await editMedicine({
        medicineUid: medicine.uid,
        payload,
      }).unwrap();

      toast.success('Files uploaded successfully');

      handleClose();
    } catch (error) {
      console.error('Failed to upload medicine files:', error);

      toast.error('Failed to upload files. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Edit Medicine Files
          </DialogTitle>

          <DialogDescription>
            Manage and upload files for this medicine.
          </DialogDescription>
        </DialogHeader>

        <form
          key={medicine.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          {/* Existing Files */}
          {medicine.files && medicine.files.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>Existing Files</Label>

              <div className='flex flex-col gap-2'>
                {medicine.files.map((file) => {
                  const isDeletingThis = deletingFileUid === file.uid;

                  return (
                    <div
                      key={file.uid}
                      className='border-border/60 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs'
                    >
                      <div className='flex min-w-0 items-center gap-2'>
                        <FileText className='text-primary h-4 w-4 shrink-0' />
                        <span className='max-w-55 truncate' title={file.name}>
                          {file.name || 'Unnamed file'}
                        </span>
                      </div>

                      <button
                        type='button'
                        onClick={() => handleDeleteExistingFile(file.uid)}
                        disabled={isAnyDeleting || isLoading}
                        className='text-muted-foreground hover:text-destructive shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
                        aria-label={`Remove ${file.name || 'file'}`}
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

          {/* Upload Files */}
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='medicine-upload-files'>Upload Files</Label>

            <input
              ref={fileInputRef}
              id='medicine-upload-files'
              type='file'
              multiple
              className='hidden'
              onChange={handleFileChange}
            />

            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnyDeleting || isLoading}
              className='justify-center'
            >
              <Upload className='h-4 w-4' />
              Choose Files
            </Button>

            {getFieldError('upload_files') && (
              <p className='text-destructive text-xs'>
                {getFieldError('upload_files')}
              </p>
            )}
          </div>

          {/* Selected Files */}
          {formData.files.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>Selected Files ({formData.files.length})</Label>

              <div className='flex flex-col gap-2'>
                {formData.files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className='border-border/60 flex items-center justify-between gap-2 rounded-lg border p-2 text-xs'
                  >
                    <div className='flex min-w-0 items-center gap-2'>
                      <FileText className='text-muted-foreground h-4 w-4 shrink-0' />

                      <span className='truncate' title={file.name}>
                        {file.name}
                      </span>
                    </div>

                    <button
                      type='button'
                      onClick={() => handleRemoveSelectedFile(index)}
                      disabled={isAnyDeleting || isLoading}
                      className='text-muted-foreground hover:text-destructive shrink-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40'
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className='text-danger h-3.5 w-3.5' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              disabled={isLoading || isAnyDeleting}
            >
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={
                isLoading || isAnyDeleting || formData.files.length === 0
              }
            >
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineFilesDialog;
