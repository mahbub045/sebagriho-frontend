export type AppointmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

interface AppointmentPatientUser {
  uid: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gender: string;
  blood_group: string | null;
  nid: string | null;
  nid_front: string | null;
  nid_back: string | null;
  avatar: string | null;
  date_of_birth: string | null;
}
export interface AppointmentPatient {
  uid: string;
  user: AppointmentPatientUser;
  age: number | null;
  serial_number: string;
  old_serial_number: string | null;
  relative_phone: string | null;
  address: string | null;
  miasm_type: string | null;
  case_history: string | null;
  habits: string | null;
}

interface MedicineDetails {
  name: string;
  power?: string | null;
  manufacturer?: string | null;
  batch_number?: string | null;
}
export interface AppointmentPrescription {
  uid: string;
  medicine_details: MedicineDetails;
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
  meal_timing?: string | null;
  instructions?: string | null;
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
  prescriptions: AppointmentPrescription[];
  files: AppointmentFile[];
  created_at: string;
  updated_at: string;
  patient: AppointmentPatient;
}

export interface AppointmentInfoCardProps {
  appointment: Appointment;
}

export interface PatientInfoCardProps {
  patient: AppointmentPatient;
}

export interface MedicinesCardProps {
  appointment_prescription: AppointmentPrescription[];
}
export interface FilesCardProps {
  files: AppointmentFile[];
}
export interface DeleteCardProps {
  appointment: Appointment;
}

export interface AppointmentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appointment[];
}

// Add these to AppointmentsType.ts (alongside the existing Appointment types)

export interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Minimal medicine shape used for search/select — adjust to match MedicinesApi's real response */
export interface MedicineOption {
  uid: string;
  name: string;
  power?: string | null;
  manufacturer?: string | null;
}

/** A medicine chosen for this appointment, with its per-appointment prescription details */
export interface SelectedMedicineDraft {
  uid: string;
  name: string;
  power?: string | null;
  manufacturer?: string | null;
  dosage: string;
  frequency: string;
  duration: string;
  meal_timing: string;
  instructions: string;
}

export interface CreateAppointmentPayload {
  patient: string; // patient uid
  symptoms: string;
  treatment_effectiveness: string;
  medicines: {
    medicine: string; // medicine uid
    dosage?: string;
    frequency?: string;
    duration?: string;
    notes?: string;
  }[];
}
export interface DeleteAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentUid: string;
  appointmentPatientName: string;
}
