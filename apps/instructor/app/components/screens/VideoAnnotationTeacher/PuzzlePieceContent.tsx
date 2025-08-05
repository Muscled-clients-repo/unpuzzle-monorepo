// -------------------- React / Next Core --------------------
import { useDispatch, useSelector } from "react-redux";

// -------------------- Relative Files --------------------
import { setActiveIndex } from "../../../redux/features/annotationSlice";

// -------------------- Assets --------------------
// import PuzzleIcon from "../../assets/puzzleBlack.svg";
// import NotePad from "../../assets/notepad.svg";

// -------------------- Tyoes/Interface --------------------
interface PuzzlePieceContentProps {
  piece: any; // Replace `PieceType` with your actual type
  index: number;
  handlePreview: (piece: any) => void; // Specify function signature
}

const PuzzlePieceContent = ({
  piece,
  index,
  handlePreview,
}: PuzzlePieceContentProps) => {
  const dispatch = useDispatch();

  const { activeIndex } = useSelector((state: any) => state.teacherAnnotations);

  return (
    <div
      key={index}
      onClick={() => {
        dispatch(setActiveIndex(index));
      }}
      onDoubleClick={() => handlePreview(piece)}
      className={`min-h-[84px] p-3 rounded-[4px] flex items-start gap-2  mx-2 cursor-pointer ${
        activeIndex === index
          ? "bg-[#e8e2e2] dark:bg-[#1D1D1D]"
          : "bg-transparent"
      }`}
    >
      <img
        src="../../assets/puzzleBlack.svg"
        alt="puzzleIcon"
        className="w-4 h-4"
      />
      <div className="space-y-1 w-[80%]">
        <h1 className="text-[#1D1D1D] dark:text-white font-medium text-[15px]">
          {piece?.title}
        </h1>
        <div className="text-[#1D1D1D] dark:text-white flex gap-[5px]">
          <p className="font-normal text-sm">at</p>
          <span className="font-bold text-sm">{piece?.startAt}</span>
          <img src="../../assets/notepad.svg" alt="notepad" />
          <p className="font-normal text-sm">{piece?.puzzleType}</p>
        </div>
      </div>
    </div>
  );
};

export default PuzzlePieceContent;
