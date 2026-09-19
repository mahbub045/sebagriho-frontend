export interface MedicineFile {
  uid: string;
  file: string;
  name?: string;
}

export interface Medicine {
  uid: string;
  name: string;
  power: number;
  expiration_date: string;
  manufacturer: string;
  total_quantity: number;
  unit_price: string;
  description: string;
  batch_number: string;
  files: MedicineFile[];
  created_at: string;
  updated_at: string;
}

export interface MedicinesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Medicine[];
}

export interface AddMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export type FilePreview = {
  file: File;
  url: string;
};

export interface FormState {
  name: string;
  power: string;
  expiration_date: string;
  is_available: boolean;
  manufacturer: string;
  total_quantity: string;
  unit_price: string;
  description: string;
  batch_number: string;
}

export interface ApiValidationError {
  data?: Record<string, string[] | string> & {
    detail?: string;
    message?: string;
  };
}

export type MedicineDetailsCardProps = {
  medicine: Medicine;
};

export interface EditMedicineOverviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
}

export interface MedicineFormData {
  name: string;
  power: string;
  manufacturer: string;
  batch_number: string;
}

export interface MedicineInventoryFormData {
  total_quantity: string;
  unit_price: string;
  expiration_date: string | null;
}

export interface MedicineFilesFormData {
  files: File[];
}

export interface MedicineDescriptionFormData {
  description: string;
}

export interface DeleteMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicineUid: string;
  medicineName?: string;
}
