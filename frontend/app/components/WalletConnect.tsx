'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = await accounts[0].getAddress();
          setAccount(address);
          await updateBalance(address);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const bal = await provider.getBalance(address);
        setBalance(ethers.formatEther(bal));
      }
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      if (typeof window === 'undefined' || !window.ethereum) {
        alert('Please install MetaMask to use this feature!');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      await updateBalance(address);
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance(null);
  };

  if (!mounted) {
    return null;
  }

  if (account) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-6 rounded-lg">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-green-400">●</span> Wallet Connected
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-400">Address</p>
            <p className="font-mono text-sm bg-black/30 p-2 rounded break-all">
              {account}
            </p>
          </div>
          {balance && (
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p className="text-2xl font-bold text-green-400">
                {parseFloat(balance).toFixed(4)} ETH
              </p>
            </div>
          )}
          <button
            onClick={disconnectWallet}
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
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isConnecting ? (
          <>
            <span className="animate-spin">⏳</span> Connecting...
          </>
        ) : (
          <>
            <span>🦊</span> Connect MetaMask
          </>
        )}
      </button>
      {typeof window !== 'undefined' && !window.ethereum && (
        <div className="mt-4 bg-yellow-900/30 border border-yellow-500/50 p-3 rounded-lg">
          <p className="text-yellow-300 text-sm">
            MetaMask not detected. <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="underline">Install MetaMask</a>
          </p>
        </div>
      )}
    </div>
  );
}

