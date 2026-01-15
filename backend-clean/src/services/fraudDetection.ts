import { Request } from "express";
import { prisma } from "../lib/prisma";

// Fraud detection service
export class FraudDetectionService {
  private suspiciousIPs: Set<string> = new Set();
  private requestCounts: Map<string, { count: number; timestamp: number }> =
    new Map();
  private blacklistedCountries: Set<string> = new Set(["XX", "YY"]); // Add actual country codes
  private riskThresholds = {
    low: 30,
    medium: 50,
    high: 70,
    critical: 90,
  };

  // Check if request is from a bot
  async detectBot(req: Request): Promise<{ isBot: boolean; reason?: string }> {
    const userAgent = req.headers["user-agent"] || "";

    // Common bot patterns
    const botPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
      /postman/i,
    ];

    for (const pattern of botPatterns) {
      if (pattern.test(userAgent)) {
        return { isBot: true, reason: `Bot detected: ${userAgent}` };
      }
    }

    // Check for missing or suspicious headers
    if (!userAgent || userAgent.length < 10) {
      return { isBot: true, reason: "Missing or invalid user agent" };
    }

    // Check for rapid requests from same IP
    const ip = this.getClientIP(req);
    const now = Date.now();
    const record = this.requestCounts.get(ip);

    if (record) {
      const timeDiff = now - record.timestamp;
      if (timeDiff < 1000 && record.count > 10) {
        return { isBot: true, reason: "Too many rapid requests" };
      }

      if (timeDiff < 60000) {
        record.count++;
      } else {
        this.requestCounts.set(ip, { count: 1, timestamp: now });
      }
    } else {
      this.requestCounts.set(ip, { count: 1, timestamp: now });
    }

