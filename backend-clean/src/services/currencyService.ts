import { prisma } from "../lib/prisma";

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  isActive: boolean;
  exchangeRate: number;
  lastUpdated: Date;
}

export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: Date;
  source: string;
}

export interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  exchangeRate: number;
  fee: number;
  totalCost: number;
  timestamp: Date;
}

export interface WalletBalance {
  currency: string;
  balance: number;
  usdEquivalent: number;
  lastUpdated: Date;
}

export class CurrencyService {
  private static instance: CurrencyService;
  private exchangeRates: Map<string, number> = new Map();
  private supportedCurrencies: Map<string, Currency> = new Map();
  private lastRateUpdate: Date = new Date();
  private readonly UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly EXCHANGE_RATE_API = "https://api.exchangerate.host/latest";
  private readonly BACKUP_API = "https://api.frankfur.com/v1/latest";

  private initialized: boolean = false;

  private constructor() {
    // Defer initialization to avoid Prisma not being ready
    setTimeout(() => {
      this.initializeCurrencies();
      this.startRateUpdates();
    }, 1000);
  }

  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initializeCurrencies();
      this.initialized = true;
    }
  }

  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  private async initializeCurrencies() {
    try {
      // Check if prisma is available
      if (!prisma || !prisma.currency) {
        console.log("Prisma not ready, using default currencies");
        this.initializeInMemoryDefaults();
        this.initialized = true;
        return;
      }

      // Load currencies from database
      const currencies = await prisma.currency.findMany({
        where: { isActive: true },
      });

      currencies.forEach((currency: any) => {
        this.supportedCurrencies.set(currency.code, {
          ...currency,
          lastUpdated: currency.updatedAt,
        });
        this.exchangeRates.set(`USD-${currency.code}`, currency.exchangeRate);
      });

      // If no currencies in database, initialize with default ones
      if (currencies.length === 0) {
        await this.initializeDefaultCurrencies();
      }

      console.log(`Initialized ${this.supportedCurrencies.size} currencies`);
    } catch (error) {
      console.error("Error initializing currencies:", error);
      this.initializeInMemoryDefaults();
    }
    this.initialized = true;
  }

  private initializeInMemoryDefaults() {
    // In-memory defaults when database is not available
    const defaults = [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        decimalPlaces: 2,
        exchangeRate: 1.0,
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        decimalPlaces: 2,
        exchangeRate: 0.92,
      },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        decimalPlaces: 2,
        exchangeRate: 0.79,
      },
      {
        code: "BTC",
        name: "Bitcoin",
        symbol: "₿",
        decimalPlaces: 8,
        exchangeRate: 43250.5,
      },
      {
        code: "ETH",
        name: "Ethereum",
        symbol: "Ξ",
        decimalPlaces: 6,
        exchangeRate: 2280.25,
      },
      {
        code: "USDC",
        name: "USD Coin",
        symbol: "$",
        decimalPlaces: 6,
        exchangeRate: 1.0,
      },
    ];

    defaults.forEach((c) => {
      this.supportedCurrencies.set(c.code, {
        ...c,
        isActive: true,
        lastUpdated: new Date(),
      });
      this.exchangeRates.set(`USD-${c.code}`, c.exchangeRate);
    });
    console.log(`Initialized ${defaults.length} in-memory currencies`);
  }

  private async initializeDefaultCurrencies() {
    const defaultCurrencies: Omit<Currency, "id" | "lastUpdated">[] = [
      {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 1.0,
      },
      {
        code: "EUR",
        name: "Euro",
        symbol: "€",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 0.92,
      },
      {
        code: "GBP",
        name: "British Pound",
        symbol: "£",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 0.79,
      },
      {
        code: "JPY",
        name: "Japanese Yen",
        symbol: "¥",
        decimalPlaces: 0,
        isActive: true,
        exchangeRate: 149.5,
      },
      {
        code: "CAD",
        name: "Canadian Dollar",
        symbol: "C$",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 1.35,
      },
      {
        code: "AUD",
        name: "Australian Dollar",
        symbol: "A$",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 1.52,
      },
      {
        code: "CHF",
        name: "Swiss Franc",
        symbol: "CHF",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 0.91,
      },
      {
        code: "CNY",
        name: "Chinese Yuan",
        symbol: "¥",
        decimalPlaces: 2,
        isActive: true,
        exchangeRate: 7.24,
      },
      {
        code: "BTC",
        name: "Bitcoin",
        symbol: "₿",
        decimalPlaces: 8,
        isActive: true,
        exchangeRate: 43250.5,
      },
      {
        code: "ETH",
        name: "Ethereum",
        symbol: "Ξ",
        decimalPlaces: 6,
        isActive: true,
        exchangeRate: 2280.25,
      },
      {
        code: "USDC",
        name: "USD Coin",
        symbol: "$",
        decimalPlaces: 6,
        isActive: true,
        exchangeRate: 1.0,
      },
    ];

    for (const currencyData of defaultCurrencies) {
      const currency = await prisma.currency.upsert({
        where: { code: currencyData.code },
        update: {
          name: currencyData.name,
          symbol: currencyData.symbol,
          decimalPlaces: currencyData.decimalPlaces,
          isActive: currencyData.isActive,
          exchangeRate: currencyData.exchangeRate,
          updatedAt: new Date(),
        },
        create: {
          code: currencyData.code,
          name: currencyData.name,
          symbol: currencyData.symbol,
          decimalPlaces: currencyData.decimalPlaces,
          isActive: currencyData.isActive,
          exchangeRate: currencyData.exchangeRate,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      this.supportedCurrencies.set(currency.code, {
        ...currency,
        lastUpdated: currency.updatedAt,
      });
      this.exchangeRates.set(`USD-${currency.code}`, currency.exchangeRate);
    }

    console.log("Initialized default currencies");
  }

  private startRateUpdates() {
    // Update rates immediately
    this.updateExchangeRates();

    // Set up periodic updates
    setInterval(() => {
      this.updateExchangeRates();
    }, this.UPDATE_INTERVAL);
  }

  private async updateExchangeRates() {
    try {
      // Get rates from primary API
      const rates = await this.fetchExchangeRates();

      // Update rates in database
      for (const [pair, rate] of Object.entries(rates)) {
        const [from, to] = pair.split("-");

        if (
          this.supportedCurrencies.has(from) &&
          this.supportedCurrencies.has(to)
        ) {
          // Update in-memory cache
          this.exchangeRates.set(pair, rate);
          this.supportedCurrencies.get(from)!.exchangeRate = rate;
          this.supportedCurrencies.get(from)!.lastUpdated = new Date();

          // Update database only if Prisma Currency model exists
          if ((prisma as any)?.currency) {
            await prisma.currency.update({
              where: { code: from },
              data: {
                exchangeRate: rate,
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      this.lastRateUpdate = new Date();
      console.log(
        `Updated exchange rates for ${Object.keys(rates).length} pairs`
      );
    } catch (error) {
      console.error("Error updating exchange rates:", error);
    }
  }

  private async fetchExchangeRates(): Promise<Record<string, number>> {
    try {
      // Try primary API first
      const response = await fetch(
        `${this.EXCHANGE_RATE_API}?access_key=${process.env.EXCHANGE_RATE_API_KEY}`
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(
            `Primary exchange-rate API returned non-JSON response (content-type: ${contentType}). Body starts with: ${text.slice(
              0,
              80
            )}`
          );
        }

        const data: any = await response.json();
        if (!data || typeof data !== "object" || !data.rates) {
          throw new Error(
            "Primary exchange-rate API returned invalid JSON payload"
          );
        }
        const rates: Record<string, number> = {};

        // Convert all rates to USD base
        for (const [currency, rate] of Object.entries(data.rates)) {
          if (currency === "USD") {
            rates[`USD-${currency}`] = 1;
          } else {
            rates[`USD-${currency}`] = Number(rate);
            rates[`${currency}-USD`] = 1 / Number(rate);
          }
        }

        return rates;
      }
    } catch (error) {
      console.error("Primary API failed, trying backup:", error);
    }

    try {
      // Try backup API
      const response = await fetch(
        `${this.BACKUP_API}?api_key=${process.env.FURF_API_KEY}`
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(
            `Backup exchange-rate API returned non-JSON response (content-type: ${contentType}). Body starts with: ${text.slice(
              0,
              80
            )}`
          );
        }

        const data: any = await response.json();
        if (!data || typeof data !== "object" || !data.rates) {
          throw new Error(
            "Backup exchange-rate API returned invalid JSON payload"
          );
        }
        const rates: Record<string, number> = {};

        for (const [currency, rate] of Object.entries(data.rates)) {
          if (currency === "USD") {
            rates[`USD-${currency}`] = Number(rate);
            rates[`${currency}-USD`] = 1 / Number(rate);
          }
        }

        return rates;
      }
    } catch (error) {
      console.error("Backup API also failed:", error);
      throw new Error("Failed to fetch exchange rates");
    }

    // Fallback return if all APIs fail
    return {
      "USD-USD": 1,
      "USD-EUR": 0.92,
      "EUR-USD": 1.09,
      "USD-GBP": 0.79,
      "GBP-USD": 1.27,
    };
  }

  async convertCurrency(
    fromAmount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<ConversionResult> {
    try {
      // Validate currencies
      if (!this.supportedCurrencies.has(fromCurrency)) {
        throw new Error(`Unsupported currency: ${fromCurrency}`);
      }
      if (!this.supportedCurrencies.has(toCurrency)) {
        throw new Error(`Unsupported currency: ${toCurrency}`);
      }

      // Get exchange rate
      const rateKey = `${fromCurrency}-${toCurrency}`;
      let exchangeRate = this.exchangeRates.get(rateKey);

      // If direct rate doesn't exist, calculate via USD
      if (!exchangeRate) {
        const fromToUsd = this.exchangeRates.get(`${fromCurrency}-USD`);
        const usdToTo = this.exchangeRates.get(`USD-${toCurrency}`);

        if (fromToUsd && usdToTo) {
          exchangeRate = fromToUsd * usdToTo;
        } else {
          throw new Error(
            `No exchange rate available for ${fromCurrency} to ${toCurrency}`
          );
        }
      }

      // Calculate conversion
      const toAmount = fromAmount * exchangeRate;
      const fee = this.calculateConversionFee(
        fromAmount,
        fromCurrency,
        toCurrency
      );
      const totalCost = fromAmount + fee;

      const result: ConversionResult = {
        fromAmount,
        fromCurrency,
        toAmount,
        toCurrency,
        exchangeRate,
        fee,
        totalCost,
        timestamp: new Date(),
      };

      // Log conversion for audit
      await this.logConversion(result);

      return result;
    } catch (error) {
      console.error("Currency conversion error:", error);
      throw error;
    }
  }

  private calculateConversionFee(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number {
    // Different fee structures for different currencies
    const cryptoCurrencies = ["BTC", "ETH", "USDC"];
    const isCryptoFrom = cryptoCurrencies.includes(fromCurrency);
    const isCryptoTo = cryptoCurrencies.includes(toCurrency);

    if (isCryptoFrom && isCryptoTo) {
      // Crypto to crypto: higher fee
      return amount * 0.002; // 0.2%
    } else if (isCryptoFrom || isCryptoTo) {
      // Crypto to fiat or fiat to crypto: medium fee
      return amount * 0.001; // 0.1%
    } else {
      // Fiat to fiat: lower fee
      return amount * 0.0005; // 0.05%
    }
  }

  private async logConversion(conversion: ConversionResult) {
    try {
      // Log conversion for audit trail
      console.log(
        `Currency Conversion: ${conversion.fromAmount} ${conversion.fromCurrency} → ${conversion.toAmount} ${conversion.toCurrency} (Rate: ${conversion.exchangeRate})`
      );

      // In production, store in database
      // await prisma.currencyConversion.create({
      //   fromAmount: conversion.fromAmount,
      //   fromCurrency: conversion.fromCurrency,
      //   toAmount: conversion.toAmount,
      //   toCurrency: conversion.toCurrency,
      //   exchangeRate: conversion.exchangeRate,
      //   fee: conversion.fee,
      //   timestamp: conversion.timestamp
      // });
    } catch (error) {
      console.error("Error logging conversion:", error);
    }
  }

  async getSupportedCurrencies(): Promise<Currency[]> {
    return Array.from(this.supportedCurrencies.values());
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    const rateKey = `${fromCurrency}-${toCurrency}`;
    let rate = this.exchangeRates.get(rateKey);

    if (!rate) {
      // Calculate via USD
      const fromToUsd = this.exchangeRates.get(`${fromCurrency}-USD`);
      const usdToTo = this.exchangeRates.get(`USD-${toCurrency}`);

      if (fromToUsd && usdToTo) {
        rate = fromToUsd * usdToTo;
      } else {
        throw new Error(
          `No exchange rate available for ${fromCurrency} to ${toCurrency}`
        );
      }
    }

    return rate;
  }

  async updateCurrency(
    code: string,
    updates: Partial<Currency>
  ): Promise<Currency> {
    try {
      const currency = await prisma.currency.update({
        where: { code },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      // Update in-memory cache
      if (this.supportedCurrencies.has(code)) {
        this.supportedCurrencies.set(code, {
          ...this.supportedCurrencies.get(code)!,
          ...updates,
          lastUpdated: new Date(),
        });
      }

      return currency;
    } catch (error) {
      console.error("Error updating currency:", error);
      throw error;
    }
  }

  async addCurrency(
    currency: Omit<Currency, "id" | "lastUpdated">
  ): Promise<Currency> {
    try {
      const newCurrency = await prisma.currency.create({
        data: {
          ...currency,
          lastUpdated: new Date(),
        },
      });

      // Add to in-memory cache
      this.supportedCurrencies.set(currency.code, {
        ...currency,
        lastUpdated: newCurrency.updatedAt,
      });
      this.exchangeRates.set(`USD-${currency.code}`, currency.exchangeRate);

      return newCurrency;
    } catch (error) {
      console.error("Error adding currency:", error);
      throw error;
    }
  }

  async getUserWalletBalances(userId: string): Promise<WalletBalance[]> {
    try {
      const wallet = await prisma.wallet.findUnique({
        where: { userId },
        include: {
          cryptoDeposits: true,
          transactions: {
            where: { status: "COMPLETED" },
            select: {
              amount: true,
              currency: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          },
        },
      });

      if (!wallet) {
        return [];
      }

      const balances: WalletBalance[] = [];

      // Add main wallet balance (USD)
      balances.push({
        currency: "USD",
        balance: Number(wallet.balance),
        usdEquivalent: Number(wallet.balance),
        lastUpdated: new Date(),
      });

      // Add crypto deposit balances
      for (const deposit of wallet.cryptoDeposits) {
        if (deposit.status === "COMPLETED") {
          const usdEquivalent = await this.convertCurrency(
            Number(deposit.amount),
            deposit.currency,
            "USD"
          );

          balances.push({
            currency: deposit.currency,
            balance: Number(deposit.amount),
            usdEquivalent: Number(usdEquivalent),
            lastUpdated: deposit.updatedAt,
          });
        }
      }

      // Add transaction balances by currency
      const currencyBalances = new Map<string, number>();

      for (const tx of wallet.transactions) {
        const currentBalance = currencyBalances.get(tx.currency) || 0;
        currencyBalances.set(tx.currency, currentBalance + Number(tx.amount));
      }

      for (const [currency, balance] of currencyBalances.entries()) {
        if (currency !== "USD") {
          const usdEquivalent = await this.convertCurrency(
            balance,
            currency,
            "USD"
          );
          balances.push({
            currency,
            balance,
            usdEquivalent: Number(usdEquivalent),
            lastUpdated: new Date(),
          });
        }
      }

      return balances.sort((a, b) => b.usdEquivalent - a.usdEquivalent);
    } catch (error) {
      console.error("Error getting user wallet balances:", error);
      return [];
    }
  }

  async getExchangeRateHistory(
    fromCurrency: string,
    toCurrency: string,
    days: number = 30
  ): Promise<ExchangeRate[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const rates = await prisma.exchangeRate.findMany({
        where: {
          fromCurrency,
          toCurrency,
          timestamp: {
            gte: startDate,
          },
        },
        orderBy: { timestamp: "desc" },
        take: 100,
      });

      return rates;
    } catch (error) {
      console.error("Error getting exchange rate history:", error);
      return [];
    }
  }

  async getConversionHistory(
    userId: string,
    days: number = 30
  ): Promise<ConversionResult[]> {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // In production, fetch from database
      // For now, return empty array
      return [];
    } catch (error) {
      console.error("Error getting conversion history:", error);
      return [];
    }
  }

  async isCurrencySupported(currencyCode: string): Promise<boolean> {
    return this.supportedCurrencies.has(currencyCode);
  }

  getCurrencyInfo(currencyCode: string): Currency | null {
    return this.supportedCurrencies.get(currencyCode) || null;
  }

  getLastRateUpdate(): Date {
    return this.lastRateUpdate;
  }

  // Real-time rate updates via WebSocket
  async subscribeToRateUpdates(
    callback: (rates: Record<string, number>) => void
  ): Promise<void> {
    // This would be used with WebSocket for real-time updates
    // Implementation depends on WebSocket setup
  }

  // Currency validation
  validateCurrency(currencyCode: string): boolean {
    return (
      /^[A-Z]{3}$/.test(currencyCode) &&
      this.supportedCurrencies.has(currencyCode)
    );
  }

  // Format currency amount
  formatCurrency(amount: number, currencyCode: string): string {
    const currency = this.supportedCurrencies.get(currencyCode);
    if (!currency) {
      return amount.toString();
    }

    const formattedAmount = amount.toFixed(currency.decimalPlaces);
    return `${currency.symbol}${formattedAmount}`;
  }

  // Parse currency amount
  parseCurrency(formattedAmount: string, currencyCode: string): number {
    const currency = this.supportedCurrencies.get(currencyCode);
    if (!currency) {
      throw new Error(`Unsupported currency: ${currencyCode}`);
    }

    // Remove currency symbol and parse
    const numericAmount = formattedAmount
      .replace(currency.symbol, "")
      .replace(/,/g, "");
    return parseFloat(numericAmount);
  }
}

export const currencyService = CurrencyService.getInstance();
