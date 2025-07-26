import CommentBox from "../../content/CommentBox";

interface JourneyPreviewProps {
  time: number;
  title: string;
  audio: string;
}

export const JourneyAudioAnnotation: React.FC<JourneyPreviewProps> = ({
  time,
  title,
  audio,
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
          <audio controls className="w-full h-10">
            <source src={audio} type="audio/mpeg" />
          </audio>
        </div>
        <CommentBox />
      </div>
    </div>
  );
};
