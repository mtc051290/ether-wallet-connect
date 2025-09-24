"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faPlug,
  faSpinner,
  faCopy,
  faExternalLinkAlt,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faCoins,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "@/hooks/useWallet";

export const WalletConnector: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const {
    isConnected,
    address,
    isConnecting,
    error,
    balance,
    isLoadingBalance,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    formatBalance,
    isMetaMaskInstalled,
    formatAddress,
  } = useWallet();

  // Fix hydration error by waiting for component to mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="status-card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
            <FontAwesomeIcon icon={faWallet} className="text-3xl text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 neon-text">Web3 Wallet</h3>
          <p className="text-gray-300 mb-6">Loading wallet connection...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const openInEtherscan = (address: string) => {
    // Open Sepolia Etherscan instead of mainnet
    window.open(`https://sepolia.etherscan.io/address/${address}`, "_blank");
  };

  if (!isMetaMaskInstalled) {
    return (
      <div className="status-card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-3xl text-white"
            />
          </div>

          <h3 className="text-2xl font-bold mb-3 neon-text">
            MetaMask Required
          </h3>
          <p className="text-gray-300 mb-6">
            Install MetaMask to connect your wallet and access Web3
            applications.
          </p>

          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="connect-button inline-flex items-center gap-3"
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} />
            Install MetaMask
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-6">
            <FontAwesomeIcon
              icon={faTimesCircle}
              className="text-3xl text-white"
            />
          </div>

          <h3 className="text-2xl font-bold mb-3 text-red-400">
            Connection Failed
          </h3>
          <p className="text-gray-300 mb-6 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            {error}
          </p>
          <button onClick={connectWallet} className="connect-button">
            <FontAwesomeIcon icon={faWallet} className="mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="status-card">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
            <FontAwesomeIcon
              icon={faCheckCircle}
              className="text-3xl text-white"
            />
          </div>

          <h3 className="text-2xl font-bold mb-3 text-green-400">
            Wallet Connected
          </h3>
          <p className="text-gray-300 mb-6">
            Your wallet is connected and ready to use.
          </p>

          {/* Balance Display */}
          <div className="balance-display mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <FontAwesomeIcon icon={faCoins} className="text-yellow-400" />
              <p className="text-sm text-gray-400">SepoliaETH Balance</p>
              <button
                onClick={refreshBalance}
                disabled={isLoadingBalance}
                className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10"
                title="Refresh balance"
              >
                <FontAwesomeIcon
                  icon={faRefresh}
                  className={isLoadingBalance ? "animate-spin" : ""}
                />
              </button>
            </div>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-lg border border-yellow-500/30 mb-4">
              <div className="text-2xl font-bold text-yellow-300">
                {isLoadingBalance ? (
                  <div className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin"
                    />
                    Loading...
                  </div>
                ) : balance ? (
                  `${formatBalance(balance)} SEP`
                ) : (
                  "0.0000 SEP"
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">Sepolia Test Network</p>
            </div>
          </div>

          {/* Address Display */}
          <div className="address-display mb-6">
            <p className="text-sm text-gray-400 mb-2">Ethereum Address</p>
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-blue-500/30">
              <code className="text-blue-300 font-mono text-lg">
                {formatAddress(address)}
              </code>
              <button
                onClick={() => copyToClipboard(address)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
                title="Copy full address"
              >
                <FontAwesomeIcon
                  icon={copied ? faCheckCircle : faCopy}
                  className={copied ? "text-green-400" : ""}
                />
              </button>
              <button
                onClick={() => openInEtherscan(address)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10"
                title="View on Sepolia Etherscan"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-sm mt-2">
                Address copied to clipboard!
              </p>
            )}
          </div>

          <button onClick={disconnectWallet} className="disconnect-button">
            <FontAwesomeIcon icon={faPlug} className="mr-2" />
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="status-card">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6">
          <FontAwesomeIcon
            icon={isConnecting ? faSpinner : faWallet}
            className={`text-3xl text-white ${
              isConnecting ? "animate-spin" : ""
            }`}
          />
        </div>

        <h3 className="text-2xl font-bold mb-3 neon-text">
          {isConnecting ? "Connecting..." : "Connect Your Wallet"}
        </h3>
        <p className="text-gray-300 mb-6">
          {isConnecting
            ? "Please check MetaMask and approve the connection request."
            : "Connect your MetaMask wallet to access Web3 applications."}
        </p>

        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="connect-button"
        >
          {isConnecting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-3" />
              Connecting...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faWallet} className="mr-3" />
              Connect Wallet
            </>
          )}
        </button>
      </div>
    </div>
  );
};
