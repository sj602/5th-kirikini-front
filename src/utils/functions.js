export const calcTime = () => {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const timestamp = new Date(Date.now() - timezoneOffset).toISOString();
  const month = Number(timestamp.slice(5, 7));
  const day = Number(timestamp.slice(8, 10));

  return [month, day]
}

export const calcWeekOfYear = (selectedWeek) => {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const timestamp = new Date(Date.now() - timezoneOffset).toISOString();
  console.log(timestamp);

  return ""
}