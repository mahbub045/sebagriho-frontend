import { AddPatientFormValues } from '@/types/Organization/Homeopathy/Patients/PatientsType';

export const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'border-success/30 bg-success/10 text-success',
  INACTIVE: 'border-muted-foreground/30 bg-muted text-muted-foreground',
  REMOVED: 'border-warning/30 bg-warning/10 text-warning',
  DELETED: 'border-danger/30 bg-danger/10 text-danger',
};
export const MIASM_STYLES: Record<string, string> = {
  ACUTE: 'border-info/30 bg-info/10 text-info',
  TYPHOID: 'border-danger/30 bg-danger/10 text-danger',
  MALARIAL: 'border-success/30 bg-success/10 text-success',
};

export const DEFAULT_VALUES: AddPatientFormValues = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  gender: '',
  date_of_birth: '',
  old_serial_number: '',
  relative_phone: '',
  address: '',
  age: '',
  miasm_type: '',
  case_history: '',
  habits: '',
};
