import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";

export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export function requireRole(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        error: "Insufficient permissions",
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  requireRole("ADMIN", "SUPERADMIN")(req, res, next);
}

export function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  requireRole("SUPERADMIN")(req, res, next);
}
