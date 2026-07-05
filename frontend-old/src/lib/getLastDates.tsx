type DataPoint = {
  date: string; // format: "DD-MM"
  value: number;
};

export function getLastDates(data: DataPoint[]): DataPoint[] {
  const today = new Date();
  const result: DataPoint[] = [];

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}-${month}`;
  };

  for (let i = 9; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    const found = data.find((item) => item.date === dateStr);
    result.push(found ? found : { date: dateStr, value: 0 });
  }

  return result;
}