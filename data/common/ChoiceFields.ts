import type { Locale } from '@/lib/i18n/config';

export type Option = { value: string; label: string; labelBn: string };
export type LocalizedOption = { value: string; label: string };

/** Resolve an option's label for the given locale, falling back to English. */
export const getOptionLabel = (option: Option, locale: Locale): string =>
  locale === 'bn' ? option.labelBn : option.label;

/**
 * Map an `Option[]` to `{ value, label }[]` with the label resolved for the
 * given locale. Use this both for `<Select items={...}>` (which reads
 * `.label` for the trigger's display value) and for rendering `<SelectItem>`
 * options, so the two never fall out of sync.
 */
export const localizeOptions = (
  options: Option[],
  locale: Locale,
): LocalizedOption[] =>
  options.map((option) => ({
    value: option.value,
    label: getOptionLabel(option, locale),
  }));

export const GENDER_OPTIONS: Option[] = [
  { value: 'MALE', label: 'Male', labelBn: 'পুরুষ' },
  { value: 'FEMALE', label: 'Female', labelBn: 'মহিলা' },
  { value: 'OTHER', label: 'Other', labelBn: 'অন্যান্য' },
];

export const BLOOD_GROUP_OPTIONS: Option[] = [
  { value: 'A+', label: 'A+', labelBn: 'এ পজিটিভ' },
  { value: 'A-', label: 'A-', labelBn: 'এ নেগেটিভ' },
  { value: 'B+', label: 'B+', labelBn: 'বি পজিটিভ' },
  { value: 'B-', label: 'B-', labelBn: 'বি নেগেটিভ' },
  { value: 'AB+', label: 'AB+', labelBn: 'এবি পজিটিভ' },
  { value: 'AB-', label: 'AB-', labelBn: 'এবি নেগেটিভ' },
  { value: 'O+', label: 'O+', labelBn: 'ও পজিটিভ' },
  { value: 'O-', label: 'O-', labelBn: 'ও নেগেটিভ' },
];

export const ORGANIZATION_TYPE_OPTIONS: Option[] = [
  { value: 'CHAMBER', label: 'Chamber', labelBn: 'চেম্বার' },
  { value: 'HOSPITAL', label: 'Hospital', labelBn: 'হাসপাতাল' },
  { value: 'CLINIC', label: 'Clinic', labelBn: 'ক্লিনিক' },
  { value: 'LABORATORY', label: 'Laboratory', labelBn: 'ল্যাবরেটরি' },
  { value: 'PHARMACY', label: 'Pharmacy', labelBn: 'ফার্মেসি' },
  { value: 'DIAGNOSTIC_CENTER', label: 'Diagnostic Center', labelBn: 'ডায়াগনস্টিক সেন্টার' },
  { value: 'BLOOD_BANK', label: 'Blood Bank', labelBn: 'রক্তের ব্যাংক' },
  { value: 'AMBULANCE_SERVICE', label: 'Ambulance Service', labelBn: 'অ্যাম্বুলেন্স সেবা' },
  { value: 'HOMEOPATHY', label: 'Homeopathy', labelBn: 'হোমিওপ্যাথি' },
  { value: 'AYURVEDIC', label: 'Ayurvedic', labelBn: 'আয়ুর্বেদিক' },
  { value: 'DENTAL', label: 'Dental', labelBn: 'ডেন্টাল' },
  { value: 'VETERINARY', label: 'Veterinary', labelBn: 'ভেটেরিনারি' },
];

export const ORGANIZATION_STATUS_OPTIONS: Option[] = [
  { value: 'ACTIVE', label: 'Active', labelBn: 'সক্রিয়' },
  { value: 'PENDING', label: 'Pending', labelBn: 'অপেক্ষমাণ' },
  { value: 'INACTIVE', label: 'Inactive', labelBn: 'নিষ্ক্রিয়' },
  { value: 'DELETED', label: 'Deleted', labelBn: 'মুছে ফেলা হয়েছে' },
  { value: 'SUSPENDED', label: 'Suspended', labelBn: 'স্থগিত' },
];

export const ORGANIZATION_MEMBER_STATUS_OPTIONS: Option[] = [
  { value: 'ACTIVE', label: 'Active', labelBn: 'সক্রিয়' },
  { value: 'INACTIVE', label: 'Inactive', labelBn: 'নিষ্ক্রিয়' },
  { value: 'SUSPENDED', label: 'Suspended', labelBn: 'স্থগিত' },
];

