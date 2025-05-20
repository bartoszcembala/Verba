export const getPreviousDates = (daysCount) => {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]); // Format: "YYYY-MM-DD"
  }

  return dates.reverse();
};
