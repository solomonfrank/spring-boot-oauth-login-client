export type WeekdayFormat = "long" | "short";

export const getWeekDayName = () => {
  return Array(7)
    .fill(null)
    .map((_, index) => nameOfDay("en", index, "short"));
};

const nameOfDay = (locale: string, day: number, format: WeekdayFormat) => {
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(
    new Date(1970, 0, day + 4)
  );
};
