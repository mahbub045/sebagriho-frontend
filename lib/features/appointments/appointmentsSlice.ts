import { AppointmentStatus } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AppointmentsState = {
  statusFilter: AppointmentStatus;
};

const initialState: AppointmentsState = {
  statusFilter: 'SCHEDULED',
};

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointmentStatusFilter(state, action: PayloadAction<AppointmentStatus>) {
      state.statusFilter = action.payload;
    },
  },
});

export const { setAppointmentStatusFilter } = appointmentsSlice.actions;
export default appointmentsSlice.reducer;
