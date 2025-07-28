
BUILD ERROR SUMMARY
==================

Total TypeScript Errors: 114

## Error Types Breakdown:

- **TS2339** (33 errors): Property does not exist on type
- **TS2322** (21 errors): Type is not assignable
- **TS2345** (10 errors): Argument type mismatch
- **TS2304** (8 errors): Cannot find name
- **TS7006** (7 errors): Parameter implicitly has 'any' type
- **TS2305** (5 errors): Module has no exported member
- **TS18047** (5 errors): Variable is possibly 'null'
- **TS2554** (4 errors): Expected X arguments, but got Y
- **TS2454** (2 errors): Variable used before being assigned
- **TS2448** (2 errors): Block-scoped variable used before declaration
- **TS2307** (2 errors): Cannot find module
- **TS7031** (1 error): Binding element implicitly has 'any' type
- **TS7019** (1 error): Rest parameter implicitly has 'any[]' type
- **TS2741** (1 error): Property missing in type
- **TS2739** (1 error): Type missing properties
- **TS2559** (1 error): Type has no properties in common
- **TS2551** (1 error): Property does not exist (did you mean X?)
- **TS2367** (1 error): This comparison appears unintentional

## Errors by File:

### Most Affected Files:
- **app/hooks/useSocket.ts** (21 errors)
- **app/context/YoutubePlayerContext.tsx** (8 errors)
- **app/components/screens/VideoEditor/VideoEditorTimeline.tsx** (8 errors)
- **app/components/screens/Courses/CourseContent.tsx** (8 errors)
- **app/hooks/usePuzzleCheck.ts** (6 errors)

### Full File List:
     21 app/hooks/useSocket.ts
      8 app/context/YoutubePlayerContext.tsx
      8 app/components/screens/VideoEditor/VideoEditorTimeline.tsx
      8 app/components/screens/Courses/CourseContent.tsx
      6 app/hooks/usePuzzleCheck.ts
      5 app/testapi/page.tsx
      5 app/components/screens/Videos/VideoDetailSection.tsx
      5 app/components/screens/Videos/CourseContent.tsx
      5 app/components/screens/Videos/AIAgents.tsx
      5 app/components/screens/moderator-view/CourseContent.tsx
      4 app/components/screens/VideoScreen/VideoJourneyDetail.tsx
      4 app/components/screens/VideoAnnotationTeacher/CourseInstructorDetail.tsx
      3 app/components/screens/Videos/NewVideoPlayer.tsx
      3 app/components/screens/MyCoursesScreen.tsx
      2 app/hooks/useFormatDateTime.ts
      2 app/components/screens/Courses/CourseCard.tsx
      1 app/ssrComponent/Layout.tsx
      1 app/services/videoExport.service.ts
      1 app/redux/hooks/useAuthenticatedCourseApi.ts
      1 app/hooks/usePuzzlePath.ts
      1 app/hooks/useApi.ts
      1 app/context/PuzzleCheck.tsx
      1 app/components/StripeGateway.tsx
      1 app/components/screens/VideoScreen/VideoJourney.tsx
      1 app/components/screens/VideoEditor/WavesurferEditor.tsx
      1 app/components/screens/VideoEditor/VideoEditorTools.tsx
      1 app/components/screens/SettingScreen.tsx
      1 app/components/screens/CourseScreen.tsx

## Critical Issues to Fix First:

### 1. Missing Dependencies:
- **socket.io-client**: Module '"socket.io-client"' has no exported member 'io' (5 occurrences)
  - Affected files: useSocket.ts, usePuzzleCheck.ts, useApi.ts, PuzzleCheck.tsx
  - Fix: Check if socket.io-client is installed and import correctly

- **date-fns**: Cannot find module 'date-fns' (1 occurrence)
  - Affected file: useFormatDateTime.ts
  - Fix: Install date-fns: `npm install date-fns`

### 2. Type Definition Issues:
- **Course type**: Missing properties 'thumbnail' and 'duration'
- **Video type**: Missing property 'instructor'
- **Asset type**: Missing property 'title'
- **AiFile type**: Missing property 'thumbnails'

### 3. Common Pattern Errors:
- **String to number assignments**: Multiple CourseContent.tsx files have string values being assigned to number properties
- **useRef vs number**: AIAgents.tsx and NewVideoPlayer.tsx are using numbers where MutableRefObject is expected
- **Redux dispatch**: CourseInstructorDetail.tsx is dispatching void instead of actions

### 4. Undefined Variables:
- **VideoEditorTimeline.tsx**: Missing `draggingVideoIndex` and `setDraggingVideoIndex` state variables
- **VideoEditorTools.tsx**: Undefined variable 'index'

### 5. Import/Export Mismatches:
- **StripePaymentContext**: Missing export 'useStripePayment'
- **PuzzleCheckInterface**: Missing properties onDataChange, onLoadingChange, onStreamChange, onScoreChange

## Recommended Fix Order:

1. **Install missing dependencies**:
   ```bash
   npm install date-fns
   npm install socket.io-client@latest
   ```

2. **Fix socket.io imports** - Update all files importing 'io' from socket.io-client

3. **Fix type definitions** - Update Course, Video, Asset, and AiFile interfaces

4. **Fix string/number type mismatches** - Update CourseContent components

5. **Fix useRef issues** - Convert number variables to useRef in AIAgents and NewVideoPlayer

6. **Add missing state variables** - Add draggingVideoIndex state in VideoEditorTimeline

7. **Fix Redux actions** - Update CourseInstructorDetail dispatch calls

8. **Fix remaining property errors** - Add missing properties to types or update component usage
