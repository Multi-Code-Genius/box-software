export function useGetWeekDayNum(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  let count = 0;

  for (
    let d = firstDayOfMonth;
    d < lastDayOfMonth;
    d.setDate(d.getDate() + 7)
  ) {
    if (date >= d) {
      count++;
    } else {
      break;
    }
  }

  return Math.max(1, count);
}
