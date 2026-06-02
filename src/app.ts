import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./module/auth/auth.routes";
import eventRoutes from "./module/event/event.routes";
import paymentRoutes from "./module/payment/payment.routes";
import adminRoutes from "./module/admin/admin.routes";
import reviewRoutes from "./module/review/review.routes";
import participationRoutes from "./module/participation/participation.routes";
import invitationRoutes from "./module/invitation/invitation.routes";
import userRoutes from "./module/user/user.routes";
import { config } from "./config";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  }),
);
app.use(morgan(config.nodeEnv === "development" ? "dev" : "combined"));

app.use("/api/v1/payments", paymentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.json({ status: "ok", env: config.nodeEnv }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/participations", participationRoutes);
app.use("/api/v1/invitations", invitationRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/users", userRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

export default app;
