import dayjs from "dayjs";
export function checkAdminPeriod(data: [bigint, bigint, boolean]) {
  const now = dayjs();
  const peroid = dayjs(+data[1].toString() * 1000);
  const diff = now.isBefore(peroid);
  return diff;
}
