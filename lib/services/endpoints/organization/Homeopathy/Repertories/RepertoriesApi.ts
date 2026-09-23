import { baseApi } from '@/lib/services/baseApi';

export const HomeopathyRepertoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomeopathyRepertories: builder.query({
      query: () => ({
        url: `/homeopathy/repertories`,
        method: 'GET',
      }),
    }),
    getRepertoriesRubrics: builder.query({
      query: ({ repertoryUid, ...params }) => ({
        url: `/homeopathy/repertories/${repertoryUid}/rubrics`,
        method: 'GET',
        params,
      }),
    }),
    getRepertoriesChapters: builder.query({
      query: ({ repertoryUid, ...params }) => ({
        url: `/homeopathy/repertories/${repertoryUid}/chapters`,
        method: 'GET',
        params,
      }),
    }),
    repertoryAnalysis: builder.mutation({
      query: ({ repertoryUid, payload }) => ({
        url: `/homeopathy/repertories/${repertoryUid}/analysis`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetHomeopathyRepertoriesQuery,
  useGetRepertoriesRubricsQuery,
  useGetRepertoriesChaptersQuery,
  useRepertoryAnalysisMutation,
} = HomeopathyRepertoriesApi;
