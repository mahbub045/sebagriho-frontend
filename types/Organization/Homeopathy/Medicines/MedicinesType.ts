export type MedicineStatus = 'AVAILABLE' | 'UNAVAILABLE';

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
  status: MedicineStatus;
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
