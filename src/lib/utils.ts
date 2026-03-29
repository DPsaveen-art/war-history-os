export function formatYears(startYear: number | null, endYear: number | null) {
  if (!startYear && !endYear) return "Unknown period";
  if (startYear && endYear) return `${startYear} - ${endYear}`;
  if (startYear) return `${startYear} - ?`;
  return `? - ${endYear}`;
}