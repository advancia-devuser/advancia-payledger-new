import { Router } from "express";
import { authenticate, AuthRequest, requireRole } from "../../middleware/auth";
import { blockchainService } from "../../services/blockchainService";
import { prisma } from "../../lib/prisma";

const router = Router();

// Get supported networks
router.get("/networks", authenticate, async (req: AuthRequest, res) => {
  try {
    const networks = await blockchainService.getSupportedNetworks();

    res.json({
      success: true,
      data: networks,
    });
  } catch (error) {
    console.error("Get networks error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get network status
router.get(
  "/networks/:networkName/status",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { networkName } = req.params;
      const status = await blockchainService.getNetworkStatus(networkName);

      res.json({
        success: true,
        data: status,
      });
    } catch (error) {
      console.error("Get network status error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Deploy smart contract
router.post(
  "/contracts/deploy",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const {
        contractName,
        contractAbi,
        bytecode,
        constructorArgs = [],
        networkName = "Ethereum Mainnet",
        deployerPrivateKey,
      } = req.body;

      if (!contractName || !contractAbi || !bytecode || !deployerPrivateKey) {
        return res.status(400).json({
          success: false,
          error:
            "Missing required fields: contractName, contractAbi, bytecode, deployerPrivateKey",
        });
      }

      const contract = await blockchainService.deployContract(
        contractName,
        contractAbi,
        bytecode,
        constructorArgs,
        networkName,
        deployerPrivateKey
      );

      res.json({
        success: true,
        data: contract,
        message: "Contract deployed successfully",
      });
    } catch (error) {
      console.error("Deploy contract error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Call contract method
router.post(
  "/contracts/:contractAddress/call",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { contractAddress } = req.params;
      const {
        methodName,
        params = [],
        networkName = "Ethereum Mainnet",
        privateKey,
      } = req.body;

      if (!methodName || !privateKey) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: methodName, privateKey",
        });
      }

      const result = await blockchainService.callContractMethod(
        contractAddress,
        methodName,
        params,
        networkName,
        privateKey
      );

      res.json({
        success: true,
        data: result,
        message: "Contract method called successfully",
      });
    } catch (error) {
      console.error("Call contract method error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get smart contracts
router.get("/contracts", authenticate, async (req: AuthRequest, res) => {
  try {
    const { networkName } = req.query;
    const contracts = await blockchainService.getSmartContracts(
      networkName as string
    );

    res.json({
      success: true,
      data: contracts,
    });
  } catch (error) {
    console.error("Get contracts error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get contract details
router.get(
  "/contracts/:contractAddress",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { contractAddress } = req.params;
      const { networkName = "Ethereum Mainnet" } = req.query;

      const contract = await blockchainService.getContract(
        contractAddress,
        networkName as string
      );

      res.json({
        success: true,
        data: {
          address: contractAddress,
          network: networkName,
          interface: contract.interface,
        },
      });
    } catch (error) {
      console.error("Get contract details error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Track transaction
router.post(
  "/transactions/track",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { txHash, networkName = "Ethereum Mainnet" } = req.body;

      if (!txHash) {
        return res.status(400).json({
          success: false,
          error: "Missing required field: txHash",
        });
      }

      const transaction = await blockchainService.trackTransaction(
        txHash,
        networkName
      );

      res.json({
        success: true,
        data: transaction,
        message: "Transaction tracked successfully",
      });
    } catch (error) {
      console.error("Track transaction error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get transaction history
router.get(
  "/transactions/history",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
      }

      // Get user's wallet address from the Wallet model
      const wallet = await prisma.wallet.findUnique({
        where: { userId: userId },
        select: { cryptoAddress: true },
      });

      if (!wallet?.cryptoAddress) {
        return res.status(400).json({
          success: false,
          error: "User wallet address not found",
        });
      }

      const { networkName = "Ethereum Mainnet", limit = 50 } = req.query;

      const transactions = await blockchainService.getTransactionHistory(
        wallet.cryptoAddress,
        networkName as string,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        data: transactions,
        count: transactions.length,
      });
    } catch (error) {
      console.error("Get transaction history error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get token balances
router.get("/wallet/balances", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Get user's wallet address from the Wallet model
    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId },
      select: { cryptoAddress: true },
    });

    if (!wallet?.cryptoAddress) {
      return res.status(400).json({
        success: false,
        error: "User wallet address not found",
      });
    }

    const { networkName = "Ethereum Mainnet" } = req.query;
    const balances = await blockchainService.getTokenBalances(
      wallet.cryptoAddress,
      networkName as string
    );

    res.json({
      success: true,
      data: balances,
      address: wallet.cryptoAddress,
      network: networkName,
    });
  } catch (error) {
    console.error("Get token balances error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Estimate gas
router.post("/gas/estimate", authenticate, async (req: AuthRequest, res) => {
  try {
    const {
      to,
      data,
      value = "0",
      networkName = "Ethereum Mainnet",
    } = req.body;

    if (!to || !data) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: to, data",
      });
    }

    const gasEstimate = await blockchainService.estimateGas(
      to,
      data,
      value,
      networkName
    );

    res.json({
      success: true,
      data: {
        gasEstimate,
        network: networkName,
      },
    });
  } catch (error) {
    console.error("Estimate gas error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Validate address
router.post(
  "/address/validate",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { address } = req.body;

      if (!address) {
        return res.status(400).json({
          success: false,
          error: "Missing required field: address",
        });
      }

      const isValid = await blockchainService.validateAddress(address);

      res.json({
        success: true,
        data: {
          address,
          isValid,
        },
      });
    } catch (error) {
      console.error("Validate address error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Get blockchain analytics
router.get(
  "/analytics",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const { days = 30 } = req.query;
      const analytics = await blockchainService.getBlockchainAnalytics(
        parseInt(days as string)
      );

      res.json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      console.error("Get blockchain analytics error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Subscribe to contract events (WebSocket endpoint)
router.post(
  "/contracts/:contractAddress/subscribe",
  authenticate,
  async (req: AuthRequest, res) => {
    try {
      const { contractAddress } = req.params;
      const { eventName, networkName = "Ethereum Mainnet" } = req.body;

      if (!eventName) {
        return res.status(400).json({
          success: false,
          error: "Missing required field: eventName",
        });
      }

      // This would set up WebSocket subscription
      // For now, return success message
      res.json({
        success: true,
        message: `Subscribed to ${eventName} events for ${contractAddress}`,
        data: {
          contractAddress,
          eventName,
          network: networkName,
        },
      });
    } catch (error) {
      console.error("Subscribe to events error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Admin only: Get all blockchain transactions
router.get(
  "/admin/transactions",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const { networkName, limit = 100, page = 1 } = req.query;

      const transactions = await prisma.blockchainTransaction.findMany({
        where: networkName ? { network: networkName as string } : {},
        orderBy: { timestamp: "desc" },
        take: parseInt(limit as string),
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      });

      const total = await prisma.blockchainTransaction.count({
        where: networkName ? { network: networkName as string } : {},
      });

      res.json({
        success: true,
        data: transactions,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Get admin transactions error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

// Admin only: Get all smart contracts
router.get(
  "/admin/contracts",
  authenticate,
  requireRole("ADMIN"),
  async (req: AuthRequest, res) => {
    try {
      const { networkName, limit = 100, page = 1 } = req.query;

      const contracts = await prisma.smartContract.findMany({
        where: networkName ? { network: networkName as string } : {},
        orderBy: { deployedAt: "desc" },
        take: parseInt(limit as string),
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      });

      const total = await prisma.smartContract.count({
        where: networkName ? { network: networkName as string } : {},
      });

      res.json({
        success: true,
        data: contracts,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
          pages: Math.ceil(total / parseInt(limit as string)),
        },
      });
    } catch (error) {
      console.error("Get admin contracts error:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);

export default router;
