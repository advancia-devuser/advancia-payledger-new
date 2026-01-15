import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AuthRequest } from "./auth";

export const activityLogger = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Capture request start time
  const startTime = Date.now();

  // Store original res.end to capture when response finishes
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: any) {
    res.end = originalEnd;
    return res.end(chunk, encoding, cb);
  };

  // Log activity after response is sent
  res.on("finish", () => {
    logActivity(req, res, Date.now() - startTime);
  });

  next();
};

async function logActivity(
  req: AuthRequest,
  res: Response,
  responseTime: number
) {
  try {
    // Only log if user is authenticated and database is available
    if (req.user && prisma) {
      console.log(
        "🔍 Logging activity for user:",
        req.user.userId,
        "Action:",
        `${req.method} ${req.path}`
      );

      const userId = req.user.userId;
      if (!userId) {
        console.log("⚠️ No user ID found in token");
        return;
      }

      await prisma.userActivityLog.create({
        data: {
          userId,
          action: `${req.method} ${req.path}`,
          endpoint: req.path,
          method: req.method,
          responseTime: responseTime,
          ipAddress: getClientIP(req),
          userAgent: req.get("user-agent"),
          success: res.statusCode < 400,
        },
      });

      console.log("✅ Activity logged successfully");
    } else {
      console.log("⚠️ No user or database available for logging");
    }
  } catch (error) {
    // Don't let logging errors break the application
    console.error("Failed to log user activity:", error);
  }
}

// Helper function to get client IP
function getClientIP(req: AuthRequest): string {
  return (
    req.ip ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection as any)?.socket?.remoteAddress ||
    "unknown"
  );
}
