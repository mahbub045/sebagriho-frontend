import { baseApi } from '../../baseApi';

export const ProfileInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfileInfo: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['ProfileInfo'],
    }),

    updateProfileInfo: builder.mutation({
      query: (profileData) => ({
        url: '/auth/me',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['ProfileInfo'],
    }),
  }),
});

export const { useGetProfileInfoQuery, useUpdateProfileInfoMutation } =
  ProfileInfoApi;
