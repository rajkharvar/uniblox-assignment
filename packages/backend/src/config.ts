export const config = {
  NTH_ORDER: Number(process.env.NTH_ORDER) || 5,
  DISCOUNT_PERCENT: Number(process.env.DISCOUNT_PERCENT) || 10,
  PORT: Number(process.env.PORT) || 3001,
  WINDOW_IN_SECONDS: 10,
  MAX_REQUESTS: 3
} as const;
