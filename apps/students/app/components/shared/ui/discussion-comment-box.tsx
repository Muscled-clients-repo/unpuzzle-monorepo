import React, { useState, ChangeEvent, KeyboardEvent } from "react";
// import commentIcon from "/assets/commentIcon.png";
// import emptyComment from "/assets/emptyComment.png";
// import commentImage from "/assets/commentImage.png";
// import likeIcon from "/assets/likeIcon.svg"; // Replace with your like icon
// import unlikeIcon from "/assets/unlikeIcon.svg"; // Replace with your unlike icon
// import replyIcon from "/assets/replyIcon.png";

import { useViewAllComments } from "../../../context/ViewAllCommentContext";
import Image from "next/image";
// import { formatDateTime } from "../../hooks/useFormatDateTime";

interface Comment {
  text: string;
  liked: boolean;
  replies: string[];
}

const CommentBox: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]); // State for comments
  const [inputValue, setInputValue] = useState<string>(""); // State for input value
  const [replyInput, setReplyInput] = useState<{ [key: number]: string }>({}); // Track replies input for each comment
  const { viewAllComment, setViewAllComment } = useViewAllComments();

  // Function to handle adding a comment
  const handleAddComment = () => {
    if (inputValue.trim() !== "") {
      setComments((prevComments) => [
        ...prevComments,
        { text: inputValue, liked: false, replies: [] },
      ]);
      setInputValue(""); // Clear the input field
    }
  };

  // Handle input value change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Handle pressing Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  // Toggle like/unlike for a comment
  // const handleToggleLike = (index: number) => {
  //   setComments((prevComments) =>
  //     prevComments.map((comment, i) =>
  //       i === index ? { ...comment, liked: !comment.liked } : comment
  //     )
  //   );
  // };

  // Handle reply input change
  const handleReplyInputChange = (index: number, value: string) => {
    setReplyInput((prev) => ({ ...prev, [index]: value }));
  };

  // Handle adding a reply to a comment
  const handleAddReply = (index: number) => {
    const replyText = replyInput[index]?.trim();
    if (replyText) {
      setComments((prevComments) =>
        prevComments.map((comment, i) =>
          i === index
            ? { ...comment, replies: [...comment.replies, replyText] }
            : comment
        )
      );
      setReplyInput((prev) => ({ ...prev, [index]: "" })); // Clear the reply input field
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <div className="flex items-center mb-3">
        <Image
          src="/assets/commentIcon.png"
          alt="Profile"
          width={28}
          height={28}
          className="rounded-full mr-3"
        />
        <input
          type="text"
          placeholder="Add a comment..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 p-1 border-b-2"
        />
      </div>

      {/* Comments List */}
      <div>
        {comments.length === 0 ? (
          <div className="text-center p-6 border-gray-300 rounded-md">
            <Image
              src="/assets/emptyComment.png"
              alt="No Comments"
              width={20}
              height={20}
              className="mb-3 mx-auto"
            />
            <h5 className="font-semibold mb-1 text-[16px]">No Comments</h5>
            <p className="text-gray-500 text-[13px] ">
              Be the first to leave a comment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="p-2 ">
                <div className="flex gap-2.5">
                  <div className="w-[30px] h-[30px] flex items-center justify-center rounded-lg">
                    <Image src="/assets/commentImage.png" alt="Profile" fill />
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center">
                      <h2 className="text-base font-semibold">Mahtab</h2>
                      <p className="text-sm text-gray-500">
                        {/* {formatDateTime(new Date().toLocaleString())} */}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-4">
                      <button
                        // onClick={() => handleToggleLike(index)}
                        className="flex items-center gap-2 text-sm text-gray-500"
                      >
                        <Image
                          src="/assets/likeIcon.svg"
                          fill
                          alt="Like"
                          className="w-5 h-5 cursor-pointer"
                        />
                        <Image
                          src="/assets/unlikeIcon.svg"
                          fill
                          alt="unlike"
                          className="w-5 h-5 cursor-pointer"
                        />
                        {/* {comment.liked ? "Unlike" : "Like"} */}
                      </button>
                      <button
                        onClick={() =>
                          setReplyInput((prev) => ({
                            ...prev,
                            [index]: "",
                          }))
                        }
                        className="text-sm text-[#1D1D1D] cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Reply Input */}
                    {replyInput[index] !== undefined && (
                      <div className="mt-3 flex flex-col  gap-2">
                        <div className="flex gap-2">
                          <div className="w-[30px] h-[30px] flex items-center justify-center rounded-lg">
                            <Image
                              src="/assets/replyIcon.png"
                              fill
                              alt="Profile"
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyInput[index]}
                            onChange={(e) =>
                              handleReplyInputChange(index, e.target.value)
                            }
                            className="flex-1 border-b-2 p-1"
                          />
                        </div>
                        <div className="self-end">
                          <button
                            // onClick={() => handleAddReply(index)}
                            className="text-sm ] text-black px-3 py-1 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAddReply(index)}
                            className="text-sm bg-[#00AFF0] text-white px-3 py-1 rounded-md cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className=" space-y-2">
                        {comment.replies.map((reply, i) => (
                          <div key={i} className="ml-6 p-2 flex gap-2  ">
                            <div className="w-[30px] h-[30px] flex items-center justify-center rounded-lg">
                              <Image
                                src="/assets/replyIcon.png"
                                fill
                                alt="Profile"
                              />
                            </div>
                            <div>
                              <p className="text-base font-semibold">Mike</p>

                              <p className="text-sm text-gray-700">{reply}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div>
              <button
                onClick={() => setViewAllComment(true)}
                className="text-sm bg-[#00AFF0] text-white px-5 py-2 rounded-md cursor-pointer"
              >
                View All Comments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
