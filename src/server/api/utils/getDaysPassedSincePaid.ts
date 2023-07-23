import dayjs from "dayjs";

export const getDaysPassedSincePaid = (start: Date) => {
  const now = dayjs();
  const paidDate = dayjs(start);
  const passed = now.diff(paidDate, "day");
  return passed;
};
