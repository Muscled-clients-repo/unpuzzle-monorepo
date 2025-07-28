import Image from "next/image";
import { AnnotationPreviewProps } from "../../../types/videos.types";
import DiscussionCommentBox from "./discussion-comment-box";

export const AnnotationPreview: React.FC<AnnotationPreviewProps> = ({
  handleRemovePrivew,
  time,
  activeTab,
  data,
}) => {
  return (
    <div>
      <div className="p-5 border flex gap-2">
        <button onClick={handleRemovePrivew} className="cursor-pointer">
          <Image
            src="/assets/arrow-left.svg"
            alt="Back"
            width={25}
            height={25}
          />
        </button>
        <h3 className="font-bold">Annotation Preview</h3>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <h5 className="font-sans font-semibold text-[16px] text-[#1D1D1D]">
          Annotations {time}
        </h5>

        {activeTab === "Text PP" && (
          <p className="font-sans font-normal text-[15px] text-[#1D1D1D]">
            {data}
          </p>
        )}
        {activeTab === "Audio PP" && (
          <div className="w-full mt-4">
            <audio controls className="w-full h-10">
              <source src={data} type="audio/mpeg" />
            </audio>
          </div>
        )}
        {activeTab === "Video PP" && (
          <div className="w-full mt-4">
            <video controls className="w-full h-64">
              <source src={data} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>
        )}
        <DiscussionCommentBox />
      </div>
    </div>
  );
};
