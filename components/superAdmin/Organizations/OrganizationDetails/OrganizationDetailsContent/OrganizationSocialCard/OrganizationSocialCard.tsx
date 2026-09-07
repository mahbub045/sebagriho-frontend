import { Card } from '@/components/ui/card';
import { OrganizationDetail } from '@/types/superAdmin/Organizations/OrganizationsType';
import { Link2 } from 'lucide-react';

type Props = {
  organization: OrganizationDetail;
};

const SOCIAL_LINKS = (organization: OrganizationDetail) => [
  {
    key: 'facebook',
    label: 'Facebook',
    url: organization.facebook,
    className: 'text-[#1877F2]',
  },
  {
    key: 'twitter',
    label: 'Twitter / X',
    url: organization.twitter,
    className: 'text-foreground',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    url: organization.linkedin,
    className: 'text-[#0A66C2]',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    url: organization.youtube,
    className: 'text-[#FF0000]',
  },
];

const OrganizationSocialCard: React.FC<Props> = ({ organization }) => {
  const links = SOCIAL_LINKS(organization);

  return (
    <Card className='border-border/60 p-5'>
      <h2 className='text-sm font-semibold'>Social links</h2>

      <div className='mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2'>
        {links.map(({ key, label, url, className }) =>
          url ? (
            <a
              key={key}
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='border-border/60 hover:border-border flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors'
            >
              <Link2 className={`h-4 w-4 shrink-0 ${className}`} />
              <span className='truncate'>{label}</span>
            </a>
          ) : (
            <div
              key={key}
              aria-disabled='true'
              className='border-border/60 text-muted-foreground/50 flex cursor-not-allowed items-center gap-2.5 rounded-lg border px-3 py-2 text-sm'
            >
              <Link2 className='h-4 w-4 shrink-0' />
              <span className='truncate'>{label}</span>
            </div>
          ),
        )}
      </div>
    </Card>
  );
};

export default OrganizationSocialCard;
