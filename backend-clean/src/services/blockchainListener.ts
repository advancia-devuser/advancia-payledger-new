import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';
const RPC_URL = process.env.RPC_URL || '';

const CONTRACT_ABI = [
  'event PaymentMade(address indexed payer, address indexed merchant, uint256 amount, uint8 paymentType, string orderId, uint256 timestamp)',
  'event SubscriptionCreated(address indexed subscriber, address indexed merchant, uint256 amount, uint256 interval, string subscriptionId, uint256 timestamp)',
  'event SubscriptionPayment(address indexed subscriber, address indexed merchant, uint256 amount, string subscriptionId, uint256 paymentNumber, uint256 timestamp)',
  'event SubscriptionCancelled(address indexed subscriber, string subscriptionId, uint256 timestamp)'
];

interface PaymentEvent {
  payer: string;
  merchant: string;
  amount: bigint;
  paymentType: number;
  orderId: string;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: number;
}

interface SubscriptionCreatedEvent {
  subscriber: string;
  merchant: string;
  amount: bigint;
  interval: bigint;
  subscriptionId: string;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: number;
}

interface SubscriptionPaymentEvent {
  subscriber: string;
  merchant: string;
  amount: bigint;
  subscriptionId: string;
  paymentNumber: bigint;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: number;
}

interface SubscriptionCancelledEvent {
  subscriber: string;
  subscriptionId: string;
  timestamp: bigint;
  transactionHash: string;
  blockNumber: number;
}

