import bcrypt from 'bcryptjs';
import { store } from './store';

const shouldSeed = () => {
  const flag = (process.env.DEMO_SEED || '').toLowerCase();
  if (flag === '1' || flag === 'true' || flag === 'yes') return true;
  return false;
};

export const seedDemoDataIfNeeded = async () => {
  if (!shouldSeed()) return;

  const stats = store.getStats();
  if (stats.users > 0) return;

  const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@advancia.local';
  const demoPassword = process.env.DEMO_USER_PASSWORD || 'Demo12345!';
  const hashedPassword = await bcrypt.hash(demoPassword, 12);

  const demoUser = store.createUser({
    email: demoEmail,
    password: hashedPassword,
    firstName: 'Demo',
    lastName: 'User',
    phoneNumber: '+1-000-000-0000',
    kycVerified: true,
    twoFactorEnabled: false,
    avatar: undefined
  });

  const btcWallet = store.createWallet({
    userId: demoUser.id,
    type: 'crypto',
    currency: 'BTC',
    address: 'bc1qdemoaddress000000000000000000000000000',
    balance: 0.125
  });

  const ethWallet = store.createWallet({
    userId: demoUser.id,
    type: 'crypto',
    currency: 'ETH',
    address: '0xDEMO000000000000000000000000000000000000',
    balance: 2.5
  });

  const usdWallet = store.createWallet({
    userId: demoUser.id,
    type: 'fiat',
    currency: 'USD',
    balance: 1500
  });

  store.createTransaction({
    userId: demoUser.id,
    type: 'receive',
    currency: 'BTC',
    amount: 0.05,
    fee: 0,
    status: 'completed',
    fromAddress: 'bc1qexternal0000000000000000000000000000000',
    toAddress: btcWallet.address,
    txHash: 'demo_tx_btc_receive',
    metadata: { note: 'Demo deposit' }
  });

  store.createTransaction({
    userId: demoUser.id,
    type: 'send',
    currency: 'ETH',
    amount: 0.2,
    fee: 0.002,
    status: 'completed',
    fromAddress: ethWallet.address,
    toAddress: '0xEXTERNAL00000000000000000000000000000000',
    txHash: 'demo_tx_eth_send',
    metadata: { note: 'Demo payout' }
  });

  store.createTransaction({
    userId: demoUser.id,
    type: 'payment',
    currency: 'USD',
    amount: 49.99,
    fee: 0,
    status: 'completed',
    metadata: { merchant: 'Advancia Demo', reference: 'INV-DEMO-0001' }
  });

  const startDate = new Date();
  const renewalDate = new Date();
  renewalDate.setFullYear(renewalDate.getFullYear() + 1);

  store.createHealthcare({
    userId: demoUser.id,
    plan: 'premium',
    provider: 'Advancia Demo Provider',
    monthlyPremium: 199,
    dependents: 1,
    startDate,
    renewalDate,
    status: 'active',
    policyNumber: 'DEMO-POLICY-0001'
  });

  store.updateWalletBalance(usdWallet.id, -49.99);
  store.updateWalletBalance(ethWallet.id, -(0.2 + 0.002));

  const seededStats = store.getStats();
  // eslint-disable-next-line no-console
  console.log(
    `🌱 Demo data seeded: users=${seededStats.users}, wallets=${seededStats.wallets}, transactions=${seededStats.transactions}, healthcare=${seededStats.healthcare}`
  );
};
