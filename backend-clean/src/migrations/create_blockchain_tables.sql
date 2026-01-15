-- Blockchain Payments Table
CREATE TABLE IF NOT EXISTS blockchain_payments (
    id SERIAL PRIMARY KEY,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number INTEGER NOT NULL,
    payer_address VARCHAR(42) NOT NULL,
    merchant_address VARCHAR(42) NOT NULL,
    amount_wei VARCHAR(78) NOT NULL,
    amount_eth DECIMAL(36, 18) NOT NULL,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('ONE_TIME', 'SUBSCRIPTION')),
    order_id VARCHAR(255),
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blockchain_payments_tx_hash ON blockchain_payments(transaction_hash);
CREATE INDEX idx_blockchain_payments_payer ON blockchain_payments(payer_address);
CREATE INDEX idx_blockchain_payments_merchant ON blockchain_payments(merchant_address);
CREATE INDEX idx_blockchain_payments_order_id ON blockchain_payments(order_id);
CREATE INDEX idx_blockchain_payments_timestamp ON blockchain_payments(timestamp);

-- Blockchain Subscriptions Table
CREATE TABLE IF NOT EXISTS blockchain_subscriptions (
    id SERIAL PRIMARY KEY,
    subscription_id VARCHAR(255) UNIQUE NOT NULL,
    subscriber_address VARCHAR(42) NOT NULL,
    merchant_address VARCHAR(42) NOT NULL,
    amount_wei VARCHAR(78) NOT NULL,
    amount_eth DECIMAL(36, 18) NOT NULL,
    interval_seconds INTEGER NOT NULL,
    last_payment_timestamp TIMESTAMP NOT NULL,
    payment_count INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED')),
    created_tx_hash VARCHAR(66) NOT NULL,
    created_block_number INTEGER NOT NULL,
    cancelled_tx_hash VARCHAR(66),
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_blockchain_subscriptions_sub_id ON blockchain_subscriptions(subscription_id);
CREATE INDEX idx_blockchain_subscriptions_subscriber ON blockchain_subscriptions(subscriber_address);
CREATE INDEX idx_blockchain_subscriptions_merchant ON blockchain_subscriptions(merchant_address);
CREATE INDEX idx_blockchain_subscriptions_status ON blockchain_subscriptions(status);

-- Blockchain Subscription Payments Table
CREATE TABLE IF NOT EXISTS blockchain_subscription_payments (
    id SERIAL PRIMARY KEY,
    subscription_id VARCHAR(255) NOT NULL,
    transaction_hash VARCHAR(66) UNIQUE NOT NULL,
    block_number INTEGER NOT NULL,
    amount_wei VARCHAR(78) NOT NULL,
    amount_eth DECIMAL(36, 18) NOT NULL,
    payment_number INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (subscription_id) REFERENCES blockchain_subscriptions(subscription_id) ON DELETE CASCADE
);

CREATE INDEX idx_blockchain_sub_payments_sub_id ON blockchain_subscription_payments(subscription_id);
CREATE INDEX idx_blockchain_sub_payments_tx_hash ON blockchain_subscription_payments(transaction_hash);
CREATE INDEX idx_blockchain_sub_payments_timestamp ON blockchain_subscription_payments(timestamp);

-- Add blockchain fields to existing orders table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='orders' AND column_name='blockchain_tx_hash') THEN
        ALTER TABLE orders ADD COLUMN blockchain_tx_hash VARCHAR(66);
        CREATE INDEX idx_orders_blockchain_tx ON orders(blockchain_tx_hash);
    END IF;
END $$;

COMMENT ON TABLE blockchain_payments IS 'Stores all blockchain payment transactions';
COMMENT ON TABLE blockchain_subscriptions IS 'Stores blockchain subscription information';
COMMENT ON TABLE blockchain_subscription_payments IS 'Stores individual subscription payment transactions';
