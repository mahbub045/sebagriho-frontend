import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type LocaleState = {
  locale: Locale;
};

const initialState: LocaleState = {
  locale: defaultLocale,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<Locale>) {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
