export type TabKey = 'organization' | 'owner' | 'social';
export interface OrganizationCardProps {
  uid: string;
  organization: {
    name: string;
    logo: string | null;
    organization_type: string;
    description: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
  };
  user: {
    first_name: string;
    last_name: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface AddOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export type OrganizationOwner = {
  uid?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  gender: string;
  nid: string | null;
  nid_front?: string | null;
  nid_back?: string | null;
  avatar?: string | null;
  blood_group: string | null;
  date_of_birth: string | null;
};

export type OrganizationDetail = {
  name: string;
  title?: string | null;
  organization_type: string;
  subdomain?: string;
  logo?: string | null;
  description: string;
  status: string;
  phone: string | null;
  email: string;
  website: string;
  address: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  youtube: string;
};

export type OrgErrors = Partial<Record<keyof OrganizationDetail, string>>;
export type UserErrors = Partial<Record<keyof OrganizationOwner, string>>;

export type OrganizationDetailsResponse = {
  uid: string;
  user: OrganizationOwner;
  organization: OrganizationDetail;
};

export interface UpdateOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationDetails: OrganizationDetailsResponse;
}
