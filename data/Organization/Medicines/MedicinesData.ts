import { MedicineStatus } from '@/types/Organization/Homeopathy/Medicines/MedicinesType';

export const MEDICINE_STATUS_STYLES: Record<MedicineStatus, string> = {
  AVAILABLE: 'border-success/30 bg-success/10 text-success',
  UNAVAILABLE: 'border-danger/30 bg-danger/10 text-danger',
};
