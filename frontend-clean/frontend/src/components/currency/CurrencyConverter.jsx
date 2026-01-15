"use client";

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const CurrencyConverter = () => {
  const { user } = useContext(AuthContext);
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [conversionResult, setConversionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletBalances, setWalletBalances] = useState([]);

  useEffect(() => {
    if (user) {
      fetchCurrencies();
      fetchWalletBalances();
    }
  }, [user]);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch("/api/currency/currencies", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrencies(data.data);
      }
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const fetchWalletBalances = async () => {
    try {
      const response = await fetch("/api/currency/wallet/balances", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalances(data.data);
      }
    } catch (error) {
      console.error("Error fetching wallet balances:", error);
    }
  };

  const handleConvert = async () => {
    setError("");
    setConversionResult(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Please select different currencies");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/currency/convert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromAmount: parseFloat(amount),
          fromCurrency,
          toCurrency,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversionResult(data.data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Conversion failed");
      }
    } catch (error) {
      setError("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currencyCode) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (!currency) return amount.toString();

    return `${currency.symbol}${parseFloat(amount).toFixed(
      currency.decimalPlaces
    )}`;
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : currencyCode;
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConversionResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Currency Converter
        </h2>

        {/* Wallet Balances */}
        {walletBalances.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Your Wallet Balances
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {walletBalances.slice(0, 8).map((balance, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-gray-600">
                    {balance.currency}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(balance.balance, balance.currency)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ≈ ${balance.usdEquivalent.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Converter Form */}
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="any"
                  min="0"
                />
              </div>
              <div className="w-32">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={
                    conversionResult
                      ? formatCurrency(conversionResult.toAmount, toCurrency)
                      : ""
                  }
                  placeholder="Converted amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div className="w-32">
                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={loading || !amount}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Converting..." : "Convert Currency"}
          </button>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Conversion Result */}
          {conversionResult && (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-4">
                Conversion Result
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">From Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      conversionResult.fromAmount,
                      conversionResult.fromCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      conversionResult.toAmount,
                      conversionResult.toCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exchange Rate:</span>
                  <span className="font-medium">
                    1 {conversionResult.fromCurrency} ={" "}
                    {conversionResult.exchangeRate.toFixed(6)}{" "}
                    {conversionResult.toCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Conversion Fee:</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(
                      conversionResult.fee,
                      conversionResult.fromCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      conversionResult.totalCost,
                      conversionResult.fromCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Converted At:</span>
                  <span className="font-medium">
                    {new Date(conversionResult.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Popular Conversions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Popular Conversions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { from: "USD", to: "EUR", icon: "🇺🇸→🇪🇺" },
              { from: "USD", to: "GBP", icon: "🇺🇸→🇬🇧" },
              { from: "USD", to: "JPY", icon: "🇺🇸→🇯🇵" },
              { from: "EUR", to: "GBP", icon: "🇪🇺→🇬🇧" },
              { from: "BTC", to: "USD", icon: "₿→💵" },
              { from: "ETH", to: "USD", icon: "Ξ→💵" },
              { from: "USD", to: "BTC", icon: "💵→₿" },
              { from: "USDC", to: "USD", icon: "💵→💵" },
            ].map((pair, index) => (
              <button
                key={index}
                onClick={() => {
                  setFromCurrency(pair.from);
                  setToCurrency(pair.to);
                  setConversionResult(null);
                }}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                <div className="text-2xl mb-1">{pair.icon}</div>
                <div className="text-sm text-gray-600">
                  {pair.from} → {pair.to}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Currency Information */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Supported Currencies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currencies.map((currency) => (
              <div
                key={currency.code}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">{currency.code}</span>
                  <span className="text-xl">{currency.symbol}</span>
                </div>
                <div className="text-sm text-gray-600">{currency.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Rate: ${currency.exchangeRate.toFixed(6)}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    currency.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {currency.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
