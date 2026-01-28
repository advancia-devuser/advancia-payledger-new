import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  name: z.string().optional(),
});

// Card validation schemas
export const createCardSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardType: z.enum(['virtual', 'physical']).default('virtual'),
});

export const updateCardBalanceSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['add', 'subtract']),
});

// Transaction validation schemas
export const createTransactionSchema = z.object({
  cardId: z.string().optional(),
  type: z.enum(['debit', 'credit', 'conversion', 'fee']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  description: z.string().optional(),
  merchantName: z.string().optional(),
  fromCurrency: z.string().optional(),
  toCurrency: z.string().optional(),
  exchangeRate: z.number().optional(),
  fee: z.number().optional(),
});

// Conversion validation schemas
export const convertSchema = z.object({
  fromCurrency: z.string().min(1, 'From currency is required'),
  toCurrency: z.string().min(1, 'To currency is required'),
  amount: z.number().positive('Amount must be positive'),
});

// Wallet validation schemas
export const createWalletSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  network: z.string().optional(),
});

// KYC validation schemas
export const uploadKYCSchema = z.object({
  documentType: z.enum(['passport', 'drivers_license', 'national_id', 'proof_of_address']),
  documentNumber: z.string().optional(),
  frontImageUrl: z.string().url().optional(),
  backImageUrl: z.string().url().optional(),
  selfieUrl: z.string().url().optional(),
});

// Environment validation schema
export const envSchema = z.object({
  DATABASE_URL: z.string().url('Invalid database URL'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('*'),
});

// Validate environment variables on startup
export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Generic validation middleware
export function validate<T>(schema: z.ZodSchema<T>) {
  return (req: any, res: any, next: any) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      next(error);
    }
  };
}
