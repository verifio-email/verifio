// Default values for logs (tracehub) configuration

const defaults = {
  PORT: "8016",
  NODE_ENV: "development",
  BASE_URL: "https://local.verifio.email",
  CLICKHOUSE_HOST: "http://localhost:8123",
  CLICKHOUSE_USER: "verifio",
  CLICKHOUSE_PASSWORD: "verifio123",
  CLICKHOUSE_DATABASE: "verifio_tracehub",
} as const;

export const logsConfig = {
  port: Number(process.env.PORT || defaults.PORT),
  NODE_ENV: process.env.NODE_ENV || defaults.NODE_ENV,
  BASE_URL: process.env.BASE_URL || defaults.BASE_URL,
  CLICKHOUSE_HOST: process.env.CLICKHOUSE_HOST || defaults.CLICKHOUSE_HOST,
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER || defaults.CLICKHOUSE_USER,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD || defaults.CLICKHOUSE_PASSWORD,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE || defaults.CLICKHOUSE_DATABASE,
};
