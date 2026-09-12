export type AppointmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface AppointmentPatient {
  uid: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gender: string;
  nid: string | null;
  nid_front: string | null;
  nid_back: string | null;
  avatar: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_admin: boolean;
  is_owner: boolean;
}

export interface AppointmentInfoCardProps {
  appointment: Appointment;
}

export interface PatientInfoCardProps {
  patient: AppointmentPatient;
}

export interface MedicinesCardProps {
  medicines: AppointmentMedicine[];
}
export interface FilesCardProps {
  files: AppointmentFile[];
}
export interface DeleteCardProps {
  appointment: Appointment;
}

export interface AppointmentMedicine {
  uid: string;
  name: string;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  notes?: string | null;
}

export interface AppointmentFile {
  uid: string;
  name: string;
  file: string;
  file_type?: string | null;
  uploaded_at?: string;
}

export interface Appointment {
  uid: string;
  slug: string;
  symptoms: string;
  treatment_effectiveness: string;
  status: AppointmentStatus;
  medicines: AppointmentMedicine[];
  files: AppointmentFile[];
  created_at: string;
  updated_at: string;
  patient: AppointmentPatient;
}

export interface AppointmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appointment[];
}

export interface DeleteAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentUid: string;
  appointmentSlug: string;
}
