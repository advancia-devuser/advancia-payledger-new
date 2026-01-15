import { useState } from "react";
import { ethers } from "ethers";
import WalletConnect from "@/components/WalletConnect";
import PaymentForm from "@/components/PaymentForm";
import SubscriptionForm from "@/components/SubscriptionForm";

export default function PaymentPage() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"payment" | "subscription">(
    "payment"
  );

  const handleConnect = (
    address: string,
    connectedProvider: ethers.BrowserProvider
  ) => {
    setUserAddress(address);
    setProvider(connectedProvider);
  };

  const handleDisconnect = () => {
    setUserAddress("");
    setProvider(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Advancia Payments
          </h1>
          <p className="text-gray-600">
            Non-custodial blockchain payments - Your keys, your funds
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <WalletConnect
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>

        {userAddress && (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg shadow p-1 inline-flex">
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    activeTab === "payment"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  One-Time Payment
                </button>
                <button
                  onClick={() => setActiveTab("subscription")}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    activeTab === "subscription"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Subscriptions
                </button>
              </div>
            </div>

            {activeTab === "payment" ? (
              <PaymentForm provider={provider} userAddress={userAddress} />
            ) : (
              <SubscriptionForm provider={provider} userAddress={userAddress} />
            )}
          </>
        )}

        {!userAddress && (
          <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Connect your Web3 wallet to start making secure, non-custodial
              payments. Your funds remain in your wallet at all times.
            </p>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            🔐 Non-Custodial Security
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Funds stay in your wallet - we never hold your crypto</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>You approve every transaction in your wallet</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Transparent on-chain payments verified by blockchain</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                Cancel subscriptions anytime directly from your wallet
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
