import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import authorizationReducer  from '../slices/authorizationSlice';
import notificationsReducer  from '../slices/notificationSlice';
import { rtkApi } from '../apis/rtkApi';

// Configure Redux store with RTK Query
export const store = configureStore({
    reducer: {
        authorization: authorizationReducer,
        notifications: notificationsReducer,
        [rtkApi.reducerPath]: rtkApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
})

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState
  dispatch: AppDispatch
}>()