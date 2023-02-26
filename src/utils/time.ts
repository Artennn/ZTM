export const Days = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"];

// hh:mm => minutes
const toMinutes = (value: string): number | false => {
  const hh = parseInt(value.slice(0, 2));
  const mm = parseInt(value.slice(3, 5));
  const result = hh * 60 + mm;
  if (typeof result !== "number") return false;
  return result;
};

// minutes => hh:mm
const toDisplay = (value: number): string => {
  const hh = Math.floor(value / 60)
    .toString()
    .padStart(2, "0");
  const mm = (value % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const Time = {
  toMinutes,
  toDisplay,
};

export default Time;
