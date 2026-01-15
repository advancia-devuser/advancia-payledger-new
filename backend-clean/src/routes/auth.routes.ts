// ============================================================================
// REGISTRATION WITH ADMIN APPROVAL
// Users CANNOT login until admin approves (or 24h auto-approve)
// ============================================================================

import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { sendEmail } from '../services/email.service';
import { generateEmailVerificationToken } from '../utils/tokens';

const router = Router();

/**
 * STEP 1: User Registration
 * POST /api/auth/register
 * 
 * Creates user with PENDING_APPROVAL status
 * User CANNOT login until admin approves
 */
router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role = 'USER',
    } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        error: 'Email, password, first name, and last name are required',
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long',
      });
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
      return res.status(400).json({
        error: 'Password must contain uppercase, number, and special character',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email already registered',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailToken = generateEmailVerificationToken();

    // Create user with PENDING_APPROVAL status
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: role === 'ADMIN' || role === 'SUPER_ADMIN' ? 'USER' : role, // Prevent self-admin
        status: 'PENDING_APPROVAL', // CRITICAL: Cannot login yet
        emailVerificationToken: emailToken,
        emailVerified: false,
        autoApproved: false,
        registeredAt: new Date(),
      },
    });

    // Send pending approval email to user
    await sendEmail({
      to: user.email,
      template: 'registration-pending',
      data: {
        firstName: user.firstName,
        email: user.email,
      },
    });

    // Send notification to admins about new registration
    const admins = await prisma.user.findMany({
      where: {
        role: { in: ['ADMIN', 'SUPER_ADMIN'] },
        status: 'ACTIVE',
      },
      select: { email: true, firstName: true },
    });

    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        template: 'admin-new-registration',
        data: {
          adminName: admin.firstName,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userRole: user.role,
          registeredAt: user.registeredAt,
          approvalUrl: `${process.env.FRONTEND_URL}/admin/approvals`,
        },
      });
    }

    // Log admin action
    // (Admin action logged when admin actually approves)

    res.status(201).json({
      message: 'Registration successful. Your account is pending admin approval.',
      email: user.email,
      status: 'PENDING_APPROVAL',
      estimatedApproval: '24-48 hours',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed. Please try again.',
    });
  }
});

/**
 * STEP 2: Login (With Status Check)
 * POST /api/auth/login
 * 
 * Blocks login if status is not ACTIVE
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // CRITICAL: Check approval status
    if (user.status === 'PENDING_APPROVAL') {
      return res.status(403).json({
        error: 'Account pending admin approval',
        message: 'Your account is awaiting admin approval. You will receive an email when approved.',
        status: 'PENDING_APPROVAL',
        registeredAt: user.registeredAt,
      });
    }

    if (user.status === 'REJECTED') {
      return res.status(403).json({
        error: 'Account rejected',
        message: user.rejectionReason || 'Your registration was not approved.',
        status: 'REJECTED',
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        error: 'Account suspended',
        message: 'Your account has been suspended. Please contact support.',
        status: 'SUSPENDED',
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        error: 'Account not active',
        message: 'Your account cannot be accessed at this time.',
        status: user.status,
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data (WITHOUT password)
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed. Please try again.',
    });
  }
});

export default router;
