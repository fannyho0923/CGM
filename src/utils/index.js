import dayjs from "dayjs";
import { round, isEmpty } from "lodash-es";

export const getIDietBgColor = (iDiet = 0) => {
  if (iDiet > 10) {
    return "#A7A7A7";
  } else if (iDiet >= 8) {
    return "#FF9781";
  } else if (iDiet >= 4) {
    return "#FFFC98";
  } else {
    return "#AFE489";
  }
};

export const getDietContent = (dayVal, startTime, endTime) => {
  if (
    isEmpty(dayVal) ||
    isEmpty(startTime) ||
    isEmpty(endTime) ||
    startTime > endTime
  ) {
    return "";
  }

  const st =
    dayVal?.findIndex(({ x }) => x === startTime.$H * 60 + startTime.$m) < 0
      ? 0
      : dayVal?.findIndex(({ x }) => x === startTime.$H * 60 + startTime.$m);
  const et =
    dayVal?.findIndex(({ x }) => x === endTime.$H * 60 + endTime.$m) < 0
      ? 0
      : dayVal?.findIndex(({ x }) => x === endTime.$H * 60 + endTime.$m);

  const tmpDietContent = dayVal?.slice(st, et);
  return tmpDietContent
    .map((item) => item.dietContent)
    .filter((item) => !isEmpty(item))
    .join("+");
};

export const getTimeText = (startTime = "", endTime = "") => {
  if (isEmpty(startTime) && isEmpty(endTime)) {
    return "";
  }
  return `(${isEmpty(startTime) ? "" : dayjs(startTime).format("HH:mm")}-${
    isEmpty(endTime) ? "" : dayjs(endTime).format("HH:mm")
  })`;
};

export const getRangeArr = (dayVal, startTime, endTime) => {
  if (
    isEmpty(dayVal) ||
    isEmpty(startTime) ||
    isEmpty(endTime) ||
    startTime > endTime
  ) {
    return;
  }
  return dayVal?.slice(
    dayVal?.findIndex(({ x }) => x === startTime.$H * 60 + startTime.$m),
    dayVal?.findIndex(({ x }) => x === endTime.$H * 60 + endTime.$m)
  );
};
export const getIArr = (rangeArr) => {
  const tmpArr = [];
  for (let i = 0; i < rangeArr?.length; i++) {
    tmpArr.push(round(rangeArr[i].bsv - rangeArr[0].bsv, 1));
  }
  return tmpArr;
};

export const getJArr = (iArr) => {
  const tmpArr = [];
  for (let j = 0; j < iArr?.length; j++) {
    let next = j + 1 >= iArr?.length ? j : j + 1;
    tmpArr.push(round(Math.abs((iArr[j] + iArr[next]) * 0.25) / 2, 2));
  }
  return tmpArr;
};

export const getIDiet = (iArr, jArr) => {
  if (isEmpty(iArr) || isEmpty(jArr)) {
    return 0;
  }
  return round(jArr?.reduce((a, b) => a + b) + Math.max(...iArr), 1);
};

export const getMaxBsv = (rangeArr) => {
  if (isEmpty(rangeArr)) {
    return 0;
  }
  return Math.max(...rangeArr?.map((item) => Object.values(item)[2]));
};

export const getFPG = (dayVal, rangeArr) => {
  if (isEmpty(dayVal) || isEmpty(rangeArr)) {
    return;
  }
  return (
    (dayVal?.map((item) => Object.values(item)[2]).reduce((a, b) => a + b) -
      rangeArr?.map((item) => Object.values(item)[2]).reduce((a, b) => a + b)) /
    (Object.keys(dayVal).length - 5)
  );
};

export const getIval = (firstBsv, dayVal, rangeArr) => {
  return firstBsv > getFPG(dayVal, rangeArr) * 1.1;
};
export const getDval = (lastBsv, firstBsv) => {
  return lastBsv < firstBsv * 1.1;
};
export const getPCval = (maxBsv, firstBsv) => {
  return 18 * (maxBsv - firstBsv) > 60;
};
