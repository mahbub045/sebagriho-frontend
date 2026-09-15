import { baseApi } from '../../baseApi';

export const setPasswordApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    setPassword: builder.mutation({
      query: (payload) => ({
        url: '/auth/set-password',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ProfileInfo'],
    }),
  }),
});

export const { useSetPasswordMutation } = setPasswordApi;
