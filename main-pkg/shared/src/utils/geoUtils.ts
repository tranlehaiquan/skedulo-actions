export const convertMetersToMiles = (
  meters: number,
  fractionDigits: number = 0
): number => {
  if (!meters || isNaN(meters)) {
    return 0;
  }
  const miles = meters * 0.000621371192;
  return +miles.toFixed(fractionDigits);
};
