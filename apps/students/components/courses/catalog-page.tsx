// import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import { useGetCoursesQuery } from "../../redux/hooks";
import { EnrolledCourse } from '../../types/course.types';
// import PageLoadingSpinner from "../shared/page-loading-spinner";
import Image from "next/image";
import { CourseGridSkeleton } from "@unpuzzle/ui";

// Dynamic imports for better code splitting
const CourseCard = dynamic(() => import('./course-card').then(mod => ({ default: mod.CourseCard })), {
  loading: () => <CourseGridSkeleton />,
  ssr: false
});

type LayoutType = "grid-1" | "grid-4" | "list";

const CourseScreen: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("All");
  const [layout] = useState<LayoutType>("grid-4");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
  const { data: courses, isLoading } = useGetCoursesQuery(undefined);

  // Courses data loaded
  useEffect(() => {
    
    if (courses) {

      let updatedCourses: EnrolledCourse[] = courses.data;
      if (filterType !== "All") {
        updatedCourses = updatedCourses.filter(course => course.category === filterType);
      }
      if (searchTerm) {
        updatedCourses = updatedCourses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      setFilteredCourses(updatedCourses);
    }
  }, [courses, filterType, searchTerm]);

  // const { user } = useSelector((state: RootState) => state.user);

  const handleFilterClick = (filter: string) => {
    setFilterType(filter);
  };

  return (
    <div>
      <div className="px-10">
        <div className="w-[70%] flex items-center px-4 py-2 bg-[#F5F4F6] rounded-[100px]">
          <Image src="/assets/searchIcon.svg" width={15} height={15} alt="searchIcon" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none bg-transparent px-3 bg-"
          />
        </div>
        <div className="flex justify-between items-center w-full mb-5 mt-3">
          <div className="flex items-center gap-2">
            <button
              className={`py-[12px] w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "All"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("All")}
            >
              All
            </button>
            <button
              className={`py-[12px] w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "Shopify UI"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("Shopify UI")}
            >
              Shopify UI
            </button>
            <button
              className={`py-3 w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "Shopify Theme Design"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("Shopify Theme Design")}
            >
              Shopify Theme Design
            </button>
            <button
              className={`py-3 w-fit px-4 rounded-[8px] cursor-pointer ${
                filterType === "App Development"
                  ? "bg-[#00AFF0] text-white"
                  : "hover:bg-[#F3F5F8] border bg-white border-[rgba(245,244,246,0.40)] text-[#55565B]"
              } text-[16px] font-medium leading-normal`}
              onClick={() => handleFilterClick("App Development")}
            >
              App Development
            </button>
          </div>
        </div>
        <div className="overflow-auto h-[75vh]">
          {isLoading ? (
            <div className="pr-[20px]">
              <CourseGridSkeleton count={layout === "grid-1" ? 3 : 8} />
            </div>
          ) : (
            <div
              className={`pr-[20px] grid ${
                layout === "grid-1"
                  ? "grid-cols-1"
                  : "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              } gap-x-[15px] gap-y-6`}
            >
              {filteredCourses.map((course, index) => (
                <button
                  key={index}
                  className=" cursor-pointer"
                >
                  <div>
                    {/* TODO: Align EnrolledCourse and Course types for CourseCard. For now, cast as any. */}
                    <CourseCard layout={layout} course={course as any} index={index} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseScreen;
