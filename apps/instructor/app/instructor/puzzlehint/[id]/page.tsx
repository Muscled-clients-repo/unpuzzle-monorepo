import React from "react";
import Header from "@/app/ssrComponent/Header";
import PuzzleHintClient from "./PuzzleHintClient";

interface PuzzleHintPageProps {
  params: Promise<{ id: string }>;
}

const PuzzleHintDetailPage: React.FC<PuzzleHintPageProps> = async ({ params }) => {
  const { id } = await params;
  
  return (
    <>
      <Header />
      <PuzzleHintClient puzzleHintId={id} />
    </>
  );
};

export default PuzzleHintDetailPage;