export const USER_STATUS_OPTIONS: Option[] = [
  { value: 'DRAFT', label: 'Draft', labelBn: 'খসড়া' },
  { value: 'ACTIVE', label: 'Active', labelBn: 'সক্রিয়' },
  { value: 'PAUSED', label: 'Paused', labelBn: 'বিরতি দেওয়া' },
  { value: 'REMOVED', label: 'Removed', labelBn: 'অপসারিত' },
  { value: 'DELETED', label: 'Deleted', labelBn: 'মুছে ফেলা হয়েছে' },
];

/* =========================
 * Homeopathic Options
 * ========================= */

export const HOMEOPATHIC_PATIENT_STATUS_OPTIONS: Option[] = [
  { value: 'ACTIVE', label: 'Active', labelBn: 'সক্রিয়' },
  { value: 'INACTIVE', label: 'Inactive', labelBn: 'নিষ্ক্রিয়' },
  { value: 'REMOVED', label: 'Removed', labelBn: 'অপসারিত' },
  { value: 'DELETED', label: 'Deleted', labelBn: 'মুছে ফেলা হয়েছে' },
];

export const MIASM_TYPE_OPTIONS: Option[] = [
  { value: 'ACUTE', label: 'Acute', labelBn: 'অ্যাকিউট' },
  { value: 'TYPHOID', label: 'Typhoid', labelBn: 'টাইফয়েড' },
  { value: 'MALARIAL', label: 'Malarial', labelBn: 'ম্যালেরিয়াল' },
  { value: 'RINGWORM', label: 'Ringworm', labelBn: 'দাদ' },
  { value: 'PSORIC', label: 'Psoric', labelBn: 'সোরিক' },
  { value: 'SYCOTIC', label: 'Sycotic', labelBn: 'সাইকোটিক' },
  { value: 'CANCER', label: 'Cancer', labelBn: 'ক্যান্সার' },
  { value: 'TUBERCULAR', label: 'Tubercular', labelBn: 'টিউবারকুলার' },
  { value: 'LEPROSY', label: 'Leprosy', labelBn: 'কুষ্ঠ' },
  { value: 'SYPHILITIC', label: 'Syphilitic', labelBn: 'সিফিলিটিক' },
  { value: 'AIDS', label: 'AIDS', labelBn: 'এইডস' },
];

export const HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS: Option[] = [
  { value: 'SCHEDULED', label: 'Scheduled', labelBn: 'নির্ধারিত' },
  { value: 'COMPLETED', label: 'Completed', labelBn: 'সম্পন্ন' },
  { value: 'CANCELLED', label: 'Cancelled', labelBn: 'বাতিল' },
];

export const MEAL_TIMING_OPTIONS: Option[] = [
  { value: 'BEFORE_MEAL', label: 'Before meal', labelBn: 'খাবারের আগে' },
  { value: 'AFTER_MEAL', label: 'After meal', labelBn: 'খাবারের পরে' },
];

/**
 * Every choice-field option in one place, keyed by `value`, so a raw enum
 * value (e.g. from an API response) can be resolved back to its localized
 * label without knowing which option set it belongs to.
 */
const ALL_OPTIONS: Option[] = [
  ...GENDER_OPTIONS,
  ...BLOOD_GROUP_OPTIONS,
  ...ORGANIZATION_TYPE_OPTIONS,
  ...ORGANIZATION_STATUS_OPTIONS,
  ...ORGANIZATION_MEMBER_STATUS_OPTIONS,
  ...USER_STATUS_OPTIONS,
  ...HOMEOPATHIC_PATIENT_STATUS_OPTIONS,
  ...MIASM_TYPE_OPTIONS,
  ...HOMEOPATHIC_APPOINTMENT_STATUS_OPTIONS,
  ...MEAL_TIMING_OPTIONS,
];

const OPTION_BY_VALUE: Map<string, Option> = new Map(
  ALL_OPTIONS.map((option) => [option.value, option]),
);

/**
 * Resolve a raw choice-field value (e.g. `"DIAGNOSTIC_CENTER"`) to its
 * localized label by looking it up across every known option set. Falls
 * back to a title-cased rendering of the raw value when it isn't a known
 * choice-field option (e.g. free-text fields), so it is safe to call on any
 * string.
 */
export const resolveChoiceFieldLabel = (
  value: string,
  locale: Locale,
): string => {
  const option = OPTION_BY_VALUE.get(value);
  if (option) return getOptionLabel(option, locale);

  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
