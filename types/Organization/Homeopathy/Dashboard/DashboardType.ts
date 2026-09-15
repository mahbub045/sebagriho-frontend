export interface DashboardSummary {
  total_patients: number;
  active_patients: number;
  total_appointments: number;
  today_appointments: number;
  total_medicines: number;
  available_medicines: number;
}

export interface MonthlyGrowthPoint {
  month: string;
  count: number;
}

export interface PatientStatusBreakdown {
  status: string;
  count: number;
}

export interface MedicineStatusBreakdown {
  status: string;
  count: number;
}

export interface HomeopathyDashboardData {
  summary: DashboardSummary;
  patient_growth: MonthlyGrowthPoint[];
  appointment_growth: MonthlyGrowthPoint[];
  patient_status: PatientStatusBreakdown[];
  medicine_status: MedicineStatusBreakdown[];
}
