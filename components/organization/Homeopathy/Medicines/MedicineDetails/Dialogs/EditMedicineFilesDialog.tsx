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
import Image from 'next/image';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const EditMedicineFilesDialog: React.FC<EditMedicineOverviewDialogProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  // Upload mutation
  const [uploadMedicine, { isLoading: isUploading, error: uploadError }] =
    useEditMedicineMutation();

  // Remove mutation
  const [removeMedicine, { isLoading: isRemoving, error: removeError }] =
    useEditMedicineMutation();

  const [formData, setFormData] = useState<MedicineFilesFormData>({
    files: [],
  });

  const [deletingFileUid, setDeletingFileUid] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadApiError = uploadError as ApiValidationError | undefined;

  const removeApiError = removeError as ApiValidationError | undefined;

  const getUploadFieldError = (field: string) => {
    const value = uploadApiError?.data?.[field];

    if (!value) {
      return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
  };

  const getRemoveFieldError = (field: string) => {
    const value = removeApiError?.data?.[field];

    if (!value) {
      return undefined;
    }

    return Array.isArray(value) ? value[0] : value;
  };

  // -----------------------------
  // Select files
  // -----------------------------

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

  // -----------------------------
  // Remove selected file
  // -----------------------------

  const handleRemoveSelectedFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  // -----------------------------
  // Remove existing file
  // -----------------------------

  const handleDeleteExistingFile = async (fileUid: string) => {
    if (!medicine.uid) {
      return;
    }

    setDeletingFileUid(fileUid);

    const payload = new FormData();

    payload.append('remove_files', fileUid);

    try {
      await removeMedicine({
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

  // -----------------------------
  // Close dialog
  // -----------------------------

  const handleClose = () => {
    setFormData({
      files: [],
    });

    setDeletingFileUid(null);

    onClose();
  };

  // -----------------------------
  // Upload files
  // -----------------------------

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!medicine.uid) {
      return;
    }

    if (formData.files.length === 0) {
      return;
    }

    const payload = new FormData();

    formData.files.forEach((file) => {
      payload.append('upload_files', file);
    });

    try {
      await uploadMedicine({
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
      <DialogContent className='w-[calc(100%-2rem)] max-w-md overflow-x-hidden overflow-y-auto p-4'>
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
          className='flex min-w-0 flex-col gap-5 p-1'
        >
          {/* Existing Files */}
          {medicine.files && medicine.files.length > 0 && (
            <div className='flex min-w-0 flex-col gap-1.5'>
              <Label>Existing Files</Label>

              <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {medicine.files.map((file) => {
                  const isDeletingThis = deletingFileUid === file.uid;

                  return (
                    <div
                      key={file.uid}
                      className='group relative overflow-hidden rounded-lg border'
                    >
                      <a
                        href={file.file}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block'
                      >
                        <div className='relative h-20 w-full'>
                          <Image
                            src={file.file}
                            alt={file.name || 'Medicine file'}
                            fill
                            sizes='(max-width: 540px) 50vw, 120px'
                            className='object-cover transition-opacity group-hover:opacity-80'
                          />
                        </div>
                      </a>

                      {/* Remove */}
                      <button
                        type='button'
                        onClick={() => handleDeleteExistingFile(file.uid)}
                        disabled={isRemoving}
                        className='bg-danger/80 hover:bg-danger absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-50'
                        aria-label={`Remove ${file.name || 'file'}`}
                      >
                        {isDeletingThis && isRemoving ? (
                          <Loading className='h-3.5 w-3.5' />
                        ) : (
                          <X className='h-3.5 w-3.5' />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {getRemoveFieldError('remove_files') && (
                <p className='text-destructive text-xs'>
                  {getRemoveFieldError('remove_files')}
                </p>
              )}
            </div>
          )}

          {/* Upload Files */}
          <div className='flex min-w-0 flex-col gap-1.5'>
            <Label htmlFor='medicine-upload-files'>Upload Files</Label>

            <input
              ref={fileInputRef}
              id='upload_files'
              type='file'
              accept='image/*'
              multiple
              className='hidden'
              onChange={handleFileChange}
            />

            <Button
              type='button'
              variant='outline'
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className='w-full justify-center'
            >
              <Upload className='h-4 w-4' />
              Choose Files
            </Button>

            {getUploadFieldError('upload_files') && (
              <p className='text-destructive text-xs'>
                {getUploadFieldError('upload_files')}
              </p>
            )}
          </div>

          {/* Selected Files */}
          {formData.files.length > 0 && (
            <div className='flex min-w-0 flex-col gap-1.5'>
              <Label>Selected Files ({formData.files.length})</Label>

              <div className='flex min-w-0 flex-col gap-2'>
                {formData.files.map((file, index) => (
                  <div
                    key={`${file.name}-${file.lastModified}-${index}`}
                    className='border-border/60 flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-lg border p-2 text-xs'
                  >
                    <FileText className='text-muted-foreground h-4 w-4 shrink-0' />

                    <span className='min-w-0 flex-1 truncate' title={file.name}>
                      {file.name}
                    </span>

                    <button
                      type='button'
                      onClick={() => handleRemoveSelectedFile(index)}
                      disabled={isUploading}
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
              disabled={isUploading || isRemoving}
            >
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={isUploading || formData.files.length === 0}
            >
              {isUploading && <Loading className='h-4 w-4 text-white!' />}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineFilesDialog;
