import { useRef } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle } from "../../shared/ui/Card";
// import course1 from "../../assets/thumbnailWeb.svg";
// import chevronButton from "../../assets/chevronButton.svg";
// import youtube from "../../assets/youtube.svg";
interface Course {
  image: string;
  title: string;
  description: string;
  duration?: string;
  instructorname?: string;
}

const courses: Course[] = [
  {
    image: "/assets/thumbnailWeb.svg",
    title: "Annotated at 03:39",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
  {
    image: "/assets/thumbnailWeb.svg",
    title: "1.1 Getting Started",
    description:
      "A Complete Course to UI/UX design: Learn everything you need to know.",
    duration: "03:02",
    instructorname: "Mahtab alam",
  },
];

const RecentPuzzleCard: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth / 4; // Scroll by 1 card width
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.offsetWidth / 4; // Scroll by 1 card width
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute top-1/2 left-[-10px] -translate-y-1/2   z-10 cursor-pointer"
      >
        {/* <img
          src={chevronButton}
          alt=""
          className="w-[50px] h-[50px] rotate-180"
        /> */}
        <Image
          src="/assets/chevronButton.svg"
          width={50}
          height={50}
          className="rotate-180"
          alt=""
        />
      </button>

      {/* Card Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-scroll scrollbar-hide w-full"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {courses.map((course, index) => (
          <Card
            key={index}
            className="rounded-[15.5px] bg-white min-h-[260.98px] relative border shadow flex-none w-[23%] scroll-snap-align-start"
          >
            {/* <img
              className="object-cover rounded-[10px] w-full h-[150px]"
              src={course.image}
              alt="Course Thumbnail"
            /> */}
            <div className="relative w-full h-[150px] rounded-[10px] overflow-hidden">
              <Image
                src={course.image}
                alt="Course Thumbnail"
                fill
                className="object-cover"
              />
              {/* <Image
              src={course.image}
              height={150}
              className="object-cover rounded-[10px] w-full"
              alt="Course Thumbnail"
            /> */}
            </div>

            <CardHeader className="gap-0 w-full p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-[#1D1D1D] text-start leading-normal font-semibold">
                  {course.title}
                </CardTitle>
                <p className="font-normal text-base text-black">
                  {course.duration}
                </p>
              </div>
              <p className="text-[#55565B] text-start font-normal  text-[12px] leading-normal truncate-2-lines">
                {course.description}
              </p>

              {course.instructorname && (
                <p className="text-sm font-bold text-[#00000099]">
                  {course.instructorname}
                </p>
              )}
              {index === 0 && (
                <div className="flex items-center gap-2">
                  {/* <img
                    src={youtube}
                    alt="YouTube"
                    className="w-[70px] h-[16px]"
                  /> */}
                  <Image
                    src="/assets/youtube.svg"
                    height={16}
                    width={70}
                    alt="youtube"
                  />
                  <p className="text-sm font-bold text-[#00000099]">
                    Puzzle Journey
                  </p>
                </div>
              )}
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute top-1/2 right-[-10px] -translate-y-1/2 cursor-pointer"
      >
        {/* <img src={chevronButton} alt="" className="w-[50px] h-[50px] " /> */}
        <Image src="/assets/chevronButton.svg" height={50} width={50} alt="" />
      </button>
    </div>
  );
};

export default RecentPuzzleCard;
