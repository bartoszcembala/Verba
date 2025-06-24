export function calculateStreak(dates: string[]): number {
  const dateSet = new Set(dates);

  let streak = 0;
  let currentDate = new Date();

  while (true) {
    const formatted = currentDate.toISOString().split("T")[0];
    if (dateSet.has(formatted)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
