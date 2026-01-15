import { prisma } from "../lib/prisma";
import { ethers } from "ethers";

export interface SmartContract {
  id: string;
  address: string;
  name: string;
  description: string;
  network: string;
  abi: any;
  deployedAt: Date;
  isActive: boolean;
  creator: string;
  contractType: "ERC20" | "ERC721" | "ERC1155" | "CUSTOM";
}

export interface BlockchainTransaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: bigint;
  blockHash: string;
  transactionIndex: number;
  status: number; // 0 = failed, 1 = success
  timestamp: Date;
  network: string;
  contractAddress?: string | null;
  functionName?: string | null;
  functionParams?: any | null;
  userId?: string | null;
  transactionType:
    | "PAYMENT"
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "CONTRACT_CALL"
    | "TOKEN_TRANSFER";
  metadata?: Record<string, any> | null;
}

export interface TokenBalance {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  balance: string;
  decimals: number;
  formattedBalance: string;
  usdValue?: number;
  network: string;
}

export interface BlockchainNetwork {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: string;
  blockTime: number;
  isActive: boolean;
}

export class BlockchainService {
  private static instance: BlockchainService;
  private providers: Map<string, ethers.JsonRpcProvider> = new Map();
  private contracts: Map<string, ethers.Contract> = new Map();
  private networks: Map<string, BlockchainNetwork> = new Map();
  private monitoringStarted = false;
  private supportedNetworks: BlockchainNetwork[] = [
    {
      name: "Ethereum Mainnet",
      chainId: 1,
      rpcUrl:
        process.env.ETHEREUM_RPC_URL ||
        "https://mainnet.infura.io/v3/YOUR_PROJECT_ID",
      explorerUrl: "https://etherscan.io",
      nativeCurrency: "ETH",
      blockTime: 12000,
      isActive: true,
    },
    {
      name: "Polygon Mainnet",
      chainId: 137,
      rpcUrl: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      explorerUrl: "https://polygonscan.com",
      nativeCurrency: "MATIC",
      blockTime: 2000,
      isActive: true,
    },
    {
      name: "BSC Mainnet",
      chainId: 56,
      rpcUrl: process.env.BSC_RPC_URL || "https://bsc-dataseed1.binance.org",
      explorerUrl: "https://bscscan.com",
      nativeCurrency: "BNB",
      blockTime: 3000,
      isActive: true,
    },
    {
      name: "Arbitrum One",
      chainId: 42161,
      rpcUrl: process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc",
      explorerUrl: "https://arbiscan.io",
      nativeCurrency: "ETH",
      blockTime: 750,
      isActive: true,
    },
  ];

  private constructor() {
    this.initializeNetworks();
    this.startBlockMonitoring();
  }

  private hasPrismaModel(
    modelName: "smartContract" | "blockchainTransaction"
  ): boolean {
    const client: any = prisma as any;
    return Boolean(client && client[modelName]);
  }

  private isPlaceholderRpcUrl(rpcUrl: string): boolean {
    const url = rpcUrl.toLowerCase();
    return (
      url.includes("your_project_id") ||
      url.includes("your-infura-key") ||
      url.includes("infura.io/v3/your")
    );
  }

