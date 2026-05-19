// Fix: Import enums from generated path, not "@prisma/client"
import { Role } from "../../prisma/generated/prisma/client.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export {};
