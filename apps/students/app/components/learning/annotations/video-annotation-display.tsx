import DiscussionCommentBox from "../../shared/ui/discussion-comment-box";

interface JourneyPreviewProps {
  time: number;
  title: string;
  video: string;
}

export const VideoAnnotationDisplay: React.FC<JourneyPreviewProps> = ({
  time,
  title,
  video,
}) => {
  return (
    <div>
      <div className=" p-5 flex flex-col gap-3 mt-2">
        <h5 className="font-sans font-semibold text-[16px] text-[#1D1D1D]">
          Annotations 00:{time}
        </h5>
        <h3 className="font-sans font-bold text-[16px] text-[#1D1D1D]">
          {title}
        </h3>

        <div className="w-full mt-4">
          <video controls className="w-full h-64">
            <source src={video} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        </div>

        <DiscussionCommentBox />
      </div>
    </div>
  );
};

// Also export with the old name for backward compatibility
export const JourneyVideoAnnotation = VideoAnnotationDisplay;
