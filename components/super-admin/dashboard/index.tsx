import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';

const index: React.FC = () => {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
    </div>
  );
};

export default index;
