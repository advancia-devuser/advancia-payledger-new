// In-memory data store (no database required)
// Data resets when server restarts

interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  kycVerified: boolean;
  twoFactorEnabled: boolean;
  role: "user" | "admin";
  loginCount: number;
  lastLoginAt?: Date;
  createdAt: Date;
}

interface Wallet {
  id: string;
  userId: string;
  type: "crypto" | "fiat";
  currency: string;
  address?: string;
  balance: number;
  createdAt: Date;
}

interface Transaction {
  id: string;
  userId: string;
  type: "send" | "receive" | "swap" | "payment" | "healthcare";
  currency: string;
  amount: number;
  fee: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  fromAddress?: string;
  toAddress?: string;
  txHash?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface HealthcareSubscription {
  id: string;
  userId: string;
  plan: "basic" | "premium" | "family" | "enterprise";
  status: "active" | "inactive" | "cancelled" | "suspended";
  provider: string;
  policyNumber?: string;
  startDate: Date;
  renewalDate: Date;
  monthlyPremium: number;
  dependents: number;
  createdAt: Date;
}

class InMemoryStore {
  private users: Map<string, User> = new Map();
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private healthcare: Map<string, HealthcareSubscription> = new Map();
  private idCounter = 1;

  generateId(): string {
    return (this.idCounter++).toString().padStart(24, "0");
  }

  // User operations
  createUser(data: Omit<User, "id" | "createdAt">): User {
    const user: User = {
      ...data,
      role: data.role || "user",
      loginCount: data.loginCount || 0,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(id: string, data: Partial<User>): User | undefined {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  // Wallet operations
  createWallet(data: Omit<Wallet, "id" | "createdAt">): Wallet {
    const wallet: Wallet = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  findWalletsByUser(userId: string): Wallet[] {
    return Array.from(this.wallets.values()).filter((w) => w.userId === userId);
  }

  findWallet(userId: string, currency: string): Wallet | undefined {
    return Array.from(this.wallets.values()).find(
      (w) =>
        w.userId === userId &&
        w.currency.toUpperCase() === currency.toUpperCase(),
    );
  }

  updateWalletBalance(id: string, amount: number): Wallet | undefined {
    const wallet = this.wallets.get(id);
    if (!wallet) return undefined;
    wallet.balance += amount;
    this.wallets.set(id, wallet);
    return wallet;
  }

  // Transaction operations
  createTransaction(
    data: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ): Transaction {
    const transaction: Transaction = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }

  findTransactionsByUser(
    userId: string,
    filters?: { status?: string; type?: string },
  ): Transaction[] {
    let txs = Array.from(this.transactions.values()).filter(
      (t) => t.userId === userId,
    );

    if (filters?.status) {
      txs = txs.filter((t) => t.status === filters.status);
    }
    if (filters?.type) {
      txs = txs.filter((t) => t.type === filters.type);
    }

    return txs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  findTransactionById(id: string, userId: string): Transaction | undefined {
    const tx = this.transactions.get(id);
    if (!tx || tx.userId !== userId) return undefined;
    return tx;
  }

  updateTransaction(
    id: string,
    data: Partial<Transaction>,
  ): Transaction | undefined {
    const tx = this.transactions.get(id);
    if (!tx) return undefined;
    const updated = { ...tx, ...data, updatedAt: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  // Healthcare operations
  createHealthcare(
    data: Omit<HealthcareSubscription, "id" | "createdAt">,
  ): HealthcareSubscription {
    const subscription: HealthcareSubscription = {
      ...data,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.healthcare.set(subscription.id, subscription);
    return subscription;
  }

  findHealthcareByUser(userId: string): HealthcareSubscription[] {
    return Array.from(this.healthcare.values()).filter(
      (h) => h.userId === userId,
    );
  }

  // Stats
  getStats() {
    return {
      users: this.users.size,
      wallets: this.wallets.size,
      transactions: this.transactions.size,
      healthcare: this.healthcare.size,
    };
  }

  // Admin methods
  getAllUsers(): User[] {
    return Array.from(this.users.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  incrementUserLogin(userId: string): User | undefined {
    const user = this.users.get(userId);
    if (!user) return undefined;
    const updated = {
      ...user,
      loginCount: user.loginCount + 1,
      lastLoginAt: new Date(),
    };
    this.users.set(userId, updated);
    return updated;
  }

  getUserStats() {
    const users = Array.from(this.users.values());
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      regularUsers: users.filter((u) => u.role === "user").length,
      withKyc: users.filter((u) => u.kycVerified).length,
      with2fa: users.filter((u) => u.twoFactorEnabled).length,
      totalLogins: users.reduce((sum, u) => sum + u.loginCount, 0),
      recentLogins: users.filter(
        (u) =>
          u.lastLoginAt &&
          Date.now() - u.lastLoginAt.getTime() < 24 * 60 * 60 * 1000,
      ).length,
    };
  }
}

// Export singleton instance
export const store = new InMemoryStore();
