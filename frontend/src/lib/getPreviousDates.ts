export const getPreviousDates = (daysCount: number): string[] => {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // "YYYY-MM-DD"
  }

  return dates.reverse();
};
