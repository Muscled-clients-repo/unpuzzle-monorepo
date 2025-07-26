"use client";
import { ReactNode, createContext, useContext, useState } from "react";

type ViewAllCommentContextType = {
  viewAllComment: boolean;
  setViewAllComment: (isViewAll: boolean) => void;
};

const ViewAllCommentContext = createContext<
  ViewAllCommentContextType | undefined
>(undefined);

type ViewAllCommentProps = {
  children: ReactNode;
};

export const ViewAllCommentProvider: React.FC<ViewAllCommentProps> = ({
  children,
}) => {
  const [viewAllComment, setViewAllComment] = useState(false);

  return (
    <ViewAllCommentContext.Provider
      value={{ viewAllComment, setViewAllComment }}
    >
      {children}
    </ViewAllCommentContext.Provider>
  );
};

// Custom hook to use the context
export const useViewAllComments = (): ViewAllCommentContextType => {
  const context = useContext(ViewAllCommentContext);
  if (!context) {
    throw new Error(
      "useViewAllComments must be used within a ViewAllCommentProvider"
    );
  }
  return context;
};
