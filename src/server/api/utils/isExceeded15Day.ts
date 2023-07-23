import dayjs from "dayjs";

export const isRecordExceeded15Days = (createdAt: Date) => {
  const fifteenDaysAgo = dayjs().subtract(15, "day");
  return dayjs(createdAt).isBefore(fifteenDaysAgo);
};
