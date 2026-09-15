import { baseApi } from '@/lib/services/baseApi';
import { HomeopathyDashboardData } from '@/types/Organization/Homeopathy/Dashboard/DashboardType';

export const HomeopathyDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeopathyDashboardData: builder.query<HomeopathyDashboardData, void>({
      query: () => ({
        url: '/homeopathy/dashboard',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetHomeopathyDashboardDataQuery } = HomeopathyDashboardApi;
