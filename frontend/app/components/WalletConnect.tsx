'use client';

import { useConnect, useAccount, useDisconnect, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const { connect, connectors, error, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-400">●</span> Wallet Connected
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="font-mono text-sm bg-black/30 p-2 rounded break-all">
              {address}
            </p>
          </div>
          {balance && (
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-green-400">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </p>
            </div>
          )}
          <button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold transition"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
      <p className="text-gray-300 mb-4">
        Connect your MetaMask wallet to send and receive cryptocurrency
      </p>
      <div className="space-y-2">
        {connectors.map((connector) => (
          <button
            key={connector.id}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin">⏳</span> Connecting...
              </>
            ) : (
              <>
                <span>🦊</span> Connect {connector.name}
              </>
            )}
          </button>
        ))}
      </div>
      {error && (
        <div className="mt-4 bg-red-900/30 border border-red-500/50 p-3 rounded-lg">
          <p className="text-red-300 text-sm">
            Error: {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
