import { baseApi } from '@/lib/services/baseApi';

export const MedicinesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMedicines: builder.query({
      query: (params) => ({
        url: '/homeopathy/medicines',
        method: 'GET',
        params,
      }),
      providesTags: ['HPMedicines'],
    }),
    getMedicineDetails: builder.query({
      query: (medicineUid) => ({
        url: `/homeopathy/medicines/${medicineUid}`,
        method: 'GET',
      }),
      providesTags: ['HPMedicines'],
    }),
    addMedicine: builder.mutation({
      query: (payload) => ({
        url: '/homeopathy/medicines',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['HPMedicines'],
    }),
    updateMedicine: builder.mutation({
      query: ({ medicineUid, payload }) => ({
        url: `/homeopathy/medicines/${medicineUid}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['HPMedicines'],
    }),
    deleteMedicine: builder.mutation({
      query: ({ medicineUid }) => ({
        url: `/homeopathy/medicines/${medicineUid}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HPMedicines'],
    }),
  }),
});

export const {
  useGetMedicinesQuery,
  useGetMedicineDetailsQuery,
  useAddMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = MedicinesApi;
