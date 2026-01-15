const { ethers } = require("hardhat");

async function main() {
  console.log("🔗 Interacting with AdvanciaSubscription contract...");

  // Contract address (update this after deployment)
  const contractAddress =
    process.env.SUBSCRIPTION_CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  // Get contract instance
  const AdvanciaSubscription = await ethers.getContractFactory("AdvanciaSubscription");
  const subscription = AdvanciaSubscription.attach(contractAddress);

  // Get signers
  const [owner, user1, user2] = await ethers.getSigners();

  console.log("Contract address:", contractAddress);
  console.log("Owner address:", owner.address);
  console.log("User1 address:", user1.address);
  console.log("User2 address:", user2.address);

  try {
    // Check initial stats
    console.log("\n📊 Initial Stats:");
    const [totalSubs, totalRev, balance] = await subscription.getStats();
    console.log("Total subscribers:", totalSubs.toString());
    console.log("Total revenue:", ethers.utils.formatEther(totalRev), "ETH");
    console.log("Contract balance:", ethers.utils.formatEther(balance), "ETH");

    // Test subscription for user1 (Basic tier)
    console.log("\n💳 User1 subscribing to Basic tier...");
    const basicPrice = ethers.utils.parseEther("0.01");
    const tx1 = await subscription.connect(user1).subscribe(0, true, { value: basicPrice });
    await tx1.wait();
    console.log("✅ User1 subscribed successfully");

    // Check user1 subscription
    const user1Sub = await subscription.getSubscription(user1.address);
    console.log("User1 subscription:", {
      tier: user1Sub.tier.toString(),
      expiresAt: new Date(user1Sub.expiresAt.toNumber() * 1000).toISOString(),
      autoRenew: user1Sub.autoRenew,
      lastPayment: new Date(user1Sub.lastPayment.toNumber() * 1000).toISOString(),
    });

    // Test subscription for user2 (Premium tier)
    console.log("\n💎 User2 subscribing to Premium tier...");
    const premiumPrice = ethers.utils.parseEther("0.05");
    const tx2 = await subscription.connect(user2).subscribe(1, false, { value: premiumPrice });
    await tx2.wait();
    console.log("✅ User2 subscribed successfully");

    // Check subscription status
    console.log("\n🔍 Checking subscription status:");
    const user1Active = await subscription.isSubscribed(user1.address);
    const user2Active = await subscription.isSubscribed(user2.address);
    console.log("User1 is subscribed:", user1Active);
    console.log("User2 is subscribed:", user2Active);

    // Check final stats
    console.log("\n📊 Final Stats:");
    const [finalSubs, finalRev, finalBalance] = await subscription.getStats();
    console.log("Total subscribers:", finalSubs.toString());
    console.log("Total revenue:", ethers.utils.formatEther(finalRev), "ETH");
    console.log("Contract balance:", ethers.utils.formatEther(finalBalance), "ETH");

    // Test auto-renewal toggle
    console.log("\n🔄 Testing auto-renewal toggle...");
    const tx3 = await subscription.connect(user2).setAutoRenew(true);
    await tx3.wait();
    console.log("✅ User2 enabled auto-renewal");

    // Test cancellation
    console.log("\n❌ Testing subscription cancellation...");
    const tx4 = await subscription.connect(user1).cancelSubscription();
    await tx4.wait();
    console.log("✅ User1 cancelled subscription (disabled auto-renewal)");

    // Check renewal needs
    console.log("\n🔔 Checking renewal needs:");
    const user1Needs = await subscription.needsRenewal(user1.address);
    const user2Needs = await subscription.needsRenewal(user2.address);
    console.log("User1 needs renewal:", user1Needs);
    console.log("User2 needs renewal:", user2Needs);
  } catch (error) {
    console.error("❌ Interaction failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
