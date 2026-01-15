const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying AdvanciaSubscription contract...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Deploy the contract
  const AdvanciaSubscription = await ethers.getContractFactory("AdvanciaSubscription");
  const subscription = await AdvanciaSubscription.deploy();

  // Wait for deployment
  await subscription.deployed();

  console.log("✅ AdvanciaSubscription deployed to:", subscription.address);
  console.log("🔗 Transaction hash:", subscription.deployTransaction.hash);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("📡 Network:", network.name, "| Chain ID:", network.chainId);

  // Display tier configurations
  console.log("\n📋 Initial Tier Configurations:");

  const basicConfig = await subscription.getTierConfig(0); // BASIC
  const premiumConfig = await subscription.getTierConfig(1); // PREMIUM
  const enterpriseConfig = await subscription.getTierConfig(2); // ENTERPRISE

  console.log("Basic:", {
    price: ethers.utils.formatEther(basicConfig.price) + " ETH",
    duration: basicConfig.duration.toString() + " seconds",
    active: basicConfig.active,
  });

  console.log("Premium:", {
    price: ethers.utils.formatEther(premiumConfig.price) + " ETH",
    duration: premiumConfig.duration.toString() + " seconds",
    active: premiumConfig.active,
  });

  console.log("Enterprise:", {
    price: ethers.utils.formatEther(enterpriseConfig.price) + " ETH",
    duration: enterpriseConfig.duration.toString() + " seconds",
    active: enterpriseConfig.active,
  });

  // Save deployment info
  const deploymentInfo = {
    contractAddress: subscription.address,
    deployerAddress: deployer.address,
    transactionHash: subscription.deployTransaction.hash,
    network: network.name,
    chainId: network.chainId,
    deployedAt: new Date().toISOString(),
    gasUsed: subscription.deployTransaction.gasLimit?.toString(),
    gasPrice: subscription.deployTransaction.gasPrice?.toString(),
  };

  console.log("\n💾 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Verify contract on Etherscan (if not local network)
  if (network.chainId !== 1337 && network.chainId !== 31337) {
    console.log("\n⏳ Waiting for block confirmations...");
    await subscription.deployTransaction.wait(6);

    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: subscription.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("📝 Add this to your .env file:");
  console.log(`SUBSCRIPTION_CONTRACT_ADDRESS=${subscription.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
