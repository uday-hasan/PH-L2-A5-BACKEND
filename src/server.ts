import "dotenv/config";
import app from "./app.js";
import { config } from "./config/index.js";
import { prisma } from "./lib/prisma.js";

async function bootstrap() {
  await prisma.$connect();
  console.log("✅ Database connected");

  app.listen(config.port, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(`   Environment: ${config.nodeEnv}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
