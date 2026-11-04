import { RepertoryTab } from '@/types/Organization/Homeopathy/Repertories/RepertoriesType';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type RepertoriesState = {
  activeTab: RepertoryTab;
};

const initialState: RepertoriesState = {
  activeTab: 'rubrics',
};

const repertoriesSlice = createSlice({
  name: 'repertories',
  initialState,
  reducers: {
    setRepertoryActiveTab(state, action: PayloadAction<RepertoryTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setRepertoryActiveTab } = repertoriesSlice.actions;
export default repertoriesSlice.reducer;
