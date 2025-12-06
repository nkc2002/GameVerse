import rateLimit from "express-rate-limit";

const isDev = (process.env.NODE_ENV || "development") !== "production";

// General API rate limiter (non-auth)
// In development we set a very high ceiling to avoid accidental 429s while testing.
const generalMax = Number(process.env.RATE_LIMIT_MAX || (isDev ? 10000 : 100));

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: generalMax,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication endpoints rate limiter.
// Made configurable and more lenient for development to avoid blocking QA/demo.
const authWindowMinutes = Number(
  process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES || (isDev ? 1 : 5)
); // default 1 minute in dev, 5 in prod if not set
const authMaxAttempts = Number(
  process.env.AUTH_RATE_LIMIT_MAX || (isDev ? 500 : 50)
); // default 500 in dev, 50 in prod if not set

export const authRateLimiter = rateLimit({
  windowMs: authWindowMinutes * 60 * 1000,
  max: authMaxAttempts,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
