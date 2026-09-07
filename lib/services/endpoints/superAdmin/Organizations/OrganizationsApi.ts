import { baseApi } from '@/lib/services/baseApi';

export const OrganizationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query({
      query: (params) => ({
        url: '/admin/organization-onboard',
        method: 'GET',
        params,
      }),
      providesTags: ['Organizations'],
    }),
    addOrganization: builder.mutation({
      query: (payload) => ({
        url: '/admin/organization-onboard',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Organizations'],
    }),
    updateOrganization: builder.mutation({
      query: ({ organizationId, organizationData }) => ({
        url: `/admin/organization-onboard/${organizationId}`,
        method: 'PUT',
        body: organizationData,
      }),
      invalidatesTags: ['Organizations'],
    }),
    deleteOrganization: builder.mutation({
      query: (organizationId) => ({
        url: `/admin/organization-onboard/${organizationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organizations'],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = OrganizationsApi;