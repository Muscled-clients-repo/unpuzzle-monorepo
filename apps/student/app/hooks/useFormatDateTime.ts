import { format, isThisWeek, isToday, isYesterday } from "date-fns";

export function formatDateTime(dateString: string) {
    const date = new Date(dateString);
  
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }
  
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
  
    if (isThisWeek(date)) {
      return `${format(date, "EEEE 'at' h:mm a")}`; // Example: "Sunday at 10:00 a.m."
    }
  
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  }