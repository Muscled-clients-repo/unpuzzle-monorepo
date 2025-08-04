import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from './services/pokemon.services';
import { enrollApi } from './services/enroll.services';
import { permissionApi } from './services/permission.services';
import { videosApi } from './services/video.services';
import { userApi } from './services//user.services';
import { userPermissionApi } from './services//userPermission.services';
import { puzzlepiecesApi } from './services/puzzlePieces.services';
import { courseApi } from './services/course.services';
import { setupListeners } from '@reduxjs/toolkit/query';
import { quizzApi } from './services/quizzes.services';
import { aiAgentApi } from './services/aiAgent.services';
import { stripeApi } from './services/stripe.services';
import { meetingApi } from './services/meeting.services';
import { activityLogsApi } from './services/activityLogs.services';
import { puzzleAgentsApi } from './services/puzzleAgents.services';
import { creditsApi } from './services/credits.services';

import recordingReducer from "./features/recording/recordingSlice";
import userReducer from "./features/user/userSlice";
import adminReducer from "./features/admin/adminSlice";
import videoReducer from "./features/recordingSlice/recordingSlice";
import notificationReducer from "./features/notifications/notificationSlice";
import previewReducer from './features/previewSlice/previewSlice';
import sidebarReducer from './features/sidebarSlice/sidebarSlice';
import annotaionReducer from './features/annotationSlice';
import selectedIndexReducer from "./features/selectedCourse/selectedIndexSlice";
import aiAgentReducer from './features/aiAgent/aiAgentSlice';
import stripeReducer from './features/stripe/stripeSlice';
import puzzleAgentsReducer from './features/puzzleAgents/puzzleAgentsSlice';
import courseReducer from './features/course/courseSlice';
import videoTimeReducer from './features/videoTime/videoTimeSlice';

import { createSlice } from '@reduxjs/toolkit';

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

const store = configureStore({
  reducer: {
    auth: authTokenSlice.reducer,
    recording: recordingReducer,
    user: userReducer,
    admin: adminReducer,
    video: videoReducer,
    notification: notificationReducer,
    preview: previewReducer,
    sidebar: sidebarReducer,
    teacherAnnotations: annotaionReducer,
    selectedIndex: selectedIndexReducer,
    aiAgent: aiAgentReducer,
    stripe: stripeReducer,
    puzzleAgents: puzzleAgentsReducer,
    course: courseReducer,
    videoTime: videoTimeReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
    [enrollApi.reducerPath]: enrollApi.reducer,
    [permissionApi.reducerPath]: permissionApi.reducer,
    [videosApi.reducerPath]: videosApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [userPermissionApi.reducerPath]: userPermissionApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
    [puzzlepiecesApi.reducerPath]: puzzlepiecesApi.reducer,
    [quizzApi.reducerPath]: quizzApi.reducer,
    [aiAgentApi.reducerPath]: aiAgentApi.reducer,
    [stripeApi.reducerPath]: stripeApi.reducer,
    [meetingApi.reducerPath]: meetingApi.reducer,
    [activityLogsApi.reducerPath]: activityLogsApi.reducer,
    [puzzleAgentsApi.reducerPath]: puzzleAgentsApi.reducer,
    [creditsApi.reducerPath]: creditsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      pokemonApi.middleware,
      enrollApi.middleware,
      permissionApi.middleware,
      videosApi.middleware,
      userApi.middleware,
      userPermissionApi.middleware,
      courseApi.middleware,
      puzzlepiecesApi.middleware,
      quizzApi.middleware,
      aiAgentApi.middleware,
      stripeApi.middleware,
      meetingApi.middleware,
      activityLogsApi.middleware,
      puzzleAgentsApi.middleware,
      creditsApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// In your AuthTokenProvider, dispatch setToken(token) when the token is fetched.
// Example:
// import { useDispatch } from 'react-redux';
// const dispatch = useDispatch();
// useEffect(() => { if (token) dispatch(setToken(token)); }, [token]);