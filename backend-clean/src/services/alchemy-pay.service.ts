import axios from 'axios';
import crypto from 'crypto';

export class AlchemyPayService {
  private apiKey: string;
  private secretKey: string;
  private merchantId: string;
  private baseUrl: string = 'https://api.alchemypay.org';

  constructor() {
    this.apiKey = process.env.ALCHEMY_PAY_API_KEY || '';
    this.secretKey = process.env.ALCHEMY_PAY_SECRET_KEY || '';
    this.merchantId = process.env.ALCHEMY_PAY_MERCHANT_ID || '';
  }

  /**
   * Check if Alchemy Pay is configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.secretKey && this.merchantId);
  }

  /**
   * Create fiat to crypto payment
   */
  async createPayment(
    amount: number,
    fiatCurrency: string,
    cryptoCurrency: string,
    userId: string
  ) {
    if (!this.isConfigured()) {
      throw new Error('Alchemy Pay is not configured. Add API credentials to .env');
    }

    try {
      const orderNo = `AP_${Date.now()}_${userId.substring(0, 8)}`;
      const timestamp = Date.now();

      const params = {
        merchantOrderNo: orderNo,
        orderAmount: amount.toString(),
        orderCurrency: fiatCurrency,
        crypto: cryptoCurrency,
        network: this.getCryptoNetwork(cryptoCurrency),
        merchantId: this.merchantId,
        timestamp: timestamp.toString(),
      };

      // Generate signature
      const signature = this.generateSignature(params);

      const response = await axios.post(
        `${this.baseUrl}/api/v1/order/create`,
        {
          ...params,
          sign: signature,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'App-Id': this.apiKey,
          },
        }
      );

      return {
        orderId: response.data.data.orderId,
        paymentUrl: response.data.data.paymentUrl,
        orderNo,
        status: 'PENDING',
      };
    } catch (error: any) {
      console.error('Alchemy Pay payment creation error:', error.response?.data || error);
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderId: string) {
    if (!this.isConfigured()) {
      throw new Error('Alchemy Pay is not configured');
    }

    try {
      const timestamp = Date.now();
      const params = {
        orderId,
        merchantId: this.merchantId,
        timestamp: timestamp.toString(),
      };

      const signature = this.generateSignature(params);

      const response = await axios.get(`${this.baseUrl}/api/v1/order/query`, {
        params: {
          ...params,
          sign: signature,
        },
        headers: {
          'App-Id': this.apiKey,
        },
      });

      return {
        orderId: response.data.data.orderId,
        status: response.data.data.status, // PENDING, COMPLETED, FAILED, CANCELLED
        cryptoAmount: response.data.data.cryptoAmount,
        crypto: response.data.data.crypto,
        fiatAmount: response.data.data.fiatAmount,
        fiatCurrency: response.data.data.fiatCurrency,
      };
    } catch (error: any) {
      console.error('Alchemy Pay status check error:', error.response?.data || error);
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }

  /**
   * Handle webhook from Alchemy Pay
   */
  async handleWebhook(payload: any, signature: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Alchemy Pay is not configured');
    }

    // Verify signature
    const expectedSignature = this.generateSignature(payload);

    if (signature !== expectedSignature) {
      console.error('Invalid Alchemy Pay webhook signature');
      return false;
    }

    // Process based on status
    const { status, merchantOrderNo, crypto, cryptoAmount, fiatAmount } = payload;

    console.log('Alchemy Pay webhook received:', {
      status,
      merchantOrderNo,
      crypto,
      cryptoAmount,
      fiatAmount,
    });

    if (status === 'COMPLETED') {
      console.log(`Alchemy Pay payment completed: ${merchantOrderNo}`);
      // TODO: Credit user balance in database
      return true;
    } else if (status === 'FAILED' || status === 'CANCELLED') {
      console.log(`Alchemy Pay payment ${status.toLowerCase()}: ${merchantOrderNo}`);
      // TODO: Update transaction status in database
      return true;
    }

    return false;
  }

  /**
   * Get supported cryptocurrencies
   */
  async getSupportedCryptos(): Promise<string[]> {
    // Common cryptocurrencies supported by Alchemy Pay
    return ['USDT', 'USDC', 'ETH', 'BTC', 'BNB', 'DAI'];
  }

  /**
   * Get supported fiat currencies
   */
  async getSupportedFiat(): Promise<string[]> {
    // Common fiat currencies supported by Alchemy Pay
    return ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CNY'];
  }

  /**
   * Calculate exchange rate (approximate)
   */
  async calculateExchangeRate(
    fiatAmount: number,
    fiatCurrency: string,
    cryptoCurrency: string
  ): Promise<{ cryptoAmount: number; rate: number; fee: number }> {
    // Note: In production, you should fetch real-time rates from Alchemy Pay API
    // This is a simplified mock implementation
    const mockRates: Record<string, number> = {
      'USD_USDT': 1.0,
      'USD_USDC': 1.0,
      'USD_ETH': 0.0003, // ~3333 USD per ETH
      'USD_BTC': 0.000015, // ~66666 USD per BTC
      'USD_BNB': 0.002, // ~500 USD per BNB
    };

    const rateKey = `${fiatCurrency}_${cryptoCurrency}`;
    const rate = mockRates[rateKey] || 1.0;
    const fee = fiatAmount * 0.015; // 1.5% fee
    const cryptoAmount = (fiatAmount - fee) * rate;

    return {
      cryptoAmount,
      rate,
      fee,
    };
  }

  /**
   * Generate HMAC SHA256 signature
   */
  private generateSignature(params: any): string {
    // Sort parameters alphabetically
    const sortedKeys = Object.keys(params).sort();
    const signString = sortedKeys.map((key) => `${key}=${params[key]}`).join('&');

    // Create HMAC SHA256 signature
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(signString)
      .digest('hex')
      .toUpperCase();
  }

  /**
   * Get blockchain network for cryptocurrency
   */
  private getCryptoNetwork(crypto: string): string {
    const networks: Record<string, string> = {
      ETH: 'ETH',
      USDT: 'ERC20',
      USDC: 'ERC20',
      BTC: 'BTC',
      BNB: 'BSC',
      DAI: 'ERC20',
    };
    return networks[crypto] || 'ERC20';
  }
}

export const alchemyPayService = new AlchemyPayService();
