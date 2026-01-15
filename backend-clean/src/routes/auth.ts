import { Request, Response, Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { signRefreshToken, signToken, verifyToken } from "../utils/jwt";
import {
  comparePassword,
  hashPassword,
  validatePassword,
} from "../utils/password";
import { emailService } from "../services/emailService";
import { adminNotificationService } from "../services/adminNotification.service";
import crypto from "crypto";

const router = Router();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Email, password, first name, and last name are required" });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: "Invalid email format" });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: "Password does not meet requirements",
        details: passwordValidation.errors,
      });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: "User already exists with this email" });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    // Create user with PENDING_APPROVAL status
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: "USER",
        status: "PENDING_APPROVAL",
        emailVerified: false,
        emailVerificationToken,
      },
    });

    // Send welcome email with verification link
    try {
      await emailService.sendWelcomeEmail(
        user.email,
        user.firstName,
        emailVerificationToken
      );
      console.log(`[REGISTRATION] Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error("[REGISTRATION] Failed to send welcome email:", emailError);
      // Don't fail registration if email fails
    }

    // Notify admins about new registration
    try {
      await adminNotificationService.notifyNewRegistration(user.id);
      console.log(`[REGISTRATION] Admin notification sent for ${user.email}`);
    } catch (notifyError) {
      console.error("[REGISTRATION] Failed to notify admins:", notifyError);
      // Don't fail registration if notification fails
    }

    // Return user without password
    const { password: _, emailVerificationToken: __, ...userWithoutPassword } = user;
    res.status(201).json({
      message: "Registration successful! Please check your email for verification instructions.",
      user: userWithoutPassword,
      requiresApproval: true,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check if user is active and verified
    if (!user.isActive) {
      res.status(403).json({ error: "Account not active" });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ error: "Email not verified" });
      return;
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = signToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return tokens and user
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Login successful",
      token: accessToken,
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Refresh token
router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    // Verify refresh token
    const payload = verifyToken(refreshToken);

    // Generate new access token
    const newAccessToken = signToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    res.json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

// Logout (client-side token removal, but we can log it)
router.post(
  "/logout",
  authenticate,
  async (req: AuthRequest, res: Response) => {
    try {
      // In a production app, you might want to blacklist the token
      // For now, we'll just return success
      res.json({ message: "Logout successful" });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to logout" });
    }
  }
);

// Get current user
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error: any) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Failed to get user" });
  }
});

// Reset password request
router.post("/reset-password-request", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists
    res.json({ message: "If the email exists, a reset link will be sent" });

    // TODO: In production, send email with reset token
  } catch (error: any) {
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Reset password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ error: "Token and new password are required" });
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: "Password does not meet requirements",
        details: passwordValidation.errors,
      });
      return;
    }

    // Verify reset token
    const payload = verifyToken(token);

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await prisma.user.update({
      where: { id: payload.userId },
      data: {
        password: hashedPassword,
      },
    });

    res.json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ error: "Invalid or expired reset token" });
  }
});

// Verify email
router.get("/verify-email/:token", async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ error: "Verification token is required" });
      return;
    }

    // Find user with this verification token
    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      res.status(404).json({ error: "Invalid or expired verification token" });
      return;
    }

    // Check if already verified
    if (user.emailVerified) {
      res.json({ 
        message: "Email already verified",
        alreadyVerified: true 
      });
      return;
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    res.json({ 
      message: "Email verified successfully!",
      success: true 
    });
  } catch (error: any) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

// Resend verification email
router.post("/resend-verification", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists
      res.json({ message: "If the email exists, a verification link will be sent" });
      return;
    }

    if (user.emailVerified) {
      res.status(400).json({ error: "Email is already verified" });
      return;
    }

    // Generate new verification token
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken },
    });

    // Send verification email
    try {
      await emailService.sendWelcomeEmail(user.email, user.firstName, emailVerificationToken);
      console.log(`[VERIFICATION] Resent verification email to ${user.email}`);
    } catch (emailError) {
      console.error("[VERIFICATION] Failed to send email:", emailError);
    }

    res.json({ message: "Verification email sent successfully" });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Failed to resend verification email" });
  }
});

export default router;
