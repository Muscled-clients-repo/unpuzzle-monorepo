import React from "react";
import { useRouter } from "next/navigation";
import Table from "../shared/Table";
import Pagination from "../shared/Pagination";
import { formatSecondsToMMSS } from "../../utils/formatTime";

interface PuzzleRecord {
  id: string;
  user: {
    firstName: string;
  };
  timestamp?: number;
  duration?: number;
  title?: string;
  status?: string;
  correct_checks_count?: number;
  total_checks?: number;
}

interface PuzzleTableProps {
  data: PuzzleRecord[];
  heading: string;
  count: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export const PuzzleReflectTable: React.FC<PuzzleTableProps> = ({
  data,
  heading,
  count,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
}) => {
  const router = useRouter();

  const transformedData =
    data?.map((record) => ({
      id: record.id,
      username: record.user?.firstName || "Unknown",
      time: formatSecondsToMMSS(record.timestamp || 0),
      reflection: record.title || "-",
      action: (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/instructor/puzzlereflect/${record.id}`);
          }}
          className="btn bg-black text-white cursor-pointer p-1.5 text-xs rounded hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      ),
    })) || [];

  const columns = [
    { title: "Username", key: "username" },
    { title: "Time", key: "time" },
    { title: "Reflection", key: "reflection" },
    { title: "Action", key: "action", link: true },
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={transformedData}
          heading={`${heading} (${count})`}
          routePrefix="/instructor/puzzlereflect"
          routing={false}
        />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={count}
        />
      </div>
    </div>
  );
};

export const PuzzleCheckTable: React.FC<PuzzleTableProps> = ({
  data,
  heading,
  count,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
}) => {
  const router = useRouter();

  const transformedData =
    data?.map((record) => ({
      id: record.id,
      username: record.user?.firstName || "Unknown",
      time: formatSecondsToMMSS(record.duration || 0),
      quizScore: `${record.correct_checks_count || 0} / ${
        record.total_checks || 0
      }`,
      action: (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/instructor/puzzlecheck/${record.id}`);
          }}
          className="btn bg-black text-white cursor-pointer p-1.5 text-xs rounded hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      ),
    })) || [];

  const columns = [
    { title: "Username", key: "username" },
    { title: "Time", key: "time" },
    { title: "Quiz Score", key: "quizScore" },
    { title: "Action", key: "action", link: true },
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={transformedData}
          heading={`${heading} (${count})`}
          routePrefix="/instructor/puzzlecheck"
          routing={false}
        />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={count}
        />
      </div>
    </div>
  );
};

export const PuzzleHintTable: React.FC<PuzzleTableProps> = ({
  data,
  heading,
  count,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
}) => {
  const router = useRouter();

  const transformedData =
    data?.map((record) => ({
      id: record.id,
      username: record.user?.firstName || "Unknown",
      time: formatSecondsToMMSS(record.duration || 0),
      status: record.status || "-",
      action: (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/instructor/puzzlehint/${record.id}`);
          }}
          className="btn bg-black text-white cursor-pointer p-1.5 text-xs rounded hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      ),
    })) || [];

  const columns = [
    { title: "Username", key: "username" },
    { title: "Time", key: "time" },
    { title: "Status", key: "status" },
    { title: "Action", key: "action", link: true },
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={transformedData}
          heading={`${heading} (${count})`}
          routePrefix="/instructor/puzzlehint"
          routing={false}
        />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={count}
        />
      </div>
    </div>
  );
};

export const PuzzlePathTable: React.FC<PuzzleTableProps> = ({
  data,
  heading,
  count,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
}) => {
  const router = useRouter();

  const transformedData =
    data?.map((record) => ({
      id: record.id,
      username: record.user?.firstName || "Unknown",
      time: formatSecondsToMMSS(record.duration || 0),
      lesson: record.title || "-",
      action: (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/instructor/puzzlepath/${record.id}`);
          }}
          className="btn bg-black text-white cursor-pointer p-1.5 text-xs rounded hover:bg-gray-800 transition-colors"
        >
          View
        </button>
      ),
    })) || [];

  const columns = [
    { title: "Username", key: "username" },
    { title: "Time", key: "time" },
    { title: "Lesson", key: "lesson" },
    { title: "Action", key: "action", link: true },
  ];

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          data={transformedData}
          heading={`${heading} (${count})`}
          routePrefix="/instructor/puzzlepath"
          routing={false}
        />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalItems={count}
        />
      </div>
    </div>
  );
};
