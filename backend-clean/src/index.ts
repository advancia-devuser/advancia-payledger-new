// ============================================================================
// SENTRY INITIALIZATION (Must be first!)
// ============================================================================
import dotenv from "dotenv";
dotenv.config();

// Initialize Sentry as early as possible
import { initializeSentry, sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } from "./config/sentry";
initializeSentry();

import express from "express";
import { createServer } from "http";
import binCheckerRouter from "./api/bin-checker";
import notificationsRouter from "./api/notifications";
import { validateEnvironment } from "./config/validate-env";
import { corsConfig } from "./middleware/cors-config";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { noAITraining } from "./middleware/no-ai-training";
import { apiLimiter, authLimiter } from "./middleware/rateLimit";
import { healthCheck, isolateErrors } from "./middleware/resilience";
import adminFundsRouter from "./routes/admin-funds";
import aiRouter from "./routes/ai";
import authRouter from "./routes/auth";
import cardsRouter from "./routes/cards";
import complianceRouter from "./routes/compliance";
import convertRouter from "./routes/convert";
import cryptoRouter from "./routes/crypto";
import dashboardRouter from "./routes/dashboard";
import healthRouter from "./routes/health";
import kpiRouter from "./routes/kpi";
import paymentsRouter from "./routes/payments";
import alchemyPayRouter from "./routes/payments/alchemy-pay.routes";
import stripeCardsRouter from "./routes/payments/stripe-cards.routes";
import transactionsRouter from "./routes/transactions";
import facilitiesRouter from "./routes/facilities";
import { initializeSocketService } from "./services/socketService";
import { RealTimeMonitoringService } from "./services/realTimeMonitoring";
import { activityLogger } from "./middleware/activityLogger";
import { cronService } from "./services/cron.service";
import adminActivityRoutes from "./routes/admin/activity";
import adminAnalyticsRoutes from "./routes/admin/analytics";
import userPreferencesRoutes from "./routes/user/preferences";
import advancedPaymentRoutes from "./routes/payments/advanced";
import monitoringRoutes from "./routes/monitoring/alerts";
import currencyRoutes from "./routes/currency/exchange";
import blockchainRoutes from "./routes/blockchain/contracts";
import emailRouter from "./routes/email";

// Validate environment variables on startup
validateEnvironment();

const app = express();
const httpServer = createServer(app);

// Start health monitoring
setInterval(async () => {
  await healthCheck.checkAll();
}, 60000); // Check every minute

// ============================================================================
// SENTRY MIDDLEWARE (Applied early for request tracking)
// ============================================================================

// Sentry request handler must be the first middleware
app.use(sentryRequestHandler());

// Sentry tracing middleware
app.use(sentryTracingHandler());

// ============================================================================
// SECURITY MIDDLEWARE (Applied first for maximum protection)
// ============================================================================

// AI training protection headers
app.use(noAITraining);

// CORS configuration with whitelist
app.use(corsConfig);

// Parse JSON bodies
app.use(express.json());

// Error isolation middleware
app.use(isolateErrors);

// ============================================================================
// RATE LIMITING
// ============================================================================

// Apply rate limiting to all API routes
app.use("/api/", apiLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ============================================================================
// PUBLIC ROUTES
// ============================================================================

// Root welcome endpoint
app.get("/", (req: any, res: any) => {
  res.json({
    status: "ok",
    message: "Advancia Platform Running!",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      wallet: "/api/wallet",
      appointments: "/api/appointments",
      auth: "/api/auth",
      payments: "/api/payments",
      crypto: "/api/crypto",
      transactions: "/api/transactions",
      dashboard: "/api/dashboard",
      kpi: "/api/kpi",
      ai: "/api/ai",
      cards: "/api/cards",
      convert: "/api/convert",
      compliance: "/api/compliance",
    },
  });
});

// Health check - both paths for Railway compatibility
app.get("/health", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req: any, res: any) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================================================
// API ROUTES
// ============================================================================

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/payments/stripe-cards", stripeCardsRouter);
app.use("/api/payments/alchemy", alchemyPayRouter);
app.use("/api/crypto", cryptoRouter);
app.use("/api/kpi", kpiRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/bin-checker", binCheckerRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/convert", convertRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/health", healthRouter);
app.use("/api/compliance", complianceRouter);

// Internal admin routes (not documented publicly)
app.use("/api/internal/admin-funds", adminFundsRouter);

// Admin activity logging routes
app.use("/api/admin", adminActivityRoutes);

// Admin analytics routes
app.use("/api/admin", adminAnalyticsRoutes);

// User preferences routes
app.use("/api/user/preferences", userPreferencesRoutes);

// Advanced payment processing routes
app.use("/api/payments/advanced", advancedPaymentRoutes);

// Real-time monitoring routes
app.use("/api/monitoring", monitoringRoutes);

// Multi-currency exchange routes
app.use("/api/currency", currencyRoutes);

// Blockchain integration routes
app.use("/api/blockchain", blockchainRoutes);

// Email service routes
app.use("/api/email", emailRouter);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler for undefined routes
app.use(notFoundHandler);

// Sentry error handler (must be before custom error handler)
app.use(sentryErrorHandler());

// Centralized error handling middleware
app.use(errorHandler);

// ============================================================================
// SERVER STARTUP
// ============================================================================

const PORT = process.env.PORT || 3001;

// Initialize Socket.IO with authentication
const socketService = initializeSocketService(httpServer);

// Initialize Real-Time Monitoring Service
import { initializeRealTimeMonitoring } from "./services/realTimeMonitoring";
const monitoringService = initializeRealTimeMonitoring(httpServer);

// Make monitoring service globally available
(global as any).realTimeMonitoring = monitoringService;

if (process.env.NODE_ENV !== "test") {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Backend API listening on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth/*`);
    console.log(`📈 KPI routes: http://localhost:${PORT}/api/kpi/*`);
    console.log(
      `💰 Transaction routes: http://localhost:${PORT}/api/transactions/*`
    );
    console.log(`🔌 Socket.IO enabled with JWT authentication`);
    console.log(`🛡️  Security headers enabled (CORS, AI Protection)`);
    
    // Start cron services
    cronService.start();
    console.log(`⏰ Cron services initialized`);
  });
}

// Export app and socket service for use in other modules
export { app, httpServer, socketService };
