import pino, { type Logger } from "pino";

export const logger: Logger = pino({
  name: "ui-component-kit",
  level:
    process.env.LOG_LEVEL ??
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
  redact: {
    paths: [
      "password",
      "token",
      "secret",
      "apiKey",
      "authorization",
      "cookie",
      "*.password",
      "*.token",
      "*.secret",
      "*.apiKey",
      "headers.authorization",
      "headers.cookie",
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});

export function createRequestLogger(
  requestId: string,
  bindings?: Record<string, unknown>,
): Logger {
  return logger.child({ requestId, ...bindings });
}
