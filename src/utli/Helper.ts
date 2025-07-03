export const formatWithCommas = (value: string): string => {
  const cleaned = value.replace(/,/g, "");
  if (!cleaned) return "";
  const number = parseFloat(cleaned);
  if (isNaN(number)) return "";
  return number.toLocaleString("en-US");
};