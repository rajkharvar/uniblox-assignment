export const config = {
  NTH_ORDER: Number(process.env.NTH_ORDER) || 5,
  DISCOUNT_PERCENT: Number(process.env.DISCOUNT_PERCENT) || 10,
  PORT: Number(process.env.PORT) || 3001,
} as const;
