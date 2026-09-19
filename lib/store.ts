import { configureStore } from '@reduxjs/toolkit';
import appointmentsReducer from './features/appointments/appointmentsSlice';
import authReducer from './features/auth/authSlice';
import localeReducer, {
  type LocaleState,
} from './features/locale/localeSlice';
import { authApi } from './services/authApi';
import { baseApi } from './services/baseApi';

// No module-level store instance is exported: Next.js App Router reuses the
// same server process (and this module) across requests from different
// users, so a shared store would leak one user's state (e.g. locale) into
// another's response. `StoreProvider` calls this to create a fresh store
// per request/session instead.
export const makeStore = (preloadedState?: { locale: LocaleState }) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      appointments: appointmentsReducer,
      locale: localeReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // RTK Query caches whatever a query/mutation returns in the
          // store. Some endpoints (e.g. file export/download endpoints)
          // intentionally return a Blob from their `responseHandler`,
          // which trips the default serializability check.
          ignoredActions: [
            'api/executeMutation/fulfilled',
            'api/executeQuery/fulfilled',
          ],
          ignoredPaths: [/^api\.(mutations|queries)\..*\.data$/],
        },
      }).concat(baseApi.middleware, authApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
