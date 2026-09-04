import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

const OrganizationsContainer: React.FC = () => {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Organizations', href: '/organizations' },
          { label: 'Organization Details', href: '/organizations/details' },
        ]}
      />
    </div>
  );
};

export default OrganizationsContainer;
