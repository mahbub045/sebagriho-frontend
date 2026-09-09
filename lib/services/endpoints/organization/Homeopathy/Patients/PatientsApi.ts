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
    addPatient: builder.mutation({
      query: (payload) => ({
        url: `/homeopathy/patients`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['HPPatients'],
    }),
    updatePatient: builder.mutation({
      query: ({ patientUid, payload }) => ({
        url: `/homeopathy/patients/${patientUid}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['HPPatients'],
    }),
    deletePatient: builder.mutation({
      query: ({ patientUid }) => ({
        url: `/homeopathy/patients/${patientUid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HPPatients'],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useGetpatientDetailsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = PatientsApi;
