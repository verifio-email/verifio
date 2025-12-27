// Default values for api-key configuration

const defaults = {
  PORT: "8012",
  PG_URL: "postgresql://verifio:verifio123@localhost:5432/verifio",
  BASE_URL: "https://local.verifio.email",
  NODE_ENV: "development",
} as const;

export const apiKeyConfig = {
  port: Number(process.env.PORT || defaults.PORT),
  PG_URL: process.env.PG_URL || defaults.PG_URL,
  BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
  NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
};
