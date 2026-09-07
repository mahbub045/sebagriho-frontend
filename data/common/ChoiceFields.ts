export type Option = { value: string; label: string };

export const GENDER_OPTIONS: Option[] = [
  { value: 'FEMALE', label: 'Female' },
  { value: 'MALE', label: 'Male' },
  { value: 'OTHER', label: 'Other' },
];

export const BLOOD_GROUP_OPTIONS: Option[] = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const ORGANIZATION_TYPE_OPTIONS: Option[] = [
  { value: 'CHAMBER', label: 'Chamber' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'LABORATORY', label: 'Laboratory' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'DIAGNOSTIC_CENTER', label: 'Diagnostic Center' },
  { value: 'BLOOD_BANK', label: 'Blood Bank' },
  { value: 'AMBULANCE_SERVICE', label: 'Ambulance Service' },
  { value: 'HOMEOPATHY', label: 'Homeopathy' },
  { value: 'AYURVEDIC', label: 'Ayurvedic' },
  { value: 'DENTAL', label: 'Dental' },
  { value: 'VETERINARY', label: 'Veterinary' },
];

export const ORGANIZATION_STATUS_OPTIONS: Option[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'DELETED', label: 'Deleted' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export const ORGANIZATION_MEMBER_STATUS_OPTIONS: Option[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export const USER_STATUS_OPTIONS: Option[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'REMOVED', label: 'Removed' },
  { value: 'DELETED', label: 'Deleted' },
];