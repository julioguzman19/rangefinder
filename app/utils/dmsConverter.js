// Function to convert DMS (Degrees, Minutes, Seconds) to Decimal Degrees
export const convertDMSToDD = (dms) => {
  if (!dms) return null; // Return null if no value provided

  const regex = /(\d+)°(\d+)'([\d.]+)"([NSEW])/;
  let match = dms.match(regex);

  if (!match) {
    console.error("Invalid DMS format:", dms);
    return null;
  }

  let degrees = parseFloat(match[1]);
  let minutes = parseFloat(match[2]);
  let seconds = parseFloat(match[3]);
  let direction = match[4];

  let decimal = degrees + minutes / 60 + seconds / 3600;

  // Handle South/West as negative
  if (direction === "S" || direction === "W") {
    decimal = -decimal;
  }

  return decimal.toFixed(6); // Keep 6 decimal places for accuracy
};
