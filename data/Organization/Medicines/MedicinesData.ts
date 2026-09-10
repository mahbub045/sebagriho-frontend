import {
  FormState,
  MedicineStatus,
} from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

export const MEDICINE_STATUS_STYLES: Record<MedicineStatus, string> = {
  AVAILABLE: 'border-success/30 bg-success/10 text-success',
  UNAVAILABLE: 'border-danger/30 bg-danger/10 text-danger',
};

export const HP_MEDICINE_INITIAL_STATE: FormState = {
  name: '',
  power: '',
  expiration_date: '',
  is_available: true,
  manufacturer: '',
  total_quantity: '',
  unit_price: '',
  description: '',
  batch_number: '',
  status: 'AVAILABLE',
};
