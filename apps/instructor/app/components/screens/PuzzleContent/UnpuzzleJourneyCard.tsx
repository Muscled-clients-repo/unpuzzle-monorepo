import Image from "next/image";
// import youtubeIcon from "../../assets/youtube.svg";
// import pdfGray from "../../assets/pdfGray.svg";
// import micGray from "../../assets/micGray.svg";
// import quizeGray from "../../assets/QuizeGray.svg";
// import notesGray from "../../assets/noteGray.svg";
// import { useNavigate } from "@remix-run/react";
import { useRouter } from "next/navigation";

interface UnpuzzleJourneyCardProps {
  thumbnail: string;
  title: string;
  badge?: string;
  annotationStatus: string;
  cardId: number;
}

export const UnpuzzleJourneyCard: React.FC<UnpuzzleJourneyCardProps> = ({
  thumbnail,
  title,
  badge,
  annotationStatus,
  cardId,
}) => {
  const router = useRouter();

  const puzzlePieces = [
    "/assets/pdfGray.svg",
    "/assets/micGray.svg",
    "/assets/QuizeGray.svg",
    "/assets/noteGray.svg",
  ];

  const handleCardClick = () => {
    if (annotationStatus === "Annotations") {
      router.push("/annotations-puzzlejourney");
    } else if (annotationStatus === "Confusions") {
      router.push("/confusions-puzzlejourney");
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="w-[24%] bg-white rounded-lg overflow-hidden transition-transform duration-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44">
        {/* <img
          src={thumbnail}
          alt="Journey Thumbnail"
          className="w-full h-full object-cover"
        /> */}
        <Image src={thumbnail} fill alt="Journey Thumbnail" />

        {/* Start Button */}
        <button className="absolute inset-0 flex items-center justify-center bg-black  text-white text-[25px] font-semibold rounded-full w-12 h-12 m-auto">
          ▶
        </button>
        {/* Badge */}
        {badge && (
          <div className="absolute top-2 right-2 bg-[#36CC7B] text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg">
            {badge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex gap-2 items-baseline">
          {/* <img src={youtubeIcon} alt="" /> */}
          <Image src="/assets/searchIcon.svg" width={20} height={20} alt="" />
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {annotationStatus}
          </p>
        </div>
        <div className="text-gray-600">
          <p className="font-light text-sm text-gray-700">
            Annotated Puzzle Pieces:
          </p>
          <div className="w-[100%] flex flex-row flex-nowrap gap-2 overflow-x-auto no-scrollbar">
            {puzzlePieces.map((puzzle, index) => (
              <div
                key={index}
                className="w-[25%] flex flex-col gap-1 rounded-[4px] min-h-[71px] items-center justify-center cursor-pointer flex-shrink-0 bg-[#F9F9F9] dark:bg-[#1D1D1D] text-gray-700 dark:text-white mt-4"
              >
                {/* <img src={puzzle} alt="" /> */}
                <Image src={puzzle} width={20} height={20} alt="" />

                <p className="font-light text-sm text-gray-700">02:08</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
