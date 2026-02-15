import mongoose, { Document, Schema } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'crypto' | 'fiat';
  currency: string;
  address?: string;
  balance: number;
  privateKeyEncrypted?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['crypto', 'fiat'],
    required: true
  },
  currency: {
    type: String,
    required: true,
    uppercase: true
  },
  address: {
    type: String,
    trim: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  privateKeyEncrypted: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// Index for fast lookups
WalletSchema.index({ userId: 1, currency: 1 });

export default mongoose.model<IWallet>('Wallet', WalletSchema);
