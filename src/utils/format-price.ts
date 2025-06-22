export function formatPrice(value: number) {
  if (isNaN(value) || !isFinite(value) || value <= 0) {
    return "0b";
  }

  const string = value.toFixed(3);
  const stringParts = string.split(".");

  const bronze = stringParts[1] || "000";

  const silver = stringParts[0].slice(-3) || "000";

  const gold = stringParts[0].slice(0, -3) || "0";

  if (gold === "0" && silver === "000" && bronze === "000") {
    return "0b";
  }

  if (gold === "0" && (silver === "000" || silver === "0")) {
    return `${bronze}b`;
  }

  if (gold === "0") {
    return `${silver}s ${bronze}b`;
  }

  return `${gold}g ${silver}s ${bronze}b`;
}
