import jwt from "jsonwebtoken";
import { config } from "../config";

export interface JwtPayload {
  id: string;
  role: string;
}

export const signToken = (payload: JwtPayload): string =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });

export const verifyToken = (token: string): JwtPayload =>
  jwt.verify(token, config.jwt.secret) as JwtPayload;

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  domain: process.env.NODE_ENV === "production" ? config.cookieDomain : null,
};
