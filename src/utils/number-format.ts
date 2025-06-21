export function numberFormat(
  number: number,
  decimals: number = 0,
  decimalSeparator: string = ".",
  thousandsSeparator: string = ","
): string {
  // Handle special cases
  if (isNaN(number) || !isFinite(number)) {
    return "0";
  }

  // Round the number to the specified decimal places
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(number * factor) / factor;

  // Split into integer and decimal parts
  const parts = rounded.toFixed(decimals).split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // Add thousands separators to integer part
  const formattedInteger = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandsSeparator
  );

  // Combine parts
  if (decimals > 0) {
    return formattedInteger + decimalSeparator + decimalPart;
  } else {
    return formattedInteger;
  }
}

export function formatPrice(value: number) {
  return numberFormat(value, 0, "", "g ") + "s";
}
