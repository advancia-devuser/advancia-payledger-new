export function validateEnvironment() {
  const required = [
    "DATABASE_URL",
    "JWT_SECRET",
    "FRONTEND_URL",
    "BACKEND_URL",
  ];

  // Critical production checks
  if (process.env.NODE_ENV === "production") {
    required.push("POSTMARK_API_KEY", "STRIPE_SECRET_KEY", "ETH_PROVIDER_URL");

    // Security validation
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length < 32) {
      console.error(
        "❌ JWT_SECRET must be at least 32 characters in production"
      );
      process.exit(1);
    }

    if (jwtSecret && jwtSecret.includes("your-super-secure")) {
      console.error(
        "❌ JWT_SECRET must be changed from default value in production"
      );
      process.exit(1);
    }
  }

  const missing = required.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing);
    process.exit(1);
  }

  console.log("✅ Environment validation passed");
}
