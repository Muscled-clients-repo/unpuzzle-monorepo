"use client";

import React, { useState } from "react";
import { useAIAgent } from "../hooks/useAIAgent";
import { useMeetingBooking } from "../hooks/useMeetingBooking";
import { useUserActivityContext } from "../hooks/useUserActivity";
import { useUnpuzzleAiApi } from "../hooks/useUnpuzzleAiApi";
import { usePuzzleHint } from "../hooks/usePuzzleHint";
import { usePuzzleCheck } from "../hooks/usePuzzleCheck";
import { usePuzzlePath } from "../hooks/usePuzzlePath";
import { usePuzzleReflect } from "../hooks/usePuzzleReflect";
import { useCourse } from "../hooks/useCourse";
import { useStripePayment } from "../redux/hooks";
import RootLayout from "../ssrComponent/Layout";
import { CourseProvider } from "../context/CourseContext";

const TEST_VIDEO_ID = "8c0aa943-8adc-4330-b1cd-f4da953f82ae";
const TEST_END_TIME = 10;

const ApiTestPanel = () => {
  // AIAgent
  const { handleVideoPaused, pausedAt, agentType, activateAgent } =
    useAIAgent();
  // Meeting
  const meeting = useMeetingBooking();
  // User Activity
  const userActivity = useUserActivityContext();
  // Unpuzzle API
  const unpuzzleApi = useUnpuzzleAiApi();
  // Puzzle APIs
  const puzzleHint = usePuzzleHint(null);
  const puzzleCheck = usePuzzleCheck(null);
  const puzzlePath = usePuzzlePath();
  const puzzleReflect = usePuzzleReflect();
  const course = useCourse();
  // Youtube Player
  // const youtubePlayer = useYoutubePlayer();
  // Stripe
  const stripe = useStripePayment();

  // UI state for results
  const [result, setResult] = useState<any>({});
  const [token, setToken] = useState("");

  // Course API test states
  const [courseId, setCourseId] = useState("");
  const [deleteCourseId, setDeleteCourseId] = useState("");
  const [createCourseData, setCreateCourseData] = useState({
    title: "",
    description: "",
  });
  const [updateCourseId, setUpdateCourseId] = useState("");
  const [updateCourseData, setUpdateCourseData] = useState({
    title: "",
    description: "",
  });

  // Course API handlers
  const handleGetAllCourses = async () => {
    setResult((r: any) => ({ ...r, allCourses: "Loading..." }));
    try {
      const data = await course.getAllCourses();
      setResult((r: any) => ({ ...r, allCourses: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, allCourses: e?.toString() }));
    }
  };

  const handleGetCourseById = async () => {
    setResult((r: any) => ({ ...r, courseById: "Loading..." }));
    try {
      const data = await course.getCourseById(courseId);
      setResult((r: any) => ({ ...r, courseById: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, courseById: e?.toString() }));
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult((r: any) => ({ ...r, createCourse: "Loading..." }));
    try {
      const data = await course.createCourse(createCourseData);
      setResult((r: any) => ({ ...r, createCourse: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, createCourse: e?.toString() }));
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult((r: any) => ({ ...r, updateCourse: "Loading..." }));
    try {
      const data = await course.updateCourse(updateCourseId, updateCourseData);
      setResult((r: any) => ({ ...r, updateCourse: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, updateCourse: e?.toString() }));
    }
  };

  const handleDeleteCourse = async () => {
    setResult((r: any) => ({ ...r, deleteCourse: "Loading..." }));
    try {
      const data = await course.deleteCourse(deleteCourseId);
      setResult((r: any) => ({ ...r, deleteCourse: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, deleteCourse: e?.toString() }));
    }
  };

  // Handlers for each API
  const handleAIAgentPaused = async () => {
    setResult((r: any) => ({ ...r, aiAgent: "Loading..." }));
    try {
      await handleVideoPaused("10", TEST_VIDEO_ID);
      setResult((r: any) => ({ ...r, aiAgent: { pausedAt, agentType } }));
    } catch (e) {
      setResult((r: any) => ({ ...r, aiAgent: e?.toString() }));
    }
  };

  const handleAIAgentActivate = (type: string) => {
    activateAgent(type as any);
    setResult((r: any) => ({ ...r, aiAgentActivate: type }));
  };

  const handleLoadInstructors = async () => {
    setResult((r: any) => ({ ...r, meeting: "Loading..." }));
    try {
      await meeting.loadInstructors();
      setResult((r: any) => ({ ...r, meeting: meeting.instructors }));
    } catch (e) {
      setResult((r: any) => ({ ...r, meeting: e?.toString() }));
    }
  };

  const handleGetActivityLogs = async () => {
    setResult((r: any) => ({ ...r, activity: "Loading..." }));
    try {
      const logs = await userActivity.getActivityLogs(TEST_VIDEO_ID);
      setResult((r: any) => ({ ...r, activity: logs }));
    } catch (e) {
      setResult((r: any) => ({ ...r, activity: e?.toString() }));
    }
  };

  const handleUnpuzzleApiGet = async () => {
    setResult((r: any) => ({ ...r, unpuzzle: "Loading..." }));
    try {
      const data = await unpuzzleApi.get("/api/health");
      setResult((r: any) => ({ ...r, unpuzzle: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, unpuzzle: e?.toString() }));
    }
  };

  const handlePuzzleHint = async () => {
    setResult((r: any) => ({ ...r, puzzleHint: "Loading..." }));
    try {
      // console.log("puzzleHint: ", await puzzleHint);
      await puzzleHint.getHint({ id: 'test-id', duration: 30 });
      setResult((r: any) => ({ ...r, puzzleHint: puzzleHint.data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, puzzleHint: e?.toString() }));
    }
  };

  const handlePuzzleCheck = async () => {
    setResult((r: any) => ({ ...r, puzzleCheck: "Loading..." }));
    try {
      await puzzleCheck.getCheck({ id: 'test-id', duration: 30 });
      setResult((r: any) => ({ ...r, puzzleCheck: puzzleCheck.data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, puzzleCheck: e?.toString() }));
    }
  };

  const handlePuzzlePath = async () => {
    setResult((r: any) => ({ ...r, puzzlePath: "Loading..." }));
    try {
      await puzzlePath.getPath({ id: 'test-id', duration: 30 });
      setResult((r: any) => ({ ...r, puzzlePath: puzzlePath.data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, puzzlePath: e?.toString() }));
    }
  };

  const handlePuzzleReflect = async () => {
    setResult((r: any) => ({ ...r, puzzleReflect: "Loading..." }));
    try {
      await puzzleReflect.getReflect();
      setResult((r: any) => ({ ...r, puzzleReflect: puzzleReflect.data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, puzzleReflect: e?.toString() }));
    }
  };

  // PuzzleReflect API test handlers
  const handleGetAllPuzzleReflects = async () => {
    setResult((r: any) => ({ ...r, allPuzzleReflects: "Loading..." }));
    try {
      const data = await puzzleReflect.getAllPuzzleReflects();
      setResult((r: any) => ({ ...r, allPuzzleReflects: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, allPuzzleReflects: e?.toString() }));
    }
  };

  const handleGetPuzzleReflectById = async () => {
    setResult((r: any) => ({ ...r, puzzleReflectById: "Loading..." }));
    try {
      const id = "3a5299ac-71e7-4588-851d-ba5001812c58";
      const data = await puzzleReflect.getPuzzleReflectById(id);
      setResult((r: any) => ({ ...r, puzzleReflectById: data }));
    } catch (e) {
      setResult((r: any) => ({ ...r, puzzleReflectById: e?.toString() }));
    }
  };

  // UI
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">API Test Panel</h1>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Auth Token (Bearer):</label>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border px-2 py-1 rounded w-full max-w-md"
          placeholder="Paste your JWT token here"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">AIAgentContext</h2>
          <button onClick={handleAIAgentPaused} className="btn">
            Test handleVideoPaused
          </button>
          <div className="flex gap-2 mt-2">
            {["hint", "reflect", "path", "check"].map((type) => (
              <button
                key={type}
                onClick={() => handleAIAgentActivate(type)}
                className="btn"
              >
                Activate {type}
              </button>
            ))}
          </div>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.aiAgent, null, 2)}
          </pre>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.aiAgentActivate, null, 2)}
          </pre>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">MeetingBookingContext</h2>
          <button onClick={handleLoadInstructors} className="btn">
            Load Instructors
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.meeting, null, 2)}
          </pre>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">UserActivityContext</h2>
          <button onClick={handleGetActivityLogs} className="btn">
            Get Activity Logs
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.activity, null, 2)}
          </pre>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">UnpuzzleAiApi</h2>
          <button onClick={handleUnpuzzleApiGet} className="btn">
            GET /api/health
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.unpuzzle, null, 2)}
          </pre>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Puzzle APIs</h2>
          <button onClick={handlePuzzleHint} className="btn">
            Get Puzzle Hint
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.puzzleHint, null, 2)}
          </pre>
          <button onClick={handlePuzzleCheck} className="btn mt-2">
            Get Puzzle Check
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.puzzleCheck, null, 2)}
          </pre>
          <button onClick={handlePuzzlePath} className="btn mt-2">
            Get Puzzle Path
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.puzzlePath, null, 2)}
          </pre>
          <button onClick={handlePuzzleReflect} className="btn mt-2">
            Get Puzzle Reflect
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.puzzleReflect, null, 2)}
          </pre>
          <button onClick={handleGetAllPuzzleReflects} className="btn mt-2">
            Get All Puzzle Reflects (with token)
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.allPuzzleReflects, null, 2)}
          </pre>
          <button onClick={handleGetPuzzleReflectById} className="btn mt-2">
            Get Puzzle Reflect By ID (with token)
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.puzzleReflectById, null, 2)}
          </pre>
        </div>
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Course APIs</h2>
          <button onClick={handleGetAllCourses} className="btn">
            Get All Courses
          </button>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.allCourses, null, 2)}
          </pre>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleGetCourseById();
            }}
            className="mt-2"
          >
            <label className="block text-xs">Course ID:</label>
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              placeholder="Enter course ID"
            />
            <button type="submit" className="btn mt-1">
              Get Course By ID
            </button>
          </form>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.courseById, null, 2)}
          </pre>
          <form onSubmit={handleCreateCourse} className="mt-2">
            <label className="block text-xs">Create Course:</label>
            <input
              type="text"
              value={createCourseData.title}
              onChange={(e) =>
                setCreateCourseData((d) => ({ ...d, title: e.target.value }))
              }
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Title"
            />
            <input
              type="text"
              value={createCourseData.description}
              onChange={(e) =>
                setCreateCourseData((d) => ({
                  ...d,
                  description: e.target.value,
                }))
              }
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Description"
            />
            <button type="submit" className="btn mt-1">
              Create Course
            </button>
          </form>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.createCourse, null, 2)}
          </pre>
          <form onSubmit={handleUpdateCourse} className="mt-2">
            <label className="block text-xs">Update Course:</label>
            <input
              type="text"
              value={updateCourseId}
              onChange={(e) => setUpdateCourseId(e.target.value)}
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Course ID"
            />
            <input
              type="text"
              value={updateCourseData.title}
              onChange={(e) =>
                setUpdateCourseData((d) => ({ ...d, title: e.target.value }))
              }
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Title"
            />
            <input
              type="text"
              value={updateCourseData.description}
              onChange={(e) =>
                setUpdateCourseData((d) => ({
                  ...d,
                  description: e.target.value,
                }))
              }
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Description"
            />
            <button type="submit" className="btn mt-1">
              Update Course
            </button>
          </form>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.updateCourse, null, 2)}
          </pre>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleDeleteCourse();
            }}
            className="mt-2"
          >
            <label className="block text-xs">Delete Course:</label>
            <input
              type="text"
              value={deleteCourseId}
              onChange={(e) => setDeleteCourseId(e.target.value)}
              className="border px-2 py-1 rounded w-full mt-1"
              placeholder="Course ID"
            />
            <button type="submit" className="btn mt-1">
              Delete Course
            </button>
          </form>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(result.deleteCourse, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <CourseProvider>
      <ApiTestPanel />
    </CourseProvider>
  );
};

export default Page;
