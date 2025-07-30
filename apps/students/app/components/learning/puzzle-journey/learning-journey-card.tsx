"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { PlayIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { DocumentTextIcon, MicrophoneIcon, PuzzlePieceIcon, DocumentIcon } from "@heroicons/react/24/outline";

interface UnpuzzleJourneyCardProps {
  thumbnail: string;
  title: string;
  badge?: string;
  annotationStatus: string;
  cardId: number;
}

export const LearningJourneyCard: React.FC<UnpuzzleJourneyCardProps> = ({
  thumbnail,
  title,
  badge,
  annotationStatus,
  cardId,
}) => {
  const router = useRouter();

  const puzzlePieces = [
    { icon: DocumentTextIcon, label: "PDF", time: "02:08" },
    { icon: MicrophoneIcon, label: "Audio", time: "03:45" },
    { icon: PuzzlePieceIcon, label: "Quiz", time: "01:30" },
    { icon: DocumentIcon, label: "Notes", time: "05:12" },
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
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl 
               transform hover:scale-105 transition-all duration-300 cursor-pointer
               border border-gray-100"
    >
      {/* Enhanced Thumbnail with Overlay */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image 
          src={thumbnail} 
          fill 
          alt="Journey Thumbnail"
          className="object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300" />

        {/* Modern Play Button */}
        <button className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 
                        transform group-hover:scale-110 transition-all duration-300
                        shadow-lg">
            <PlayIcon className="h-8 w-8 text-blue-600" />
          </div>
        </button>
        
        {/* Enhanced Badge */}
        {badge && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-green-500 
                        text-white text-xs font-bold py-1.5 px-3 rounded-full 
                        shadow-lg backdrop-blur-sm">
            <CheckCircleIcon className="h-4 w-4" />
            {badge}
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 
                     group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        
        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                         ${annotationStatus === "Annotations" 
                           ? "bg-blue-100 text-blue-700" 
                           : "bg-purple-100 text-purple-700"}`}>
            {annotationStatus}
          </span>
        </div>
        
        {/* Puzzle Pieces Section */}
        <div className="space-y-3">
          <p className="font-medium text-sm text-gray-700">
            Puzzle Pieces Completed:
          </p>
          <div className="grid grid-cols-4 gap-2">
            {puzzlePieces.map((puzzle, index) => {
              const Icon = puzzle.icon;
              return (
                <div
                  key={index}
                  className="group/item flex flex-col items-center justify-center p-3 
                           bg-gray-50 hover:bg-blue-50 rounded-lg min-h-[70px] 
                           cursor-pointer transition-all duration-200 hover:shadow-md"
                >
                  <Icon className="h-5 w-5 text-gray-600 group-hover/item:text-blue-600 
                                 transition-colors duration-200 mb-1" />
                  <p className="text-xs font-medium text-gray-600 group-hover/item:text-blue-600">
                    {puzzle.time}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Also export with the old name for backward compatibility
export const UnpuzzleJourneyCard = LearningJourneyCard;
