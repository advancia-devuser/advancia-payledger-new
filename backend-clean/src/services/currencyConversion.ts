import { logger } from '../middleware/errorHandler';

export class CurrencyConversionService {
  private conversionRates: Map<string, ConversionRate> = new Map();
  private conversionHistory: Map<string, ConversionRecord[]> = new Map();
  private rateUpdateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeRates();
    this.startRateUpdates();
  }

  private initializeRates(): void {
    const basePairs = [
      { from: 'USD', to: 'EUR', rate: 0.92 },
      { from: 'USD', to: 'GBP', rate: 0.79 },
      { from: 'USD', to: 'BTC', rate: 0.000023 },
      { from: 'USD', to: 'ETH', rate: 0.00045 },
      { from: 'USD', to: 'USDT', rate: 1.0 },
      { from: 'USD', to: 'USDC', rate: 1.0 },
      { from: 'BTC', to: 'USD', rate: 43500 },
      { from: 'ETH', to: 'USD', rate: 2200 },
      { from: 'EUR', to: 'USD', rate: 1.09 },
      { from: 'GBP', to: 'USD', rate: 1.27 },
    ];

    basePairs.forEach(pair => {
      const key = `${pair.from}_${pair.to}`;
      this.conversionRates.set(key, {
        from: pair.from,
        to: pair.to,
        rate: pair.rate,
        lastUpdated: new Date(),
        source: 'internal',
      });
    });
  }

  private startRateUpdates(): void {
    this.rateUpdateInterval = setInterval(() => {
      this.updateRates();
    }, 60000);
  }

  private async updateRates(): Promise<void> {
    try {
      logger.info('Updating conversion rates');
      
      for (const [key, rate] of this.conversionRates.entries()) {
        const volatility = Math.random() * 0.02 - 0.01;
        rate.rate = rate.rate * (1 + volatility);
        rate.lastUpdated = new Date();
      }
    } catch (error) {
      logger.error(error as Error, { context: 'Rate update failed' });
    }
  }

  async convertCurrency(params: {
    userId: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    ledgerBalance?: boolean;
  }): Promise<ConversionResult> {
    try {
      if (params.fromCurrency === params.toCurrency) {
        return {
          success: true,
          fromCurrency: params.fromCurrency,
          toCurrency: params.toCurrency,
          fromAmount: params.amount,
          toAmount: params.amount,
          rate: 1,
          fee: 0,
          timestamp: new Date(),
          conversionId: this.generateConversionId(),
        };
      }

      const rate = this.getConversionRate(params.fromCurrency, params.toCurrency);
      if (!rate) {
        throw new Error(`Conversion rate not available for ${params.fromCurrency} to ${params.toCurrency}`);
      }

      const convertedAmount = params.amount * rate.rate;
      const fee = this.calculateFee(params.amount, params.fromCurrency, params.ledgerBalance);
      const finalAmount = convertedAmount - fee;

      const conversionId = this.generateConversionId();
      const record: ConversionRecord = {
        conversionId,
        userId: params.userId,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: finalAmount,
        rate: rate.rate,
        fee,
        timestamp: new Date(),
        status: 'completed',
        ledgerBalance: params.ledgerBalance || false,
      };

      this.saveConversionRecord(params.userId, record);

      logger.info('Currency conversion completed', {
        userId: params.userId,
        conversionId,
        from: params.fromCurrency,
        to: params.toCurrency,
        amount: params.amount,
      });

      return {
        success: true,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: finalAmount,
        rate: rate.rate,
        fee,
        timestamp: new Date(),
        conversionId,
      };
    } catch (error) {
      logger.error(error as Error, { userId: params.userId });
      return {
        success: false,
        fromCurrency: params.fromCurrency,
        toCurrency: params.toCurrency,
        fromAmount: params.amount,
        toAmount: 0,
        rate: 0,
        fee: 0,
        timestamp: new Date(),
        conversionId: '',
        error: (error as Error).message,
      };
    }
  }

  private getConversionRate(from: string, to: string): ConversionRate | null {
    const directKey = `${from}_${to}`;
    const directRate = this.conversionRates.get(directKey);
    
    if (directRate) {
      return directRate;
    }

    const reverseKey = `${to}_${from}`;
    const reverseRate = this.conversionRates.get(reverseKey);
    
    if (reverseRate) {
      return {
        from,
        to,
        rate: 1 / reverseRate.rate,
        lastUpdated: reverseRate.lastUpdated,
        source: reverseRate.source,
      };
    }

    const usdFromKey = `${from}_USD`;
    const usdToKey = `USD_${to}`;
    const fromUsdRate = this.conversionRates.get(usdFromKey);
    const toUsdRate = this.conversionRates.get(usdToKey);

    if (fromUsdRate && toUsdRate) {
      return {
        from,
        to,
        rate: fromUsdRate.rate * toUsdRate.rate,
        lastUpdated: new Date(),
        source: 'calculated',
      };
    }

    return null;
  }

  private calculateFee(amount: number, currency: string, ledgerBalance?: boolean): number {
    if (ledgerBalance) {
      return 0;
    }

    const feePercentage = 0.005;
    const minFee = currency === 'USD' ? 0.5 : 0.0001;
    const maxFee = currency === 'USD' ? 50 : 0.01;

    let fee = amount * feePercentage;
    fee = Math.max(fee, minFee);
    fee = Math.min(fee, maxFee);

    return fee;
  }

  private generateConversionId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private saveConversionRecord(userId: string, record: ConversionRecord): void {
    const userHistory = this.conversionHistory.get(userId) || [];
    userHistory.push(record);
    this.conversionHistory.set(userId, userHistory);
  }

  getConversionHistory(userId: string, limit: number = 50): ConversionRecord[] {
    const history = this.conversionHistory.get(userId) || [];
    return history.slice(-limit).reverse();
  }

  getCurrentRate(from: string, to: string): number | null {
    const rate = this.getConversionRate(from, to);
    return rate ? rate.rate : null;
  }

  getSupportedCurrencies(): string[] {
    const currencies = new Set<string>();
    this.conversionRates.forEach(rate => {
      currencies.add(rate.from);
      currencies.add(rate.to);
    });
    return Array.from(currencies);
  }

  async estimateConversion(from: string, to: string, amount: number): Promise<{
    estimatedAmount: number;
    rate: number;
    fee: number;
  }> {
    const rate = this.getConversionRate(from, to);
    if (!rate) {
      throw new Error(`Conversion rate not available for ${from} to ${to}`);
    }

    const convertedAmount = amount * rate.rate;
    const fee = this.calculateFee(amount, from);

    return {
      estimatedAmount: convertedAmount - fee,
      rate: rate.rate,
      fee,
    };
  }

  stopRateUpdates(): void {
    if (this.rateUpdateInterval) {
      clearInterval(this.rateUpdateInterval);
      this.rateUpdateInterval = null;
    }
  }
}

interface ConversionRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
  source: 'internal' | 'external' | 'calculated';
}

interface ConversionRecord {
  conversionId: string;
  userId: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  timestamp: Date;
  status: 'completed' | 'failed' | 'pending';
  ledgerBalance: boolean;
}

interface ConversionResult {
  success: boolean;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  fee: number;
  timestamp: Date;
  conversionId: string;
  error?: string;
}

export const currencyConversion = new CurrencyConversionService();
