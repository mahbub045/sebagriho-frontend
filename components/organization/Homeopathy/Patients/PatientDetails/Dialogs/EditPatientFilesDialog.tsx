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
  const [editPatient, { isLoading, error }] = useEditPatientMutation();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fieldErrors: FieldErrorMap =
    (error as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const value = fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    // reset input so selecting the same file again still fires onChange
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
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
      await editPatient({
        patientUid: patient.uid,
        payload,
      }).unwrap();
      toast.success('Files uploaded successfully');
      handleClose();
    } catch {
      toast.error('Failed to upload files. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Patient Files</DialogTitle>
          <DialogDescription>
            Upload additional files for this patient.
          </DialogDescription>
        </DialogHeader>
        <form
          key={patient.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          {patient.files && patient.files.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>Existing Files</Label>
              <div className='flex flex-col gap-2'>
                {patient.files.map((file) => (
                  <div
                    key={file.uid}
                    className='border-border/60 flex items-center gap-2 rounded-lg border p-2 text-xs'
                  >
                    <FileText className='text-muted-foreground h-4 w-4 shrink-0' />
                    <span className='truncate'>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='upload_files'>Upload Files</Label>
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

          {selectedFiles.length > 0 && (
            <div className='flex flex-col gap-1.5'>
              <Label>Selected Files ({selectedFiles.length})</Label>
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
                      onClick={() => handleRemoveFile(index)}
                      className='text-muted-foreground hover:text-destructive shrink-0'
                    >
                      <X className='h-3.5 w-3.5' />
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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientFilesDialog;