export class BlockchainListener {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private isListening: boolean = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
  }

  async start() {
    if (this.isListening) {
      console.log('Blockchain listener already running');
      return;
    }

    this.isListening = true;
    console.log('Starting blockchain listener...');
    console.log(`Monitoring contract: ${CONTRACT_ADDRESS}`);

    await this.syncHistoricalEvents();

    this.contract.on('PaymentMade', async (payer, merchant, amount, paymentType, orderId, timestamp, event) => {
      await this.handlePaymentMade({
        payer,
        merchant,
        amount,
        paymentType,
        orderId,
        timestamp,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber
      });
    });

    this.contract.on('SubscriptionCreated', async (subscriber, merchant, amount, interval, subscriptionId, timestamp, event) => {
      await this.handleSubscriptionCreated({
        subscriber,
        merchant,
        amount,
        interval,
        subscriptionId,
        timestamp,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber
      });
    });

    this.contract.on('SubscriptionPayment', async (subscriber, merchant, amount, subscriptionId, paymentNumber, timestamp, event) => {
      await this.handleSubscriptionPayment({
        subscriber,
        merchant,
        amount,
        subscriptionId,
        paymentNumber,
        timestamp,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber
      });
    });

    this.contract.on('SubscriptionCancelled', async (subscriber, subscriptionId, timestamp, event) => {
      await this.handleSubscriptionCancelled({
        subscriber,
        subscriptionId,
        timestamp,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber
      });
    });

    console.log('Blockchain listener started successfully');
  }

  async stop() {
    if (!this.isListening) return;

    this.contract.removeAllListeners();
    this.isListening = false;
    console.log('Blockchain listener stopped');
  }

  private async syncHistoricalEvents() {
    console.log('Syncing historical events...');
    
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(0, currentBlock - 10000);

      const paymentFilter = this.contract.filters.PaymentMade();
      const paymentEvents = await this.contract.queryFilter(paymentFilter, fromBlock, currentBlock);

      for (const event of paymentEvents) {
        const args = event.args as any;
        await this.handlePaymentMade({
          payer: args.payer,
          merchant: args.merchant,
          amount: args.amount,
          paymentType: args.paymentType,
          orderId: args.orderId,
          timestamp: args.timestamp,
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        }, true);
      }

      console.log(`Synced ${paymentEvents.length} historical payment events`);
    } catch (error) {
      console.error('Error syncing historical events:', error);
    }
  }

  private async handlePaymentMade(event: PaymentEvent, isHistorical: boolean = false) {
    
    try {
      await client.query('BEGIN');

      const checkQuery = `
        SELECT id FROM blockchain_payments 
        WHERE transaction_hash = $1
      `;
      const existing = await client.query(checkQuery, [event.transactionHash]);

      if (existing.rows.length > 0) {
        console.log(`Payment already processed: ${event.transactionHash}`);
        await client.query('COMMIT');
        return;
      }

      const insertPaymentQuery = `
        INSERT INTO blockchain_payments (
          transaction_hash,
          block_number,
          payer_address,
          merchant_address,
          amount_wei,
          amount_eth,
          payment_type,
          order_id,
          timestamp,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, to_timestamp($9), $10)
        RETURNING id
      `;

      const amountEth = ethers.formatEther(event.amount);
      
      const result = await client.query(insertPaymentQuery, [
        event.transactionHash,
        event.blockNumber,
        event.payer,
        event.merchant,
        event.amount.toString(),
        amountEth,
        event.paymentType === 0 ? 'ONE_TIME' : 'SUBSCRIPTION',
        event.orderId,
        Number(event.timestamp),
        'CONFIRMED'
      ]);

      const updateOrderQuery = `
        UPDATE orders 
        SET 
          payment_status = 'PAID',
          payment_method = 'BLOCKCHAIN',
          blockchain_tx_hash = $1,
          updated_at = NOW()
        WHERE order_id = $2
      `;
      
      await client.query(updateOrderQuery, [event.transactionHash, event.orderId]);

      await client.query('COMMIT');

      console.log(`✓ Payment processed: ${event.orderId} | ${amountEth} ETH | TX: ${event.transactionHash}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error handling payment:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async handleSubscriptionCreated(event: SubscriptionCreatedEvent, isHistorical: boolean = false) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const checkQuery = `
        SELECT id FROM blockchain_subscriptions 
        WHERE subscription_id = $1
      `;
      const existing = await client.query(checkQuery, [event.subscriptionId]);

      if (existing.rows.length > 0) {
        console.log(`Subscription already exists: ${event.subscriptionId}`);
        await client.query('COMMIT');
        return;
      }

      const insertSubscriptionQuery = `
        INSERT INTO blockchain_subscriptions (
          subscription_id,
          subscriber_address,
          merchant_address,
          amount_wei,
          amount_eth,
          interval_seconds,
          last_payment_timestamp,
          payment_count,
          status,
          created_tx_hash,
          created_block_number,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7), $8, $9, $10, $11, to_timestamp($12))
        RETURNING id
      `;

      const amountEth = ethers.formatEther(event.amount);
      
      await client.query(insertSubscriptionQuery, [
        event.subscriptionId,
        event.subscriber,
        event.merchant,
        event.amount.toString(),
        amountEth,
        Number(event.interval),
        Number(event.timestamp),
        1,
        'ACTIVE',
        event.transactionHash,
        event.blockNumber,
        Number(event.timestamp)
      ]);

      await client.query('COMMIT');

      console.log(`✓ Subscription created: ${event.subscriptionId} | ${amountEth} ETH every ${Number(event.interval) / 86400} days`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error handling subscription creation:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async handleSubscriptionPayment(event: SubscriptionPaymentEvent, isHistorical: boolean = false) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const insertPaymentQuery = `
        INSERT INTO blockchain_subscription_payments (
          subscription_id,
          transaction_hash,
          block_number,
          amount_wei,
          amount_eth,
          payment_number,
          timestamp,
          status
        ) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7), $8)
        RETURNING id
      `;

      const amountEth = ethers.formatEther(event.amount);
      
      await client.query(insertPaymentQuery, [
        event.subscriptionId,
        event.transactionHash,
        event.blockNumber,
        event.amount.toString(),
        amountEth,
        Number(event.paymentNumber),
        Number(event.timestamp),
        'CONFIRMED'
      ]);

      const updateSubscriptionQuery = `
        UPDATE blockchain_subscriptions 
        SET 
          last_payment_timestamp = to_timestamp($1),
          payment_count = $2,
          updated_at = NOW()
        WHERE subscription_id = $3
      `;
      
      await client.query(updateSubscriptionQuery, [
        Number(event.timestamp),
        Number(event.paymentNumber),
        event.subscriptionId
      ]);

      await client.query('COMMIT');

      console.log(`✓ Subscription payment: ${event.subscriptionId} | Payment #${event.paymentNumber} | ${amountEth} ETH`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error handling subscription payment:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  private async handleSubscriptionCancelled(event: SubscriptionCancelledEvent, isHistorical: boolean = false) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const updateQuery = `
        UPDATE blockchain_subscriptions 
        SET 
          status = 'CANCELLED',
          cancelled_at = to_timestamp($1),
          cancelled_tx_hash = $2,
          updated_at = NOW()
        WHERE subscription_id = $3
      `;
      
      await client.query(updateQuery, [
        Number(event.timestamp),
        event.transactionHash,
        event.subscriptionId
      ]);

      await client.query('COMMIT');

      console.log(`✓ Subscription cancelled: ${event.subscriptionId}`);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error handling subscription cancellation:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getStatus() {
    return {
      isListening: this.isListening,
      contractAddress: CONTRACT_ADDRESS,
      rpcUrl: RPC_URL,
      currentBlock: await this.provider.getBlockNumber()
    };
  }
}

export const blockchainListener = new BlockchainListener();
