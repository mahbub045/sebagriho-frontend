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

    resetPassword: builder.mutation({
      query: ({ payload }) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ProfileInfo'],
    }),
  }),
});

export const {
  useGetProfileInfoQuery,
  useUpdateProfileInfoMutation,
  useResetPasswordMutation,
} = ProfileInfoApi;
