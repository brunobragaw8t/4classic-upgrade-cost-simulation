export const ITEM_LEVELS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
] as const;

export type ITEM_LEVEL = (typeof ITEM_LEVELS)[number];

export const RATES: Record<ITEM_LEVEL, number> = {
  11: 0.6,
  12: 0.2,
  13: 0.35,
  14: 0.13,
  15: 0.12,
  16: 0.05,
  17: 0.07,
  18: 0.035,
  19: 0.01,
  20: 0.005,
  21: 0.008,
  22: 0.005,
  23: 0.02,
} as const;
