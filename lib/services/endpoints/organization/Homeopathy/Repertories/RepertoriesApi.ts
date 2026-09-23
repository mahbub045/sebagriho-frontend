import { baseApi } from '@/lib/services/baseApi';

export const HomeopathyRepertoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeopathyRepertories: builder.query({
      query: () => ({
        url: '/homeopathy/repertories',
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetHomeopathyRepertoriesQuery } = HomeopathyRepertoriesApi;
