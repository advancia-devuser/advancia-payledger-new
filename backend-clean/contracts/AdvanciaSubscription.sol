// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title AdvanciaSubscription
 * @dev Smart contract for managing Advancia Pay Ledger subscriptions
 * Features:
 * - Multiple subscription tiers (Basic, Premium, Enterprise)
 * - Flexible pricing and duration management
 * - Automatic renewal capability
 * - Emergency pause functionality
 * - Comprehensive event logging
 */
contract AdvanciaSubscription is Ownable, ReentrancyGuard, Pausable {
    
    // Subscription tiers
    enum SubscriptionTier {
        BASIC,
        PREMIUM, 
        ENTERPRISE
    }
    
    // Subscription data structure
    struct Subscription {
        SubscriptionTier tier;
        uint256 expiresAt;
        bool autoRenew;
        uint256 lastPayment;
    }
    
    // Tier configuration
    struct TierConfig {
        uint256 price;        // Price in wei
        uint256 duration;     // Duration in seconds
        bool active;          // Whether tier is available
        string name;          // Tier name
    }
    
    // State variables
    mapping(address => Subscription) public subscriptions;
    mapping(SubscriptionTier => TierConfig) public tierConfigs;
    
    // Statistics
    uint256 public totalSubscribers;
    uint256 public totalRevenue;
    
    // Events
    event Subscribed(
        address indexed user, 
        SubscriptionTier tier, 
        uint256 expiresAt, 
        uint256 amount,
        bool autoRenew
    );
    
    event SubscriptionRenewed(
        address indexed user,
        SubscriptionTier tier,
        uint256 newExpiresAt,
        uint256 amount
    );
    
    event SubscriptionCancelled(address indexed user);
    
    event TierConfigUpdated(
        SubscriptionTier tier,
        uint256 newPrice,
        uint256 newDuration,
        bool active
    );
    
    event AutoRenewToggled(address indexed user, bool autoRenew);
    
    event FundsWithdrawn(address indexed owner, uint256 amount);
    
    /**
     * @dev Constructor sets up initial tier configurations
     */
    constructor() {
        // Basic tier: 0.01 ETH for 30 days
        tierConfigs[SubscriptionTier.BASIC] = TierConfig({
            price: 0.01 ether,
            duration: 30 days,
            active: true,
            name: "Basic"
        });
        
        // Premium tier: 0.05 ETH for 30 days
        tierConfigs[SubscriptionTier.PREMIUM] = TierConfig({
            price: 0.05 ether,
            duration: 30 days,
            active: true,
            name: "Premium"
        });
        
        // Enterprise tier: 0.1 ETH for 30 days
        tierConfigs[SubscriptionTier.ENTERPRISE] = TierConfig({
            price: 0.1 ether,
            duration: 30 days,
            active: true,
            name: "Enterprise"
        });
    }
    
    /**
     * @dev Subscribe to a specific tier
     * @param tier The subscription tier to subscribe to
     * @param autoRenew Whether to enable automatic renewal
     */
    function subscribe(SubscriptionTier tier, bool autoRenew) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        TierConfig memory config = tierConfigs[tier];
        require(config.active, "Tier not available");
        require(msg.value == config.price, "Incorrect payment amount");
        
        Subscription storage userSub = subscriptions[msg.sender];
        uint256 currentExpiry = userSub.expiresAt;
        uint256 newExpiry;
        
        // If user has active subscription, extend it
        if (currentExpiry > block.timestamp) {
            newExpiry = currentExpiry + config.duration;
        } else {
            newExpiry = block.timestamp + config.duration;
            totalSubscribers++;
        }
        
        // Update subscription
        userSub.tier = tier;
        userSub.expiresAt = newExpiry;
        userSub.autoRenew = autoRenew;
        userSub.lastPayment = block.timestamp;
        
        // Update statistics
        totalRevenue += msg.value;
        
        emit Subscribed(msg.sender, tier, newExpiry, msg.value, autoRenew);
    }
    
    /**
     * @dev Renew subscription (can be called by anyone for auto-renewal)
     * @param user The user to renew subscription for
     */
    function renewSubscription(address user) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        Subscription storage userSub = subscriptions[user];
        require(userSub.expiresAt > 0, "No subscription found");
        require(userSub.autoRenew, "Auto-renewal not enabled");
        require(userSub.expiresAt <= block.timestamp + 7 days, "Too early to renew");
        
        TierConfig memory config = tierConfigs[userSub.tier];
        require(config.active, "Tier no longer available");
        require(msg.value == config.price, "Incorrect payment amount");
        
        // Extend subscription
        userSub.expiresAt = userSub.expiresAt + config.duration;
        userSub.lastPayment = block.timestamp;
        
        // Update statistics
        totalRevenue += msg.value;
        
        emit SubscriptionRenewed(user, userSub.tier, userSub.expiresAt, msg.value);
    }
    
    /**
     * @dev Cancel subscription (stops auto-renewal)
     */
    function cancelSubscription() external {
        Subscription storage userSub = subscriptions[msg.sender];
        require(userSub.expiresAt > 0, "No subscription found");
        
        userSub.autoRenew = false;
        
        emit SubscriptionCancelled(msg.sender);
    }
    
    /**
     * @dev Toggle auto-renewal setting
     * @param autoRenew New auto-renewal setting
     */
    function setAutoRenew(bool autoRenew) external {
        Subscription storage userSub = subscriptions[msg.sender];
        require(userSub.expiresAt > 0, "No subscription found");
        
        userSub.autoRenew = autoRenew;
        
        emit AutoRenewToggled(msg.sender, autoRenew);
    }
    
    /**
     * @dev Check if user has active subscription
     * @param user The user to check
     * @return bool Whether user has active subscription
     */
    function isSubscribed(address user) external view returns (bool) {
        return subscriptions[user].expiresAt > block.timestamp;
    }
    
    /**
     * @dev Get user's subscription details
     * @param user The user to query
     * @return Subscription struct with all details
     */
    function getSubscription(address user) external view returns (Subscription memory) {
        return subscriptions[user];
    }
    
    /**
     * @dev Get tier configuration
     * @param tier The tier to query
     * @return TierConfig struct with tier details
     */
    function getTierConfig(SubscriptionTier tier) external view returns (TierConfig memory) {
        return tierConfigs[tier];
    }
    
    /**
     * @dev Check if user needs renewal (within 7 days of expiry)
     * @param user The user to check
     * @return bool Whether user needs renewal
     */
    function needsRenewal(address user) external view returns (bool) {
        Subscription memory userSub = subscriptions[user];
        return userSub.autoRenew && 
               userSub.expiresAt > 0 && 
               userSub.expiresAt <= block.timestamp + 7 days;
    }
    
    // Owner functions
    
    /**
     * @dev Update tier configuration (owner only)
     * @param tier The tier to update
     * @param price New price in wei
     * @param duration New duration in seconds
     * @param active Whether tier should be active
     * @param name New tier name
     */
    function updateTierConfig(
        SubscriptionTier tier,
        uint256 price,
        uint256 duration,
        bool active,
        string calldata name
    ) external onlyOwner {
        tierConfigs[tier] = TierConfig({
            price: price,
            duration: duration,
            active: active,
            name: name
        });
        
        emit TierConfigUpdated(tier, price, duration, active);
    }
    
    /**
     * @dev Withdraw contract funds (owner only)
     * @param amount Amount to withdraw (0 = all)
     */
    function withdraw(uint256 amount) external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        uint256 withdrawAmount = amount == 0 ? balance : amount;
        require(withdrawAmount <= balance, "Insufficient funds");
        
        payable(owner()).transfer(withdrawAmount);
        
        emit FundsWithdrawn(owner(), withdrawAmount);
    }
    
    /**
     * @dev Emergency pause (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get contract statistics
     * @return totalSubs Total number of subscribers
     * @return totalRev Total revenue collected
     * @return contractBalance Current contract balance
     */
    function getStats() external view returns (
        uint256 totalSubs,
        uint256 totalRev,
        uint256 contractBalance
    ) {
        return (totalSubscribers, totalRevenue, address(this).balance);
    }
    
    /**
     * @dev Emergency function to refund a user (owner only)
     * @param user User to refund
     * @param amount Amount to refund
     */
    function emergencyRefund(address user, uint256 amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(amount <= address(this).balance, "Insufficient funds");
        require(subscriptions[user].expiresAt > 0, "User has no subscription");
        
        // Cancel subscription
        delete subscriptions[user];
        totalSubscribers--;
        
        // Send refund
        payable(user).transfer(amount);
    }
}
