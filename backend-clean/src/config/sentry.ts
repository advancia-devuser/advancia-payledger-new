import * as Sentry from "@sentry/node";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Must be called as early as possible in the application lifecycle
 */
export function initializeSentry() {
  const sentryDsn = process.env.SENTRY_DSN;
  const environment = process.env.NODE_ENV || "development";
  const release = process.env.SENTRY_RELEASE || `advancia-backend@${process.env.npm_package_version || "2.0.0"}`;

  // Don't initialize Sentry in test environment or if DSN is not provided
  if (environment === "test" || !sentryDsn) {
    console.log("ℹ️  Sentry: Disabled (test environment or DSN not provided)");
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment,
    release,

    // Performance Monitoring
    tracesSampleRate: environment === "production" ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Integrations
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
    ],

    // Ignore common errors that don't need tracking
    ignoreErrors: [
      "ECONNRESET",
      "ECONNREFUSED",
      "ETIMEDOUT",
      "NetworkError",
      "AbortError",
    ],

    // Filter sensitive data
    beforeSend(event) {
      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
        delete event.request.headers["x-api-key"];
      }

      // Remove sensitive query params
      if (event.request?.query_string) {
        event.request.query_string = event.request.query_string
          .replace(/password=[^&]*/gi, "password=[FILTERED]")
          .replace(/token=[^&]*/gi, "token=[FILTERED]")
          .replace(/api_key=[^&]*/gi, "api_key=[FILTERED]");
      }

      // Filter sensitive data from extra context
      if (event.extra) {
        Object.keys(event.extra).forEach((key) => {
          if (
            key.toLowerCase().includes("password") ||
            key.toLowerCase().includes("token") ||
            key.toLowerCase().includes("secret") ||
            key.toLowerCase().includes("key")
          ) {
            event.extra![key] = "[FILTERED]";
          }
        });
      }

      return event;
    },
  });

  // Add custom tags
  Sentry.setTags({
    service: "advancia-payledger-backend",
    platform: "node",
  });

  console.log(`✅ Sentry initialized (${environment})`);
  console.log(`📊 Release: ${release}`);
}

/**
 * Capture an exception with additional context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setExtra(key, context[key]);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with severity level
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "log" | "info" | "debug" = "info",
  context?: Record<string, any>
) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach((key) => {
        scope.setExtra(key, context[key]);
      });
      Sentry.captureMessage(message, level as any);
    });
  } else {
    Sentry.captureMessage(message, level as any);
  }
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
}) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string = "custom",
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level: "info" as any,
    data,
  });
}

/**
 * Express middleware to attach request context to Sentry
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler({
    user: ["id", "email", "username"],
    ip: true,
    request: ["method", "url", "headers", "query_string"],
  });
}

/**
 * Express middleware to track request tracing
 */
export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Express error handler middleware for Sentry
 * Should be placed before your custom error handler
 */
export function sentryErrorHandler(): any {
  return Sentry.Handlers.errorHandler({
    shouldHandleError(error: any) {
      // Capture all errors except 4xx client errors
      const statusCode = error.statusCode || 500;
      return statusCode >= 500;
    },
  });
}

/**
 * Flush Sentry events before shutting down
 */
export async function closeSentry() {
  try {
    await Sentry.close(2000); // Wait max 2 seconds
    console.log("✅ Sentry closed gracefully");
  } catch (error) {
    console.error("❌ Error closing Sentry:", error);
  }
}

// Export Sentry instance for advanced usage
export { Sentry };
