// src/app/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import recordingReducer from "./features/recording/recordingSlice";
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import videoReducer from "./features/recordingSlice/recordingSlice";
import notificationReducer from "./features/notifications/notificationSlice";
import previewReducer from './features/previewSlice/previewSlice';
import sidebarReducer from './features/sidebarSlice/sidebarSlice';
import annotaionReducer from './features/annotationSlice';

import selectedIndexReducer from "./features/selectedCourse/selectedIndexSlice"
import { pokemonApi } from './services/pokemon.services';
import { enrollApi } from './services/enroll.services';
import { permissionApi } from './services/permission.services';
import { videosApi } from './services/video.services';
import { userApi } from './services//user.services';
import { userPermissionApi } from './services//userPermission.services';
import { courseApi } from './services/course.services';
import { puzzlepiecesApi } from "./services/puzzlePieces.services";
import { quizzApi } from "./services/quizzes.services";



const rootReducer = combineReducers({
    recording: recordingReducer,
    user: userReducer,
    admin: adminReducer,
    video: videoReducer,
    notification: notificationReducer,
    preview: previewReducer,
    sidebar: sidebarReducer,
    teacherAnnotations: annotaionReducer,
    selectedIndex: selectedIndexReducer,
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