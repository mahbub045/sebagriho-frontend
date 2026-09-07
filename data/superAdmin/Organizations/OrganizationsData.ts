export const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  INACTIVE: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  SUSPENDED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export const INITIAL_FORM = {
  user: {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    gender: '',
    nid: '',
    blood_group: '',
    date_of_birth: '',
  },
  organization: {
    name: '',
    parent: null as string | null,
    organization_type: '',
    description: '',
    status: 'ACTIVE',
    phone: '',
    email: '',
    website: '',
    address: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    youtube: '',
  },
};
