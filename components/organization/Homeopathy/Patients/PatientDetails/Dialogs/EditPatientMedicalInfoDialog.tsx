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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  MIASM_TYPE_OPTIONS,
  localizeOptions,
} from '@/data/common/ChoiceFields';
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import {
  EditPatientMedicalInfoDailogProps,
  FieldErrorMap,
  MiasmType,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { SelectRootChangeEventDetails } from '@base-ui/react';
import { useState } from 'react';
import { toast } from 'sonner';

const EditPatientMedicalInfoDialog: React.FC<
  EditPatientMedicalInfoDailogProps
> = ({ isOpen, onClose, patientInfo }) => {
  const { dict, locale } = useTranslation();
  const [editPatient, { isLoading, error }] = useEditPatientMutation();

  const [formData, setFormData] = useState<{
    miasm_type: MiasmType | null;
    habits: string;
  }>({
    miasm_type: patientInfo.miasm_type ?? null,
    habits: patientInfo.habits ?? '',
  });

  const miasmTypeOptions = localizeOptions(MIASM_TYPE_OPTIONS, locale);

  const fieldErrors: FieldErrorMap =
    (error as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const value = fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  const handleHabitsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, habits: e.target.value }));
  };

  const handleMiasmChange = (
    value: MiasmType | null,
    _eventDetails: SelectRootChangeEventDetails,
  ) => {
    setFormData((prev) => ({ ...prev, miasm_type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const initial = {
      miasm_type: patientInfo.miasm_type ?? null,
      habits: patientInfo.habits ?? '',
    };

    const payload = new FormData();
    let hasChanges = false;

    if (formData.miasm_type !== initial.miasm_type) {
      payload.append('miasm_type', formData.miasm_type ?? '');
      hasChanges = true;
    }

    if (formData.habits !== initial.habits) {
      payload.append('habits', formData.habits);
      hasChanges = true;
    }

    if (!hasChanges) {
      onClose();
      return;
    }

    try {
      await editPatient({
        patientUid: patientInfo.uid,
        payload,
      }).unwrap();
      onClose();
      toast.success(dict.patients.dialogs.editMedicalInfo.successToast);
    } catch {
      toast.error(dict.patients.dialogs.editMedicalInfo.errorToast);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.patients.dialogs.editMedicalInfo.title}
          </DialogTitle>
          <DialogDescription>
            {dict.patients.dialogs.editMedicalInfo.description}
          </DialogDescription>
        </DialogHeader>
        <form
          key={patientInfo.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='miasm_type'>
              {dict.patients.dialogs.editMedicalInfo.miasmType}
            </Label>
            <Select
              items={miasmTypeOptions}
              value={formData.miasm_type}
              onValueChange={handleMiasmChange}
            >
              <SelectTrigger id='miasm_type' className='w-full'>
                <SelectValue
                  placeholder={
                    dict.patients.dialogs.editMedicalInfo.miasmTypePlaceholder
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {miasmTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('miasm_type') && (
              <p className='text-destructive text-xs'>
                {getFieldError('miasm_type')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='habits'>
              {dict.patients.dialogs.editMedicalInfo.habits}
            </Label>
            <Textarea
              id='habits'
              name='habits'
              rows={5}
              value={formData.habits}
              onChange={handleHabitsChange}
              className='field-sizing-fixed'
            />
            {getFieldError('habits') && (
              <p className='text-destructive text-xs'>
                {getFieldError('habits')}
              </p>
            )}
          </div>

          <div className='flex justify-end gap-2 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isLoading}
            >
              {dict.common.cancel}
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading && <Loading className='h-4 w-4 text-white!' />}
              {dict.patients.dialogs.saveChanges}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientMedicalInfoDialog;
