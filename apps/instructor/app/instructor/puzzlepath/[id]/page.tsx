import React from "react";
import Header from "@/app/ssrComponent/Header";
import PuzzlePathClient from "./PuzzlePathClient";

interface PuzzlePathPageProps {
  params: Promise<{ id: string }>;
}

const PuzzlePathDetailPage: React.FC<PuzzlePathPageProps> = async ({ params }) => {
  const { id } = await params;
  
  return (
    <>
      <Header />
      <PuzzlePathClient puzzlePathId={id} />
    </>
  );
};

export default PuzzlePathDetailPage;