import { z } from "zod";
import { resolve } from "node:path";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().max(65535).default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://127.0.0.1:3000"),
  JWT_SECRET: z.string().min(32).default("yasta-development-secret-change-before-production"),
  JWT_EXPIRES_IN: z.string().default("12h"),
  STORAGE_DRIVER: z.enum(["memory", "json"]).default("json"),
  DATA_FILE_PATH: z.string().default("./data/store.json")
});

export function loadConfig(source = process.env) {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(`Configuración inválida: ${z.prettifyError(result.error)}`);
  }
  if (result.data.NODE_ENV === "production" && result.data.JWT_SECRET.startsWith("yasta-development")) {
    throw new Error("JWT_SECRET debe configurarse antes de iniciar en producción.");
  }
  return {
    nodeEnv: result.data.NODE_ENV,
    port: result.data.PORT,
    frontendOrigin: result.data.FRONTEND_ORIGIN,
    jwtSecret: result.data.JWT_SECRET,
    jwtExpiresIn: result.data.JWT_EXPIRES_IN,
    storageDriver: result.data.STORAGE_DRIVER,
    dataFilePath: resolve(result.data.DATA_FILE_PATH)
  };
}
