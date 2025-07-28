// src/app/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import recordingReducer from "./features/recording/recordingSlice";
import userReducer from "./features/user/userSlice";
import videoReducer from "./features/recordingSlice/recordingSlice";
import notificationReducer from "./features/notifications/notificationSlice";
import previewReducer from './features/previewSlice/previewSlice';
import sidebarReducer from './features/sidebarSlice/sidebarSlice';
import annotaionReducer from './features/annotationSlice';
import selectedIndexReducer from "./features/selectedCourse/selectedIndexSlice"
import videoEditorReducer from "./features/videoEditor/videoEditorSlice";
import coursesReducer from './features/courses/coursesSlice';
import { createSlice } from '@reduxjs/toolkit';
import { pokemonApi } from './services/pokemon.services';
import { enrollApi } from './services/enroll.services';
import { permissionApi } from './services/permission.services';
import { videosApi } from './services/video.services';
import { userApi } from './services/user.services';
import { userPermissionApi } from './services/userPermission.services';
import { courseApi } from './services/course.services';
import { puzzlepiecesApi } from "./services/puzzlePieces.services";
import { quizzApi } from "./services/quizzes.services";

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
    recording: recordingReducer,
    user: userReducer,
    video: videoReducer,
    notification: notificationReducer,
    preview: previewReducer,
    sidebar: sidebarReducer,
    annotations: annotaionReducer,
    selectedIndex: selectedIndexReducer,
    videoEditor: videoEditorReducer,
    courses: coursesReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [enrollApi.reducerPath]: enrollApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [userPermissionApi.reducerPath]: userPermissionApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [puzzlepiecesApi.reducerPath]: puzzlepiecesApi.reducer,
    [quizzApi.reducerPath]: quizzApi.reducer,

});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;