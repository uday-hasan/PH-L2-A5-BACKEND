export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as string,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  },
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  cookieDomain: process.env.COOKIE_DOMAIN || "",
};
