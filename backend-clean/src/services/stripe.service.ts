import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    })
  : null;

export class StripeService {

  /**
   * Check if Stripe is configured
   */
  isConfigured(): boolean {
    return stripe !== null;
  }

  /**
   * Create virtual card for user
   */
  async createVirtualCard(userId: string, amount: number) {
    if (!stripe) {
      throw new Error('Stripe is not configured. Add STRIPE_SECRET_KEY to .env');
    }

    try {
      // Create Stripe Issuing cardholder first
      const cardholder = await stripe.issuing.cardholders.create({
        name: `User ${userId}`,
        email: `user${userId}@advancia.com`, // Replace with actual email
        phone_number: '+18888675309', // Replace with actual phone
        billing: {
          address: {
            line1: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            postal_code: '94111',
            country: 'US',
          },
        },
        type: 'individual',
      });

      // Create virtual card
      const card = await stripe.issuing.cards.create({
        cardholder: cardholder.id,
        type: 'virtual',
        currency: 'usd',
        status: 'active',
        spending_controls: {
          spending_limits: [{
            amount: Math.round(amount * 100), // Convert to cents
            interval: 'all_time',
          }],
        },
        metadata: {
          userId,
        },
      });

      return {
        id: card.id,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        brand: card.brand,
        status: card.status,
        cardholderId: cardholder.id,
      };
    } catch (error: any) {
      console.error('Stripe card creation error:', error);
      throw new Error(`Failed to create virtual card: ${error.message}`);
    }
  }

  /**
   * Get card details
   */
  async getCard(cardId: string) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    try {
      const card = await stripe.issuing.cards.retrieve(cardId);

      return {
        id: card.id,
        last4: card.last4,
        expMonth: card.exp_month,
        expYear: card.exp_year,
        brand: card.brand,
        status: card.status,
        spendingLimit: card.spending_controls?.spending_limits?.[0]?.amount || 0,
      };
    } catch (error: any) {
      console.error('Stripe card retrieval error:', error);
      throw new Error(`Failed to retrieve card: ${error.message}`);
    }
  }

  /**
   * Update card spending limit (fund card)
   */
  async updateCardLimit(cardId: string, newAmount: number) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    try {
      const card = await stripe.issuing.cards.update(cardId, {
        spending_controls: {
          spending_limits: [{
            amount: Math.round(newAmount * 100),
            interval: 'all_time',
          }],
        },
      });

      return {
        success: true,
        cardId: card.id,
        newLimit: card.spending_controls?.spending_limits?.[0]?.amount || 0,
      };
    } catch (error: any) {
      console.error('Stripe card update error:', error);
      throw new Error(`Failed to update card limit: ${error.message}`);
    }
  }

  /**
   * Freeze/unfreeze card
   */
  async setCardStatus(cardId: string, active: boolean) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    try {
      const card = await stripe.issuing.cards.update(cardId, {
        status: active ? 'active' : 'inactive',
      });

      return {
        success: true,
        cardId: card.id,
        status: card.status,
      };
    } catch (error: any) {
      console.error('Stripe card status update error:', error);
      throw new Error(`Failed to update card status: ${error.message}`);
    }
  }

  /**
   * Get card transactions
   */
  async getCardTransactions(cardId: string, limit: number = 10) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    try {
      const transactions = await stripe.issuing.transactions.list({
        card: cardId,
        limit,
      });

      return transactions.data.map(tx => ({
        id: tx.id,
        amount: tx.amount / 100,
        currency: tx.currency,
        merchant: tx.merchant_data.name,
        status: tx.type,
        created: new Date(tx.created * 1000).toISOString(),
      }));
    } catch (error: any) {
      console.error('Stripe transactions retrieval error:', error);
      throw new Error(`Failed to retrieve transactions: ${error.message}`);
    }
  }

  /**
   * Handle Stripe webhook
   */
  async handleWebhook(payload: any, signature: string) {
    if (!stripe) {
      throw new Error('Stripe is not configured');
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      switch (event.type) {
        case 'issuing_authorization.created':
          console.log('Card authorization created:', event.data.object);
          // TODO: Record transaction attempt
          break;
        case 'issuing_authorization.updated':
          console.log('Card authorization updated:', event.data.object);
          // TODO: Update transaction status
          break;
        case 'issuing_transaction.created':
          console.log('Card transaction created:', event.data.object);
          // TODO: Record completed transaction
          break;
        case 'issuing_card.created':
          console.log('Card created:', event.data.object);
          break;
        case 'issuing_card.updated':
          console.log('Card updated:', event.data.object);
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }

      return { received: true, type: event.type };
    } catch (error: any) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
