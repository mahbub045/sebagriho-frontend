export type ProfileInfo = {
  uid: string;
  avatar: string | null;
  name: string;
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string | null;
  nid: string | null;
  nid_front: string | null;
  nid_back: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
  is_admin: boolean;
  is_owner: boolean;
  is_password_set: boolean;
  organization_type: string | null;
};

export type ProfileFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gender: string;
  blood_group: string;
  date_of_birth: string;
  nid: string;
};

export type ProfileFieldErrors = Partial<Record<keyof ProfileFormData, string>>;

export type ResetPasswordFormData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export type ResetPasswordFieldErrors = Partial<
  Record<keyof ResetPasswordFormData, string>
>;

export type ResetPasswordDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};
