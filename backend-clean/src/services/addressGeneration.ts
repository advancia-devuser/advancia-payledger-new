import { randomBytes, createHash } from 'crypto';
import { logger } from '../middleware/errorHandler';

export class AddressGenerationService {
  private generatedAddresses: Map<string, GeneratedAddress> = new Map();

  async generateAddress(params: {
    userId: string;
    network: 'ethereum' | 'bitcoin' | 'tron' | 'polygon' | 'bsc';
    purpose: 'deposit' | 'internal' | 'external';
  }): Promise<GeneratedAddress> {
    try {
      const addressId = this.generateUniqueId();
      const address = await this.createAddress(params.network);
      
      const generatedAddress: GeneratedAddress = {
        id: addressId,
        userId: params.userId,
        network: params.network,
        address: address.address,
        privateKey: address.privateKey,
        publicKey: address.publicKey,
        purpose: params.purpose,
        isActive: true,
        createdAt: new Date(),
        lastUsed: null,
        balance: '0',
      };

      this.generatedAddresses.set(addressId, generatedAddress);
      
      logger.info('Address generated', {
        userId: params.userId,
        network: params.network,
        address: address.address,
      });

      return generatedAddress;
    } catch (error) {
      logger.error(error as Error, { userId: params.userId, network: params.network });
      throw new Error(`Failed to generate address: ${(error as Error).message}`);
    }
  }

  async generateMultipleAddresses(params: {
    userId: string;
    networks: Array<'ethereum' | 'bitcoin' | 'tron' | 'polygon' | 'bsc'>;
    purpose: 'deposit' | 'internal' | 'external';
  }): Promise<GeneratedAddress[]> {
    const addresses: GeneratedAddress[] = [];
    
    for (const network of params.networks) {
      const address = await this.generateAddress({
        userId: params.userId,
        network,
        purpose: params.purpose,
      });
      addresses.push(address);
    }

    return addresses;
  }

  private async createAddress(network: string): Promise<{
    address: string;
    privateKey: string;
    publicKey: string;
  }> {
    const privateKey = this.generatePrivateKey();
    const publicKey = this.derivePublicKey(privateKey);
    const address = this.deriveAddress(publicKey, network);

    return { address, privateKey, publicKey };
  }

  private generatePrivateKey(): string {
    return randomBytes(32).toString('hex');
  }

  private derivePublicKey(privateKey: string): string {
    const hash = createHash('sha256').update(privateKey).digest('hex');
    return hash;
  }

  private deriveAddress(publicKey: string, network: string): string {
    const hash = createHash('sha256').update(publicKey).digest('hex');
    
    switch (network) {
      case 'ethereum':
      case 'polygon':
      case 'bsc':
        return '0x' + hash.substring(0, 40);
      case 'bitcoin':
        return '1' + hash.substring(0, 33);
      case 'tron':
        return 'T' + hash.substring(0, 33);
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  private generateUniqueId(): string {
    return `addr_${Date.now()}_${randomBytes(8).toString('hex')}`;
  }

  getAddress(addressId: string): GeneratedAddress | undefined {
    return this.generatedAddresses.get(addressId);
  }

  getUserAddresses(userId: string): GeneratedAddress[] {
    return Array.from(this.generatedAddresses.values()).filter(
      addr => addr.userId === userId && addr.isActive
    );
  }

  async deactivateAddress(addressId: string): Promise<boolean> {
    const address = this.generatedAddresses.get(addressId);
    if (address) {
      address.isActive = false;
      return true;
    }
    return false;
  }

  async updateBalance(addressId: string, balance: string): Promise<void> {
    const address = this.generatedAddresses.get(addressId);
    if (address) {
      address.balance = balance;
      address.lastUsed = new Date();
    }
  }

  validateAddress(address: string, network: string): boolean {
    switch (network) {
      case 'ethereum':
      case 'polygon':
      case 'bsc':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      case 'bitcoin':
        return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || 
               /^bc1[a-z0-9]{39,59}$/.test(address);
      case 'tron':
        return /^T[a-zA-Z0-9]{33}$/.test(address);
      default:
        return false;
    }
  }
}

interface GeneratedAddress {
  id: string;
  userId: string;
  network: string;
  address: string;
  privateKey: string;
  publicKey: string;
  purpose: 'deposit' | 'internal' | 'external';
  isActive: boolean;
  createdAt: Date;
  lastUsed: Date | null;
  balance: string;
}

export const addressGeneration = new AddressGenerationService();
