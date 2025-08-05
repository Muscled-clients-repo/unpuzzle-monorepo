import React from "react";
import Header from "@/app/ssrComponent/Header";
import PuzzleCheckWrapper from "./PuzzleCheckWrapper";

interface PuzzleCheckPageProps {
  params: Promise<{ id: string }>;
}

const PuzzleCheckDetailPage: React.FC<PuzzleCheckPageProps> = async ({ params }) => {
  const { id } = await params;
  
  return (
    <>
      <Header />
      <PuzzleCheckWrapper puzzleCheckId={id} />
    </>
  );
};

export default PuzzleCheckDetailPage;