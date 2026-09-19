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
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useEditMedicineMutation } from '@/lib/services/endpoints/organization/Homeopathy/Medicines/MedicinesApi';
import {
  EditMedicineOverviewDialogProps,
  MedicineInventoryFormData,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';
import { getChangedFields } from '@/utils/commonFunctions';
import { useState } from 'react';
import { toast } from 'sonner';

const getFieldError = (
  error: unknown,
  field: keyof MedicineInventoryFormData,
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

const EditMedicineInventoryDialog: React.FC<
  EditMedicineOverviewDialogProps
> = ({ isOpen, onClose, medicine }) => {
  const { dict } = useTranslation();
  const [editMedicine, { isLoading, error }] = useEditMedicineMutation();

  const getGeneralError = (error: unknown): string | undefined => {
    if (!error || typeof error !== 'object') return undefined;
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object') {
      const dataObj = data as Record<string, unknown>;
      if (typeof dataObj.message === 'string') return dataObj.message;
    }
    return dict.medicines.dialogs.editInventory.genericError;
  };

  const getInitialData = (): MedicineInventoryFormData => ({
    total_quantity: medicine?.total_quantity?.toString() ?? '',
    unit_price: medicine?.unit_price?.toString() ?? '',
    expiration_date: medicine?.expiration_date ?? '',
  });

  const [formData, setFormData] =
    useState<MedicineInventoryFormData>(getInitialData());
  const [initialData, setInitialData] =
    useState<MedicineInventoryFormData>(getInitialData());

  const handleChange = (
    field: keyof MedicineInventoryFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      toast.success(dict.medicines.dialogs.editInventory.successToast);
      onClose();
    } catch (err) {
      console.error('Failed to update inventory:', err);
      toast.error(
        getGeneralError(err) ?? dict.medicines.dialogs.editInventory.errorToast,
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.medicines.dialogs.editInventory.title}
          </DialogTitle>
          <DialogDescription>
            {dict.medicines.dialogs.editInventory.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='total_quantity'>
              {dict.medicines.dialogs.editInventory.totalQuantity}
            </Label>
            <Input
              type='number'
              id='total_quantity'
              value={formData.total_quantity}
              onChange={(e) => handleChange('total_quantity', e.target.value)}
              min={0}
              aria-invalid={!!getFieldError(error, 'total_quantity')}
            />
            {getFieldError(error, 'total_quantity') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'total_quantity')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='unit_price'>
              {dict.medicines.dialogs.editInventory.unitPrice}
            </Label>
            <Input
              type='number'
              id='unit_price'
              value={formData.unit_price}
              onChange={(e) => handleChange('unit_price', e.target.value)}
              min={0}
              step='0.01'
              aria-invalid={!!getFieldError(error, 'unit_price')}
            />
            {getFieldError(error, 'unit_price') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'unit_price')}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='expiration_date'>
              {dict.medicines.dialogs.editInventory.expirationDate}
            </Label>
            <Input
              type='date'
              id='expiration_date'
              value={formData.expiration_date}
              onChange={(e) => handleChange('expiration_date', e.target.value)}
              aria-invalid={!!getFieldError(error, 'expiration_date')}
            />
            {getFieldError(error, 'expiration_date') && (
              <p className='text-sm text-red-500'>
                {getFieldError(error, 'expiration_date')}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              {dict.common.cancel}
            </Button>
            <Button type='submit' disabled={isUnchanged || isLoading}>
              {isLoading
                ? dict.medicines.dialogs.editInventory.saving
                : dict.medicines.dialogs.editInventory.saveChanges}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMedicineInventoryDialog;
