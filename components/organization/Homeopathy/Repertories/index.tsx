import Breadcrumbs from '@/components/common/Breadcrumbs/Breadcrumbs';
import { getDictionary } from '@/lib/i18n/getDictionary';
import RepertoryList from './RepertoryList/RepertoryList';

const HomeopathyRepertoriesContainer: React.FC = async () => {
  const dict = await getDictionary();
  return (
    <div>
      <Breadcrumbs
        items={[
          {
            label: dict.nav.dashboard,
            href: `/organization/homeopathy/dashboard`,
          },
          {
            label: dict.nav.repertories,
            href: `/organization/homeopathy/repertories`,
          },
        ]}
      />
      <RepertoryList />
    </div>
  );
};

export default HomeopathyRepertoriesContainer;
