import { baseApi } from '@/lib/services/baseApi';

export const HomeopathyRepertoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeopathyRepertories: builder.query({
      query: () => ({
        url: `/homeopathy/repertories`,
        method: 'GET',
      }),
    }),
    getRepertoriesChapters: builder.query({
      query: ({ repertoryUid }) => ({
        url: `/homeopathy/repertories/${repertoryUid}/chapters`,
        method: 'GET',
      }),
    }),
    getRepertoriesRubrics: builder.query({
      query: ({ repertoryUid }) => ({
        url: `/homeopathy/repertories/${repertoryUid}/rubrics`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetHomeopathyRepertoriesQuery,
  useGetRepertoriesChaptersQuery,
  useGetRepertoriesRubricsQuery,
} = HomeopathyRepertoriesApi;
