import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3002"),
});

export type AppEnv = z.infer<typeof envSchema>;

function parseEnv(): AppEnv {
  const raw = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002",
  };

  if (process.env.SKIP_ENV_VALIDATION === "true") {
    return {
      NODE_ENV:
        raw.NODE_ENV === "production" || raw.NODE_ENV === "test"
          ? raw.NODE_ENV
          : "development",
      NEXT_PUBLIC_APP_URL: raw.NEXT_PUBLIC_APP_URL,
    };
  }

  const parsed = envSchema.safeParse(raw);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment variables: ${details}`);
  }

  return parsed.data;
}

export const env: AppEnv = parseEnv();
