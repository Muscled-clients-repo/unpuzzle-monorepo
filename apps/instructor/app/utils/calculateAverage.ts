export interface PuzzleAgentStats {
  value: number;
  percentageDiff: number;
  isHigher: boolean;
}

export const calculatePuzzleAgentStats = (
  puzzleAgentCounts: {
    puzzleHint: number;
    puzzleCheck: number;
    puzzleReflect: number;
    puzzlePath: number;
  }
): Record<string, PuzzleAgentStats> => {
  // Get all values
  const values = Object.values(puzzleAgentCounts);
  
  // Calculate average
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  
  // Calculate stats for each puzzle agent
  const stats: Record<string, PuzzleAgentStats> = {};
  
  Object.entries(puzzleAgentCounts).forEach(([key, value]) => {
    let percentageDiff = 0;
    let isHigher = false;
    
    if (average > 0) {
      // Calculate percentage difference from average
      percentageDiff = Math.abs(((value - average) / average) * 100);
      isHigher = value > average;
    } else if (value > 0) {
      // If average is 0 but this value is not, it's higher
      percentageDiff = 100;
      isHigher = true;
    }
    
    stats[key] = {
      value,
      percentageDiff: Math.round(percentageDiff),
      isHigher
    };
  });
  
  return stats;
};