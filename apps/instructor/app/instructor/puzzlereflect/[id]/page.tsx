import React from "react";
import Header from "@/app/ssrComponent/Header";
import PuzzleReflectClient from "./PuzzleReflectClient";

interface PuzzleReflectPageProps {
  params: Promise<{ id: string }>;
}

const PuzzleReflectDetailPage: React.FC<PuzzleReflectPageProps> = async ({ params }) => {
  const { id } = await params;
  
  return (
    <>
      <Header />
      <PuzzleReflectClient puzzleReflectId={id} />
    </>
  );
};

export default PuzzleReflectDetailPage;
