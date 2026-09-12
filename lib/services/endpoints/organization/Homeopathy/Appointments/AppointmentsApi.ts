import { baseApi } from '@/lib/services/baseApi';

export const AppointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppointments: builder.query({
      query: () => ({
        url: '/homeopathy/appointments',
        method: 'GET',
      }),
      providesTags: ['HPAppointments'],
    }),
    getAppointmentDetails: builder.query({
      query: (appointmentUid) => ({
        url: `/homeopathy/appointments/${appointmentUid}`,
        method: 'GET',
      }),
      providesTags: ['HPAppointments'],
    }),
    addAppointment: builder.mutation({
      query: (appointmentData) => ({
        url: '/homeopathy/appointments',
        method: 'POST',
        body: appointmentData,
      }),
      invalidatesTags: ['HPAppointments'],
    }),
    editAppointment: builder.mutation({
      query: ({ appointmentUid, appointmentData }) => ({
        url: `/homeopathy/appointments/${appointmentUid}`,
        method: 'PATCH',
        body: appointmentData,
      }),
      invalidatesTags: ['HPAppointments'],
    }),
    deleteAppointment: builder.mutation({
      query: (appointmentUid) => ({
        url: `/homeopathy/appointments/${appointmentUid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HPAppointments'],
    }),
  }),
});

export const {
  useGetAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useAddAppointmentMutation,
  useEditAppointmentMutation,
  useDeleteAppointmentMutation,
} = AppointmentsApi;