  static getInstance(): BlockchainService {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new BlockchainService();
    }
    return BlockchainService.instance;
  }

  private async initializeNetworks() {
    for (const network of this.supportedNetworks) {
      if (network.isActive) {
        try {
          if (!network.rpcUrl || this.isPlaceholderRpcUrl(network.rpcUrl)) {
            console.warn(
              `Skipping ${network.name} RPC initialization (RPC URL not configured). Set env var for this network to enable blockchain monitoring.`
            );
            continue;
          }

          const provider = new ethers.JsonRpcProvider(network.rpcUrl);
          this.providers.set(network.name, provider);
          this.networks.set(network.name, network);

          // Test connection
          await provider.getNetwork();
          console.log(`Connected to ${network.name}`);
        } catch (error) {
          console.error(`Failed to connect to ${network.name}:`, error);
        }
      }
    }
  }

  private startBlockMonitoring() {
    if (this.monitoringStarted) return;
    this.monitoringStarted = true;

    // Monitor new blocks every 15 seconds
    setInterval(async () => {
      await this.monitorNewBlocks();
    }, 15000);
  }

  private async monitorNewBlocks() {
    for (const [networkName, provider] of this.providers.entries()) {
      try {
        const latestBlock = await provider.getBlock("latest");

        // Process transactions in the latest block
        if (latestBlock && latestBlock.transactions.length > 0) {
          await this.processBlockTransactions(latestBlock, networkName);
        }
      } catch (error) {
        console.error(`Error monitoring blocks for ${networkName}:`, error);
      }
    }
  }

  private async processBlockTransactions(block: any, networkName: string) {
    const provider = this.providers.get(networkName);
    if (!provider) return;

    for (const txHash of block.transactions.slice(0, 10)) {
      // Process first 10 transactions
      try {
        const tx = await provider.getTransaction(txHash);
        const receipt = await provider.getTransactionReceipt(txHash);

        if (tx && receipt) {
          await this.storeTransaction(tx, receipt, networkName);
        }
      } catch (error) {
        console.error(`Error processing transaction ${txHash}:`, error);
      }
    }
  }

  private async storeTransaction(tx: any, receipt: any, networkName: string) {
    try {
      if (!this.hasPrismaModel("blockchainTransaction")) {
        // Prisma client might be missing the model (client not regenerated / migrations not applied)
        return;
      }

      // Check if transaction already exists
      const existingTx = await prisma.blockchainTransaction.findUnique({
        where: { hash: tx.hash },
      });

      if (existingTx) return;

      // Determine transaction type
      const transactionType = await this.determineTransactionType(
        tx,
        receipt,
        networkName
      );

      // Get block for timestamp
      const provider = this.providers.get(networkName);
      if (!provider) return;

      const block = await provider.getBlock(tx.blockNumber || 0);
      const timestamp = block ? new Date(block.timestamp * 1000) : new Date();

      // Store transaction in database
      await prisma.blockchainTransaction.create({
        data: {
          hash: tx.hash,
          from: tx.from,
          to: tx.to || "",
          value: tx.value.toString(),
          gasUsed: receipt.gasUsed.toString(),
          gasPrice: tx.gasPrice?.toString() || "0",
          blockNumber: tx.blockNumber ? BigInt(tx.blockNumber) : BigInt(0),
          blockHash: tx.blockHash || "",
          transactionIndex: receipt.index || 0,
          status: receipt.status ? 1 : 0,
          timestamp: timestamp,
          network: networkName,
          contractAddress: receipt.contractAddress || undefined,
          functionName: this.extractFunctionName(receipt) || undefined,
          functionParams: this.extractFunctionParams(receipt) || undefined,
          transactionType: transactionType as
            | "DEPOSIT"
            | "WITHDRAWAL"
            | "PAYMENT"
            | "CONTRACT_CALL"
            | "TOKEN_TRANSFER", // Type cast
          metadata:
            tx.gasLimit || tx.nonce || tx.data
              ? {
                  gasLimit: tx.gasLimit?.toString(),
                  nonce: tx.nonce,
                  data: tx.data,
                }
              : undefined,
        },
      });

      console.log(`Stored transaction: ${tx.hash} on ${networkName}`);
    } catch (error) {
      console.error("Error storing transaction:", error);
    }
  }

  private requirePrismaModelOrThrow(
    modelName: "smartContract" | "blockchainTransaction"
  ): void {
    if (!this.hasPrismaModel(modelName)) {
      throw new Error(
        `Prisma model '${modelName}' is not available. Run prisma generate/migrate to enable this feature.`
      );
    }
  }

  private async determineTransactionType(
    tx: any,
    receipt: any,
    networkName: string
  ): Promise<
    "PAYMENT" | "DEPOSIT" | "WITHDRAWAL" | "CONTRACT_CALL" | "TOKEN_TRANSFER"
  > {
    // Check if it's a contract deployment
    if (tx.creates) {
      return "CONTRACT_CALL";
    }

    // Check if it's a token transfer
    if (receipt.logs && receipt.logs.length > 0) {
      for (const log of receipt.logs) {
        if (
          log.topics &&
          log.topics[0] ===
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
        ) {
          return "TOKEN_TRANSFER";
        }
      }
    }

    // Check if it's a contract interaction
    if (receipt.contractAddress) {
      return "CONTRACT_CALL";
    }

    // Default to payment
    return "PAYMENT";
  }

  private extractFunctionName(receipt: any): string | undefined {
    // This would require ABI decoding - simplified for now
    return receipt.logs.length > 0 ? "contract_call" : undefined;
  }

  async deployContract(
    contractName: string,
    contractAbi: any,
    bytecode: string,
    constructorArgs: any[] = [],
    networkName: string = "Ethereum Mainnet",
    deployerPrivateKey: string
  ): Promise<SmartContract> {
    try {
      this.requirePrismaModelOrThrow("smartContract");

      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      const wallet = new ethers.Wallet(deployerPrivateKey, provider);
      const factory = new ethers.ContractFactory(contractAbi, bytecode, wallet);

      const contract = await factory.deploy(...constructorArgs);
      const deploymentReceipt = await contract.deploymentTransaction();

      const smartContract: SmartContract = {
        id: contract.target as string,
        address: contract.target as string,
        name: contractName,
        description: `Deployed ${contractName} contract`,
        network: networkName,
        abi: contractAbi,
        deployedAt: new Date(),
        isActive: true,
        creator: wallet.address,
        contractType: this.determineContractType(contractAbi),
      };

      // Store contract in database
      await prisma.smartContract.create({
        data: {
          id: smartContract.id,
          address: smartContract.address,
          name: smartContract.name,
          description: smartContract.description,
          network: smartContract.network,
          abi: JSON.stringify(smartContract.abi),
          deployedAt: smartContract.deployedAt,
          isActive: smartContract.isActive,
          creator: smartContract.creator,
          contractType: smartContract.contractType,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Cache contract instance
      this.contracts.set(
        smartContract.id,
        contract as unknown as ethers.Contract
      );

      console.log(
        `Contract deployed: ${smartContract.address} on ${networkName}`
      );
      return smartContract;
    } catch (error) {
      console.error("Error deploying contract:", error);
      throw error;
    }
  }

  async getContract(
    address: string,
    networkName: string
  ): Promise<ethers.Contract> {
    const cacheKey = `${address}-${networkName}`;

    // Return cached contract if exists
    if (this.contracts.has(cacheKey)) {
      return this.contracts.get(cacheKey)!;
    }

    const provider = this.providers.get(networkName);
    if (!provider) {
      throw new Error(`Network ${networkName} not supported`);
    }

    // Load contract from database (if available)
    if (!this.hasPrismaModel("smartContract")) {
      throw new Error(
        "Smart contract storage is not available (Prisma model missing). Run prisma generate/migrate."
      );
    }

    const contractData = await prisma.smartContract.findUnique({
      where: { address, network: networkName },
    });

    if (!contractData) {
      throw new Error(`Contract not found: ${address} on ${networkName}`);
    }

    const abi =
      typeof contractData.abi === "string"
        ? JSON.parse(contractData.abi)
        : contractData.abi;
    const contract = new ethers.Contract(address, abi, provider);
    this.contracts.set(cacheKey, contract);

    return contract;
  }

  async trackTransaction(
    txHash: string,
    networkName: string,
    metadata?: Record<string, any>
  ): Promise<BlockchainTransaction> {
    try {
      this.requirePrismaModelOrThrow("blockchainTransaction");

      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      const [tx, receipt] = await Promise.all([
        provider.getTransaction(txHash),
        provider.getTransactionReceipt(txHash),
      ]);

      if (!tx || !receipt) {
        throw new Error("Transaction not found");
      }

      const block = await provider.getBlock(tx.blockNumber || 0);
      if (!block) {
        throw new Error(`Block not found for transaction ${txHash}`);
      }

      const transactionType = await this.determineTransactionType(
        tx,
        receipt,
        networkName
      );

      const blockchainTx: BlockchainTransaction = {
        id: tx.hash,
        hash: tx.hash,
        from: tx.from,
        to: tx.to || "",
        value: tx.value.toString(),
        gasUsed: receipt.gasUsed.toString(),
        gasPrice: tx.gasPrice?.toString() || "0",
        blockNumber: tx.blockNumber ? BigInt(tx.blockNumber) : BigInt(0),
        blockHash: tx.blockHash || "",
        transactionIndex: receipt.index || 0,
        status: receipt.status ? 1 : 0,
        timestamp: new Date(block.timestamp * 1000),
        network: networkName,
        contractAddress: receipt.contractAddress || undefined,
        functionName: this.extractFunctionName(receipt),
        functionParams: this.extractFunctionParams(receipt),
        transactionType: transactionType as
          | "DEPOSIT"
          | "WITHDRAWAL"
          | "PAYMENT"
          | "CONTRACT_CALL"
          | "TOKEN_TRANSFER",
        metadata: metadata || {},
      };

      // Store in database
      await prisma.blockchainTransaction.upsert({
        where: { hash: tx.hash },
        update: {
          status: blockchainTx.status,
          blockNumber: blockchainTx.blockNumber,
          timestamp: blockchainTx.timestamp,
          metadata: blockchainTx.metadata || undefined,
        },
        create: {
          hash: blockchainTx.hash,
          from: blockchainTx.from,
          to: blockchainTx.to,
          value: blockchainTx.value,
          gasUsed: blockchainTx.gasUsed,
          gasPrice: blockchainTx.gasPrice,
          blockNumber: blockchainTx.blockNumber,
          blockHash: blockchainTx.blockHash,
          transactionIndex: blockchainTx.transactionIndex,
          status: blockchainTx.status,
          timestamp: blockchainTx.timestamp,
          network: blockchainTx.network,
          contractAddress: blockchainTx.contractAddress || undefined,
          functionName: blockchainTx.functionName || undefined,
          functionParams: blockchainTx.functionParams || undefined,
          transactionType: blockchainTx.transactionType,
          metadata: blockchainTx.metadata || undefined,
          userId: blockchainTx.userId || undefined,
        },
      });

      return blockchainTx;
    } catch (error) {
      console.error("Error tracking transaction:", error);
      throw error;
    }
  }

  async getTransactionHistory(
    userAddress: string,
    networkName?: string,
    limit: number = 50
  ): Promise<BlockchainTransaction[]> {
    try {
      if (!this.hasPrismaModel("blockchainTransaction")) {
        return [];
      }

      const transactions = await prisma.blockchainTransaction.findMany({
        where: {
          OR: [{ from: userAddress }, { to: userAddress }],
          ...(networkName ? { network: networkName } : {}),
        },
        orderBy: { timestamp: "desc" },
        take: limit,
      });

      return transactions.map((tx: any) => ({
        id: tx.id,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        blockNumber: tx.blockNumber as unknown as bigint,
        blockHash: tx.blockHash,
        transactionIndex: tx.transactionIndex,
        status: tx.status,
        timestamp: tx.timestamp,
        network: tx.network,
        contractAddress: tx.contractAddress || undefined,
        functionName: tx.functionName || undefined,
        functionParams: tx.functionParams || undefined,
        transactionType: tx.transactionType as
          | "PAYMENT"
          | "DEPOSIT"
          | "WITHDRAWAL"
          | "CONTRACT_CALL"
          | "TOKEN_TRANSFER",
        metadata: tx.metadata
          ? (tx.metadata as Record<string, any>)
          : undefined,
      }));
    } catch (error) {
      console.error("Error getting transaction history:", error);
      return [];
    }
  }

  async getAnalytics(days: number = 30): Promise<any> {
    try {
      if (
        !this.hasPrismaModel("blockchainTransaction") ||
        !this.hasPrismaModel("smartContract")
      ) {
        return {
          totalTransactions: 0,
          totalContracts: 0,
          networkStats: [],
          periodDays: days,
          note: "Analytics unavailable (Prisma models missing).",
        };
      }

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [totalTransactions, totalContracts, networkStats] =
        await Promise.all([
          prisma.blockchainTransaction.count({
            where: {
              timestamp: { gte: startDate },
            },
          }),
          prisma.smartContract.count({
            where: {
              deployedAt: { gte: startDate },
            },
          }),
          prisma.blockchainTransaction.groupBy({
            by: ["network"],
            where: {
              timestamp: { gte: startDate },
            },
            _count: { network: true },
          }),
        ]);

      return {
        totalTransactions,
        totalContracts,
        networkStats: networkStats.map((stat: any) => ({
          network: stat.network,
          transactions: stat._count.network,
        })),
        period: `${days} days`,
      };
    } catch (error) {
      console.error("Error getting blockchain analytics:", error);
      return null;
    }
  }

  // Added missing methods

  getSupportedNetworks(): BlockchainNetwork[] {
    return Array.from(this.networks.values());
  }

  async getNetworkStatus(networkName: string): Promise<any> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      const [network, blockNumber, gasPrice] = await Promise.all([
        provider.getNetwork(),
        provider.getBlockNumber(),
        provider.getFeeData(),
      ]);

      return {
        name: networkName,
        chainId: network.chainId,
        blockNumber,
        gasPrice: gasPrice.gasPrice?.toString() || "0",
        maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas?.toString() || "0",
        maxFeePerGas: gasPrice.maxFeePerGas?.toString() || "0",
        isConnected: true,
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.error(`Error getting network status for ${networkName}:`, error);
      return {
        name: networkName,
        isConnected: false,
        error: error instanceof Error ? error.message : "Unknown error",
        lastUpdated: new Date(),
      };
    }
  }

  async callContractMethod(
    contractAddress: string,
    methodName: string,
    params: any[] = [],
    networkName: string = "Ethereum Mainnet",
    privateKey?: string
  ): Promise<any> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      const contract = await this.getContract(contractAddress, networkName);

      // Read-only call (no private key provided)
      if (!privateKey) {
        return await contract[methodName](...params);
      }

      // Transaction call (with private key)
      const wallet = new ethers.Wallet(privateKey, provider);
      const contractWithSigner = contract.connect(wallet);

      const tx = await contractWithSigner[
        methodName as keyof typeof contractWithSigner
      ](...params);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        events: receipt.logs,
      };
    } catch (error) {
      console.error(`Error calling contract method ${methodName}:`, error);
      throw error;
    }
  }

  async getSmartContracts(networkName?: string): Promise<SmartContract[]> {
    try {
      if (!this.hasPrismaModel("smartContract")) {
        return [];
      }

      const contracts = await prisma.smartContract.findMany({
        where: networkName ? { network: networkName } : {},
        orderBy: { deployedAt: "desc" },
      });

      return contracts.map((contract: any) => ({
        id: contract.id,
        address: contract.address,
        name: contract.name,
        description: contract.description,
        network: contract.network,
        abi:
          typeof contract.abi === "string"
            ? JSON.parse(contract.abi)
            : contract.abi,
        deployedAt: contract.deployedAt,
        isActive: contract.isActive,
        creator: contract.creator,
        contractType: contract.contractType as
          | "ERC20"
          | "ERC721"
          | "ERC1155"
          | "CUSTOM",
      }));
    } catch (error) {
      console.error("Error getting smart contracts:", error);
      return [];
    }
  }

  async getTokenBalances(
    address: string,
    networkName: string
  ): Promise<TokenBalance[]> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      // For a real implementation, you would need to query token contracts
      // This is a simplified version that returns native token balance only
      const balance = await provider.getBalance(address);

      const network = this.networks.get(networkName);
      if (!network) {
        throw new Error(
          `Network ${networkName} not found in network configuration`
        );
      }

      return [
        {
          tokenAddress: "0x0000000000000000000000000000000000000000", // Native token
          tokenSymbol: network.nativeCurrency,
          tokenName: `${network.nativeCurrency} (Native)`,
          balance: balance.toString(),
          decimals: 18,
          formattedBalance: ethers.formatEther(balance),
          network: networkName,
        },
      ];
    } catch (error) {
      console.error(`Error getting token balances for ${address}:`, error);
      return [];
    }
  }

  async estimateGas(
    to: string,
    data: string,
    value: string = "0",
    networkName: string = "Ethereum Mainnet"
  ): Promise<string> {
    try {
      const provider = this.providers.get(networkName);
      if (!provider) {
        throw new Error(`Network ${networkName} not supported`);
      }

      const gasEstimate = await provider.estimateGas({
        to,
        data,
        value: ethers.parseEther(value),
      });

      return gasEstimate.toString();
    } catch (error) {
      console.error("Error estimating gas:", error);
      throw error;
    }
  }

  validateAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }

  async getBlockchainAnalytics(days: number = 30): Promise<any> {
    return this.getAnalytics(days);
  }

  extractFunctionParams(receipt: any): any {
    // This would require ABI decoding - simplified for now
    if (!receipt || !receipt.logs || receipt.logs.length === 0) {
      return {};
    }

    // Simple extraction of basic parameters
    return {
      logCount: receipt.logs.length,
      topics: receipt.logs.flatMap((log: any) => log.topics),
    };
  }

  determineContractType(abi: any): "ERC20" | "ERC721" | "ERC1155" | "CUSTOM" {
    if (!abi || !Array.isArray(abi)) {
      return "CUSTOM";
    }

    // Check for ERC20 interface
    const erc20Functions = [
      "transfer",
      "transferFrom",
      "approve",
      "allowance",
      "balanceOf",
      "totalSupply",
    ];
    const hasERC20 = erc20Functions.every((fn) =>
      abi.some((item) => item.type === "function" && item.name === fn)
    );

    if (hasERC20) return "ERC20";

    // Check for ERC721 interface
    const erc721Functions = [
      "ownerOf",
      "safeTransferFrom",
      "transferFrom",
      "approve",
      "getApproved",
    ];
    const hasERC721 = erc721Functions.every((fn) =>
      abi.some((item) => item.type === "function" && item.name === fn)
    );

    if (hasERC721) return "ERC721";

    // Check for ERC1155 interface
    const erc1155Functions = [
      "balanceOfBatch",
      "safeBatchTransferFrom",
      "safeTransferFrom",
      "setApprovalForAll",
    ];
    const hasERC1155 = erc1155Functions.every((fn) =>
      abi.some((item) => item.type === "function" && item.name === fn)
    );

    if (hasERC1155) return "ERC1155";

    return "CUSTOM";
  }
}

export const blockchainService = BlockchainService.getInstance();
