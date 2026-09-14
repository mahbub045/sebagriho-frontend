export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'REMOVED' | 'DELETED';
export type MiasmType = 'ACUTE' | 'TYPHOID' | 'MALARIAL';
export type PatientGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface PatientUser {
  uid: string;
  avatar: string | null;
  name: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  gender: PatientGender | null;
  date_of_birth: string | null;
  blood_group: string | null;
}
export interface PatientFile {
  uid: string;
  file: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
export interface Patient {
  uid: string;
  serial_number: number;
  slug: string;
  status: PatientStatus;
  old_serial_number: number | null;
  relative_phone: string | null;
  address: string | null;
  blood_group: string | null;
  age: number | null;
  miasm_type: MiasmType | null;
  case_history: string | null;
  habits: string | null;
  user: PatientUser;
  files: PatientFile[];
  created_at: string;
  updated_at: string;
}

export interface AddPatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AddPatientFormValues {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gender: PatientGender | '';
  date_of_birth: string;
  blood_group: string;
  old_serial_number: string;
  relative_phone: string;
  address: string;
  age: string;
  miasm_type: MiasmType | '';
  case_history: string;
  habits: string;
}

export type FieldErrors = Partial<Record<keyof AddPatientFormValues, string>>;

export type FieldErrorMap = Record<string, string[] | string>;

export interface DeletePatientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientUid: string;
  patientName: string;
}

export interface EditPatientIdentityDailogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: Patient;
}
export interface EditPatientPersonalInfoDailogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: {
    uid: string;
    age: number | null;
    user: {
      gender: PatientGender | null;
      date_of_birth: string | null;
      blood_group: string | null;
    };
  };
}

export interface EditPatientContactDetailsDailogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: {
    uid: string;
    relative_phone: string | null;
    address: string | null;
    user: {
      phone: string | null;
      email: string | null;
    };
  };
}

export interface PatientDetailsCardProps {
  patient: Patient;
}

export interface EditPatientMedicalInfoDailogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: {
    uid: string;
    miasm_type: MiasmType | null;
    habits: string | null;
  };
}

export interface EditMedicalHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patientInfo: Patient;
}

export interface EditPatientFilesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}
