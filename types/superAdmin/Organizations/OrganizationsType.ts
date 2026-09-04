export interface OrganizationCardProps {
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
  joined_at: string;
  uid: string;
}