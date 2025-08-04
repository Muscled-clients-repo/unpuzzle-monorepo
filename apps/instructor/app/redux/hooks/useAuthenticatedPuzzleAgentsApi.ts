import {
  useGetPuzzleHintsByVideoIdQuery as useGetPuzzleHintsByVideoIdQueryBase,
  useGetPuzzleHintByIdQuery as useGetPuzzleHintByIdQueryBase,
  useGetPuzzleChecksByVideoIdQuery as useGetPuzzleChecksByVideoIdQueryBase,
  useGetPuzzleCheckByIdQuery as useGetPuzzleCheckByIdQueryBase,
  useGetPuzzleReflectsByVideoIdQuery as useGetPuzzleReflectsByVideoIdQueryBase,
  useGetPuzzleReflectByIdQuery as useGetPuzzleReflectByIdQueryBase,
  useGetPuzzlePathsByVideoIdQuery as useGetPuzzlePathsByVideoIdQueryBase,
  useGetPuzzlePathByIdQuery as useGetPuzzlePathByIdQueryBase,
  useCreatePuzzleHintMutation as useCreatePuzzleHintMutationBase,
  useCreatePuzzleCheckMutation as useCreatePuzzleCheckMutationBase,
  useCreatePuzzleReflectMutation as useCreatePuzzleReflectMutationBase,
  useCreatePuzzlePathMutation as useCreatePuzzlePathMutationBase,
} from "../services/puzzleAgents.services";

// Helper function to create authenticated query hooks
const createAuthenticatedQueryHook = (useBaseHook: any) => {
  return (
    params: { videoId: string; page?: number; limit?: number },
    options?: any
  ) => {
    // Direct API call without authentication
    const result = useBaseHook(
      params,
      {
        ...options,
        skip: options?.skip,
      }
    );

    return result;
  };
};

// Helper function to create authenticated mutation hooks
const createAuthenticatedMutationHook = (useBaseMutation: any) => {
  return () => {
    const [baseMutation, result] = useBaseMutation();

    const authenticatedMutation = async (payload: any) => {
      // Direct API call without authentication
      return baseMutation({ payload });
    };

    return [authenticatedMutation, result] as const;
  };
};

// Helper function to create authenticated query hook for single item fetch
const createAuthenticatedSingleQueryHook = (useBaseHook: any) => {
  return (
    params: { id: string },
    options?: any
  ) => {
    // Direct API call without authentication
    const result = useBaseHook(
      params,
      {
        ...options,
        skip: options?.skip,
      }
    );

    return result;
  };
};

// Authenticated query hooks
export const useGetPuzzleHintsByVideoIdQuery = createAuthenticatedQueryHook(
  useGetPuzzleHintsByVideoIdQueryBase
);
export const useGetPuzzleHintByIdQuery = createAuthenticatedSingleQueryHook(
  useGetPuzzleHintByIdQueryBase
);
export const useGetPuzzleChecksByVideoIdQuery = createAuthenticatedQueryHook(
  useGetPuzzleChecksByVideoIdQueryBase
);
export const useGetPuzzleCheckByIdQuery = createAuthenticatedSingleQueryHook(
  useGetPuzzleCheckByIdQueryBase
);
export const useGetPuzzleReflectsByVideoIdQuery = createAuthenticatedQueryHook(
  useGetPuzzleReflectsByVideoIdQueryBase
);
export const useGetPuzzleReflectByIdQuery = createAuthenticatedSingleQueryHook(
  useGetPuzzleReflectByIdQueryBase
);
export const useGetPuzzlePathsByVideoIdQuery = createAuthenticatedQueryHook(
  useGetPuzzlePathsByVideoIdQueryBase
);
export const useGetPuzzlePathByIdQuery = createAuthenticatedSingleQueryHook(
  useGetPuzzlePathByIdQueryBase
);

// Authenticated mutation hooks
export const useCreatePuzzleHintMutation = createAuthenticatedMutationHook(
  useCreatePuzzleHintMutationBase
);
export const useCreatePuzzleCheckMutation = createAuthenticatedMutationHook(
  useCreatePuzzleCheckMutationBase
);
export const useCreatePuzzleReflectMutation = createAuthenticatedMutationHook(
  useCreatePuzzleReflectMutationBase
);
export const useCreatePuzzlePathMutation = createAuthenticatedMutationHook(
  useCreatePuzzlePathMutationBase
);
