import { baseApi } from '@/lib/services/baseApi';

export const OrganizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: () => ({
        url: '/admin/organization-onboard',
        method: 'GET',
      }),
      providesTags: ['Organizations'],
    }),
  }),
});

export const { useGetOrganizationsQuery } = OrganizationsApi;
