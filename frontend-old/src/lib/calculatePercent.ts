export function calculatePercent(val1: number, val2: number): number {
  const percent = Math.round((val1 / val2) * 100);

  if (isNaN(percent)) {
    return 0;
  }

  return percent;
}

export function calculatePercentContext(val1: number, val2: number): number {
  const percent = Math.round((val1 / (val1 + val2)) * 100);

  if (isNaN(percent)) {
    return 0;
  }

  return percent;
}
