import { MouseEvent, useState } from "react";
import { CreateCourseModalProps } from "../../../types/course.types";
import { useCreateCourseMutation, useUpdateCourseMutation } from "../../../redux/hooks";
import { useCreateQuizzMutation } from "../../../redux/services/quizzes.services";
const CreateQuizModal: React.FC<CreateCourseModalProps> = ({
  isOpen,
  onClose,
  onNext,
  isEdit,
  courseId
}) => {
  if (!isOpen) return null;
  const [createQuizz, { isLoading, error }] = useCreateQuizzMutation();
  const [loading, setLoading] = useState<Boolean>(false)

  console.log("Is editing", isEdit)
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-backdrop") {
      onClose();
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const quizData = {
      quizzNumber: formData.get("quizzNumber"),
      question: formData.get("question"),
      choice1: formData.get("choice1"),
      choice2: formData.get("choice2"),
      choice3: formData.get("choice3"),
      choice4: formData.get("choice4"),

      // choices: [
      //   formData.get("choice1"),
      //   formData.get("choice2"),
      //   formData.get("choice3"),
      //   formData.get("choice4"),
      // ],
      credit: formData.get("credit"),
      courseId, // Ensure courseId is included
      puzzlepiecesId: "71f3b819-b99e-463a-b0d0-0c39b958f1b6",
      correctChoise: "choice4"
    };

    try {
      const response = await createQuizz(quizData).unwrap();
      console.log("Quiz created successfully:", response);
      onClose(); // Close modal after success
    } catch (err) {
      console.error("Error creating quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdate = async (e: React.FormEvent<HTMLFormElement>, courseId: string) => {
  //   e.preventDefault();
  
  //   const formData = new FormData(e.target as HTMLFormElement);
  //   //const updatedData = Object.fromEntries(formData.entries()); // Convert FormData to object
  
  //   try {
  //     await updateCourse({ courseId, formData }).unwrap();
  //     console.log("Course updated successfully!");
  //   } catch (error) {
  //     console.error("Error updating course:", error);
  //   }
  // };
  

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      {loading && <div className="absolute center z-index-1" role="status">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
      </div>}
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-[50%] xl:w-[38%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-2xl text-[#1D1D1D] font-semibold">
           {isEdit ? 'Edit Course': 'Create Quiz'} 
          </h2>
        </div>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">


          <div className="mt-2">
            <label className=" text-[#1D1D1D] font-medium text-sm">
              Question Number
            </label>
            <input
              type="text"
              name="quizzNumber"
              placeholder="Quiz Number"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
            <label className=" text-[#1D1D1D] font-medium text-sm">
              Question
            </label>
            <input
              type="text"
              name="question"
              placeholder="Quiz question"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <label className="text-[#1D1D1D] font-medium text-sm">Choice 1</label>
            <input
              type="text"
              name="choice1"
              placeholder="Choice 1"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>
          
          <div>
            <label className="text-[#1D1D1D] font-medium text-sm">Choice 2</label>
            <input
              type="text"
              name="choice2"
              placeholder="Choice 2"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>

          <div>
            <label className="text-[#1D1D1D] font-medium text-sm">Choice 3</label>
            <input
              type="text"
              name="choice3"
              placeholder="Choice 3"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>

          <div>
            <label className="text-[#1D1D1D] font-medium text-sm">Choice 4</label>
            <input
              type="text"
              name="choice4"
              placeholder="Choice 4"
              className="mt-1 w-full border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>
        </div>

          <div className="mt-5 flex flex-col justify-center">
            <label className=" text-[#1D1D1D] font-medium text-sm">
              Credit
            </label>
            <input
              name="credit"
              placeholder="Credit score"
              className="mt-1 w-3/12 border border-[#D0D5DD] h-[44px] rounded-[8px] px-[14px] outline-none text-[#1D1D1D] font-normal text-sm"
            />
          </div>

          <div className="mt-2">
            <button
              // onClick={onNext}
              type="submit"
              className="cursor-pointer bg-[#00AFF0] font-medium text-white text-sm rounded-[8px] h-[44px] w-[22%] flex items-center justify-center"
            >
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;
