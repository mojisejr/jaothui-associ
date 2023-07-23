import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import th from "dayjs/locale/th";

export const getDaysPassed = (startedInput: Date) => {
  dayjs.extend(relativeTime);
  dayjs.locale(th);
  const started = dayjs(startedInput);
  return started.fromNow();
};
