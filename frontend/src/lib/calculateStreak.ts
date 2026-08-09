export function calculateStreak(dates: string[]): number {
  const dateSet = new Set(dates);

  let streak = 0;
  const currentDate = new Date();
  let formatted = currentDate.toISOString().split("T")[0];

  while (dateSet.has(formatted)) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
    formatted = currentDate.toISOString().split("T")[0];
  }

  return streak;
}
