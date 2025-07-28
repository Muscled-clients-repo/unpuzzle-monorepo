import { useState } from "react";
import Image from "next/image";
// import HeartIcon from "../../assets/commentlike.svg"; // Heroicons for the heart icon
import comments from "../../../lib/comments";

const CommentBox = () => {
  const [data, setData] = useState(comments);

  const toggleLike = (id: number) => {
    setData((prevData) =>
      prevData.map((comment) =>
        comment.id === id ? { ...comment, liked: !comment.liked } : comment
      )
    );
  };

  return (
    <div className="space-y-8 mt-4">
      {data.map(({ id, name, auth, time, comment, liked, image }) => (
        <div key={id} className="flex items-start space-x-4  rounded-lg">
          {/* User Image */}
          {/* <img
            src={image}
            alt={`${name}'s profile`}
            width={58}
            height={58}
          /> */}
          <Image src={image} width={58} height={58} alt={`${name}'s profile`} />

          <div className="flex-1">
            {/* Top Row: Name, Authorization, and Heart Icon */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* Name */}
                <p className="font-semibold text-xl text-[#1D1D1D]">{name}</p>
                {/* Authorization */}
                {auth === "teacher" ? (
                  <span className="w-[89px] h-[34px] flex items-center justify-center text-sm font-semibold text-white bg-[#00AFF0] rounded-[5px]">
                    Unpuzzler
                  </span>
                ) : (
                  <span className="text-sm text-[rgba(29, 29, 29, 0.7)]">
                    Student
                  </span>
                )}
              </div>

              {/* Heart Icon */}
              <button onClick={() => toggleLike(id)} aria-label="Like comment">
                {/* <img src={HeartIcon} alt={`${name}'s profile`} /> */}
                <Image
                  src="/assets/commentlike.svg"
                  width={20}
                  height={20}
                  alt={`${name}'s profile`}
                />
              </button>
            </div>

            {/* Time */}
            <p className="text-xs text-gray-500">{time}</p>

            {/* Comment Text */}
            <p className="mt-4 text-gray-800">{comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentBox;
