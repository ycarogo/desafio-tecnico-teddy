export function removeFormatCurrency(value: string): number {
  const cleanedValue = value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", "")
    .trim();
  return parseInt(cleanedValue);
}
