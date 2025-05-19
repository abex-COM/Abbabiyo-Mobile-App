function isGregorianLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export default function gregorianToEthiopian(gYear, gMonth, gDay) {
  const gDate = new Date(gYear, gMonth - 1, gDay); // JS months are 0-based

  // Determine Ethiopian New Year in Gregorian Calendar
  let newYear = new Date(gYear, 8, 11); // Default: Sep 11
  if (isGregorianLeapYear(gYear + 1)) {
    newYear = new Date(gYear, 8, 12); // Sep 12 in GC leap year
  }

  let ethYear;
  if (gDate >= newYear) {
    ethYear = gYear - 7;
  } else {
    ethYear = gYear - 8;
    // Update newYear to be the Ethiopian New Year of the previous year
    if (isGregorianLeapYear(gYear)) {
      newYear = new Date(gYear - 1, 8, 12);
    } else {
      newYear = new Date(gYear - 1, 8, 11);
    }
  }

  // Calculate days since Ethiopian New Year
  const diffInMs = gDate - newYear;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const ethMonth = Math.floor(diffInDays / 30) + 1;
  const ethDay = (diffInDays % 30) + 1;

  return {
    ethYear,
    ethMonth,
    ethDay,
  };
}
