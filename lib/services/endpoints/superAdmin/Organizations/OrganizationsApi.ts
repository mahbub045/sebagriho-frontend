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
    getOrganizationDetails: builder.query({
      query: (organizationUid) => ({
        url: `/admin/organization-onboard/${organizationUid}`,
        method: 'GET',
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
      query: ({ organizationUid, organizationData }) => ({
        url: `/admin/organization-onboard/${organizationUid}`,
        method: 'PUT',
        body: organizationData,
      }),
      invalidatesTags: ['Organizations'],
    }),
    deleteOrganization: builder.mutation({
      query: ({ organizationUid }) => ({
        url: `/admin/organization-onboard/${organizationUid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Organizations'],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationDetailsQuery,
  useAddOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = OrganizationsApi;
