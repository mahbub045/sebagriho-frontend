import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useEditMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  EditMedicineOverviewDialogProps,
  MedicineDescriptionFormData,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getChangedFields } from '@/utils/commonFunctions';
import { useState } from 'react';
import { toast } from 'sonner';

const getFieldError = (
  error: unknown,
  field: keyof MedicineDescriptionFormData,
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

  if (Array.isArray(fieldError)) {
    return String(fieldError[0]);
  }

  return String(fieldError);
};

const getGeneralError = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Something went wrong while updating the medicine description.';
  }

  const data = (error as { data?: unknown }).data;

  if (data && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>;

    if (typeof dataObj.message === 'string') {
      return dataObj.message;
    }
  }

  return 'Something went wrong while updating the medicine description.';
};

const EditMedicineDescriptionDialog: React.FC<
  EditMedicineOverviewDialogProps
> = ({ isOpen, onClose, medicine }) => {
  const [editMedicine, { isLoading, error }] = useEditMedicineMutation();

  const getInitialData = (): MedicineDescriptionFormData => ({
    description: medicine?.description ?? '',
  });

  const [formData, setFormData] =
    useState<MedicineDescriptionFormData>(getInitialData());

  const [initialData, setInitialData] =
    useState<MedicineDescriptionFormData>(getInitialData());

  const handleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const isUnchanged = formData.description === initialData.description;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isUnchanged || !medicine?.uid) return;

    const changedFields = getChangedFields(formData, initialData);

    try {
      await editMedicine({
        medicineUid: medicine.uid,
        payload: changedFields,
      }).unwrap();

      toast.success('Medicine description updated successfully');

      setInitialData(formData);
      onClose();
    } catch (err) {
      console.error('Failed to update medicine description:', err);

      toast.error(
        getGeneralError(err) ||
          'Failed to update medicine description. Please try again.',
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            Edit Description
          </DialogTitle>

          <DialogDescription>
            Update the description of the medicine.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>

            <Textarea
              id='description'
              value={formData.description ?? ''}
              onChange={(e) => handleChange(e.target.value)}
              placeholder='Enter medicine description'
              rows={5}
              aria-invalid={!!getFieldError(error, 'description')}
              className='field-sizing-fixed'
            />

            {getFieldError(error, 'description') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'description')}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
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

export default EditMedicineDescriptionDialog;