    return { isBot: false };
  }

  // Check for suspicious transaction patterns
  async detectFraudulentTransaction(data: {
    userId: string;
    amount: number;
    currency: string;
    destinationAddress?: string;
    ip: string;
  }): Promise<{ isFraudulent: boolean; riskScore: number; reasons: string[] }> {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check amount
    if (data.amount > 10000) {
      riskScore += 30;
      reasons.push("Large transaction amount");
    }

    if (data.amount > 50000) {
      riskScore += 50;
      reasons.push("Very large transaction amount - requires manual review");
    }

    // Check if IP is suspicious
    if (this.suspiciousIPs.has(data.ip)) {
      riskScore += 40;
      reasons.push("Transaction from suspicious IP address");
    }

    // Check for rapid transactions
    const recentTxCount = await this.getRecentTransactionCount(data.userId);
    if (recentTxCount > 5) {
      riskScore += 25;
      reasons.push("Multiple transactions in short time");
    }

    // Check destination address (for crypto)
    if (data.destinationAddress) {
      const isKnownScam = await this.checkScamAddress(data.destinationAddress);
      if (isKnownScam) {
        riskScore += 100;
        reasons.push("CRITICAL: Known scam address detected");
      }
    }

    // Velocity check - unusual spending pattern
    const avgTransaction = await this.getUserAverageTransaction(data.userId);
    if (avgTransaction > 0 && data.amount > avgTransaction * 5) {
      riskScore += 35;
      reasons.push("Transaction amount significantly higher than user average");
    }

    return {
      isFraudulent: riskScore >= 70,
      riskScore,
      reasons,
    };
  }

  // Validate crypto address format
  validateCryptoAddress(
    address: string,
    network: string
  ): { valid: boolean; reason?: string } {
    // Bitcoin
    if (network === "bitcoin") {
      if (
        !/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) &&
        !/^bc1[a-z0-9]{39,59}$/.test(address)
      ) {
        return { valid: false, reason: "Invalid Bitcoin address format" };
      }
    }

    // Ethereum
    if (network === "ethereum") {
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return { valid: false, reason: "Invalid Ethereum address format" };
      }
    }

    // Tron
    if (network === "tron") {
      if (!/^T[a-zA-Z0-9]{33}$/.test(address)) {
        return { valid: false, reason: "Invalid Tron address format" };
      }
    }

    return { valid: true };
  }

  // Check if address is in known scam database
  async checkScamAddress(address: string): Promise<boolean> {
    // In production, check against databases like:
    // - ChainAbuse
    // - Etherscan scam database
    // - Bitcoin abuse database

    const knownScamAddresses = new Set([
      // Add known scam addresses here
      "0x0000000000000000000000000000000000000000",
    ]);

    return knownScamAddresses.has(address.toLowerCase());
  }

  // Get client IP from request
  private getClientIP(req: Request): string {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.ip || req.socket.remoteAddress || "unknown";
  }

  // Mock function - replace with actual database query
  private async getRecentTransactionCount(userId: string): Promise<number> {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const count = await prisma.transaction.count({
        where: {
          userId,
          createdAt: {
            gte: tenMinutesAgo,
          },
        },
      });
      return count;
    } catch (error) {
      console.error("Error getting recent transaction count:", error);
      return 0;
    }
  }

  // Mock function - replace with actual database query
  private async getUserAverageTransaction(userId: string): Promise<number> {
    try {
      const result = await prisma.transaction.aggregate({
        where: {
          userId,
          status: "COMPLETED",
        },
        _avg: {
          amount: true,
        },
      });
      return Number(result._avg.amount) || 0;
    } catch (error) {
      console.error("Error getting user average transaction:", error);
      return 0;
    }
  }

  // Mark IP as suspicious
  markIPSuspicious(ip: string): void {
    this.suspiciousIPs.add(ip);
  }

  // Check geolocation risk
  async checkGeolocationRisk(
    ip: string
  ): Promise<{ isHighRisk: boolean; country?: string; reason?: string }> {
    // In production, use a geolocation API like MaxMind or IP2Location
    // For now, return mock data

    // Example: Check if IP is from high-risk country
    const country = "US"; // Mock - get from geolocation service

    if (this.blacklistedCountries.has(country)) {
      return {
        isHighRisk: true,
        country,
        reason: "Transaction from blacklisted country",
      };
    }

    return { isHighRisk: false, country };
  }

  // Device fingerprinting
  async checkDeviceFingerprint(
    req: Request
  ): Promise<{ isSuspicious: boolean; reason?: string }> {
    const userAgent = req.headers["user-agent"] || "";
    const acceptLanguage = req.headers["accept-language"] || "";
    const acceptEncoding = req.headers["accept-encoding"] || "";

    // Check for header manipulation
    if (!acceptLanguage || !acceptEncoding) {
      return {
        isSuspicious: true,
        reason: "Missing standard browser headers",
      };
    }

    // Check for headless browser indicators
    if (
      userAgent.includes("HeadlessChrome") ||
      userAgent.includes("PhantomJS")
    ) {
      return {
        isSuspicious: true,
        reason: "Headless browser detected",
      };
    }

    return { isSuspicious: false };
  }

  // Behavioral analysis
  async analyzeBehavior(data: {
    userId: string;
    actionType: string;
    timestamp: Date;
  }): Promise<{ isAnomalous: boolean; reason?: string }> {
    // Check for unusual time patterns
    const hour = data.timestamp.getHours();

    // Transactions at unusual hours (2 AM - 5 AM)
    if (hour >= 2 && hour <= 5) {
      return {
        isAnomalous: true,
        reason: "Transaction at unusual hour",
      };
    }

    return { isAnomalous: false };
  }

  // Advanced ML-based fraud detection
  async advancedFraudDetection(data: {
    userId: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    destinationAddress?: string;
    ip: string;
    userAgent: string;
    deviceId?: string;
  }): Promise<{
    riskScore: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    isFraudulent: boolean;
    reasons: string[];
    recommendations: string[];
  }> {
    const reasons: string[] = [];
    const recommendations: string[] = [];
    let riskScore = 0;

    // 1. Transaction amount analysis
    if (data.amount > 10000) {
      riskScore += 20;
      reasons.push("High-value transaction");
      recommendations.push("Require additional verification");
    }

    if (data.amount > 50000) {
      riskScore += 40;
      reasons.push("Very high-value transaction");
      recommendations.push("Manual review required");
    }

    // 2. Velocity checks
    const recentTxCount = await this.getRecentTransactionCount(data.userId);
    if (recentTxCount > 3) {
      riskScore += 25;
      reasons.push("High transaction velocity");
      recommendations.push("Implement rate limiting");
    }

    // 3. Pattern analysis
    const avgTransaction = await this.getUserAverageTransaction(data.userId);
    if (avgTransaction > 0 && data.amount > avgTransaction * 10) {
      riskScore += 30;
      reasons.push("Unusual spending pattern");
      recommendations.push("Verify user identity");
    }

    // 4. Geographic analysis
    const geoRisk = await this.checkGeolocationRisk(data.ip);
    if (geoRisk.isHighRisk) {
      riskScore += 35;
      reasons.push("High-risk geographic location");
      recommendations.push("Block transaction from this region");
    }

    // 5. Device analysis
    const deviceRisk = await this.checkDeviceFingerprint({
      headers: { "user-agent": data.userAgent },
    } as Request);
    if (deviceRisk.isSuspicious) {
      riskScore += 30;
      reasons.push("Suspicious device fingerprint");
      recommendations.push("Require device verification");
    }

    // 6. Payment method risk
    const methodRisk = this.getPaymentMethodRisk(data.paymentMethod);
    riskScore += methodRisk.score;
    if (methodRisk.score > 0) {
      reasons.push(methodRisk.reason);
      recommendations.push(methodRisk.recommendation);
    }

    // 7. Address validation (for crypto)
    if (data.destinationAddress) {
      const addressValidation = this.validateCryptoAddress(
        data.destinationAddress,
        "ethereum"
      );
      if (!addressValidation.valid) {
        riskScore += 50;
        reasons.push("Invalid destination address");
        recommendations.push("Block invalid address transactions");
      }

      const isScam = await this.checkScamAddress(data.destinationAddress);
      if (isScam) {
        riskScore += 100;
        reasons.push("Known scam address detected");
        recommendations.push("IMMEDIATE BLOCK - Known scam address");
      }
    }

    // Determine risk level
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (riskScore >= this.riskThresholds.critical) {
      riskLevel = "CRITICAL";
    } else if (riskScore >= this.riskThresholds.high) {
      riskLevel = "HIGH";
    } else if (riskScore >= this.riskThresholds.medium) {
      riskLevel = "MEDIUM";
    }

    return {
      riskScore,
      riskLevel,
      isFraudulent: riskScore >= this.riskThresholds.high,
      reasons,
      recommendations,
    };
  }

  // Payment method risk assessment
  private getPaymentMethodRisk(paymentMethod: string): {
    score: number;
    reason: string;
    recommendation: string;
  } {
    const riskMap = {
      CRYPTO_USDC: {
        score: 5,
        reason: "Low-risk stablecoin",
        recommendation: "Standard verification",
      },
      CRYPTO_ETH: {
        score: 15,
        reason: "Volatile cryptocurrency",
        recommendation: "Enhanced monitoring",
      },
      STRIPE_CARD: {
        score: 10,
        reason: "Standard card payment",
        recommendation: "CVV verification",
      },
      STRIPE_ACH: {
        score: 8,
        reason: "Bank transfer",
        recommendation: "Account verification",
      },
      PAYPAL: {
        score: 12,
        reason: "Third-party wallet",
        recommendation: "PayPal verification",
      },
      APPLE_PAY: {
        score: 5,
        reason: "Secure mobile payment",
        recommendation: "Biometric verification",
      },
      GOOGLE_PAY: {
        score: 5,
        reason: "Secure mobile payment",
        recommendation: "Biometric verification",
      },
      BANK_WIRE: {
        score: 20,
        reason: "High-value wire transfer",
        recommendation: "Manual review required",
      },
    };

    return (
      (riskMap as any)[paymentMethod] || {
        score: 15,
        reason: "Unknown payment method",
        recommendation: "Enhanced verification",
      }
    );
  }

  // Log fraud detection results
  async logFraudDetection(data: {
    userId: string;
    transactionId?: string;
    riskScore: number;
    riskLevel: string;
    reasons: string[];
    recommendations: string[];
    ip: string;
    userAgent: string;
  }): Promise<void> {
    try {
      await prisma.fraudDetectionLog.create({
        data: {
          userId: data.userId,
          transactionId: data.transactionId,
          riskScore: data.riskScore,
          riskLevel: data.riskLevel as any,
          reasons: data.reasons,
          recommendations: data.recommendations,
          ipAddress: data.ip,
          userAgent: data.userAgent,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Error logging fraud detection:", error);
    }
  }
}

export const fraudDetection = new FraudDetectionService();
