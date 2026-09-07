import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { authApi } from './services/authApi';
import { baseApi } from './services/baseApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
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

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
