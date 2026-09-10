'use client';

import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import { HOMEOPATHIC_MEDICINE_STATUS_OPTIONS } from '@/data/common/ChoiceFields';
import { HP_MEDICINE_INITIAL_STATE } from '@/data/Organization/Medicines/MedicinesData';
import { useAddMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  AddMedicineDialogProps,
  FilePreview,
  FormState,
  MedicineStatus,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getFieldErrors } from '@/utils/commonFunctions';
import { getCurrencySymbol } from '@/utils/constants';
import { toast } from 'sonner';

const AddMedicineDialog: React.FC<AddMedicineDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [addMedicine, { isLoading, error }] = useAddMedicineMutation();

  const [form, setForm] = useState<FormState>(HP_MEDICINE_INITIAL_STATE);
  const [files, setFiles] = useState<FilePreview[]>([]);

  const fieldErrors = getFieldErrors(error);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetAndClose = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setForm(HP_MEDICINE_INITIAL_STATE);
    setFiles([]);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = new FormData();

    payload.append('name', form.name);
    payload.append('power', form.power);
    payload.append('expiration_date', form.expiration_date);
    payload.append('is_available', String(form.is_available));
    payload.append('manufacturer', form.manufacturer);
    payload.append('total_quantity', form.total_quantity);
    payload.append('unit_price', form.unit_price);
    payload.append('description', form.description);
    payload.append('batch_number', form.batch_number);
    payload.append('status', form.status);

    files.forEach(({ file }) => payload.append('upload_files', file));

    try {
      await addMedicine(payload).unwrap();
      resetAndClose();
      toast.success('Medicine added successfully.');
    } catch {
      // error is already surfaced via the `error` state / fieldErrors below
      toast.error(
        'Failed to add medicine. Please check the form and try again.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-185'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Add Medicine
          </DialogTitle>
          <DialogDescription>
            Fill in the details of the new medicine to add it to the inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-4 py-2'>
            {/* Name + Power */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='name'>
                  Name
                  <span className='text-danger'>*</span>
                </Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder='e.g., Montair'
                  required
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <p className='text-danger text-xs'>{fieldErrors.name}</p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='power'>Power</Label>
                <Input
                  id='power'
                  name='power'
                  type='number'
                  value={form.power}
                  onChange={(e) => updateField('power', e.target.value)}
                  placeholder='e.g., 30'
                  aria-invalid={!!fieldErrors.power}
                />
                {fieldErrors.power && (
                  <p className='text-danger text-xs'>{fieldErrors.power}</p>
                )}
              </div>
            </div>

            {/* Manufacturer + Batch number */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='manufacturer'>Manufacturer</Label>
                <Input
                  type='text'
                  id='manufacturer'
                  name='manufacturer'
                  value={form.manufacturer}
                  onChange={(e) => updateField('manufacturer', e.target.value)}
                  placeholder='e.g., Boiron'
                  aria-invalid={!!fieldErrors.manufacturer}
                />
                {fieldErrors.manufacturer && (
                  <p className='text-danger text-xs'>
                    {fieldErrors.manufacturer}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='batch_number'>Batch Number</Label>
                <Input
                  type='text'
                  id='batch_number'
                  name='batch_number'
                  value={form.batch_number}
                  onChange={(e) => updateField('batch_number', e.target.value)}
                  placeholder='e.g., ARN-2026-001'
                  aria-invalid={!!fieldErrors.batch_number}
                />
                {fieldErrors.batch_number && (
                  <p className='text-danger text-xs'>
                    {fieldErrors.batch_number}
                  </p>
                )}
              </div>
            </div>

            {/* Quantity + Unit price */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='total_quantity'>
                  Total Quantity
                  <span className='text-danger'>*</span>
                </Label>
                <Input
                  id='total_quantity'
                  name='total_quantity'
                  type='number'
                  value={form.total_quantity}
                  onChange={(e) =>
                    updateField('total_quantity', e.target.value)
                  }
                  placeholder='e.g., 100'
                  required
                  aria-invalid={!!fieldErrors.total_quantity}
                />
                {fieldErrors.total_quantity && (
                  <p className='text-danger text-xs'>
                    {fieldErrors.total_quantity}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='unit_price'>
                  Unit Price({getCurrencySymbol()})
                  <span className='text-danger'>*</span>
                </Label>
                <Input
                  id='unit_price'
                  name='unit_price'
                  type='number'
                  step='0.01'
                  value={form.unit_price}
                  onChange={(e) => updateField('unit_price', e.target.value)}
                  placeholder='e.g., 25.50'
                  required
                  aria-invalid={!!fieldErrors.unit_price}
                />
                {fieldErrors.unit_price && (
                  <p className='text-danger text-xs'>
                    {fieldErrors.unit_price}
                  </p>
                )}
              </div>
            </div>

            {/* Expiration + Status */}
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='expiration_date'>
                  Expiration Date
                  <span className='text-danger'>*</span>
                </Label>
                <Input
                  id='expiration_date'
                  name='expiration_date'
                  type='date'
                  value={form.expiration_date}
                  onChange={(e) =>
                    updateField('expiration_date', e.target.value)
                  }
                  required
                  aria-invalid={!!fieldErrors.expiration_date}
                />
                {fieldErrors.expiration_date && (
                  <p className='text-danger text-xs'>
                    {fieldErrors.expiration_date}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label>Status</Label>
                <Select
                  items={HOMEOPATHIC_MEDICINE_STATUS_OPTIONS}
                  value={form.status}
                  onValueChange={(value) =>
                    updateField('status', value as MedicineStatus)
                  }
                >
                  <SelectTrigger id='status' className='w-full'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>

                  <SelectContent>
                    {HOMEOPATHIC_MEDICINE_STATUS_OPTIONS.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.status && (
                  <p className='text-danger text-xs'>{fieldErrors.status}</p>
                )}
              </div>
            </div>

            {/* Is available */}
            <div className='flex items-center justify-between rounded-lg border p-3'>
              <Label htmlFor='is_available' className='cursor-pointer'>
                Available
              </Label>
              <Switch
                id='is_available'
                checked={form.is_available}
                onCheckedChange={(checked) =>
                  updateField('is_available', checked)
                }
              />
            </div>

            {/* Description */}
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                name='description'
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder='e.g., Used for bruising and muscle soreness.'
                rows={3}
                className='field-sizing-fixed'
                aria-invalid={!!fieldErrors.description}
              />
              {fieldErrors.description && (
                <p className='text-danger text-xs'>{fieldErrors.description}</p>
              )}
            </div>

            {/* Files */}
            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <Label>Files</Label>

                {files.length > 0 && (
                  <button
                    type='button'
                    onClick={() => {
                      files.forEach((f) => URL.revokeObjectURL(f.url));
                      setFiles([]);
                    }}
                    className='text-muted-foreground hover:text-danger text-xs font-medium underline-offset-2 hover:underline'
                  >
                    Clear all
                  </button>
                )}
              </div>

              <label
                htmlFor='files'
                className='border-border hover:bg-muted/50 flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed py-6 text-center transition-colors'
              >
                <Upload className='text-muted-foreground h-5 w-5' />
                <span className='text-muted-foreground text-sm'>
                  Click to upload images
                </span>
                <input
                  id='files'
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={(e) => handleFilesSelected(e.target.files)}
                />
              </label>

              {files.length > 0 && (
                <div className='mt-2 grid grid-cols-4 gap-2'>
                  {files.map((preview, index) => (
                    <div
                      key={preview.url}
                      className='border-border relative aspect-square overflow-hidden rounded-md border'
                    >
                      <Image
                        src={preview.url}
                        alt={preview.file.name}
                        fill
                        sizes='80px'
                        className='object-cover'
                      />

                      <button
                        type='button'
                        onClick={() => removeFile(index)}
                        className='absolute top-1 right-1 cursor-pointer rounded-full bg-black/70 p-1 text-white shadow-sm transition-colors hover:bg-black/90'
                      >
                        <X className='text-danger h-3 w-3' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {fieldErrors.upload_files && (
                <p className='text-danger text-xs'>
                  {fieldErrors.upload_files}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={resetAndClose}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
              Add Medicine
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineDialog;
