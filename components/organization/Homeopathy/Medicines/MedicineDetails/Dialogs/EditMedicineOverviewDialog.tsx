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
import { Switch } from '@/components/ui/switch';
import { useEditMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  EditMedicineOverviewDialogProps,
  MedicineFormData,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getChangedFields } from '@/utils/commonFunctions';
import { useState } from 'react';
import { toast } from 'sonner';

const getFieldError = (
  error: unknown,
  field: keyof MedicineFormData,
): string | undefined => {
  if (!error || typeof error !== 'object') return undefined;

  const data = (error as { data?: unknown }).data;
  if (!data || typeof data !== 'object') return undefined;

  const dataObj = data as Record<string, unknown>;
  const errorsObj =
    dataObj.errors && typeof dataObj.errors === 'object'
      ? (dataObj.errors as Record<string, unknown>)
      : dataObj;

  const fieldError = errorsObj[field];

  if (!fieldError) return undefined;
  if (Array.isArray(fieldError)) return String(fieldError[0]);
  return String(fieldError);
};

const getGeneralError = (error: unknown): string | undefined => {
  if (!error || typeof error !== 'object') return undefined;
  const data = (error as { data?: unknown }).data;
  if (data && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>;
    if (typeof dataObj.message === 'string') return dataObj.message;
  }
  return 'Something went wrong while updating the medicine.';
};

const EditMedicineOverviewDialog: React.FC<EditMedicineOverviewDialogProps> = ({
  isOpen,
  onClose,
  medicine,
}) => {
  const [editMedicine, { isLoading, error }] = useEditMedicineMutation();

  const getInitialData = (): MedicineFormData => ({
    name: medicine?.name ?? '',
    power: medicine?.power?.toString() ?? '',
    manufacturer: medicine?.manufacturer ?? '',
    batch_number: medicine?.batch_number ?? '',
    status: medicine?.status ?? 'AVAILABLE',
  });

  const [formData, setFormData] = useState<MedicineFormData>(getInitialData());
  const [initialData, setInitialData] =
    useState<MedicineFormData>(getInitialData());

  const handleChange = (field: keyof MedicineFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      status: checked ? 'AVAILABLE' : 'UNAVAILABLE',
    }));
  };

  const isUnchanged = JSON.stringify(formData) === JSON.stringify(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnchanged) return;

    const changedFields = getChangedFields(formData, initialData);

    try {
      await editMedicine({
        medicineUid: medicine.uid,
        payload: changedFields,
      }).unwrap();
      toast.success('Medicine updated successfully');
      onClose();
    } catch (err) {
      console.error('Failed to update medicine:', err);
      toast.error(
        getGeneralError(err) ?? 'Failed to update medicine. Please try again.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Edit Medicine
          </DialogTitle>
          <DialogDescription>
            Update the details of the medicine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input
              type='text'
              id='name'
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              aria-invalid={!!getFieldError(error, 'name')}
            />
            {getFieldError(error, 'name') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'name')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='power'>Power</Label>
            <Input
              type='number'
              id='power'
              value={formData.power}
              onChange={(e) => handleChange('power', e.target.value)}
              aria-invalid={!!getFieldError(error, 'power')}
            />
            {getFieldError(error, 'power') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'power')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='manufacturer'>Manufacturer</Label>
            <Input
              type='text'
              id='manufacturer'
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              aria-invalid={!!getFieldError(error, 'manufacturer')}
            />
            {getFieldError(error, 'manufacturer') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'manufacturer')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='batch_number'>Batch Number</Label>
            <Input
              type='text'
              id='batch_number'
              value={formData.batch_number}
              onChange={(e) => handleChange('batch_number', e.target.value)}
              aria-invalid={!!getFieldError(error, 'batch_number')}
            />
            {getFieldError(error, 'batch_number') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'batch_number')}
              </p>
            )}
          </div>

          <div className='flex items-center justify-between space-y-2'>
            <div>
              <Label htmlFor='status'>Status</Label>
              <p className='text-muted-foreground text-sm'>
                {formData.status === 'AVAILABLE' ? 'Available' : 'Unavailable'}
              </p>
            </div>
            <Switch
              id='status'
              checked={formData.status === 'AVAILABLE'}
              onCheckedChange={handleStatusToggle}
              aria-invalid={!!getFieldError(error, 'status')}
              className='cursor-pointer'
            />
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isUnchanged || isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineOverviewDialog;
