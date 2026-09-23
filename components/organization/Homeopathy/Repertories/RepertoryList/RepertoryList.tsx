'use client';
import { useGetHomeopathyRepertoriesQuery } from '@/lib/services/endpoints/organization/Homeopathy/Repertories/RepertoriesApi';

const RepertoryList: React.FC = () => {
  const {
    data: repertories,
    isLoading,
    error,
  } = useGetHomeopathyRepertoriesQuery(undefined);

  return <div>{/* JSX here */}</div>;
};

export default RepertoryList;
