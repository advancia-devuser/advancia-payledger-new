import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthcareSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  plan: 'basic' | 'premium' | 'family' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'suspended';
  provider: string;
  policyNumber?: string;
  startDate: Date;
  renewalDate: Date;
  monthlyPremium: number;
  dependents: number;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

const HealthcareSubscriptionSchema = new Schema<IHealthcareSubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'family', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'suspended'],
    default: 'active'
  },
  provider: {
    type: String,
    required: true
  },
  policyNumber: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  monthlyPremium: {
    type: Number,
    required: true
  },
  dependents: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Index for user lookups
HealthcareSubscriptionSchema.index({ userId: 1 });

export default mongoose.model<IHealthcareSubscription>('HealthcareSubscription', HealthcareSubscriptionSchema);
