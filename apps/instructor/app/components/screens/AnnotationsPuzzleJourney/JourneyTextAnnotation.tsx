import CommentBox from "../../shared/ui/CommentBox";

interface JourneyPreviewProps {
  time: number;
  title: string;
  text: string;
}

export const JourneyTextAnnotation: React.FC<JourneyPreviewProps> = ({
  time,
  title,
  text,
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
        <p className="font-sans font-normal text-[15px] text-[#1D1D1D]">
          {text}
        </p>
        <CommentBox />
      </div>
    </div>
  );
};
