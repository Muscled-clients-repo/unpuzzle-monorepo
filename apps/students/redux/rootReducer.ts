// src/app/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import notificationReducer from "./features/notifications/notificationSlice";
import coursesReducer from './features/courses/coursesSlice';
import { createSlice } from '@reduxjs/toolkit';
import { enrollApi } from './services/enroll.services';
import { permissionApi } from './services/permission.services';
import { userApi } from './services/user.services';
import { userPermissionApi } from './services/userPermission.services';
import { courseApi } from './services/course.services';

const authTokenSlice = createSlice({
  name: 'auth',
  initialState: { token: null },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export const { setToken } = authTokenSlice.actions;

const rootReducer = combineReducers({
    auth: authTokenSlice.reducer,
    user: userReducer,
    notification: notificationReducer,
    courses: coursesReducer,
    [enrollApi.reducerPath]: enrollApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [userPermissionApi.reducerPath]: userPermissionApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;