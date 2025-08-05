import { configureStore } from '@reduxjs/toolkit';
import { enrollApi } from './services/enroll.services';
import { permissionApi } from './services/permission.services';
import { userApi } from './services/user.services';
import { userPermissionApi } from './services/userPermission.services';
import { courseApi } from './services/course.services';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './rootReducer';
export { setToken } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      enrollApi.middleware,
      permissionApi.middleware,
      userApi.middleware,
      userPermissionApi.middleware,
      courseApi.middleware
    ),
});

setupListeners(store.dispatch);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

// In your AuthTokenProvider, dispatch setToken(token) when the token is fetched.
// Example:
// import { useDispatch } from 'react-redux';
// const dispatch = useDispatch();
// useEffect(() => { if (token) dispatch(setToken(token)); }, [token]);