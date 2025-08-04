const timeToSeconds = (time: string): number => {
  const [min, sec] = time.split(":").map(Number);
  return min * 60 + sec;
};

export const calculateComplexity = (logs: any[]): "low" | "medium" | "high" => {
  let pauseCount = 0;
  let seekBackCount = 0;

  for (const log of logs) {
    if (log.action === "pause") {
      const duration = timeToSeconds(log.duration);
      if (duration > 20) pauseCount++;
    }
    if (log.action === "seek") {
      const from = timeToSeconds(log.from);
      const to = timeToSeconds(log.to);
      if (to < from) seekBackCount++;
    }
  }

  const score = pauseCount + seekBackCount;
  if (score >= 4) return "high";
  if (score >= 2) return "medium";
  return "low";
};
