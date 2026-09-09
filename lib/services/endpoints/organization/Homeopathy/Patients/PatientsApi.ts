import { baseApi } from '@/lib/services/baseApi';

export const PatientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query({
      query: (params) => ({
        url: `/homeopathy/patients`,
        method: 'GET',
        params: params,
      }),
      providesTags: ['HPPatients'],
    }),
    getpatientDetails: builder.query({
      query: (patientUid) => ({
        url: `/homeopathy/patients/${patientUid}`,
        method: 'GET',
      }),
      providesTags: ['HPPatients'],
    }),
  }),
});

export const { useGetPatientsQuery, useGetpatientDetailsQuery } = PatientsApi;
