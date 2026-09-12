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
  date_of_birth: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_admin: boolean;
  is_owner: boolean;
}

export interface Appointment {
  uid: string;
  slug: string;
  symptoms: string;
  treatment_effectiveness: string;
  status: AppointmentStatus;
  medicines: unknown[];
  files: unknown[];
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