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
import { Textarea } from '@/components/ui/textarea';
import { useEditPatientMutation } from '@/lib/services/endpoints/organization/Homeopathy/Patients/PatientsApi';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  EditMedicalHistoryDialogProps,
  FieldErrorMap,
} from '@/types/Organization/Homeopathy/Patients/PatientsType';
import { useState } from 'react';
import { toast } from 'sonner';

const EditMedicalHistoryDialog: React.FC<EditMedicalHistoryDialogProps> = ({
  isOpen,
  onClose,
  patientInfo,
}) => {
  const { dict } = useTranslation();
  const [editPatient, { isLoading, error }] = useEditPatientMutation();

  const [formData, setFormData] = useState({
    case_history: patientInfo.case_history ?? '',
  });

  const fieldErrors: FieldErrorMap =
    (error as { data?: FieldErrorMap })?.data ?? {};

  const getFieldError = (field: string) => {
    const value = fieldErrors[field];
    if (!value) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const initial = {
      case_history: patientInfo.case_history ?? '',
    };

    if (formData.case_history === initial.case_history) {
      onClose();
      return;
    }

    const payload = new FormData();
    payload.append('case_history', formData.case_history);

    try {
      await editPatient({
        patientUid: patientInfo.uid,
        payload,
      }).unwrap();
      onClose();
      toast.success(dict.patients.dialogs.editMedicalHistory.successToast);
    } catch {
      toast.error(dict.patients.dialogs.editMedicalHistory.errorToast);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto p-4 sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-primary -mb-3 text-lg font-semibold'>
            {dict.patients.dialogs.editMedicalHistory.title}
          </DialogTitle>
          <DialogDescription>
            {dict.patients.dialogs.editMedicalHistory.description}
          </DialogDescription>
        </DialogHeader>
        <form
          key={patientInfo.uid}
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 p-1'
        >
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='case_history'>
              {dict.patients.dialogs.editMedicalHistory.caseHistory}
            </Label>
            <Textarea
              id='case_history'
              name='case_history'
              rows={8}
              value={formData.case_history}
              onChange={handleChange}
              className='field-sizing-fixed'
            />
            {getFieldError('case_history') && (
              <p className='text-destructive text-xs'>
                {getFieldError('case_history')}
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

export default EditMedicalHistoryDialog;
